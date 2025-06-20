import userService from './user.service.js'
import ApiError from '../../utils/api.error.js'
import { UserDto } from './user.dto.js'
class UserController {
    constructor(userService){
        this.userService = userService
    }
    register = async (req, res, next) => {
        try {
            const {username, email, password} = req.body
            const userData = await this.userService.register({username, email, password})
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(201).json({
                message: "User registred succesfully",
                accessToken: userData.accessToken,
                user: userData.user
            })
        } catch (error) {
            next(error)
        }
    }

    login = async (req, res, next) => {
       try {
            const {login, password} = req.body

            if(!login || !password){
                throw new ApiError(400, 'Please provide login and password')
            }

            const userData = await this.userService.login(login, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict'})

            res.status(200).json({
                message: 'Login was successfull',
                accessToken: userData.accessToken,
                user: userData.user
            })
       } catch (error) {
            next(error)
       }
    }

    getMe = async (req, res, next) => {
        try {
            const userDto = new UserDto(req.user)
            res.status(200).json({
                message: "User data retrieved successfully",
                user: userDto
            })
        } catch (error) {
            next(error)
        }
    }

    logout = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies
            await this.userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.status(200).json({message: 'Logout was successfull'})
        } catch (error) {
            next(error)
        }
    }

    refresh = async (req, res, next) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) {
                return next(new ApiError(401, 'Refresh token not provided'));
            }
            const userData = await this.userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict'})
            res.status(200).json({
                message: 'Refresh was successfull',
                accessToken: userData.accessToken,
                user: userData.user,
                refreshToken: userData.refreshToken
            })
        } catch (error) {
            next(error)
        }
    }
}

export default UserController