import { Router } from 'express'
import { faker } from '@faker-js/faker'
import dotenv from 'dotenv'
import multer from 'multer'
import File from '../models/files'
import isValidObjectId from '../utils/isValidObjectId'
import { authMiddleware } from '../middleware/authMiddleware'
import User from '../models/users'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage })

dotenv.config()

const router = Router()

router.get('/', async (req, res) => {
  res.json(await File.find().populate('user'))
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  if (!isValidObjectId(id)) {
    return res.status(400).send({ message: 'Invalid id format' })
  }

  const file = await File.findById(id).populate('user')

  if (!file) {
    return res.status(404).json({ message: 'File not found' })
  }

  res.json(file)
})

router.post(
  '/',
  authMiddleware(),
  upload.single('avatar'),
  async (req, res) => {
    const user = await User.findById(req.userInfo.id)

    if (!user) {
      return res.status(401).json({ message: 'Access token is invalid' })
    }

    const file = await File.create({
      filename: req.file?.filename,
      path: req.file?.path,
      user: user.id,
    })

    user.files.push(file.id)

    res.json({
      file: req.file,
    })
  }
)

export default router
