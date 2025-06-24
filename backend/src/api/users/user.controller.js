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

    verifyEmail = async (req, res, next) => {
        try {
            const { email, verificationCode } = req.body
            const userData = await this.userService.verifyEmail(email, verificationCode)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
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

    googleAuthCallback = async (req, res, next) => {
        try {
           const result = await this.userService.OAuthCallback(req.user)

           if(result.isNewUser){
            return res.redirect(`http://localhost:5173/auth/complete-registration?token=${result.registrationToken}`)
           }else {
            res.cookie('refreshToken', result.tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.redirect(`http://localhost:5173/dashboard?accessToken=${result.tokens.accessToken}`)
           }
        } catch (error) {
            next(error)
        }
    }

    githubAuthCallback = async (req, res, next) => {
        try {
            const result = await this.userService.OAuthCallback(req.user)

            if(result.isNewUser){
                return res.redirect(`http://localhost:5173/auth/complete-registration?token=${result.registrationToken}`)
            }else {
                res.cookie('refreshToken', result.tokens.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                })
                return res.redirect(`http://localhost:5173/dashboard?accessToken=${result.tokens.accessToken}`)
            }
        } catch (error) {
            next(error)
        }
    }

    completeRegistration = async (req, res, next) => {
        try {
            const { token, username, password } = req.body
            const userData = await this.userService.completeRegistration(token, username, password)

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })

            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    googleAuthCallback = async (req, res, next) => {
        try {
            
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

    searchUsers = async (req, res, next) => {
        try {
            const query = req.query.query
            const users = await this.userService.searchUsers(query, req.user.id);
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
}


export default UserController