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

type HarnessOptions = {
  userId?: string;
  conversations?: Array<{ participants: string[] }>;
  failPresenceLookup?: boolean;
};

const presenceFixtures = new Map<
  string,
  { queries: unknown[]; conversations: Array<{ participants: string[] }>; fail: boolean }
>();

const createSocketHarness = (options: HarnessOptions = {}) => {
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
  const joinedRooms: string[] = [];
  const presenceQueries: unknown[] = [];
  const userId = options.userId ?? "developer-1";
  presenceFixtures.set(userId, {
    queries: presenceQueries,
    conversations: options.conversations ?? [],
    fail: options.failPresenceLookup ?? false,
  });
  const restorePresenceFind = replaceMethod(
    Conversation,
    "find",
    (query: unknown) => {
      const queriedUserId = (query as { participants?: string }).participants;
      const fixture = queriedUserId
        ? presenceFixtures.get(queriedUserId)
        : undefined;
      fixture?.queries.push(query);
      return {
        select: () => ({
          lean: async () => {
            if (fixture?.fail) {
              throw new Error("presence query failed");
            }
            return fixture?.conversations ?? [];
          },
        }),
      };
    },
  );

  const socket = {
    id: "test-socket",
    connected: true,
    user: { userId, role: "developer" },
    broadcast: { emit: () => undefined },
    on: (event: string, handler: EventHandler) => {
      handlers.set(event, handler);
      return socket;
    },
    emit: (event: string, payload: unknown) => {
      socketEvents.push({ event, payload });
      return true;
    },
    join: (room: string) => {
      joinedRooms.push(room);
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
    joinedRooms,
    presenceQueries,
    restorePresenceFind,
    removePresenceFixture: () => presenceFixtures.delete(userId),
    disconnect: async () => {
      (socket as { connected: boolean }).connected = false;
      await handlers.get("disconnect")?.("test disconnect");
    },
  };
};

const waitForPresence = async () =>
  new Promise<void>((resolve) => setImmediate(resolve));

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
    await harness.disconnect();
    harness.restorePresenceFind();
    harness.removePresenceFixture();
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
    await harness.disconnect();
    harness.restorePresenceFind();
    harness.removePresenceFixture();
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
    await harness.disconnect();
    harness.restorePresenceFind();
    harness.removePresenceFixture();
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
    await harness.disconnect();
    harness.restorePresenceFind();
    harness.removePresenceFixture();
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
    await harness.disconnect();
    harness.restorePresenceFind();
    harness.removePresenceFixture();
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
    await harness.disconnect();
    harness.restorePresenceFind();
    harness.removePresenceFixture();
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
    await harness.disconnect();
    harness.restorePresenceFind();
    harness.removePresenceFixture();

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

test("presence snapshot is scoped to authenticated conversation participants", async () => {
  const onlinePeer = createSocketHarness({ userId: "presence-online-peer" });
  const requester = createSocketHarness({
    userId: "presence-requester",
    conversations: [
      {
        participants: [
          "presence-requester",
          "presence-online-peer",
          "presence-offline-peer",
          "presence-online-peer",
        ],
      },
      {
        participants: ["presence-requester", "presence-offline-peer"],
      },
    ],
  });

  try {
    await waitForPresence();
    await requester.handlers.get("request_presence_snapshot")?.([
      "unrelated-user",
    ]);

    const snapshot = requester.socketEvents.find(
      (event) => event.event === "presence_snapshot",
    );
    assert.deepEqual(snapshot?.payload, {
      users: [
        {
          userId: "presence-online-peer",
          online: true,
          revision: 1,
        },
        {
          userId: "presence-offline-peer",
          online: false,
          revision: 0,
        },
      ],
    });
    assert.deepEqual(requester.presenceQueries, [
      { participants: "presence-requester" },
      { participants: "presence-requester" },
    ]);
    assert.deepEqual(requester.joinedRooms, ["user:presence-requester"]);
  } finally {
    await requester.disconnect();
    await onlinePeer.disconnect();
    requester.restorePresenceFind();
    requester.removePresenceFixture();
    onlinePeer.restorePresenceFind();
    onlinePeer.removePresenceFixture();
  }
});

test("presence snapshot reports lookup failures without returning offline statuses", async () => {
  const originalConsoleError = console.error;
  console.error = () => undefined;
  const harness = createSocketHarness({
    userId: "presence-error-user",
    failPresenceLookup: true,
  });

  try {
    await harness.handlers.get("request_presence_snapshot")?.();

    assert.deepEqual(harness.socketEvents.at(-1), {
      event: "presence_snapshot_error",
      payload: { message: "Failed to load presence snapshot" },
    });
    assert.equal(
      harness.socketEvents.some((event) => event.event === "presence_snapshot"),
      false,
    );
  } finally {
    await harness.disconnect();
    harness.restorePresenceFind();
    harness.removePresenceFixture();
    console.error = originalConsoleError;
  }
});

test("presence transitions are sent only to distinct users who share a conversation", async () => {
  const harness = createSocketHarness({
    userId: "presence-changing-user",
    conversations: [
      {
        participants: [
          "presence-changing-user",
          "presence-related-user",
          "presence-related-user",
        ],
      },
      {
        participants: ["presence-changing-user", "presence-related-user"],
      },
    ],
  });

  try {
    await waitForPresence();
    assert.deepEqual(harness.roomEvents, [
      {
        room: "user:presence-related-user",
        event: "user_online",
        payload: { userId: "presence-changing-user", revision: 1 },
      },
    ]);

    await harness.disconnect();
    await waitForPresence();
    assert.deepEqual(harness.roomEvents.at(-1), {
      room: "user:presence-related-user",
      event: "user_offline",
      payload: { userId: "presence-changing-user", revision: 2 },
    });
  } finally {
    await harness.disconnect();
    harness.restorePresenceFind();
    harness.removePresenceFixture();
  }
});

test("presence remains online until the last socket disconnects", async () => {
  const options = {
    userId: "presence-multi-socket-user",
    conversations: [
      {
        participants: [
          "presence-multi-socket-user",
          "presence-multi-socket-peer",
        ],
      },
    ],
  };
  const firstSocket = createSocketHarness(options);
  const secondSocket = createSocketHarness(options);

  try {
    await waitForPresence();
    assert.equal(firstSocket.roomEvents.length, 1);
    assert.equal(secondSocket.roomEvents.length, 0);

    await firstSocket.disconnect();
    await waitForPresence();
    assert.equal(firstSocket.roomEvents.length, 1);
    assert.equal(secondSocket.roomEvents.length, 0);

    await secondSocket.disconnect();
    await waitForPresence();
    assert.deepEqual(secondSocket.roomEvents, [
      {
        room: "user:presence-multi-socket-peer",
        event: "user_offline",
        payload: { userId: "presence-multi-socket-user", revision: 2 },
      },
    ]);
  } finally {
    await firstSocket.disconnect();
    await secondSocket.disconnect();
    secondSocket.restorePresenceFind();
    secondSocket.removePresenceFixture();
    firstSocket.restorePresenceFind();
    firstSocket.removePresenceFixture();
  }
});
