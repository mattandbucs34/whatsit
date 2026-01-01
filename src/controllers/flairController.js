import { getAllFlairs, addFlair, getFlair, deleteFlair, updateFlair } from "../db/queries.flairs.js";

export function index(req, res, next) {
  getAllFlairs((err, flairs) => {
    if (err) {
      res.redirect(500, "static/index");
    } else {
      res.render("flairs/index", { flairs });
    }
  });
}
export function new (req, res, next) {
  res.render("flairs/new");
}
export function create(req, res, next) {
  let newFlair = {
    name: req.body.name,
    color: req.body.color
  };
  addFlair(newFlair, (err, flair) => {
    if (err) {
      res.redirect(505, "/flairs/new");
    } else {
      res.redirect(303, `/flairs/${flair.name}`);
    }
  });
}
export function show(req, res, next) {
  getFlair(req.params.name, (err, flair) => {
    if (err || flair == null) {
      res.redirect(404, "/");
    } else {
      res.render("flairs/show", { flair });
    }
  });
}
export function destroy(req, res, next) {
  deleteFlair(req.params.name, (err, flair) => {
    if (err) {
      res.redirect(500, `/flairs/${req.params.name}`);
    } else {
      res.redirect(303, "/flairs");
    }
  });
}
export function edit(req, res, next) {
  getFlair(req.params.name, (err, flair) => {
    if (err || flair == null) {
      res.redirect(404, "/");
    } else {
      res.render("flairs/edit", { flair });
    }
  });
}
export function update(req, res, next) {
  updateFlair(req.params.name, req.body, (err, flair) => {
    if (err || flair == null) {
      res.redirect(404, `/flairs/${req.params.name}/edit`);
    } else {
      res.redirect(`/flairs/${flair.name}`);
    }
  });
}