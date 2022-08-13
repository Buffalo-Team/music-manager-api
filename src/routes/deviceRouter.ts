import { Router } from 'express';
import {
  getOneDevice,
  updateDevice,
  deleteDevice,
  getAllDevices,
  createDevice,
} from 'controllers/device';
import protect from 'middlewares/protect';

const router = Router();

router.use(protect); // YOU HAVE TO BE LOGGED IN TO ENTER ROUTES BELOW

router.route('/:id').get(getOneDevice).patch(updateDevice).delete(deleteDevice);

router.route('/').get(getAllDevices).post(createDevice);

export default router;
