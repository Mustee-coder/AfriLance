import assert from "node:assert/strict";
import { test } from "node:test";
import { Conversation } from "../src/models/conversation.model.js";
import { Message } from "../src/models/message.model.js";
import { getMessages } from "../src/controllers/message.controller.js";

const conversationId = "507f1f77bcf86cd799439011";
const userId = "507f1f77bcf86cd799439012";

const conversation = { _id: conversationId };

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

const createQuery = (
  value: unknown,
  capture?: {
    sort?: unknown;
    limit?: number;
    populate?: unknown[];
  },
) => {
  const query = {
    sort: (specification: unknown) => {
      if (capture) {
        capture.sort = specification;
      }
      return query;
    },
    limit: (valueToLimit: number) => {
      if (capture) {
        capture.limit = valueToLimit;
      }
      return query;
    },
    populate: (...args: unknown[]) => {
      if (capture) {
        capture.populate ??= [];
        capture.populate.push(args);
      }
      return query;
    },
    then: (
      onFulfilled: (result: unknown) => unknown,
      onRejected?: (error: unknown) => unknown,
    ) => Promise.resolve(value).then(onFulfilled, onRejected),
  };

  return query;
};

const createResponse = () => {
  const response = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(body: unknown) {
      response.body = body;
      return response;
    },
  };

  return response;
};

const createRequest = (
  params: { id?: string } = { id: conversationId },
  query: Record<string, string> = {},
) =>
  ({
    params,
    query,
    user: { userId, role: "developer" },
  }) as any;

const createMessage = (
  id: string,
  createdAt: string,
) => ({
  _id: id,
  createdAt: new Date(createdAt),
  sender: { _id: userId },
});

const encodeCursor = (message: { _id: string; createdAt: Date }) =>
  Buffer.from(
    JSON.stringify({
      createdAt: message.createdAt.toISOString(),
      _id: message._id,
    }),
  ).toString("base64url");

const mockAuthorizedConversation = () =>
  replaceMethod(Conversation, "findOne", async () => conversation);

const mockMessageCount = (count: number) =>
  replaceMethod(Message, "countDocuments", async () => count);

test("getMessages returns the newest page in ascending order with pagination metadata", async () => {
  const messages = [
    createMessage("507f1f77bcf86cd799439021", "2026-01-01T00:00:01.000Z"),
    createMessage("507f1f77bcf86cd799439022", "2026-01-01T00:00:02.000Z"),
    createMessage("507f1f77bcf86cd799439023", "2026-01-01T00:00:03.000Z"),
    createMessage("507f1f77bcf86cd799439024", "2026-01-01T00:00:04.000Z"),
    createMessage("507f1f77bcf86cd799439025", "2026-01-01T00:00:05.000Z"),
  ];
  const capture: { sort?: unknown; limit?: number; populate?: unknown[] } = {};
  const restoreConversation = mockAuthorizedConversation();
  const restoreCount = mockMessageCount(messages.length);
  const restoreFind = replaceMethod(
    Message,
    "find",
    () => createQuery(messages.slice(-3).reverse(), capture),
  );
  const response = createResponse();

  try {
    await getMessages(
      createRequest(undefined, { limit: "3" }),
      response as any,
    );

    assert.equal(response.statusCode, 200);
    assert.equal((response.body as any).success, true);
    assert.deepEqual(
      (response.body as any).messages.map((message: any) => message._id),
      [
        "507f1f77bcf86cd799439023",
        "507f1f77bcf86cd799439024",
        "507f1f77bcf86cd799439025",
      ],
    );
    assert.equal((response.body as any).count, messages.length);
    assert.equal((response.body as any).pagination.hasMore, true);
    const nextCursor = JSON.parse(
      Buffer.from(
        (response.body as any).pagination.nextCursor,
        "base64url",
      ).toString("utf8"),
    );
    assert.deepEqual(nextCursor, {
      createdAt: messages[2].createdAt.toISOString(),
      _id: messages[2]._id,
    });
    assert.equal("id" in nextCursor, false);
    assert.deepEqual(capture.sort, { createdAt: -1, _id: -1 });
    assert.equal(capture.limit, 4);
    assert.deepEqual(capture.populate, [["sender", "firstName lastName role"]]);
  } finally {
    restoreFind();
    restoreCount();
    restoreConversation();
  }
});

