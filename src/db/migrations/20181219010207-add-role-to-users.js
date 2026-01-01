export function up(queryInterface, Sequelize) {

  return queryInterface.addColumn(
    "Users",
    "role",
    {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "member"
    }
  );
}
export function down(queryInterface, Sequelize) {
  return queryInterface.removeColumn("Users", "role");
}
