import bcrypt from 'bcryptjs'
import userModel from "./user.model.js";
import { UserDto }  from "./user.dto.js";
import { generateTokens, removeToken, validateRefreshToken, findToken } from "./token.service.js";
import ApiError from "../../utils/api.error.js";


class UserService {
    async register(username, email, password) {
        const candidate = await userModel.findOne({ email })
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} already exists`)
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({ username, email, password: hashedPassword })
        
        const userDto = new UserDto(user)
        const tokens = await generateTokens({ ...userDto })

        return { ...tokens, user: userDto }
    }

    async login({ email, username, password }) {
        const user = await userModel.findOne({
            $or: [{ email }, { username }]
        }).select('+password');

        if (!user) {
            throw ApiError.BadRequest('User not found with provided credentials')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Invalid password')
        }

        const userDto = new UserDto(user)
        const tokens = await generateTokens({ ...userDto })

        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        if (!refreshToken) {
            throw ApiError.BadRequest("Refresh token not provided");
        }
        await removeToken(refreshToken)
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new ApiError(401, 'User is not authorized');
        }

        const userData = validateRefreshToken(refreshToken)
        const tokenFromDb = await findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw new ApiError(401, 'User is not authorized');
        }

        const user = await userModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = await generateTokens({ ...userDto })

        return { ...tokens, user: userDto }
    }
    
}

export default new UserService()