const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let nicknames = [];

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  socket.on('join', (nickname) => {
    if (nicknames.includes(nickname)) {
      socket.emit('nickname duplicate');
    } else {
      nicknames.push(nickname);
      socket.nickname = nickname;
      io.emit('chat message', `${nickname}가 접속함`);
    }
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', `[${socket.nickname}]: ${msg}`);
  });

  socket.on('disconnect', () => {
    if (socket.nickname) {
      io.emit('chat message', `${socket.nickname}가 나감`);
      nicknames = nicknames.filter(n => n !== socket.nickname);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
