'use strict';
const faker = require("faker");

let topics = [];

for(let i = 0; i < 15; i++) {
  postMessage.push({
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert("Posts", posts, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete("Posts", null, {});
  }
};
