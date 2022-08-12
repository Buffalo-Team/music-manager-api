import { Router } from 'express';
import { signup } from 'controllers/authController';
import {
  getOneUser,
  updateUser,
  deleteUser,
  getAllUsers,
  createUser,
} from 'controllers/userController';

const router = Router();

router.route('/:id').get(getOneUser).patch(updateUser).delete(deleteUser);

router.route('/').get(getAllUsers).post(createUser);

router.route('/signup').post(signup);

export default router;
