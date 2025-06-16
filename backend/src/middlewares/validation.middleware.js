import { body, validationResult } from 'express-validator'
import ApiError from '../utils/api.error.js'

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const errorMessages = errors.array().map(error => error.msg).join(', ')
        return next(new ApiError(400, errorMessages))
    }
    next()
}

export const registerValidation = [
    body('email', 'Please provide a valid email').isEmail(),
    body('password', 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/),
    body('username', 'Username cannot be empty').notEmpty(),
    handleValidationErrors
]

export const loginValidation = [
    body('login', 'Login field cannot be empty').notEmpty(),
    body('password', 'Password field cannot be empty').notEmpty(),
    handleValidationErrors
]
