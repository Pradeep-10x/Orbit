import { Server } from "socket.io";
import registerCallEvents from "./call.socket.js";

 const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true
    }
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("user:online", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
          break;
        }
      }
    });
  });

  registerCallEvents(io, onlineUsers);

  return { io, onlineUsers };
};

export { initSocket };