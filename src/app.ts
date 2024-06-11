import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import usersRouter from './routes/usersRouter'
import authRouter from './routes/authRouter'
import filesRouter from './routes/filesRouter'

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

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/files', filesRouter)

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.all('/*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(8080, async () => {
  console.log('Start')
  try {
    mongoose.set('debug', true)
    await mongoose.connect(process.env.DB_MONGO || 'mongo')
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})
