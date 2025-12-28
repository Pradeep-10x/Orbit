 function registerCallEvents(io, onlineUsers) {
  io.on("connection", (socket) => {

    socket.on("call:start", ({ to, offer }) => {
      const target = onlineUsers.get(to);
      if (target) {
        io.to(target).emit("call:incoming", {
          from: socket.id,
          offer
        });
      }
    });

    socket.on("call:answer", ({ to, answer }) => {
      io.to(to).emit("call:answer", { answer });
    });

    socket.on("call:ice", ({ to, candidate }) => {
      io.to(to).emit("call:ice", { candidate });
    });

    socket.on("call:end", ({ to }) => {
      io.to(to).emit("call:end");
    });

  });
}


export default registerCallEvents;