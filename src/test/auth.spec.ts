import supertest from 'supertest'
import express from 'express'
import bodyParser from 'body-parser'
import authRouter from '../routes/authRouter'
import { faker } from '@faker-js/faker'

const app = express()

app.use(bodyParser.json())
app.use('/api/auth', authRouter)

const newUser = {
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}

describe('Test auth router', () => {
  test('Test validate register route', async () => {
    const res = await supertest(app).post('/api/auth/register').send()

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('message', 'Validation error')
    expect(res.body).toHaveProperty('errors')
  })

  test('Test success register route', async () => {
    console.log(newUser.name)

    const res = await supertest(app).post('/api/auth/register').send(newUser)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('access_token')
    expect(res.body).toHaveProperty('refresh_token')
    expect(res.body.user).toHaveProperty('id')
    expect(res.body.user).toHaveProperty('name', newUser.name)
    expect(res.body.user).toHaveProperty('email', newUser.email)
    expect(res.body.user).not.toHaveProperty('password')
  })

  test('Test unique register email', async () => {
    const res = await supertest(app).post('/api/auth/register').send(newUser)

    expect(res.statusCode).toBe(409)
    expect(res.body).toHaveProperty('message', 'Email already exists')
  })

  test('Test validate login route', async () => {
    const res = await supertest(app).post('/api/auth/login').send()

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('message', 'Validation error')
    expect(res.body).toHaveProperty('errors')
  })

  test('Test success login route', async () => {
    const res = await supertest(app).post('/api/auth/login').send(newUser)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('access_token')
    expect(res.body).toHaveProperty('refresh_token')
    expect(res.body.user).toHaveProperty('id')
    expect(res.body.user).toHaveProperty('name', newUser.name)
    expect(res.body.user).toHaveProperty('email', newUser.email)
    expect(res.body.user).not.toHaveProperty('password')
  })
})
