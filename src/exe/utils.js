const path = require('path');
const fs = require('fs');
const StateManager = require('./StateManager');

module.exports.getCurrentDirectory = (execPath) =>
  execPath
    .split('\\')
    .filter((_, index, array) => index < array.length - 1)
    .join('\\');

module.exports.createFolders = ({
  currentDirectory,
  foldersCreateOperations,
}) => {
  foldersCreateOperations.forEach((operation) => {
    const folderPath = path.join(currentDirectory, operation.path);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      StateManager.reportSuccess(`Created ${folderPath} folder.`);
    } else {
      StateManager.reportWarning(`Folder ${folderPath} has already existed.`);
    }
  });
};

module.exports.performFilesOperations = ({
  currentDirectory,
  filesOperations,
}) => {
  filesOperations.forEach((operation) => {
    if (operation.type === 'ADD') {
      const songPath = path.join(currentDirectory, operation.fileName);
      const destinationPath = path.join(currentDirectory, operation.path);
      const destinationSongPath = path.join(
        destinationPath,
        operation.fileName
      );

      if (fs.existsSync(destinationSongPath)) {
        StateManager.reportWarning(
          `File ${operation.fileName} already in ${destinationPath}`
        );
      } else if (fs.existsSync(songPath) && fs.existsSync(destinationPath)) {
        fs.renameSync(songPath, destinationSongPath);
        StateManager.reportSuccess(
          `Moved ${operation.fileName} to ${destinationPath}`
        );
      } else {
        StateManager.reportError(
          `Moving ${operation.fileName} failed: Source or destination not found.`
        );
      }
    } else if (operation.type === 'DELETE') {
      const fileToDeletePath = path.join(currentDirectory, operation.path);

      if (fs.existsSync(fileToDeletePath)) {
        fs.unlinkSync(fileToDeletePath);
        StateManager.reportSuccess(`Removed ${fileToDeletePath}.`);
      } else {
        StateManager.reportWarning(
          `Removing ${fileToDeletePath} failed: File not found.`
        );
      }
    }
  });
};

module.exports.waitForKeyPress = async (message) => {
  console.log(message);
  console.log('Click any key to continue. . .\n');
  process.stdin.setRawMode(true);
  return new Promise((resolve) => {
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      resolve();
    });
  });
};
