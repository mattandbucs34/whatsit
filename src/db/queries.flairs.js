const Flair = require("./models").Flair;
const Topic = require("./models").Topic;
const Post = require("./models").Post;

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

  getFlair(id, callback) {
    return Flair.findById(id)
    .then((flair) => {
      callback(null, flair);
    }).catch((err) => {
      callback(err);
    })
  },

  deleteFlair(id, callback) {
    return Flair.destroy({
      where: {id}
    }).then((deleteFlairCount) => {
      callback(null, deleteFlairCount);
    }).catch((err) => {
      callback(err);
    })
  }
}