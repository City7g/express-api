import { Router } from 'express'
import User from '../models/users'
import { validateData } from '../middleware/validationMiddleware'
import { createUserSchema, updateUserSchema } from '../schemas/userSchema'
import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'
import File from '../models/files'
import isValidObjectId from '../utils/isValidObjectId'

const createData = async () => {
  const user = new User({
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  })

  await user.save()

  for (let i = 0; i < 2; i++) {
    File.create({
      filename: faker.system.fileName(),
      path: faker.system.filePath(),
      user: user.id,
    })
  }
}

const router = Router()

router.get('/', async (req, res) => {
  const users = await User.find().populate('files')

  res.json(users)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  if (!isValidObjectId(id)) {
    return res.status(400).send({ message: 'Invalid id format' })
  }

  const user = await User.findById(id).populate('files')

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.json(user)
})

router.post('/', validateData(createUserSchema), async (req, res) => {
  const newUser = await User.create(req.body)

  res.status(201).json(newUser)
})

router.put('/:id', validateData(updateUserSchema), async (req, res) => {
  const { id } = req.params

  if (!isValidObjectId(id)) {
    return res.status(400).send({ message: 'Invalid id format' })
  }

  const user = await User.findByIdAndUpdate(id, req.body, { new: true })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.status(200).json(user)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  if (!isValidObjectId(id)) {
    return res.status(400).send({ message: 'Invalid id format' })
  }

  const user = await User.findByIdAndDelete(id)

  console.log(user)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.sendStatus(204)
})

export default router
