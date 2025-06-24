import { Router } from 'express'
import UserController from './user.controller.js'
import UserService from './user.service.js'
import { schema } from './user.dto.js'
import { validate } from '../../middlewares/validation.middleware.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import passport from 'passport'

const router = Router()

const userController = new UserController(UserService)

router.post('/register', validate(schema.register), userController.register)
router.post('/verify-email', userController.verifyEmail)
router.post('/login', validate(schema.login), userController.login)
router.post('/refresh', userController.refresh)
router.post('/logout', userController.logout)
router.get('/me', authMiddleware, userController.getMe)

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))
router.get('/auth/github', passport.authenticate('github', {
    scope: ['user:email'] 
}))

router.get(
    '/auth/google/callback',
     passport.authenticate('google', {
        session: false,
        failureRedirect: '/login',
    }),
    userController.googleAuthCallback
)
router.get(
    '/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    userController.githubAuthCallback
);

router.post('/auth/google/complete-registration', userController.completeRegistration)
router.get('/search', authMiddleware, userController.searchUsers);

export default router