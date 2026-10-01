const onlineUsers = new Map<string, number>();

export const addUserConnection = (userId: string): boolean => {
  const currentConnections = onlineUsers.get(userId) ?? 0;

  onlineUsers.set(userId, currentConnections + 1);

  return currentConnections === 0;
};

export const removeUserConnection = (userId: string): boolean => {
  const currentConnections = onlineUsers.get(userId) ?? 0;

  if (currentConnections <= 1) {
    onlineUsers.delete(userId);
    return true;
  }

  onlineUsers.set(userId, currentConnections - 1);

  return false;
};

export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};
