import { Router } from 'express'
import User from '../models/users'
import { validateData } from '../middleware/validationMiddleware'
import { createUserSchema, updateUserSchema } from '../schemas/userSchema'

const router = Router()

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.get('/:id(\\d+)', async (req, res) => {
  const user = await User.findByPk(1)
  res.json(user)
})

router.post('/', validateData(createUserSchema), async (req, res) => {
  const newUser = await User.create(req.body)

  res.status(201).json(newUser)
})

router.put('/:id(\\d+)', validateData(updateUserSchema), async (req, res) => {
  const id = +req.params.id
  const user = await User.findByPk(id)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const updatedUser = user.update(req.body)

  res.status(200).json(updatedUser)
})

router.delete('/:id(\\d+)', async (req, res) => {
  const id = +req.params.id
  const user = await User.findByPk(id)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  await user.destroy()

  res.sendStatus(204)
})

export default router
