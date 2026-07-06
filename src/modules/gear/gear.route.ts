import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { gearController } from './gear.controller';

const router = Router();

router.post('/', auth(Role.PROVIDER), gearController.createGear);
router.get('/my-gear', auth(Role.PROVIDER), gearController.getMyGear);
router.get('/my-gear/:id', auth(Role.PROVIDER), gearController.getMyGearById);

router.get('/', gearController.getAllGear);

router.get('/:id', gearController.getGearById);

router.put('/:id', auth(Role.PROVIDER), gearController.updateGear);
router.delete('/:id', auth(Role.PROVIDER), gearController.deleteGear);

router.patch('/:id/stock', auth(Role.PROVIDER), gearController.updateGearStock);
router.patch('/:id/status', auth(Role.PROVIDER), gearController.updateGearStatus);

export const gearRoutes = router;
