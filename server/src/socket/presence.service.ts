const onlineUsers = new Map<string, number>();
const userRevisions = new Map<string, number>();

const advanceRevision = (userId: string): number => {
  const revision = (userRevisions.get(userId) ?? 0) + 1;
  userRevisions.set(userId, revision);
  return revision;
};

export const addUserConnection = (userId: string): boolean => {
  const currentConnections = onlineUsers.get(userId) ?? 0;

  onlineUsers.set(userId, currentConnections + 1);

  if (currentConnections === 0) {
    advanceRevision(userId);
    return true;
  }

  return false;
};

export const removeUserConnection = (userId: string): boolean => {
  const currentConnections = onlineUsers.get(userId) ?? 0;

  if (currentConnections === 0) {
    return false;
  }

  if (currentConnections === 1) {
    onlineUsers.delete(userId);
    advanceRevision(userId);
    return true;
  }

  onlineUsers.set(userId, currentConnections - 1);

  return false;
};

export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};

export const getUserPresence = (userId: string): {
  online: boolean;
  revision: number;
} => ({
  online: isUserOnline(userId),
  revision: userRevisions.get(userId) ?? 0,
});
