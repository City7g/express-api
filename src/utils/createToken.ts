import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const createAccessToken = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  })
}

const createRefreshToken = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  })
}

const createTokens = (data: any) => {
  const access_token = createAccessToken(data)
  const refresh_token = createRefreshToken(data)

  return { access_token, refresh_token }
}

export { createAccessToken, createRefreshToken, createTokens }
