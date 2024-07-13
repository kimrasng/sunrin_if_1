const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const io = socketio(server);

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

// databass 테이블 생성
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, nickname TEXT, password TEXT)');
});

// 페이지 연결
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// socket 연결
io.on('connection', (socket) => {
  const sessionId = socket.handshake.headers.cookie && socket.handshake.headers.cookie.split('=')[1];
  socket.sessionId = sessionId;

  // 로그인 기능 구현
  socket.on('login', (username, password) => {
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
      if (err) {
        console.error('Error while logging in: ' + err.message);
        socket.emit('login result', { success: false, message: '로그인 실패' });
      } else {
        if (row) {
          const sessionId = generateSessionId();
          socket.sessionId = sessionId;
          socket.emit('login result', { success: true, message: '로그인 성공' });
          socket.emit('set cookie', { name: 'sessionId', value: sessionId, options: { maxAge: 900000, httpOnly: true } });
          io.emit('chat message', `${row.nickname}님이 접속하셨습니다.`);
          socket.emit('logged in');
          socket.username = row.nickname;
        } else {
          socket.emit('login result', { success: false, message: '유효하지 않은 사용자명 또는 비밀번호' });
        }
      }
    });
  });

  // 회원가입 기능
  socket.on('signup', (username, nickname, password) => {
    db.run('INSERT INTO users (username, nickname, password) VALUES (?, ?, ?)', [username, nickname, password], (err) => {
      if (err) {
        if (err.errno === 19) {
          socket.emit('signup result', { success: false, message: '이미 존재하는 사용자명입니다.' });
        } else {
          console.error('Error while registering user: ' + err.message);
          socket.emit('signup result', { success: false, message: '회원가입 실패' });
        }
      } else {
        socket.emit('signup result', { success: true, message: '회원가입 성공' });
      }
    });
  });

  // 채팅 기능
  socket.on('chat message', (msg) => {
    io.emit('chat message', `[${socket.username}] : ${msg}`);
  });

  // 퇴장 기능
  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('chat message', `${socket.username}님이 나가셨습니다.`);
    }
  });

  // 로그아웃 기능
  socket.on('logout', () => {
    socket.sessionId = null;
    socket.emit('delete cookie', 'sessionId');
  });
});

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});