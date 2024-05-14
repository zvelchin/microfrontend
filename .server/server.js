// Импортируем необходимые модули
const express = require("express");
const path = require("path");
const http = require("http");

const app = express();

const port = 4200;

const dist = path.join(__dirname, "../dist");
const indexPath = path.join(dist, "index.html");

app.use(express.static(dist));

app.get("*", function (request, response) {
  response.sendFile(path.resolve(indexPath));
});

const server = http.createServer(app);
server.listen(port);
