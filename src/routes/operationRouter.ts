import { Router } from 'express';
import { getAllOperations } from 'controllers/operation';
import protect from 'middlewares/protect';

const router = Router();

router.use(protect); // YOU HAVE TO BE LOGGED IN TO ENTER ROUTES BELOW

router.route('/').get(getAllOperations);

export default router;
