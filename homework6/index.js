const http = require('http');
const io = require('socket.io');
const { createReadStream } = require('fs');
const { join } = require('path');
const generateName = require('./name');

const server = http.createServer((req, res) => {
  const filePath = join(__dirname, 'index.html');

  const readStream = createReadStream(filePath);

  readStream.pipe(res);
});

const socket = io(server);

socket.on('connection', (client) => {
  const name = generateName();
  client.broadcast.emit('new_client', { name: name });

  client.on('client_msg', (data) => {
    const payload = {
      name: name,
      message: data.message,
    };
    client.broadcast.emit('server_msg', payload);
    client.emit('server_msg', payload);
  });

  client.on('disconnect', () => {
    client.broadcast.emit('out_client', { name: name });
  });

  client.on('reconnect_client', () => {
    console.log(`${name} reconnecting`);
    client.broadcast.emit('re_client', { name: name });
  });
});

server.listen(8888);
