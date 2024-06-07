import { Router } from 'express'
import dotenv from 'dotenv'

import User from '../models/users'
import { createTokens } from '../utils/createToken'
import { validateData } from '../middleware/validationMiddleware'
import { loginSchema, registerSchema } from '../schemas/authSchema'
import { authMiddleware } from '../middleware/authMiddleware'

dotenv.config()

const router = Router()

router.post('/login', validateData(loginSchema), async (req, res) => {
  const user = await User.findOne({
    where: { email: req.body.email },
    attributes: { exclude: ['password'] },
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
  const user = await User.findByPk(21)
  res.json({ user })
})

router.post('/refresh', authMiddleware(), async (req, res) => {
  const user = await User.findByPk(21)
  res.json({ ...createTokens({ id: user?.getDataValue('id') }), user })
})

router.all('/*', (req, res) => {
  res.sendStatus(404)
})

export default router
