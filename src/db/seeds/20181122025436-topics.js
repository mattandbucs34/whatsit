import { hacker } from "faker";

let topics = [];

for (let i = 1; i <= 15; i++) {
  topics.push({
    title: hacker.noun(),
    description: hacker.phrase(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export function up(queryInterface, Sequelize) {
  /*
    Add altering commands here.
    Return a promise to correctly handle asynchronicity.

    Example:
    return queryInterface.bulkInsert('Person', [{
      name: 'John Doe',
      isBetaMember: false
    }], {});
  */
  return queryInterface.bulkInsert("Topics", topics, {});
}
export function down(queryInterface, Sequelize) {
  /*
    Add reverting commands here.
    Return a promise to correctly handle asynchronicity.

    Example:
    return queryInterface.bulkDelete('Person', null, {});
  */
  return queryInterface.bulkDelete("Topics", null, {});
}