test("getMessages reports no more pages when the conversation fits in one page", async () => {
  const messages = [
    createMessage("507f1f77bcf86cd799439026", "2026-01-01T00:00:01.000Z"),
    createMessage("507f1f77bcf86cd799439027", "2026-01-01T00:00:02.000Z"),
  ];
  const restoreConversation = mockAuthorizedConversation();
  const restoreCount = mockMessageCount(messages.length);
  const restoreFind = replaceMethod(
    Message,
    "find",
    () => createQuery(messages.slice().reverse()),
  );
  const response = createResponse();

  try {
    await getMessages(
      createRequest(undefined, { limit: "5" }),
      response as any,
    );

    assert.equal((response.body as any).pagination.hasMore, false);
    assert.equal((response.body as any).pagination.nextCursor, null);
    assert.deepEqual(
      (response.body as any).messages.map((message: any) => message._id),
      [
        "507f1f77bcf86cd799439026",
        "507f1f77bcf86cd799439027",
      ],
    );
  } finally {
    restoreFind();
    restoreCount();
    restoreConversation();
  }
});

test("getMessages uses the cursor to return the next older page without gaps", async () => {
  const pageOne = [
    createMessage("507f1f77bcf86cd799439032", "2026-01-01T00:00:03.000Z"),
    createMessage("507f1f77bcf86cd799439033", "2026-01-01T00:00:04.000Z"),
    createMessage("507f1f77bcf86cd799439034", "2026-01-01T00:00:05.000Z"),
  ];
  const olderMessages = [
    createMessage("507f1f77bcf86cd799439030", "2026-01-01T00:00:01.000Z"),
    createMessage("507f1f77bcf86cd799439031", "2026-01-01T00:00:02.000Z"),
  ];
  const capture: {
    sort?: unknown;
    limit?: number;
    populate?: unknown[];
    filter?: unknown;
  } = {};
  const restoreConversation = mockAuthorizedConversation();
  const restoreCount = mockMessageCount(5);
  const restoreFind = replaceMethod(
    Message,
    "find",
    (filter: unknown) => {
      capture.filter = filter;
      return createQuery(olderMessages.slice().reverse(), capture);
    },
  );
  const response = createResponse();
  const cursor = encodeCursor(pageOne[0]);

  try {
    await getMessages(
      createRequest(undefined, { limit: "2", cursor }),
      response as any,
    );

    assert.equal(response.statusCode, 200);
    assert.deepEqual(
      (response.body as any).messages.map((message: any) => message._id),
      [
        "507f1f77bcf86cd799439030",
        "507f1f77bcf86cd799439031",
      ],
    );
    assert.equal((response.body as any).pagination.hasMore, false);
    assert.equal((response.body as any).pagination.nextCursor, null);
    assert.equal(capture.limit, 3);
    assert.deepEqual(
      [
        ...pageOne.map((message) => message._id),
        ...(response.body as any).messages.map((message: any) => message._id),
      ].sort(),
      [
        "507f1f77bcf86cd799439030",
        "507f1f77bcf86cd799439031",
        "507f1f77bcf86cd799439032",
        "507f1f77bcf86cd799439033",
        "507f1f77bcf86cd799439034",
      ].sort(),
    );
    assert.equal((capture.filter as any).conversation, conversationId);
  } finally {
    restoreFind();
    restoreCount();
    restoreConversation();
  }
});

