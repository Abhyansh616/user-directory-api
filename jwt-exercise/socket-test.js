const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to Socket.IO");
  console.log("Socket ID:", socket.id);
});

socket.on("upload_progress", (data) => {
  console.log("Upload progress:", data);
});

socket.on("upload_complete", (data) => {
  console.log("Upload complete:", data);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO");
});