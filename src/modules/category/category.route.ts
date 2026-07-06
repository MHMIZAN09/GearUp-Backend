import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { categoryController } from './category.controller';

const router = Router();

router.post('/', auth(Role.ADMIN, Role.PROVIDER), categoryController.createCategory);
router.get('/', categoryController.getAllCategories);

router.get('/:id', categoryController.getCategoryById);

router.put('/:id', auth(Role.ADMIN, Role.CUSTOMER), categoryController.updateCategory);
router.delete('/:id', auth(Role.ADMIN, Role.CUSTOMER), categoryController.deleteCategory);

export const categoryRoutes = router;
