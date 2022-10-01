import { Router } from 'express';
import {
  getOneFile,
  updateFile,
  deleteFile,
  getAllFiles,
  createFilesMatchingUploads,
  createFolder,
  getFilesInFolder,
} from 'controllers/file';
import protect from 'middlewares/protect';
import resolveUploadTarget from 'middlewares/resolveUploadTarget';
import { uploadToS3 } from 'controllers/AWS';

const router = Router();

router.use(protect); // YOU HAVE TO BE LOGGED IN TO ENTER ROUTES BELOW

router.route('/').get(getAllFiles);

router.route('/in/:folderId?').get(getFilesInFolder);

router
  .route('/upload/:target?')
  .post(
    resolveUploadTarget,
    uploadToS3.array('songs'),
    createFilesMatchingUploads
  );

router.route('/folder/:target?').post(resolveUploadTarget, createFolder);

router.route('/:id').get(getOneFile).patch(updateFile).delete(deleteFile);

export default router;
