import { hacker, random } from "faker";

let postMessage = [];

for (let i = 0; i < 15; i++) {
  postMessage.push({
    title: hacker.noun(),
    body: hacker.phrase(),
    createdAt: new Date(),
    updatedAt: new Date(),
    topicId: random.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
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
  return queryInterface.bulkInsert("Posts", postMessage, {});
}
export function down(queryInterface, Sequelize) {
  /*
    Add reverting commands here.
    Return a promise to correctly handle asynchronicity.

    Example:
    return queryInterface.bulkDelete('Person', null, {});
  */
  return queryInterface.bulkDelete("Posts", null, {});
}
