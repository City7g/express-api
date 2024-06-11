import { Router } from 'express'
import dotenv from 'dotenv'

import User from '../models/users'
import { createTokens, verifyToken } from '../utils/createToken'
import { validateData } from '../middleware/validationMiddleware'
import { loginSchema, registerSchema } from '../schemas/authSchema'
import { authMiddleware } from '../middleware/authMiddleware'
import { updateUserSchema } from '../schemas/userSchema'

dotenv.config()

const router = Router()

router.post('/register', validateData(registerSchema), async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  })

  if (user) {
    return res.status(409).json({ message: 'Email already exists' })
  }

  const newUser = await User.create(req.body)

  res.status(201).json({ ...createTokens({ id: newUser.id }), newUser })
})

router.post('/login', validateData(loginSchema), async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const tokens = createTokens({ id: user.id })

  res.json({ ...tokens, user })
})

router.post('/me', authMiddleware(), async (req, res) => {
  const user = await User.findById(req.userInfo.id)

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

  const user = await User.findById(id)

  if (!user) {
    return res.status(401).json({ message: 'Access token is invalid' })
  }

  res.json({ ...createTokens({ id: user.id }), user })
})

router.post('/logout', authMiddleware(), async (req, res) => {
  const user = await User.findById(req.userInfo.id)

  if (!user) {
    return res.status(401).json({ message: 'Access token is invalid' })
  }

  user.save()

  res.sendStatus(204)
})

router.post(
  '/update',
  authMiddleware(),
  validateData(updateUserSchema),
  async (req, res) => {
    console.log(req.userInfo.id, req.body)

    const user = await User.findOne({
      email: req.body.email,
    })

    if (user) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    const updateUser = await User.findByIdAndUpdate(req.userInfo.id, req.body, {
      new: true,
    })

    if (!updateUser) {
      return res.status(401).json({ message: 'Access token is invalid' })
    }

    res.json(updateUser)
  }
)

export default router
