import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { gearController } from './gear.controller';

const router = Router();



router.get('/', gearController.getAllGear);
router.get('/:id', gearController.getGearById);



export const gearRoutes = router;
