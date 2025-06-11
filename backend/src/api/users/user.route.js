import { Router } from 'express'
import UserController from './user.controller.js'
import userService from './user.service.js'
import authMiddleware from '../../middlewares/auth.middleware.js'


const router = Router()
const userController = new UserController(userService)
router.post('/', userController.register)
router.post('/login', userController.login)
router.get('/me', authMiddleware, userController.getMe)

export default router