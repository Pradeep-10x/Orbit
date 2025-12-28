 function registerCallEvents(io, onlineUsers) {
  io.on("connection", (socket) => {

    socket.on("call:start", ({ to, offer }) => {
      if (!to || !offer) {
        socket.emit("call:error", { message: "Invalid call parameters" });
        return;
      }
      
      if (typeof to !== "string" && typeof to !== "object") {
        socket.emit("call:error", { message: "Invalid user ID" });
        return;
      }
      
      const target = onlineUsers.get(to.toString());
      if (target) {
        io.to(target).emit("call:incoming", {
          from: socket.id,
          offer
        });
      }
    });

    socket.on("call:answer", ({ to, answer }) => {
      if (!to || !answer) {
        socket.emit("call:error", { message: "Invalid answer parameters" });
        return;
      }
      io.to(to.toString()).emit("call:answer", { answer });
    });

    socket.on("call:ice", ({ to, candidate }) => {
      if (!to || !candidate) {
        socket.emit("call:error", { message: "Invalid ICE candidate" });
        return;
      }
      io.to(to.toString()).emit("call:ice", { candidate });
    });

    socket.on("call:end", ({ to }) => {
      if (!to) {
        return;
      }
      io.to(to.toString()).emit("call:end");
    });

  });
}


export default registerCallEvents;