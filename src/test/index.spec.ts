import supertest from 'supertest'
import express from 'express'
import bodyParser from 'body-parser'
import usersRouter from '../routes/usersRouter'

const app = express()

app.use(bodyParser.json())
app.use('/', usersRouter)

describe('Test the root path', () => {
  test('It should response the GET method', async () => {
    const res = await supertest(app).get('/')
    expect(res.statusCode).toBe(200)
  })
})
