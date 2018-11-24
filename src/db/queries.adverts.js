const Advert = require("./models").Advert;

module.exports = {

  getAllAdverts(callback) {
    return Advert.all().then((adverts) => {
      callback(null, adverts);
    }).catch((err) => {
      callback(err);
    })
  },

  addAdvert(newAdvert, callback) {
    return Advert.create({
      title: newAdvert.title,
      description: newAdvert.description
    })
    .then((advert) => {
      callback(null, advert);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getAdvert(id, callback){
    return Advert.findById(id).then((advert) => {
      callback(null, advert);
    }).catch((err) => {
      callback(err);
    })
  },

  deleteAdvert(id, callback) {
    return Advert.destroy({
      where: {id}
    }).then((advert) => {
      callback(null, advert);
    }).catch((err) => {
      callback(err);
    })
  },

  updateAdvert(id, updatedAdvert, callback) {
    return Advert.findById(id)
    .then((advert) => {
      if(!advert) {
        return callback("Topic Not Found");
      }

      advert.update(updatedAdvert, {
        fields: Object.keys(updatedAdvert)
      }).then(() => {
        callback(null, advert);
      }).catch((err) => {
        callback(err);
      });
    });
  }
}