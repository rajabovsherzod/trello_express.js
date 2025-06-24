import bcrypt from 'bcryptjs'
import userModel from "./user.model.js";
import { UserDto }  from "./user.dto.js";
import { generateTokens, removeToken, validateRefreshToken, findToken } from "./token.service.js";
import ApiError from "../../utils/api.error.js";
import emailService from "../../utils/email.service.js";
import jwt from 'jsonwebtoken'
import { createVerificationEmailTemplate } from "../../templates/emailverification.templates.js";


class UserService {
    async register(username, email, password) {
        const candidate = await userModel.findOne({ email })
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} already exists`)
        }

        const verificationCode =Math.floor(100000 + Math.random() * 900000).toString()
        const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

        const user = await userModel.create({ 
            username, 
            email, 
            password,
            verificationCode,
            verificationCodeExpiresAt
         })

         const subject = 'Verify your email for Trello App';
        const html = createVerificationEmailTemplate(verificationCode)

        try {
            await emailService.send(email, subject, html)
        } catch (error) {
            throw ApiError(500, 'Failed to send verification email')
        }
        

        return { 
            message: "Registration successful. Please check your email for the verification code."
        }
    }

    async verifyEmail(email, verificationCode) {
        const user = await userModel.findOne({ email}).select('+verificationCode +verificationCodeExpiresAt');
        if(!user) {
            throw new ApiError(400, 'User with this email does not exist.')
        }
        if(user.isVerified){
            throw new ApiError(400, 'This account has already been verified.')
        }

        if(user.verificationCode !== verificationCode){
            throw new ApiError(400, 'Invalid verification code.')
        }

        if(user.verificationCodeExpiresAt < new Date()){
            throw new ApiError(400, 'Verification code has expired.')
        }

        user.isVerified = true
        user.verificationCode = null
        user.verificationCodeExpiresAt = null

        await user.save()

        const userDto = new UserDto(user)
        const tokens = await generateTokens({ ...userDto })

        return {
            message: "Email verified successfully.",
            ...tokens,
            user: userDto
        }
    }

    async login({ email, username, password }) {
        const user = await userModel.findOne({
            $or: [{ email }, { username }]
        }).select('+password');

        if (!user) {
            throw new ApiError(400, 'User not found with provided credentials');
        }

        if(!user.isVerified){
            throw new ApiError(403, 'Account is not verified. Please check your email.')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Invalid password')
        }

        const userDto = new UserDto(user)
        const tokens = await generateTokens({ ...userDto })

        return { ...tokens, user: userDto }
    }

    async OAuthCallback(oauthUser){
        if(oauthUser && !oauthUser.isNewUser){
            const userDto = new UserDto(oauthUser)
            const tokens = await generateTokens({...userDto})

            return {
                isNewUser: false,
                tokens,
            }
        }

        if(oauthUser && oauthUser.isNewUser){
            const registrationToken = jwt.sign(
                {
                    email: oauthUser.email,
                    googleId: oauthUser.googleId,
                    username: oauthUser.username,
                },
                process.env.JWT_ACCESS_SECRET,
                {expiresIn: '10m'}
            )

            return {
                isNewUser: true,
                registrationToken,
            }
        }

        throw new ApiError(400, 'Something went wrong during Google authentication.')
    }

    async completeRegistration(token, username, password){
        if(!token){
            throw new ApiError(400, 'Registration token is missing.')
        }
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        } catch (error) {
            throw new ApiError(400, 'Invalid or expired registration token.')
        }

        const { email, googleId } = decoded

        const existingUserByEmail = await userModel.findOne({ email })
        if(existingUserByEmail){
            throw new ApiError(400, 'User with this email already exists.')
        }

       const existingUserByUsername = await userModel.findOne({ username })
       if(existingUserByUsername){
        throw new ApiError(400, 'User with this username already exists.')
       }

       const user = await userModel.create({
        googleId,
        email,
        username,
        password,
        isVerified: true,
       })

       const userDto = new UserDto(user)
       const tokens = await generateTokens({...userDto})

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

    async searchUsers(query, currentUserId) {
            if (!query || query.trim().length < 2) {
                return [];
            }
            const regex = new RegExp(query, 'i');
            const users = await userModel.find({
                _id: { $ne: currentUserId },
                $or: [{ username: regex }, { email: regex }]
            }).limit(5);
            return users;
    }
    
}

export default new UserService()