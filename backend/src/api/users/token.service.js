import jwt from 'jsonwebtoken'
import TokenModel from './token.model.js'

export const generateTokens = async (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})

    await saveRefreshToken(payload.id, refreshToken)

    return {accessToken, refreshToken}
}

export const saveRefreshToken = async (userId, refreshToken) => {
    const tokenData = await TokenModel.findOneAndUpdate(
        { userId: userId },
        { token: refreshToken },
        { new: true, upsert: true }
    )
    return tokenData
}

export const removeToken = async (refreshToken) => {
    const tokenData = await TokenModel.deleteOne({token: refreshToken})
    return tokenData
}

export const findToken = async (refreshToken) => {
    const tokenData = await TokenModel.findOne({token: refreshToken})
    return tokenData
}

export const validateAccessToken = (token) => {
    try {
        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        return userData
    } catch (error) {
        return null
    }
}

export const validateRefreshToken = (token) => {
    try {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        return userData
    } catch (error) {
        return null
    }
}


    