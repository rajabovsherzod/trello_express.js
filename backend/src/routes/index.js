import { Router } from "express";
import userRoutes from '../api/users/user.route.js';
import boardRoutes from '../api/boards/board.route.js';


const router = Router()

router.use('/users', userRoutes);
router.use('/boards', boardRoutes)



export default router
