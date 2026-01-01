import { hacker, internet } from "faker";

let flairs = [];

for (let i = 0; i < 15; i++) {
  flairs.push({
    name: hacker.noun(),
    color: internet.color(),
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
  return queryInterface.bulkInsert("Flairs", flairs, {});
}
export function down(queryInterface, Sequelize) {
  /*
    Add reverting commands here.
    Return a promise to correctly handle asynchronicity.

    Example:
    return queryInterface.bulkDelete('Person', null, {});
  */
  return queryInterface.bulkDelete("Flairs", null, {});
}
