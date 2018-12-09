const Flair = require("./models").Flair;
const Topic = require("./models").Topic;

module.exports = {
  getAllFlairs(callback) {
    return Flair.all().then((flairs) => {
      callback(null, flairs);
    }).catch((err) => {
      callback(err);
    })
  },

  addFlair(newFlair, callback) {
    return Flair.create({
      name: newFlair.name,
      color: newFlair.color
    }).then((flair) => {
      callback(null, flair);
    }).catch((err) => {
      callback(err);
    })
  },

  getFlair(name, callback) {
    return Flair.find({
      where: {name}
      },
      {
      include: [{
        model: Topic,
        as: "topics"
      }] 
    })
    .then((flair) => {
      callback(null, flair);
    }).catch((err) => {
      callback(err);
    })
  },

  deleteFlair(name, callback) {
    return Flair.destroy({
      where: {name}
    }).then((deleteFlairCount) => {
      callback(null, deleteFlairCount);
    }).catch((err) => {
      callback(err);
    })
  }, 

  updateFlair(name, updatedFlair, callback) {
    return Flair.find({
      where: {name}
      }).then((flair) => {
      if(!flair) {
        return callback("Flair not found");
      }

      flair.update(updatedFlair, {
        fields: Object.keys(updatedFlair)
      }).then(() => {
        callback(null, flair);
      }).catch((err) => {
        callback(err);
      });
    });
  }
}