const express = require('express');
const app = express();
const port = 4000;

app.get('/', function (req, res) {
  const mainPagePath = path.join(__dirname, './page/index.html');
});


console.log("start server on port http://localhost:" + port);
app.listen(port);