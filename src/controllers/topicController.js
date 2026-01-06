import { getAllTopics, addTopic, getTopic, deleteTopic, updateTopic } from "../db/queries.topics.js";
import Authorizer from "../policies/topic.js";
export async function index(req, res, next) {
  try {
    const topics = await getAllTopics();
    res.render("topics/index", { topics });
  } catch (err) {
    res.redirect(500, "static/index");
  }
}
export function newTopic(req, res, next) {
  const authorized = new Authorizer(req.user).new();

  if (authorized) {
    res.render("topics/new");
  } else {
    req.flash("notice", "You are not authorized to do that.");
    res.redirect("/topics");
  }
}
export async function create(req, res, next) {
  const authorized = new Authorizer(req.user).create();

  if (authorized) {
    let newTopicData = {
      title: req.body.title,
      description: req.body.description
    };
    try {
      const topic = await addTopic(newTopicData);
      res.redirect(303, `/topics/${topic.id}`);
    } catch (err) {
      res.redirect(500, "/topics/new");
    }
  } else {
    req.flash("notice", "You are not authorized to do that.");
    res.redirect("/topics");
  }
}
export async function show(req, res, next) {
  try {
    const topic = await getTopic(req.params.id);
    if (topic == null) {
      res.redirect(404, "/");
    } else {
      res.render("topics/show", { topic });
    }
  } catch (err) {
    res.redirect(404, "/");
  }
}
export async function edit(req, res, next) {
  try {
    const topic = await getTopic(req.params.id);
    if (topic == null) {
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
  } catch (err) {
    res.redirect(404, "/");
  }
}
export async function destroy(req, res, next) {
  try {
    await deleteTopic(req);
    res.redirect(303, "/topics");
  } catch (err) {
    res.redirect(err, `/topics/${req.params.id}`);
  }
}
export async function update(req, res, next) {
  try {
    const topic = await updateTopic(req, req.body);
    if (topic == null) {
      res.redirect(401, `/topics/${req.params.id}/edit`);
    } else {
      res.redirect(`/topics/${req.params.id}`);
    }
  } catch (err) {
    res.redirect(401, `/topics/${req.params.id}/edit`);
  }
}