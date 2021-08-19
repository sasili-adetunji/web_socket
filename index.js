const fs = require('fs');
const path = require('path');
var WebSocketServer = require('ws').Server;
const express = require('express');

const PORT = process.env.PORT || 9898;

const server = express()
  .use(function (req, res, next) {
    if (req.path.substr(-1) == '/' && req.path.length > 1) {
      let query = req.url.slice(req.path.length)
      res.redirect(301, req.path.slice(0, -1) + query)
    } else next()
  })
  .use((req, res) => res.sendFile(path.join(__dirname, './', req.url)) )
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    const client_data = JSON.parse(message)
    processMessage(client_data)
  });
  ws.on('close', () => console.log('Client disconnected'));
});

function processMessage(message) {
  if (message.type == "event.interaction") {
    fs.appendFile('interactions.txt', `${message.data}\n`, function (err) {
      if (err) return console.log(err);
    });
  }
  if (message.type == "event.error") {
    fs.appendFile('errors.txt', `${message.data}\n`, function (err) {
      if (err) return console.log(err);
    });
  }
}
