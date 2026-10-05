import assert from "node:assert/strict";
import { test } from "node:test";
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

  const socket = {
    id: "test-socket",
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
    to: (room: string) => ({ emit: () => undefined, room }),
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
    socketEvents,
    disconnect: () => handlers.get("disconnect")?.("test disconnect"),
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
