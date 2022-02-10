const { join, resolve } = require('path');
const rl = require('readline');
const { readdirSync, lstatSync, createReadStream } = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const inquirer = require('inquirer');
const colors = require('colors');

export class Reader {
  /**
   * Create instance of Reader
   * @param {string} path - path to directory
   * @param {string} searchText - text for searching in file
   */
  constructor(path, searchText) {
    this.currentDirectory = path;
    this.searchText = searchText;
  }

  /**
   * Getting list of files in current directory
   * @returns list of files
   */
  #getListOfFiles() {
    let list = readdirSync(this.currentDirectory);
    if (this.currentDirectory !== '/') list = ['.', '..', ...list];
    return list;
  }

  /**
   * File check
   * @param {string} path
   * @returns true or false
   */
  #isFile(path) {
    if (lstatSync(path).isFile()) return true;
    return false;
  }

  /**
   * Opening readable stream
   * @param {string} path
   * @returns stream
   */
  #openReadStream(path) {
    const stream = rl.createInterface({
      input: createReadStream(path, { encoding: 'utf-8' }),
      crlfDelay: Infinity,
    });

    return stream;
  }

  /**
   * Read file
   * @param {FileStream} stream
   */
  #readFile(stream) {
    stream.on('line', (line) => {
      console.log(line);
    });
  }

  /**
   * Search text in file
   * @param {FileStream} stream
   */
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

  /**
   * Show files in command line
   */
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
