const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 9898 });
const fs = require('fs');

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const client_data = JSON.parse(message)
      processMessage(client_data)
    });
    ws.on('close', (reasonCode, description) => {
        console.log('Client has disconnected.');
    });
});

function processMessage(message) {
  if (message.type == "event.interaction") {
    fs.appendFile('errors.txt', `${message.data}\n`, function (err) {
      if (err) return console.log(err);
    });
  }
  if (message.type == "event.error") {
    fs.appendFile('interactions.txt', `${message.data}\n`, function (err) {
      if (err) return console.log(err);
    });
  }
}


console.log("wss up");