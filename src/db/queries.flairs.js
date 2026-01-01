const Flair = require("./models").default.Flair;

module.exports = {
  getAllFlairs(callback) {
    return Flair.all().then((flairs) => {
      callback(null, flairs);
    }).catch((err) => {
      callback(err);
    });
  },

  addFlair(newFlair, callback) {
    return Flair.create({
      name: newFlair.name,
      color: newFlair.color
    }).then((flair) => {
      callback(null, flair);
    }).catch((err) => {
      callback(err);
    });
  },

  getFlair(name, callback) {
    return Flair.findOne({
      where: { name: name }
    }).then((flair) => {
      callback(null, flair);
    }).catch((err) => {
      callback(err);
    });
  },

  deleteFlair(name, callback) {
    return Flair.destroy({
      where: { name }
    }).then((flair) => {
      callback(null, flair);
    }).catch((err) => {
      callback(err);
    });
  },

  updateFlair(name, updatedFlair, callback) {
    return Flair.findOne({
      where: { name }
    }).then((flair) => {
      if (!flair) {
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
};