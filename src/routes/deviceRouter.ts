import { Router } from 'express';
import {
  getOneDevice,
  updateDevice,
  deleteDevice,
  getAllDevices,
  createDevice,
} from 'controllers/deviceController';

const router = Router();

router.route('/:id').get(getOneDevice).patch(updateDevice).delete(deleteDevice);

router.route('/').get(getAllDevices).post(createDevice);

export default router;
