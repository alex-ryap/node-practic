const http = require('http');
const { join } = require('path');
const url = require('url');
const Reader = require('./Reader');
const { isFile, isDir } = require('./utils');
const io = require('socket.io');

// create inctance of Reader
const reader = new Reader(__dirname);

const server = http.createServer((req, res) => {
  // get query string
  const { pathname } = url.parse(req.url, true);

  // lock favicon request
  if (pathname.includes('favicon.ico')) {
    res.end();
    return;
  }

  // make requested path to render
  const renderPath = join(reader.startDirectory, pathname);

  try {
    // if requestd path is file or directory render him
    if (isFile(renderPath) || isDir(renderPath)) {
      reader.changeCurrentPath(renderPath);
      const { stream, contentType } = reader.render();
      res.writeHead(200, 'OK', {
        'Content-Type': contentType,
      });
      stream.pipe(res);
      res.end();
    }
  } catch (err) {
    console.log(err.message);
    res.writeHead(404, 'Not Found');
    res.end('Incorrect url');
  }
});

const socket = io(server);

socket.on('connection', (client) => {
  const countOfClients = client.conn.server.clientsCount;
  client.broadcast.emit('new_client', {
    count: countOfClients,
  });
  client.emit('new_client', {
    count: countOfClients,
  });
});

server.listen(8888);
