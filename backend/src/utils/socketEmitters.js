export const emitToUser = (req, userId, event, payload) => {
  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");

  const socketId = onlineUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit(event, payload);
  }
};

export const emitToUsers = (req, userIds, event, payloads) => {
  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");

  userIds.forEach((userId, index) => {
    const socketId = onlineUsers.get(userId.toString());
    if (socketId && payloads[index]) {
      io.to(socketId).emit(event, payloads[index]);
    }
  });
};
