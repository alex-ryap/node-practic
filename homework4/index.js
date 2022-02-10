const { join, resolve } = require('path');
const rl = require('readline');
const { readdirSync, lstatSync, createReadStream } = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const inquirer = require('inquirer');
const colors = require('colors');

class Reader {
  constructor(path, searchText) {
    this.currentDirectory = path;
    this.searchText = searchText;
  }

  #getListOfFiles() {
    let list = readdirSync(this.currentDirectory);
    if (this.currentDirectory !== '/') list = ['.', '..', ...list];
    return list;
  }

  #isFile(path) {
    if (lstatSync(path).isFile()) return true;
    return false;
  }

  #openReadStream(path) {
    const stream = rl.createInterface({
      input: createReadStream(path, { encoding: 'utf-8' }),
      crlfDelay: Infinity,
    });

    return stream;
  }

  #readFile(stream) {
    stream.on('line', (line) => {
      console.log(line);
    });
  }

  #searchText(stream) {
    let count = 0;
    stream.on('line', (line) => {
      if (line.includes(this.searchText)) {
        const re = new RegExp(this.searchText, 'g');
        console.log(line.replace(re, colors.green(this.searchText)));
        count++;
      }
    });
    stream.on('close', () =>
      console.log(colors.green(`\nFounded is a ${count} lines`))
    );
  }

  showFiles() {
    inquirer
      .prompt([
        {
          name: 'fileName',
          type: 'list',
          message: 'Select a file: ',
          choices: this.#getListOfFiles(),
        },
      ])
      .then(({ fileName }) => {
        const fullPath = join(this.currentDirectory, fileName);

        if (this.#isFile(fullPath)) {
          const stream = this.#openReadStream(fullPath);
          this.searchText ? this.#searchText(stream) : this.#readFile(stream);
        } else {
          this.currentDirectory = fullPath;
          this.showFiles();
        }
      });
  }
}

const options = yargs(hideBin(process.argv))
  .usage('Usage: -d <path>, -s <search text>')
  .option('d', {
    alias: 'directory',
    describe: 'Path to directory',
    type: 'string',
  })
  .option('s', {
    alias: 'search',
    describe: 'Search text',
    type: 'string',
  }).argv;

const startDirectory = resolve(options.directory || './');
const searchText = options.search || '';

const reader = new Reader(startDirectory, searchText);
reader.showFiles();
