const flairQueries = require("../db/queries.flairs.js");

module.exports = {
  new(req, res, next) {
    res.render("flairs/new");
  },

  create(req, res, next) {
    let newFlair = {
      name: req.body.flairName,
      color: req.body.flairColor
    };
    flairQueries.addFlair(newFlair, (err, flair) => {
      if(err) {
        res.redirect(500, "/flairs/new");
      }else {
        res.redirect(303, `/flairs/${flair.id}`);
      }
    });
  },

  show(req, res, next) {
    flairQueries.getFlair(req.params.color, (err, flair) => {
      if(err || flair == null)
        res.redirect(404, "/");
      else
        res.render("flairs/show", {flair});
    });
  },

  destroy(req, res, next) {
    flairQueries.deleteFlair(req.params.id, (err, flair) => {
      if(err) {
        res.redirect(500, `/flairs/${flair.id}`);
      }else {
        res.redirect(303, `/flairs`);
      }
    });
  }
}