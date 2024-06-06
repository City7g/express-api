'use strict'

const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const posts = []

    for (let i = 0; i < 50; i++) {
      posts.push({
        title: faker.lorem.words(2, 4),
        userId: faker.number.int({ min: 1, max: 20 }),
        description: faker.lorem.sentences(2, 4),
        createdAt: faker.date.anytime(),
        updatedAt: faker.date.anytime(),
      })
    }

    await queryInterface.bulkInsert('posts', posts)
  },

  async down(queryInterface, Sequelize) {},
}
