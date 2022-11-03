import { Router } from 'express';
import protect from 'middlewares/protect';
import { clearTheDatabase, generateExe } from 'controllers/admin';
import restrictTo from 'middlewares/restrictTo';
import { Role } from 'consts/enums';

const router = Router();

router.use(protect); // YOU HAVE TO BE LOGGED IN TO ENTER ROUTES BELOW

router.use(restrictTo(Role.ADMIN));

router.delete('/database', clearTheDatabase);
router.post('/generateExe', generateExe);

export default router;
