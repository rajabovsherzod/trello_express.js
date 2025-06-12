import { Router } from "express";
import userRoutes from '../api/users/user.route.js';
import boardRoutes from '../api/boards/board.route.js';
import listRoutes from '../api/lists/list.route.js';


const router = Router()

router.use('/users', userRoutes);
router.use('/boards', boardRoutes);
router.use('/lists', listRoutes);



export default router
