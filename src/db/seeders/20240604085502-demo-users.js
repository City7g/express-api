'use strict'

const { faker } = require('@faker-js/faker')
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = []

    for (let i = 0; i < 20; i++) {
      users.push({
        name: `${faker.person.firstName()} ${faker.person.lastName()}`,
        email: faker.internet.email(),
        password: bcrypt.hashSync(faker.internet.password(), 10),
        createdAt: faker.date.anytime(),
        updatedAt: faker.date.anytime(),
      })
    }

    users.push({
      name: `Dima Mironenko`,
      email: 'City7gor@gmail.com',
      password: bcrypt.hashSync('123', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await queryInterface.bulkInsert('users', users)
  },

  async down() {},
}
