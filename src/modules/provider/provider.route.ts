import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { providerController } from './provider.controller';

const router = Router();

/// all gears
router.post('/', auth(Role.PROVIDER), providerController.createGear);
router.get('/gears', auth(Role.PROVIDER), providerController.getMyGear);
router.get('/gears/:id', auth(Role.PROVIDER), providerController.getMyGearById);

router.put('/:id', auth(Role.PROVIDER), providerController.updateGear);
router.delete('/:id', auth(Role.PROVIDER), providerController.deleteGear);
router.patch('/:id/stock', auth(Role.PROVIDER), providerController.updateGearStock);
router.patch('/:id/status', auth(Role.PROVIDER), providerController.updateGearStatus);

// get all orders
router.get('/orders', providerController.getOrders);

router.get('/orders/:id', providerController.getOrderById);

router.patch('/orders/:id/status', providerController.updateOrderStatus);

export const providerRoutes = router;
