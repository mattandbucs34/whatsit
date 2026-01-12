import * as FlairQueries from "../db/queries.flairs.js";

export async function index(req, res, next) {
  try {
    const flairs = await FlairQueries.getAllFlairs();
    res.render("flairs/index", { flairs });
  } catch (err) {
    res.redirect(500, "static/index");
  }
}
export function newFlair(req, res, next) {
  res.render("flairs/new");
}
export async function createFlair(req, res, next) {
  console.log("NEW FLAIR DATA: ", req.body);
  let newFlairData = {
    name: req.body.name,
    color: req.body.color
  };
  try {
    const flair = await FlairQueries.addFlair(newFlairData);
    res.redirect(303, `/flairs/${flair.name}`);
  } catch (err) {
    res.redirect(505, "/flairs/new");
  }
}
export async function showFlair(req, res, next) {
  try {
    const flair = await FlairQueries.getFlair(req.params.name);
    if (flair == null) {
      res.redirect(404, "/");
    } else {
      res.render("flairs/show", { flair });
    }
  } catch (err) {
    res.redirect(404, "/");
  }
}
export async function destroyFlair(req, res, next) {
  try {
    await FlairQueries.deleteFlair(req.params.name);
    res.redirect(303, "/flairs");
  } catch (err) {
    res.redirect(500, `/flairs/${req.params.name}`);
  }
}
export async function editFlair(req, res, next) {
  try {
    const flair = await FlairQueries.getFlair(req.params.name);
    if (flair == null) {
      res.redirect(404, "/");
    } else {
      res.render("flairs/edit", { flair });
    }
  } catch (err) {
    res.redirect(404, "/");
  }
}
export async function updateFlair(req, res, next) {
  try {
    const flair = await FlairQueries.updateFlair(req.params.name, req.body);
    if (flair == null) {
      res.redirect(404, `/flairs/${req.params.name}/edit`);
    } else {
      res.redirect(`/flairs/${flair.name}`);
    }
  } catch (err) {
    res.redirect(404, `/flairs/${req.params.name}/edit`);
  }
}