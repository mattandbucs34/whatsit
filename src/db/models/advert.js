export default (sequelize, DataTypes) => {
  var Advert = sequelize.define('Advert', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    topicId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Topics",
        key: "id",
        as: "topicId",
      }
    }
  }, {});
  Advert.associate = function (models) {
    // associations can be defined here
    Advert.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });
  };
  return Advert;
};