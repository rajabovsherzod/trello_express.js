import ApiError from '../utils/api.error.js'
import userModel from '../api/users/user.model.js'
import { validateAccessToken } from '../api/users/token.service.js'

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('Auth Error: No token or incorrect format.')
            return next(new ApiError(401, 'Unauthorized: No token provided or malformed header.'))
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            console.error('Auth Error: Token is missing after Bearer split.')
            return next(new ApiError(401, 'Unauthorized: Token is missing.'))
        }

        const userDataFromToken = validateAccessToken(token)
        if (!userDataFromToken) {
            console.error('Auth Error: Invalid or expired access token.', { token })
            return next(new ApiError(401, 'Unauthorized: Invalid or expired token.'))
        }

        const user = await userModel.findById(userDataFromToken.id)
        if (!user) {
            console.error('Auth Error: User for the provided token not found.', { userId: userDataFromToken.id })
            return next(new ApiError(401, 'Unauthorized: User for this token not found.'))
        }

        req.user = user
        next()

    } catch (error) {
        console.error('CRITICAL ERROR in auth middleware:', error)
        next(new ApiError(500, 'Something went wrong in the auth middleware.', error))
    }
}

export default authMiddleware