export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Adverts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    topicId: {
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Topics",
        key: "id",
        as: "topicId",
      }
    }
  });
}
export function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('Adverts');
}