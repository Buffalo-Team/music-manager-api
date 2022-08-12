const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/:id')
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/signup').post(authController.signup);

module.exports = router;
