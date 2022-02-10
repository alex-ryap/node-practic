const { isFile } = require('./utils');
const { join } = require('path');
const Stream = require('stream');
const { readdirSync, readFileSync } = require('fs');

class Reader {
  /**
   * Create instance of Reader
   * @param {string} path - path to directory
   */
  constructor(path) {
    this.startDirectory = path;
    this.currentPath = path;
  }

  /**
   * Getting list of files in current directory
   * @returns string(html)
   */
  getListOfFiles() {
    const listOfFiles = readdirSync(this.currentPath);
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="/socket.io/socket.io.js"></script>
      <link rel="icon" href="data:;base64,=">
      <title>Document</title>
    </head>
    <body>
      <p id="counter"></p>
      <h2>${this.currentPath}</h2>
      <br>
      <ul>
        ${listOfFiles
          .map((file) => {
            const linkToFile = join(this.currentPath, file).replace(
              this.startDirectory,
              ''
            );
            return `<li><a href=${linkToFile}>${file}</a></li>`;
          })
          .join('')}
      </ul>
      <script>
        const socket = io('http://localhost:8888');
        
        const clientCount = document.querySelector('#counter');

        socket.on('connect', () => {
          console.log('Connect');
        });

        socket.on('new_client', (data) => {
          console.log(data);
          clientCount.innerHTML = "<p>Clients <b>online</b>: " + data.count + "</p>";
        })
      </script>
    </body>
    </html>
    `;
  }

  /**
   *
   * @returns file contents
   */
  getFileContent() {
    return readFileSync(this.currentPath, { encoding: 'utf-8' });
  }

  /**
   * Update directory path
   * @param {string} newPath
   */
  changeCurrentPath(newPath) {
    this.currentPath = newPath;
  }

  /**
   * Render file or list of files
   */
  render() {
    let contentType, content;
    if (isFile(this.currentPath)) {
      content = this.getFileContent();
      contentType = 'text/plain';
    } else {
      content = this.getListOfFiles();
      contentType = 'text/html';
    }

    const stream = new Stream();
    stream.pipe = (dest) => {
      dest.write(content);
    };
    return { stream, contentType };
  }
}

module.exports = Reader;
