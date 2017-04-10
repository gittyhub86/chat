const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();

app.use(express.static('./'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(msg) {
  	// Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
    	if (client !== wss && client.readyState === WebSocket.OPEN) {
    		client.send(msg);
    	}
    });
  });

  ws.send('Welcome to the chat room.');
});

server.listen(3000, function listening() {
  console.log('Listening on %d', server.address().port);
});

/*server.listen(process.env.PORT || '8080', function listening() {
  console.log('Listening on %d', server.address().port);
});*/