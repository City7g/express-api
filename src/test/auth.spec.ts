import supertest from 'supertest'
import express from 'express'
import bodyParser from 'body-parser'
import authRouter from '../routes/authRouter'
import { faker } from '@faker-js/faker'
import { createAccessToken, createRefreshToken } from '../utils/createToken'

const app = express()

app.use(bodyParser.json())
app.use('/api/auth', authRouter)

const newUser = {
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}

const userInfo = {
  id: null,
  access_token: null,
  refresh_token: null,
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

    userInfo.id = res.body.user.id
    userInfo.access_token = res.body.access_token
    userInfo.refresh_token = res.body.refresh_token

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('access_token')
    expect(res.body).toHaveProperty('refresh_token')
    expect(res.body.user).toHaveProperty('id')
    expect(res.body.user).toHaveProperty('name', newUser.name)
    expect(res.body.user).toHaveProperty('email', newUser.email)
    expect(res.body.user).not.toHaveProperty('password')
  })

  test('Test me route middleware', async () => {
    const res = await supertest(app).post('/api/auth/me')

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('message', 'No auth')
  })

  test('Test expired token me route', async () => {
    const res = await supertest(app)
      .post('/api/auth/me')
      .set(
        'Authorization',
        `Bearer ${createAccessToken(
          { id: 1 },
          {
            expiresIn: '-1m',
          }
        )}`
      )

    expect(res.statusCode).toBe(403)
    expect(res.body).toHaveProperty('message', 'Access token is invalid')
  })

  test('Test success me route', async () => {
    const res = await supertest(app)
      .post('/api/auth/me')
      .set('Authorization', `Bearer ${userInfo.access_token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).not.toHaveProperty('access_token')
    expect(res.body).not.toHaveProperty('refresh_token')
    expect(res.body.user).toHaveProperty('id')
    expect(res.body.user).toHaveProperty('name', newUser.name)
    expect(res.body.user).toHaveProperty('email', newUser.email)
    expect(res.body.user).not.toHaveProperty('password')
  })

  test('Test refresh route without refresh token', async () => {
    const res = await supertest(app).post('/api/auth/refresh')

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('message', 'Access token is invalid')
  })

  test('Test refresh route without refresh token', async () => {
    const res = await supertest(app).post('/api/auth/refresh')

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('message', 'Access token is invalid')
  })

  test('Test refresh route with invalid id', async () => {
    const refresh_token = createRefreshToken({ id: 1000000000 })
    const res = await supertest(app).post('/api/auth/refresh').send({
      refresh_token,
    })

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('message', 'Access token is invalid')
  })

  test('Test success refresh route', async () => {
    const res = await supertest(app).post('/api/auth/refresh').send({
      refresh_token: userInfo.refresh_token,
    })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('access_token')
    expect(res.body).toHaveProperty('refresh_token')
    expect(res.body.user).toHaveProperty('id')
    expect(res.body.user).toHaveProperty('name', newUser.name)
    expect(res.body.user).toHaveProperty('email', newUser.email)
    expect(res.body.user).not.toHaveProperty('password')
  })
})
