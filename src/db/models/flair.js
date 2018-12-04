'use strict';
module.exports = (sequelize, DataTypes) => {
  var Flair = sequelize.define('Flair', {
    name: DataTypes.STRING,
    color: DataTypes.STRING
  }, {});
  Flair.associate = function(models) {
    // associations can be defined here
    Flair.belongsToMany(models.Topic, {
      through: 'TopicFlair'
    }),

    Flair.belongsToMany(models.Post, {
      through: 'PostFlair'
    })
  };
  return Flair;
};