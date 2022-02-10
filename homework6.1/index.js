const http = require('http');
const io = require('socket.io');
const { createReadStream } = require('fs');
const { join } = require('path');
const generateName = require('./name');

const server = http.createServer((req, res) => {
  let filePath = join(__dirname, 'index.html');

  if (req.url === '/style.css') filePath = join(__dirname, 'style.css');

  const readStream = createReadStream(filePath);

  readStream.pipe(res);
});

const socket = io(server);
let listOfClients = [];

socket.on('connection', (client) => {
  const name = generateName();
  listOfClients.push(name);

  client.broadcast.emit('new_client', { name: name, clients: listOfClients });
  client.emit('new_client', { name: name, clients: listOfClients });

  client.on('client_msg', (data) => {
    const payload = {
      name: name,
      message: data.message,
    };
    client.broadcast.emit('server_msg', payload);
    client.emit('server_msg', payload);
  });

  client.on('disconnect', () => {
    listOfClients = listOfClients.filter((item) => item !== name);
    client.broadcast.emit('out_client', { name: name, clients: listOfClients });
    client.emit('out_client', { name: name, clients: listOfClients });
  });

  client.on('reconnect_client', () => {
    console.log(`${name} reconnecting`);
    client.broadcast.emit('re_client', { name: name });
  });
});

server.listen(8888);
