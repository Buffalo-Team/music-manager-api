const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router
  .route('/:id')
  .get(fileController.getOneFile)
  .patch(fileController.updateFile)
  .delete(fileController.deleteFile);

router
  .route('/')
  .get(fileController.getAllFiles)
  .post(fileController.createFile);

module.exports = router;
