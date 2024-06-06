import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import usersRouter from './routes/usersRouter'
import authRouter from './routes/authRouter'

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

app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

app.use('/', (req, res) => {
  res.send('Hello world!')
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
