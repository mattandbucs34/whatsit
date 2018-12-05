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
    }
  }, {});
  Flair.associate = function(models) {
    // associations can be defined here
    Flair.belongsToMany(models.Topic, {
      through: 'TopicFlair',
      foreignKey: 'topicId'
    }),

    Flair.belongsToMany(models.Post, {
      through: 'PostFlair'
    })
  };
  return Flair;
};