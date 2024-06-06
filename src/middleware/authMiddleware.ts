import { Response, NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const authMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers['authorization']

    if (!authToken || !authToken.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No auth' })
    }

    const token = authToken.split(' ')[1]

    try {
      req.userInfo = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    } catch (error) {
      res.status(403).json({ message: 'Access token is invalid' })
    }

    next()
  }
}
