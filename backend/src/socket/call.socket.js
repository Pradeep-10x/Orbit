 function registerCallEvents(io, onlineUsers) {
  io.on("connection", (socket) => {
    // Get userId from socket
    const userId = socket.handshake.query.userId;

    socket.on("call:start", ({ to, offer, type = 'video' }) => {
      // 'to' should be userId, not socket.id
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call:incoming", {
          from: userId || socket.id,
          fromSocketId: socket.id,
          offer,
          type
        });
      }
    });

    socket.on("call:answer", ({ to, answer }) => {
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call:answer", { 
          answer,
          from: userId || socket.id
        });
      }
    });

    socket.on("call:ice", ({ to, candidate }) => {
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call:ice", { 
          candidate,
          from: userId || socket.id
        });
      }
    });

    socket.on("call:end", ({ to }) => {
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call:end", {
          from: userId || socket.id
        });
      }
    });

    socket.on("call:reject", ({ to }) => {
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call:rejected", {
          from: userId || socket.id
        });
      }
    });

  });
}


export default registerCallEvents;