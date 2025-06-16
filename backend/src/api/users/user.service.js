import userModel from "./user.model.js";
import { UserDto }  from "./user.dto.js";
import { generateTokens, removeToken, validateRefreshToken, findToken } from "./token.service.js";
import ApiError from "../../utils/api.error.js";


class UserService {
    async register(userData){
        const existingUser = await userModel.findOne({
            $or: [{email: userData.email}, {username: userData.username}]
        })

        if(existingUser){
            throw new ApiError(409, 'User with this email or username already exists.')
        }

        const newUser = await userModel.create(userData)
        const userDto = new UserDto(newUser)
        const tokens = await generateTokens({...userDto})
        return ({user: userDto, ...tokens})
    }

    async login(login, password){
        const user = await userModel.findOne({$or: [{email: login}, {username: login}]}).select('+password')

        if(!user){
            throw new ApiError(401, 'Invalid credentials')
        }

        const isPasswordMatch = await user.comparePassword(password)

        if(!isPasswordMatch){
            throw new ApiError(401, 'Invalid credentials')
        }

        const userDto = new UserDto(user);
        const tokens = await generateTokens({...userDto})

        return ({
            ...tokens,
            user: userDto
        })
    }

    async logout(refreshToken){
        if(!refreshToken){
            return 
        }

        const tokenData = await removeToken(refreshToken)
        return tokenData
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw new ApiError(401, 'User is not authenticated')
        }

        const userDataFromToken = validateRefreshToken(refreshToken)
        const tokenFromDb = await findToken(refreshToken)

        if(!userDataFromToken || !tokenFromDb){
            throw new ApiError(401, 'User is not authenticated')
        }

        const user = await userModel.findById(userDataFromToken.id)

        if(!user){
            throw new ApiError(401, 'User not found')
        }

        const userDto = new UserDto(user)
        const tokens = await generateTokens({...userDto})

        return ({
            ...tokens,
            user: userDto
        })
    }
    
}

export default new UserService()