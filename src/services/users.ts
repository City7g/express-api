import { faker } from '@faker-js/faker'
import { User, Users } from '../types/User'

export const createUsers = (count = 10): Users => {
  const users: Users = []

  for (let i = 0; i < count; i++) {
    users.push(createUser(i))
  }

  return users
}

export const createUser = (id: number): User => {
  return {
    id: id,
    name: faker.internet.userName(),
    email: faker.internet.email(),
  }
}
