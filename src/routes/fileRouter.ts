import { Router } from 'express';
import {
  getOneFile,
  updateFile,
  deleteFile,
  getAllFiles,
  createFile,
} from 'controllers/file';
import protect from 'middlewares/protect';

const router = Router();

router.use(protect); // YOU HAVE TO BE LOGGED IN TO ENTER ROUTES BELOW

router.route('/:id').get(getOneFile).patch(updateFile).delete(deleteFile);

router.route('/').get(getAllFiles).post(createFile);

export default router;
