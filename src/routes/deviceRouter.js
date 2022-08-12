const express = require('express');
const deviceController = require('../controllers/deviceController');

const router = express.Router();

router
  .route('/:id')
  .get(deviceController.getOneDevice)
  .patch(deviceController.updateDevice)
  .delete(deviceController.deleteDevice);

router
  .route('/')
  .get(deviceController.getAllDevices)
  .post(deviceController.createDevice);

module.exports = router;
