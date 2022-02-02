const { lstatSync } = require('fs');

const isFile = (pathToFile) => {
  return lstatSync(pathToFile).isFile();
};

const isDir = (pathToFile) => {
  return lstatSync(pathToFile).isDirectory();
};

module.exports = { isFile, isDir };
