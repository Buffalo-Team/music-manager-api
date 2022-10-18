const path = require('path');
const fs = require('fs');

module.exports.getCurrentDirectory = (execPath) =>
  execPath
    .split('\\')
    .filter((_, index, array) => index < array.length - 1)
    .join('\\');

module.exports.createFolders = ({ devicePath, foldersCreateOperations }) => {
  foldersCreateOperations.forEach((operation) => {
    const folderPath = path.join(devicePath, operation.path);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(`Created ${folderPath} folder.`);
    } else {
      console.log(
        `Error while creating ${folderPath}: Folder has already existed.`
      );
    }
  });
};

module.exports.performFilesOperations = ({
  currentDirectory,
  storagePath,
  devicePath,
  filesOperations,
}) => {
  filesOperations.forEach((operation) => {
    if (operation.type === 'ADD') {
      const songPath = path.join(
        currentDirectory,
        storagePath,
        operation.songName
      );
      const destinationPath = path.join(devicePath, operation.path);
      const destinationSongPath = path.join(
        destinationPath,
        operation.songName
      );

      if (fs.existsSync(songPath) && fs.existsSync(destinationPath)) {
        fs.renameSync(songPath, destinationSongPath);
        console.log(`Moved ${operation.songName} to ${destinationPath}`);
      } else {
        console.log(
          `Error while moving ${operation.songName}: Source or destination not found.`
        );
      }
    } else if (operation.type === 'DELETE') {
      const fileToDeletePath = path.join(devicePath, operation.path);

      if (fs.existsSync(fileToDeletePath)) {
        fs.unlinkSync(fileToDeletePath);
        console.log(`Removed ${fileToDeletePath} successfully.`);
      } else {
        console.log(
          `Error while removing ${fileToDeletePath}: File not found.`
        );
      }
    }
  });
};
