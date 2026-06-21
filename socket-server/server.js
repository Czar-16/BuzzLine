import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

import User from "./user.js";

dotenv.config({
  path: "../.env",
});

await mongoose.connect(process.env.MONGODB_URI);
console.log("MongoDB Connected");

// Reset all users to offline when the server boots up.
// Otherwise, if your server restarts, users who were online get permanently stuck as "online"!
// fine for the development phase
await User.updateMany({}, { isOnline: false });

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Track online users: socketId → userId
const onlineUsers = new Map();

io.on("connection", (socket) => {
  // console.log("Client connected: ", socket.id);
  // console.log(`FINAL ONE ::  socket Id : ${socket.id}`);

  // Map the socket ID to the user ID when a user comes online
  socket.on("user-connected", async (userId) => {
    onlineUsers.set(socket.id, userId);

    // mark the user online
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
    });

    io.emit("user-online", userId);

    // console.log(`User ${userId} connected and socket Id : ${socket.id}`);
  });

  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
    // console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on("send-message", ({ conversationId, message }) => {
    // console.log("Message event received:", message.text);
    // console.log("Sending to room:", conversationId);

    socket.to(conversationId).emit("receive-message", message);

    // console.log("receive-message emitted");
  });
  socket.on("disconnect", async () => {
    // mark user offline
    // console.log("Map before disconnect:", onlineUsers);
    const userId = onlineUsers.get(socket.id);
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastActive: new Date(),
      });

      io.emit("user-offline", {
        userId,
        lastActive: new Date(),
      });

      onlineUsers.delete(socket.id);
      // console.log(`User ${userId} Disconnected...`);
    }
    // console.log("Client disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Socket server running on port 3001");
});
