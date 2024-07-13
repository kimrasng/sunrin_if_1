document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const chatBox = document.getElementById('chatBox');
    const messages = document.getElementById('messages');
    const chatForm = document.getElementById('chatForm');
    const m = document.getElementById('m');
    const loginMessage = document.getElementById('loginMessage');
    const signupMessage = document.getElementById('signupMessage');
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
      socket.emit('login', username, password);
    });
  
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('signupUsername').value;
      const nickname = document.getElementById('signupNickname').value;
      const password = document.getElementById('signupPassword').value;
      socket.emit('signup', username, nickname, password);
    });
  
    socket.on('login result', (result) => {
      loginMessage.textContent = result.message;
      if (result.success) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        chatBox.style.display = 'block';
      }
    });
  
    socket.on('signup result', (result) => {
      signupMessage.textContent = result.message;
    });
  
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = m.value;
      socket.emit('chat message', msg);
      m.value = '';
      return false;
    });
  
    socket.on('chat message', (msg) => {
      const item = document.createElement('li');
      item.textContent = msg;
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });
  
    document.getElementById('logoutButton').addEventListener('click', () => {
      socket.emit('logout');
      location.reload();
    });
  });