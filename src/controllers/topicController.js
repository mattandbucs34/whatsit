import { getAllTopics, addTopic, getTopic, deleteTopic, updateTopic } from "../db/queries.topics.js";
import Authorizer from "../policies/topic";
export function index(req, res, next) {
  getAllTopics((err, topics) => {
    if (err) {
      res.redirect(500, "static/index");
    } else {
      res.render("topics/index", { topics });
    }
  });
}
export function new (req, res, next) {
  const authorized = new Authorizer(req.user).new();

  if (authorized) {
    res.render("topics/new");
  } else {
    req.flash("notice", "You are not authorized to do that.");
    res.redirect("/topics");
  }
}
export function create(req, res, next) {
  const authorized = new Authorizer(req.user).create();

  if (authorized) {
    let newTopic = {
      title: req.body.title,
      description: req.body.description
    };
    addTopic(newTopic, (err, topic) => {
      if (err) {
        res.redirect(500, "/topics/new");
      } else {
        res.redirect(303, `/topics/${topic.id}`);
      }
    });
  } else {
    req.flash("notice", "You are not authorized to do that.");
    res.redirect("/topics");
  }
}
export function show(req, res, next) {
  getTopic(req.params.id, (err, topic) => {
    if (err || topic == null) {
      res.redirect(404, "/");
    } else {
      res.render("topics/show", { topic });
    }
  });
}
export function edit(req, res, next) {
  getTopic(req.params.id, (err, topic) => {
    if (err || topic == null) {
      res.redirect(404, "/");
    } else {
      const authorized = new Authorizer(req.user, topic).edit();

      if (authorized) {
        res.render("topics/edit", { topic });
      } else {
        req.flash("You are not authorized to do that.");
        res.redirect(`/topics/${req.params.id}`);
      }
    }
  });
}
export function destroy(req, res, next) {
  deleteTopic(req, (err, topic) => {
    if (err) {
      res.redirect(err, `/topics/${req.params.id}`);
    } else {
      res.redirect(303, "/topics");
    }
  });
}
export function update(req, res, next) {
  updateTopic(req, req.body, (err, topic) => {
    if (err || topic == null) {
      res.redirect(401, `/topics/${req.params.id}/edit`);
    } else {
      res.redirect(`/topics/${req.params.id}`);
    }
  });
}