const createServer = require('http').createServer;
const fs = require('fs');
var WebSocketServer = require('ws').Server;
const parse = require('url').parse;

const server = createServer((req, res) => {
  fs.readFile(__dirname + req.url, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const client_data = JSON.parse(message)
      processMessage(client_data)
    });
    ws.on('close', (reasonCode, description) => {
        console.log('Client has disconnected.');
    });
});

server.on('upgrade', function upgrade(request, socket, head) {
  const { pathname } = parse(request.url);
  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
})

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
const port = 9898
server.listen(port, () => console.info(`Server is running on PORT ${port}`));
