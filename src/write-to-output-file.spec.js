const fs = require('fs');
const path = require('path');
const writeToOutputFile = require('./write-to-output-file');

let outputDirPath;
let outputFilePath;

beforeAll(() => {
  outputDirPath = fs.mkdtempSync(
    path.join(__dirname, path.sep, 'write-to-output-file.spec.')
  );
  outputFilePath = path.join(outputDirPath, path.sep, 'output.csv');
});

beforeEach(() => {
  if (fs.existsSync(outputFilePath)) {
    fs.truncateSync(outputFilePath);
  }
  fs.appendFileSync(outputFilePath, 'ExternalReference');
});

afterAll(() => {
  if (fs.existsSync(outputFilePath)) {
    fs.rmSync(outputFilePath);
  }
  if (fs.existsSync(outputDirPath)) {
    fs.rmdirSync(outputDirPath);
  }
});

it('should append to the output file', () => {
  // Arrange
  const data1 = new Date().valueOf();
  const data2 = new Date().valueOf();

  // Act
  writeToOutputFile(outputFilePath, data1);
  writeToOutputFile(outputFilePath, data2);

  // Assert
  expect(fs.readFileSync(outputFilePath, { encoding: 'UTF-8' })).toEqual(
    `ExternalReference\n${data1}\n${data2}`
  );
});
