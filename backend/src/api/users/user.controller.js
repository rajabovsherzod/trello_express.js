import UserService from './user.service.js'
import { UserDto } from './user.dto.js'

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    register = async (req, res, next) => {
        try {
            const { username, email, password } = req.body
            const userData = await this.userService.register(username, email, password)

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 kun
                httpOnly: true,
            })
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    login = async (req, res, next) => {
       try {
            const { email, username, password } = req.body
            const userData = await this.userService.login({ email, username, password })

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 kun
                httpOnly: true,
            })
            return res.json(userData)
       } catch (error) {
            next(error)
       }
    }

    refresh = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies
            const userData = await this.userService.refresh(refreshToken)
            
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 kun
                httpOnly: true,
            })
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    logout = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies
            await this.userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.status(200).json({ message: "Logged out successfully" })
        } catch (error) {
            next(error)
        }
    }

    getMe = async (req, res, next) => {
        try {
            const user = req.user
            const userDto = new UserDto(user)
            return res.json(userDto)
        } catch (error) {
            next(error)
        }
    }
}


export default UserController