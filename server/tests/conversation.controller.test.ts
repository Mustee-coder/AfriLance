import assert from "node:assert/strict";
import { test } from "node:test";
import { Conversation } from "../src/models/conversation.model.js";
import Application from "../src/models/application.model.js";
import Job from "../src/models/job.model.js";
import { createConversation } from "../src/controllers/conversation.controller.js";

const applicationId = "507f1f77bcf86cd799439011";
const jobId = "507f1f77bcf86cd799439012";
const developerId = "507f1f77bcf86cd799439013";
const clientId = "507f1f77bcf86cd799439014";

const application = {
  _id: applicationId,
  job: jobId,
  developer: { toString: () => developerId },
};

const job = {
  _id: jobId,
  client: { toString: () => clientId },
};

const existingConversation = {
  _id: "conversation-1",
  application: applicationId,
  job: jobId,
};

const createdConversation = {
  _id: "conversation-2",
  application: applicationId,
  job: jobId,
};

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

const createQuery = (value: unknown) => {
  const query = {
    populate: () => query,
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
  userId = developerId,
  body: { applicationId?: string } = { applicationId },
) =>
  ({
    body,
    user: { userId, role: "developer" },
  }) as any;

const mockAuthorizedDependencies = () => {
  const restoreApplication = replaceMethod(
    Application,
    "findById",
    async () => application,
  );
  const restoreJob = replaceMethod(
    Job,
    "findById",
    async () => job,
  );

  return () => {
    restoreJob();
    restoreApplication();
  };
};

test("createConversation returns an existing conversation with HTTP 200", async () => {
  const restoreDependencies = mockAuthorizedDependencies();
  const restoreFindOne = replaceMethod(
    Conversation,
    "findOne",
    () => createQuery(existingConversation),
  );
  const response = createResponse();

  try {
    await createConversation(createRequest(), response as any);

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, {
      success: true,
      message: "Conversation already exists",
      conversation: existingConversation,
    });
  } finally {
    restoreFindOne();
    restoreDependencies();
  }
});

test("createConversation returns HTTP 201 for a new conversation", async () => {
  const restoreDependencies = mockAuthorizedDependencies();
  const restoreFindOne = replaceMethod(
    Conversation,
    "findOne",
    () => createQuery(null),
  );
  const restoreCreate = replaceMethod(
    Conversation,
    "create",
    async () => createdConversation,
  );
  const restoreFindById = replaceMethod(
    Conversation,
    "findById",
    () => createQuery(createdConversation),
  );
  const response = createResponse();

  try {
    await createConversation(createRequest(), response as any);

    assert.equal(response.statusCode, 201);
    assert.deepEqual(response.body, {
      success: true,
      message: "Conversation created successfully",
      conversation: createdConversation,
    });
  } finally {
    restoreFindById();
    restoreCreate();
    restoreFindOne();
    restoreDependencies();
  }
});

test("createConversation returns the winner after a duplicate-key race", async () => {
  const restoreDependencies = mockAuthorizedDependencies();
  let findOneCalls = 0;
  const restoreFindOne = replaceMethod(
    Conversation,
    "findOne",
    () => {
      findOneCalls += 1;
      return createQuery(findOneCalls === 1 ? null : existingConversation);
    },
  );
  const restoreCreate = replaceMethod(
    Conversation,
    "create",
    async () => {
      throw { code: 11000 };
    },
  );
  const response = createResponse();

  try {
    await createConversation(createRequest(), response as any);

    assert.equal(findOneCalls, 2);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, {
      success: true,
      message: "Conversation already exists",
      conversation: existingConversation,
    });
  } finally {
    restoreCreate();
    restoreFindOne();
    restoreDependencies();
  }
});

test("createConversation returns HTTP 500 when duplicate re-fetch finds nothing", async () => {
  const restoreDependencies = mockAuthorizedDependencies();
  const restoreFindOne = replaceMethod(
    Conversation,
    "findOne",
    () => createQuery(null),
  );
  const restoreCreate = replaceMethod(
    Conversation,
    "create",
    async () => {
      throw { code: 11000 };
    },
  );
  const response = createResponse();
  const originalConsoleError = console.error;
  console.error = () => undefined;

  try {
    await createConversation(createRequest(), response as any);

    assert.equal(response.statusCode, 500);
    assert.deepEqual(response.body, {
      success: false,
      message: "Failed to create conversation",
    });
  } finally {
    console.error = originalConsoleError;
    restoreCreate();
    restoreFindOne();
    restoreDependencies();
  }
});

test("createConversation keeps non-duplicate errors as HTTP 500 without re-fetching", async () => {
  const restoreDependencies = mockAuthorizedDependencies();
  let findOneCalls = 0;
  const restoreFindOne = replaceMethod(
    Conversation,
    "findOne",
    () => {
      findOneCalls += 1;
      return createQuery(null);
    },
  );
  const restoreCreate = replaceMethod(
    Conversation,
    "create",
    async () => {
      throw new Error("database failure");
    },
  );
  const response = createResponse();
  const originalConsoleError = console.error;
  console.error = () => undefined;

  try {
    await createConversation(createRequest(), response as any);

    assert.equal(findOneCalls, 1);
    assert.equal(response.statusCode, 500);
    assert.deepEqual(response.body, {
      success: false,
      message: "Failed to create conversation",
    });
  } finally {
    console.error = originalConsoleError;
    restoreCreate();
    restoreFindOne();
    restoreDependencies();
  }
});

test("createConversation preserves HTTP 403 for an unauthorized requester", async () => {
  const restoreDependencies = mockAuthorizedDependencies();
  const restoreFindOne = replaceMethod(
    Conversation,
    "findOne",
    () => {
      throw new Error("findOne should not be called");
    },
  );
  const response = createResponse();

  try {
    await createConversation(createRequest("507f1f77bcf86cd799439015"), response as any);

    assert.equal(response.statusCode, 403);
    assert.deepEqual(response.body, {
      success: false,
      message: "You are not allowed to start this conversation",
    });
  } finally {
    restoreFindOne();
    restoreDependencies();
  }
});

test("createConversation preserves HTTP 400 for invalid or missing applicationId", async () => {
  for (const body of [{ applicationId: "invalid" }, {}]) {
    const response = createResponse();

    await createConversation(
      createRequest(developerId, body),
      response as any,
    );

    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.body, {
      success: false,
      message: "Valid applicationId is required",
    });
  }
});
