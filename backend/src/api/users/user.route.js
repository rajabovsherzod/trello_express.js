import { Router } from 'express'
import UserController from './user.controller.js'
import UserService from './user.service.js'
import { schema } from './user.dto.js'
import { validate } from '../../middlewares/validation.middleware.js'
import authMiddleware from '../../middlewares/auth.middleware.js'

const router = Router()

const userController = new UserController(UserService)

router.post('/register', validate(schema.register), userController.register)
router.post('/login', validate(schema.login), userController.login)
router.post('/refresh', userController.refresh)
router.post('/logout', userController.logout)
router.get('/me', authMiddleware, userController.getMe)

export default router