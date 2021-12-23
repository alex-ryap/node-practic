import { appendFile, createReadStream } from 'fs';
import * as readline from 'readline';
import { join } from 'path';
import colors from 'colors';

/**
 * Get params from cli
 */
let [path, ...patterns] = process.argv.slice(2);

if (!path) {
  console.log(colors.red('Please input path to file in params'));
  process.exit();
}

if (patterns.length <= 0) {
  patterns = ['89.123.1.41', '34.48.240.111'];
}

/**
 * Write selected line to file
 * @param {string} path path to file
 * @param {string} data line from log file
 */
const writeToFile = (path, data) => {
  appendFile(join('./', path), data + '\n', (err) => {
    if (err) throw err;
  });
};

/**
 * Find patterns from line
 * @param {string} line line from log file
 * @param {array} patterns array of patterns
 * @returns array founded patterns
 */
const find = (line, patterns) => {
  const foundedPatterns = [];

  for (const pattern of patterns) {
    if (line.includes(pattern)) foundedPatterns.push(pattern);
  }

  return foundedPatterns;
};

/**
 * Open read stream
 */
const rt = readline.createInterface({
  input: createReadStream(path, { encoding: 'utf-8' }),
  crlDelay: Infinity,
});

/**
 * read file line by line and find patterns
 */
rt.on('line', (line) => {
  const foundedPatterns = find(line, patterns);

  if (foundedPatterns.length > 0) {
    for (const pattern of foundedPatterns) {
      writeToFile(pattern + '_requests.log', line);
    }
  }
});
