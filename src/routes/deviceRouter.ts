import { Router } from 'express';
import {
  getOneDevice,
  updateDevice,
  deleteDevice,
  getAllDevices,
  createDevice,
  downloadMissingFiles,
} from 'controllers/device';
import protect from 'middlewares/protect';

const router = Router();

router.use(protect); // YOU HAVE TO BE LOGGED IN TO ENTER ROUTES BELOW

router.route('/').get(getAllDevices).post(createDevice);

router.route('/:id/downloadMissingFiles').get(downloadMissingFiles);

router.route('/:id').get(getOneDevice).patch(updateDevice).delete(deleteDevice);

export default router;
