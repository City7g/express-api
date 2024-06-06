import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

interface tokenData {
  id: number | string
}

const createAccessToken = (data: tokenData) => {
  return jwt.sign(data, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  })
}

const createRefreshToken = (data: tokenData) => {
  return jwt.sign(data, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  })
}

const createTokens = (data: tokenData) => {
  const access_token = createAccessToken(data)
  const refresh_token = createRefreshToken(data)

  return { access_token, refresh_token }
}

export { createAccessToken, createRefreshToken, createTokens }
