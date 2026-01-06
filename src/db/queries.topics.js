import db from "./models/index.js";
const Topic = db.Topic;
const Post = db.Post;
import Authorizer from "../policies/topic.js";

export async function getAllTopics() {
  try {
    return await Topic.findAll();
  } catch (err) {
    throw err;
  }
}

export async function addTopic(newTopic) {
  try {
    return await Topic.create({
      title: newTopic.title,
      description: newTopic.description
    });
  } catch (err) {
    throw err;
  }
}

export async function getTopic(id) {
  try {
    return await Topic.findByPk(id, {
      include: [{
        model: Post,
        as: "posts"
      }]
    });
  } catch (err) {
    throw err;
  }
}

export async function deleteTopic(req) {
  try {
    const topic = await Topic.findByPk(req.params.id);
    if (!topic) throw new Error("Topic not found");

    const authorized = new Authorizer(req.user, topic).destroy();

    if (authorized) {
      await topic.destroy();
      return topic;
    } else {
      req.flash("notice", "You are not authorized to do that.");
      throw new Error(401);
    }
  } catch (err) {
    throw err;
  }
}

export async function updateTopic(req, updatedTopic) {
  try {
    const topic = await Topic.findByPk(req.params.id);
    if (!topic) throw new Error("Topic not found");

    const authorized = new Authorizer(req.user, topic).update();

    if (authorized) {
      return await topic.update(updatedTopic, {
        fields: Object.keys(updatedTopic)
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      throw new Error("Forbidden");
    }
  } catch (err) {
    throw err;
  }
}