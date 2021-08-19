const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 9898 });

const clients = new Map();

wss.on('connection', (ws) => {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);

    ws.on('message', (message) => {
      const metadata = clients.get(ws);
      message.sender = metadata.id;
      message.color = metadata.color;
      const outbound = JSON.stringify(message);

      [...clients.keys()].forEach((client) => {
        client.send(outbound);
      });

      console.log('Received Message:', message);
    });
    ws.on('close', (reasonCode, description) => {
        console.log('Client has disconnected.');
        clients.delete(ws);

    });
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
console.log("wss up");