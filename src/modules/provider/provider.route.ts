import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { providerController } from './provider.controller';

const router = Router();

/// all gears -- done testing
router.post('/gears', auth(Role.PROVIDER), providerController.createGear);
router.get('/gears', auth(Role.PROVIDER), providerController.getMyGear);
router.get('/gears/:id', auth(Role.PROVIDER), providerController.getMyGearById);

router.put('/gears/:id', auth(Role.PROVIDER), providerController.updateGear);
router.delete('/gears/:id', auth(Role.PROVIDER), providerController.deleteGear);
router.patch('/gears/:id/stock', auth(Role.PROVIDER), providerController.updateGearStock);
router.patch('/gears/:id/status', auth(Role.PROVIDER), providerController.updateGearStatus);

// get all orders
router.get('/rentals', auth(Role.PROVIDER), providerController.getAllRentals);
router.get('/rentals/:id', auth(Role.PROVIDER), providerController.getRentalById);
router.patch('/rentals/:id/status', auth(Role.PROVIDER), providerController.updateRentalStatus);

router.patch('/rentals/:id/confirm', auth(Role.PROVIDER), providerController.confirmRentalStatus);

router.get('/analytics', auth(Role.PROVIDER), providerController.getAnalytics);

export const providerRoutes = router;
