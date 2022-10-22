const { partition } = require('lodash');
const fs = require('fs');
const {
  getCurrentDirectory,
  createFolders,
  performFilesOperations,
  waitForKeyPress,
} = require('./utils');
const { DATA_JSON_PATH } = require('./consts');
const StateManager = require('./StateManager');

(async () => {
  const currentDirectory = getCurrentDirectory(process.execPath);
  await waitForKeyPress(
    `This application will move and delete files inside ${currentDirectory} directory and child directories. Do you want to continue?`
  );

  try {
    const dataRaw = fs.readFileSync(DATA_JSON_PATH);
    const { operations } = JSON.parse(dataRaw);

    const [foldersCreateOperations, restOperations] = partition(
      operations,
      ({ type, isFolder }) => type === 'ADD' && isFolder === true
    );

    createFolders({ currentDirectory, foldersCreateOperations });

    performFilesOperations({
      filesOperations: restOperations,
      currentDirectory,
    });
  } catch (err) {
    StateManager.reportError(`Unexpected Error -> ${err}`);
  }

  await waitForKeyPress(
    `\n${StateManager.status}\nYour device has been updated. Remember to mark it as up to date in the Music Manager application.`
  ).then(() => process.exit(0));
})();
