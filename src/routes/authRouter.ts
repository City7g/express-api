import { Router } from 'express'
import User from '../models/users'

import dotenv from 'dotenv'
import { createTokens } from '../utils/createToken'
import { validateData } from '../middleware/validationMiddleware'
import { loginSchema, registerSchema } from '../schemas/authSchema'

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

  // if (!user && comparePassword(req.body.password, user!.password!)) {
  //   return res.json({ error: 'User not found' })
  // }

  res.json({ ...createTokens({ id: 'id' }), user })
})

router.post('/register', validateData(registerSchema), async (req, res) => {
  const newUser = await User.create(req.body)

  // if (!user && comparePassword(req.body.password, user!.password!)) {
  //   return res.json({ error: 'User not found' })
  // }

  //!! add newUSer id
  res.json({ ...createTokens({ id: 'id' }), newUser })
})

router.post('/me', validateData(registerSchema), async (req, res) => {
  const newUser = await User.create(req.body)

  // if (!user && comparePassword(req.body.password, user!.password!)) {
  //   return res.json({ error: 'User not found' })
  // }

  //!! add newUSer id
  res.json({ ...createTokens({ id: 'id' }), newUser })
})

router.all('/*', (req, res) => {
  res.sendStatus(404)
})

export default router
