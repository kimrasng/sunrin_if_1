const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// const chatRouter = require('./src/chat');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pages/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

// app.use('/chat', chatRouter);

server.listen(4000, () => {
  console.log('listening on *:4000');
});