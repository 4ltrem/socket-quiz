const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

/* 
    CORS handling code based on:
    https://socket.io/docs/v4/handling-cors/
*/ 
const io = new socketIO.Server(server, {
  cors: {
    origin: "http://localhost:3000",
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let interval;
let questions;

io.on("connection", (socket) => {
  
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  
  socket.on("gimmeQuestion", () => {
    //console.log("request received");
    //const response = "test"
    socket.emit("ServedQuestion", "test");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

});

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
  };

server.listen(port, () => console.log(`Listening on port ${port}`));