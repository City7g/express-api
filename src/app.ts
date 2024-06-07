import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import usersRouter from './routes/usersRouter'
import authRouter from './routes/authRouter'
import multer from 'multer'

import { sequelize } from './db/connection'

//! how move in express.d.ts
declare global {
  namespace Express {
    interface Request {
      userInfo: any
    }
  }
}

dotenv.config()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage })

const app = express()

app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

app.post('/photo', upload.single('avatar'), (req, res, next) => {
  console.log(req.file)

  res.json({
    file: req.file,
  })
})

app.use('/', (req, res) => {
  res.send('Hello world!')
})

app.all('/*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(3000, async () => {
  console.log('Start')
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})
