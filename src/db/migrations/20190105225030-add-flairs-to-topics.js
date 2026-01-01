export function up(queryInterface, Sequelize) {
  return queryInterface.addColumn(
    "Topics",
    "flairId",
    {
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Flairs",
        key: "id",
        as: "flairId"
      },
    }
  );
}
export function down(queryInterface, Sequelize) {
  return queryInterface.removeColumn("Topics", "flairId");
}
