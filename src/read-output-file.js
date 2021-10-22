const fs = require("fs");

/**
 * Reads an output file and returns an object representation of the data.
 * @param {string} outputFilePath The full path to the output file
 * @returns {{Array<Object<string, string>>}} Contents of the output file
 */
const readOutputFile = (outputFilePath) => {
  const result = [];
  const contents = fs.readFileSync(outputFilePath, { encoding: "UTF-8" });

  const [titleRow, ...dataRows] = contents.split("\n");
  const propertyName = titleRow.substr(0, 1).toLowerCase() + titleRow.substr(1);
  return dataRows.map((item) => {
    const row = {};
    row[propertyName] = item;
    return row;
  });
};

module.exports = readOutputFile;
