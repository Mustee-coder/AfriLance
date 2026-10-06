import assert from "node:assert/strict";
import { mock, test } from "node:test";
import type { Server, Socket } from "socket.io";
import { Conversation } from "../src/models/conversation.model.js";
import { Message } from "../src/models/message.model.js";
import { registerSocketHandlers } from "../src/socket/socket.handlers.js";

type EventHandler = (...args: any[]) => unknown;

const replaceMethod = (
  target: object,
  method: string,
  implementation: unknown,
): (() => void) => {
  const original = Object.getOwnPropertyDescriptor(target, method);
  Object.defineProperty(target, method, {
    configurable: true,
    writable: true,
    value: implementation,
  });

  return () => {
    if (original) {
      Object.defineProperty(target, method, original);
    } else {
      Reflect.deleteProperty(target, method);
    }
  };
};

const createSocketHarness = () => {
  const handlers = new Map<string, EventHandler>();
  const socketEvents: Array<{ event: string; payload: unknown }> = [];
  const roomEvents: Array<{
    room: string;
    event: string;
    payload: unknown;
  }> = [];
  const socketRoomEvents: Array<{
    room: string;
    event: string;
    payload: unknown;
  }> = [];

  const socket = {
    id: "test-socket",
    connected: true,
    user: { userId: "developer-1", role: "developer" },
    broadcast: { emit: () => undefined },
    on: (event: string, handler: EventHandler) => {
      handlers.set(event, handler);
      return socket;
    },
    emit: (event: string, payload: unknown) => {
      socketEvents.push({ event, payload });
      return true;
    },
    to: (room: string) => ({
      emit: (event: string, payload: unknown) => {
        socketRoomEvents.push({ room, event, payload });
      },
      room,
    }),
  } as unknown as Socket;

  const io = {
    to: (room: string) => ({
      emit: (event: string, payload: unknown) => {
        roomEvents.push({ room, event, payload });
      },
    }),
  } as unknown as Server;

  registerSocketHandlers(io, socket);

  return {
    handlers,
    roomEvents,
    socketRoomEvents,
    socketEvents,
    disconnect: () => {
      (socket as { connected: boolean }).connected = false;
      handlers.get("disconnect")?.("test disconnect");
    },
  };
};

const createdMessage = {
  _id: "message-1",
  conversation: "conversation-1",
  content: "Hello",
};

const populatedMessage = {
  ...createdMessage,
  sender: {
    _id: "developer-1",
    firstName: "Dev",
    lastName: "One",
    role: "developer",
  },
};

const conversation = {
  _id: "conversation-1",
  lastMessage: undefined,
  lastMessageAt: undefined,
  save: async () => undefined,
};

const mockSuccessfulPersistence = (): (() => void) => {
  const restoreFindConversation = replaceMethod(
    Conversation,
    "findOne",
    async () => conversation,
  );
  const restoreCreateMessage = replaceMethod(
    Message,
    "create",
    async () => createdMessage,
  );
  const restoreFindMessage = replaceMethod(
    Message,
    "findById",
    () => ({ populate: async () => populatedMessage }),
  );

  return () => {
    restoreFindMessage();
    restoreCreateMessage();
    restoreFindConversation();
  };
};

test("send_message acknowledges successful creation and emits new_message", async (t) => {
  const restore = mockSuccessfulPersistence();
  const harness = createSocketHarness();

  try {
    let acknowledgement: unknown;
    await harness.handlers.get("send_message")?.(
      { conversationId: "conversation-1", content: "Hello" },
      (response: unknown) => {
        acknowledgement = response;
      },
    );

    assert.deepEqual(acknowledgement, { success: true });
    assert.deepEqual(harness.roomEvents, [
      {
        room: "conversation:conversation-1",
        event: "new_message",
        payload: populatedMessage,
      },
    ]);
  } finally {
    harness.disconnect();
    restore();
  }
});

