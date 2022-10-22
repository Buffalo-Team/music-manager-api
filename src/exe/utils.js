const path = require('path');
const fs = require('fs');
const StateManager = require('./StateManager');

const PATH_DELIMITER = '\\';

module.exports.getCurrentDirectory = (execPath) =>
  execPath
    .split(PATH_DELIMITER)
    .filter((_, index, array) => index < array.length - 1)
    .join(PATH_DELIMITER);

// Copied from https://stackoverflow.com/questions/8496212/node-js-fs-unlink-function-causes-eperm-error
const deleteFolderRecursive = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const currentPath = path.join(folderPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(currentPath);
      } else {
        // delete file
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
};

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
        if (fs.lstatSync(fileToDeletePath).isDirectory()) {
          deleteFolderRecursive(fileToDeletePath);
        } else {
          fs.unlinkSync(fileToDeletePath);
        }
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
