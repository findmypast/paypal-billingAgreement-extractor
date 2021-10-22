const fs = require("fs");

/**
 * Appends text to a new line in the file
 * @param {string} outputFilePath The full path to the file
 * @param {string} data The data to append to the file
 */
const writeToOutputFile = (outputFilePath, data) =>
  fs.appendFileSync(outputFilePath, `\n${data}`);

module.exports = writeToOutputFile;
