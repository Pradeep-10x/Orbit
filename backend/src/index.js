import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { initSocket } from "./socket/index.js";
import { app } from "./app.js";
import connectDB from "./db/index.js";


const PORT = process.env.PORT || 8000;


const server = http.createServer(app);
const { io, onlineUsers } = initSocket(server);
app.set("io", io);
app.set("onlineUsers", onlineUsers);
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server (HTTP + Socket.IO) running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
  });
