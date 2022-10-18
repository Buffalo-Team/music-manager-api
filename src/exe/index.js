const { partition } = require('lodash');
const fs = require('fs');
const {
  getCurrentDirectory,
  createFolders,
  performFilesOperations,
} = require('./utils');
const { DATA_JSON_PATH } = require('./consts');

const currentDirectory = getCurrentDirectory(process.execPath);

try {
  const dataRaw = fs.readFileSync(DATA_JSON_PATH);
  const { devicePath, storagePath, operations } = JSON.parse(dataRaw);

  const [foldersCreateOperations, restOperations] = partition(
    operations,
    ({ type, isFolder }) => type === 'ADD' && isFolder === true
  );

  createFolders({ devicePath, foldersCreateOperations });

  performFilesOperations({
    filesOperations: restOperations,
    currentDirectory,
    devicePath,
    storagePath,
  });
} catch (err) {
  console.log(err);
}

console.log('Press any key to exit');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));
