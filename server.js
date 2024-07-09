const express = require('express');
const app = express();
const port = 4000;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

console.log("start server on port http://localhost:" + port);

app.listen(port);