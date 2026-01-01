import { getAllAdverts, addAdvert, getAdvert, deleteAdvert, updateAdvert } from "../db/queries.adverts.js";

export function index(req, res, next) {
  getAllAdverts((err, adverts) => {
    if (err) {
      res.redirect(500, "static/index");
    } else {
      res.render("adverts/index", { adverts });
    }
  });
}
export function newAdvert(req, res, next) {
  res.render("adverts/new");
}
export function createAdvert(req, res, next) {
  let newAdvert = {
    title: req.body.title,
    description: req.body.description
  };

  addAdvert(newAdvert, (err, advert) => {
    if (err) {
      res.redirect(500, "/adverts/new");
    } else {
      res.redirect(303, `/adverts/${advert.id}`);
    }
  });
}
export function showAdvert(req, res, next) {
  getAdvert(req.params.id, (err, advert) => {
    if (err || advert == null) {
      res.redirect(404, "/");
    } else {
      res.render("adverts/show", { advert });
    }
  });
}
export function destroyAdvert(req, res, next) {
  deleteAdvert(req.params.id, (err, advert) => {
    if (err) {
      res.redirect(500, `/adverts/${advert.id}`);
    } else {
      res.redirect(303, "/adverts");
    }
  });
}
export function editAdvert(req, res, next) {
  getAdvert(req.params.id, (err, advert) => {
    if (err || advert == null) {
      res.redirect(404, "/");
    } else {
      res.render("adverts/edit", { advert });
    }
  });
}
export function updateAdvert(req, res, next) {
  updateAdvert(req.params.id, req.body, (err, advert) => {
    if (err || advert == null) {
      res.redirect(404, `/adverts/${req.params.id}/edit`);
    } else {
      res.redirect(`/adverts/${advert.id}`);
    }
  });
}