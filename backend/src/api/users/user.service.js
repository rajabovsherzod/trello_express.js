import userModel from "./user.model.js";
import { UserDto }  from "./user.dto.js";
import { generateTokens } from "./token.service.js";
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
        const tokens = generateTokens({...userDto})
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

        const payload = {
            id: user._id,
            email: user.email,
            username: user.username
        }

        const userDto = new UserDto(user);
        const tokens = generateTokens(payload)

        return ({
            ...tokens,
            user: userDto
        })
    }
    
}

export default new UserService()