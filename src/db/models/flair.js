'use strict';
module.exports = (sequelize, DataTypes) => {
  var Flair = sequelize.define('Flair', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    }/* ,
    topicId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Topics",
        key: "id",
        as: "topicId",
      }
    } */
  }, {});
  Flair.associate = function(models) {
    // associations can be defined here
    Flair.hasOne(models.Topic, {
      foreignKey: "flairId",
      as: "flair"
    })
  };
  return Flair;
};