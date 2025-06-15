import ApiError from '../utils/api.error.js'
import userModel from '../api/users/user.model.js'
import { validateAccessToken } from '../api/users/token.service.js'

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            throw new ApiError(401, 'Unauthorized: No token provided')
        }

        const token = authHeader.split(' ')[1]
        const userDataFromToken = validateAccessToken(token)

        if(!userDataFromToken){
            throw new ApiError(401, 'Unauthorized: Invalid token')
        }

        const user = await userModel.findById(userDataFromToken.id)

        if(!user){
            throw new ApiError(401, 'Unauthorized: User not found')
        }

        req.user = user
        next()

    } catch (error) {
        next(new ApiError(500, 'Something went wrong in auth middleware'))
    }
}

export default authMiddleware