test("send_message acknowledges invalid content as a failure", async () => {
  const harness = createSocketHarness();

  try {
    let acknowledgement: unknown;
    await harness.handlers.get("send_message")?.(
      { conversationId: "conversation-1", content: "   " },
      (response: unknown) => {
        acknowledgement = response;
      },
    );

    assert.deepEqual(acknowledgement, {
      success: false,
      error: "Message content cannot be empty",
    });
  } finally {
    harness.disconnect();
  }
});

test("send_message acknowledges persistence failures as a failure", async () => {
  const restoreFindConversation = replaceMethod(
    Conversation,
    "findOne",
    async () => conversation,
  );
  const restoreCreateMessage = replaceMethod(
    Message,
    "create",
    async () => {
      throw new Error("database write failed");
    },
  );
  const originalConsoleError = console.error;
  console.error = () => undefined;
  const harness = createSocketHarness();

  try {
    let acknowledgement: unknown;
    await harness.handlers.get("send_message")?.(
      { conversationId: "conversation-1", content: "Hello" },
      (response: unknown) => {
        acknowledgement = response;
      },
    );

    assert.deepEqual(acknowledgement, {
      success: false,
      error: "Failed to send message",
    });
  } finally {
    harness.disconnect();
    console.error = originalConsoleError;
    restoreCreateMessage();
    restoreFindConversation();
  }
});

test("typing_start creates state and refreshes it without repeated database reads", async () => {
  let findConversationCalls = 0;
  const restoreFindConversation = replaceMethod(
    Conversation,
    "findOne",
    async () => {
      findConversationCalls += 1;
      return conversation;
    },
  );
  const harness = createSocketHarness();

  try {
    await harness.handlers.get("typing_start")?.("conversation-1");
    await harness.handlers.get("typing_start")?.("conversation-1");

    assert.equal(findConversationCalls, 1);
    assert.deepEqual(harness.socketRoomEvents, [
      {
        room: "conversation:conversation-1",
        event: "user_typing",
        payload: {
          conversationId: "conversation-1",
          userId: "developer-1",
        },
      },
      {
        room: "conversation:conversation-1",
        event: "user_typing",
        payload: {
          conversationId: "conversation-1",
          userId: "developer-1",
        },
      },
    ]);
  } finally {
    harness.disconnect();
    restoreFindConversation();
  }
});

test("typing expiry clears state and emits user_stopped_typing", async () => {
  const restoreFindConversation = replaceMethod(
    Conversation,
    "findOne",
    async () => conversation,
  );
  const harness = createSocketHarness();
  mock.timers.enable();

  try {
    await harness.handlers.get("typing_start")?.("conversation-1");
    mock.timers.tick(5_000);

    assert.deepEqual(harness.socketRoomEvents.at(-1), {
      room: "conversation:conversation-1",
      event: "user_stopped_typing",
      payload: {
        conversationId: "conversation-1",
        userId: "developer-1",
      },
    });
  } finally {
    harness.disconnect();
    mock.timers.reset();
    restoreFindConversation();
  }
});

test("typing_stop immediately clears active typing state", async () => {
  const restoreFindConversation = replaceMethod(
    Conversation,
    "findOne",
    async () => conversation,
  );
  const harness = createSocketHarness();

  try {
    await harness.handlers.get("typing_start")?.("conversation-1");
    await harness.handlers.get("typing_stop")?.("conversation-1");

    assert.deepEqual(harness.socketRoomEvents.at(-1), {
      room: "conversation:conversation-1",
      event: "user_stopped_typing",
      payload: {
        conversationId: "conversation-1",
        userId: "developer-1",
      },
    });
  } finally {
    harness.disconnect();
    restoreFindConversation();
  }
});

test("disconnect clears active typing state and emits user_stopped_typing", async () => {
  const restoreFindConversation = replaceMethod(
    Conversation,
    "findOne",
    async () => conversation,
  );
  const harness = createSocketHarness();

  try {
    await harness.handlers.get("typing_start")?.("conversation-1");
    harness.disconnect();

    assert.deepEqual(harness.socketRoomEvents.at(-1), {
      room: "conversation:conversation-1",
      event: "user_stopped_typing",
      payload: {
        conversationId: "conversation-1",
        userId: "developer-1",
      },
    });
  } finally {
    restoreFindConversation();
  }
});
