const emitNotification = (req, receiverId, payload) => {
  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");

  const socketId = onlineUsers.get(receiverId.toString());
  if (socketId) {
    io.to(socketId).emit("notification:new", payload);
  }
};


export { emitNotification };