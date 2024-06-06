import { Router } from 'express'
import User from '../models/users'
import { createPassword } from '../utils/hashPassword'
import { validateData } from '../middleware/validationMiddleware'
import { createUserSchema, updateUserSchema } from '../schemas/userSchema'

const router = Router()

router.get('/', async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } })
  res.json(users)
})

router.get('/:id(\\d+)', async (req, res) => {
  const user = await User.findByPk(1, { attributes: { exclude: ['password'] } })
  res.json(user)
})

router.post('/', validateData(createUserSchema), async (req, res) => {
  req.body.password = createPassword(req.body.password)

  const newUser = await User.create(req.body)

  res.status(201).json(newUser)
})

router.put('/:id(\\d+)', validateData(updateUserSchema), async (req, res) => {
  if (req.body.password) req.body.password = createPassword(req.body.password)

  const updatedUser = await User.update(req.body, {
    where: { id: req.params.id },
  })

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

router.all('/*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

export default router
