import { Router } from 'express';
import {
  getOneFile,
  updateFile,
  deleteFile,
  getAllFiles,
  createFile,
} from 'controllers/fileController';

const router = Router();

router.route('/:id').get(getOneFile).patch(updateFile).delete(deleteFile);

router.route('/').get(getAllFiles).post(createFile);

export default router;
