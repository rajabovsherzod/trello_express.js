import { Router } from "express";
import userRoutes from '../api/users/user.route.js';
import boardRoutes from '../api/boards/board.route.js';
import listRoutes from '../api/lists/list.route.js';
import cardRoutes from '../api/cards/card.route.js';


const router = Router()

router.use('/users', userRoutes);
router.use('/boards', boardRoutes);
router.use('/lists', listRoutes);
router.use('/cards', cardRoutes);



export default router
