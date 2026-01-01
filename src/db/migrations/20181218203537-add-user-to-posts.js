export function up(queryInterface, Sequelize) {

  return queryInterface.addColumn(
    "Posts",
    "userId",
    {
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
        as: "userId"
      },
    }
  );
}
export function down(queryInterface, Sequelize) {

  return queryInterface.removeColumn("Posts", "userId");
}
