import { Router } from 'express'
import UserController from './user.controller.js'
import userService from './user.service.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import { registerValidation, loginValidation } from '../../middlewares/validation.middleware.js'


const router = Router()
const userController = new UserController(userService)
router.post('/', registerValidation, userController.register)
router.post('/login', loginValidation, userController.login)
router.get('/me', authMiddleware, userController.getMe)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)

export default router