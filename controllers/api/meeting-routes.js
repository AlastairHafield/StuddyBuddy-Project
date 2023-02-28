const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname + "/api/meeting-routes.js"));
app.use(express.static(__dirname + '/public'));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on("message", (roomId, message) => {
    socket.to(roomId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
