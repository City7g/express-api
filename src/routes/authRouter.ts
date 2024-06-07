import { Router } from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import User from '../models/users'
import { createTokens, verifyToken } from '../utils/createToken'
import { validateData } from '../middleware/validationMiddleware'
import { loginSchema, registerSchema } from '../schemas/authSchema'
import { authMiddleware } from '../middleware/authMiddleware'
import { strict } from 'assert'

dotenv.config()

const router = Router()

router.post('/login', validateData(loginSchema), async (req, res) => {
  const user = await User.findOne({
    where: { email: req.body.email },
  })

  if (!user) {
    return res.json({ error: 'User not found' })
  }

  res.json({ ...createTokens({ id: user.getDataValue('id') }), user })
})

router.post('/register', validateData(registerSchema), async (req, res) => {
  const [user, create] = await User.findOrCreate({
    where: { email: req.body.email },
    defaults: { ...req.body },
  })

  if (!create) {
    return res.status(409).json({ message: 'Email already exists' })
  }

  res
    .status(201)
    .json({ ...createTokens({ id: user.getDataValue('id') }), user })
})

router.post('/me', authMiddleware(), async (req, res) => {
  const user = await User.findByPk(req.userInfo.id)

  if (!user) {
    res.status(401).json({ message: 'Access token is invalid' })
  }

  res.json({ user })
})

router.post('/refresh', async (req, res) => {
  let data

  try {
    data = verifyToken(req.body.refresh_token)
  } catch (error) {
    return res.status(401).json({ message: 'Access token is invalid' })
  }

  const id = typeof data !== 'string' ? data.id : null

  if (!id) {
    return res.status(401).json({ message: 'Access token is invalid' })
  }

  const user = await User.findByPk(id)

  if (!user) {
    return res.status(401).json({ message: 'Access token is invalid' })
  }

  res.json({ ...createTokens({ id: user.getDataValue('id') }), user })
})

export default router
