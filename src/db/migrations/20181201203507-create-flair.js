'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Flairs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      color: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      /* flairId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Flairs",
          key: "id",
          as: "flairId",
        },
      } */
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Flairs');
  }
};