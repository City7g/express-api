import jwt, { SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

interface tokenData {
  id: number | string
}

const createAccessToken = (data: tokenData, options?: SignOptions) => {
  return jwt.sign(data, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    ...options,
  })
}

const createRefreshToken = (data: tokenData, options?: SignOptions) => {
  return jwt.sign(data, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    ...options,
  })
}

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret')
}

const createTokens = (data: tokenData) => {
  const access_token = createAccessToken(data)
  const refresh_token = createRefreshToken(data)

  return { access_token, refresh_token }
}

export { createAccessToken, createRefreshToken, createTokens, verifyToken }
