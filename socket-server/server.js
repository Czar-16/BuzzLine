import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);

  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);

    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on("send-message", ({ conversationId, message }) => {
    console.log("Message event received:", message.text);
    socket.to(conversationId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Socket server running on port 3001");
});