test("getMessages uses _id as the tie-breaker for equal timestamps", async () => {
  const timestamp = "2026-01-01T00:00:03.000Z";
  const cursorMessage = createMessage(
    "507f1f77bcf86cd799439040",
    timestamp,
  );
  const capture: { filter?: unknown } = {};
  const restoreConversation = mockAuthorizedConversation();
  const restoreCount = mockMessageCount(2);
  const restoreFind = replaceMethod(
    Message,
    "find",
    (filter: unknown) => {
      capture.filter = filter;
      return createQuery([]);
    },
  );
  const response = createResponse();

  try {
    await getMessages(
      createRequest(undefined, { cursor: encodeCursor(cursorMessage) }),
      response as any,
    );

    const filter = capture.filter as any;
    assert.equal(filter.conversation, conversationId);
    assert.equal(filter.$or[0].createdAt.$lt.toISOString(), timestamp);
    assert.equal(filter.$or[1].createdAt.toISOString(), timestamp);
    assert.equal(
      filter.$or[1]._id.$lt.toString(),
      cursorMessage._id,
    );
  } finally {
    restoreFind();
    restoreCount();
    restoreConversation();
  }
});

test("getMessages bounds oversized limits at the server maximum", async () => {
  const capture: { limit?: number } = {};
  const restoreConversation = mockAuthorizedConversation();
  const restoreCount = mockMessageCount(0);
  const restoreFind = replaceMethod(
    Message,
    "find",
    () => createQuery([], capture),
  );
  const response = createResponse();

  try {
    await getMessages(
      createRequest(undefined, { limit: "10000" }),
      response as any,
    );

    assert.equal(response.statusCode, 200);
    assert.equal(capture.limit, 101);
  } finally {
    restoreFind();
    restoreCount();
    restoreConversation();
  }
});

test("getMessages rejects invalid pagination input with HTTP 400", async () => {
  const restoreConversation = mockAuthorizedConversation();
  const responseForLimit = createResponse();
  const responseForCursor = createResponse();
  const responseForLegacyCursor = createResponse();

  try {
    await getMessages(
      createRequest(undefined, { limit: "0" }),
      responseForLimit as any,
    );
    await getMessages(
      createRequest(undefined, { cursor: "not-a-cursor" }),
      responseForCursor as any,
    );
    await getMessages(
      createRequest(undefined, {
        cursor: Buffer.from(
          JSON.stringify({
            createdAt: "2026-01-01T00:00:00.000Z",
            id: "507f1f77bcf86cd799439040",
          }),
        ).toString("base64url"),
      }),
      responseForLegacyCursor as any,
    );

    assert.equal(responseForLimit.statusCode, 400);
    assert.equal((responseForLimit.body as any).message, "Invalid limit");
    assert.equal(responseForCursor.statusCode, 400);
    assert.equal((responseForCursor.body as any).message, "Invalid cursor");
    assert.equal(responseForLegacyCursor.statusCode, 400);
    assert.equal((responseForLegacyCursor.body as any).message, "Invalid cursor");
  } finally {
    restoreConversation();
  }
});

test("getMessages preserves authorization, validation, response fields, and database errors", async () => {
  const restoreUnauthorizedConversation = replaceMethod(
    Conversation,
    "findOne",
    async () => null,
  );
  const unauthorizedResponse = createResponse();
  const invalidIdResponse = createResponse();

  try {
    await getMessages(createRequest(), unauthorizedResponse as any);
    await getMessages(
      createRequest({ id: "invalid" }),
      invalidIdResponse as any,
    );

    assert.equal(unauthorizedResponse.statusCode, 403);
    assert.equal(invalidIdResponse.statusCode, 400);
  } finally {
    restoreUnauthorizedConversation();
  }

  const restoreConversation = mockAuthorizedConversation();
  const restoreCount = replaceMethod(
    Message,
    "countDocuments",
    async () => {
      throw new Error("database failure");
    },
  );
  const restoreFind = replaceMethod(
    Message,
    "find",
    () => createQuery([]),
  );
  const databaseResponse = createResponse();
  const originalConsoleError = console.error;
  console.error = () => undefined;

  try {
    await getMessages(createRequest(), databaseResponse as any);

    assert.equal(databaseResponse.statusCode, 500);
    assert.deepEqual(databaseResponse.body, {
      success: false,
      message: "Failed to fetch messages",
    });
  } finally {
    console.error = originalConsoleError;
    restoreFind();
    restoreCount();
    restoreConversation();
  }
});
