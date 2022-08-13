import { Router } from 'express';
import { signup, login, logout, getLoggedUser } from 'controllers/auth';
import {
  getOneUser,
  updateUser,
  deleteUser,
  getAllUsers,
  createUser,
} from 'controllers/user';
import protect from 'middlewares/protect';

const router = Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/me').get(getLoggedUser);

router.use(protect); // YOU HAVE TO BE LOGGED IN TO ENTER ROUTES BELOW

router.route('/:id').get(getOneUser).patch(updateUser).delete(deleteUser);

router.route('/').get(getAllUsers).post(createUser);

export default router;
