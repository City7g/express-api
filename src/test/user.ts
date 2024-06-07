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

  test('Test get user by id', async () => {
    const res = await supertest(app).get('/1')
    expect(res.statusCode).toBe(200)
  })

  test('Test create user', async () => {
    const data = {
      name: 'john',
      email: 'john@example.com',
      password: '123',
    }

    const res = await supertest(app).post('/').send(data)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('name', data.name)
    expect(res.body).toHaveProperty('email', data.email)
    expect(res.body).not.toHaveProperty('password')
  })

  test('Test validate create user', async () => {
    const data = {
      name: '',
      email: '',
      password: '',
    }

    const res = await supertest(app).post('/').send(data)

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('message', 'Validation error')
    expect(res.body).toHaveProperty('errors')
  })
})
