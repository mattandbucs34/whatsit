import * as PostQueries from "../db/queries.posts.js";
import Authorizer from "../policies/post.js";

export function newPost(req, res, next) {
  const authorized = new Authorizer(req.user).new();
  if (authorized) {
    res.render("posts/new", { topicId: req.params.topicId });
  } else {
    req.flash("notice", "You are not authorized to do that!");
    res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}/new`);
  }
}
export async function createPost(req, res, next) {
  const authorized = new Authorizer(req.user).create();
  if (authorized) {
    let newPostData = {
      title: req.body.title,
      body: req.body.body,
      topicId: req.params.topicId,
      userId: req.user.id
    };
    try {
      const post = await PostQueries.addPost(newPostData);
      res.redirect(303, `/topics/${newPostData.topicId}/posts/${post.id}`);
    } catch (err) {
      res.redirect(500, "/posts/new");
    }
  } else {
    req.flash("notice", "You are not authorized to do that!");
    res.redirect(`/topics/${req.params.topicId}`);
  }
}
export async function showPost(req, res, next) {
  try {
    const post = await PostQueries.getPost(req);
    if (post == null) {
      res.redirect(404, "/");
    } else {
      res.render("posts/show", { post });
    }
  } catch (err) {
    res.redirect(404, "/");
  }
}
export async function destroyPost(req, res, next) {
  try {
    await PostQueries.deletePost(req);
    res.redirect(303, `/topics/${req.params.topicId}`);
  } catch (err) {
    res.redirect(302, `/topics/${req.params.topicId}/posts/${req.params.id}`);
  }
}
export async function editPost(req, res, next) {
  try {
    const post = await PostQueries.getPost(req);
    if (post == null) {
      res.redirect(404, "/");
    } else {
      const authorized = new Authorizer(req.user, post).edit();
      if (authorized) {
        res.render("posts/edit", { post });
      } else {
        req.flash("You are not authorized to do that!");
        res.redirect(`/topics/${req.params.topicId}`);
      }
    }
  } catch (err) {
    res.redirect(404, "/");
  }
}
export async function updatePost(req, res, next) {
  try {
    const post = await PostQueries.getPost(req);
    if (!post) return res.redirect(404, "/");

    const authorized = new Authorizer(req.user, post).update();
    if (authorized) {
      await PostQueries.updatePost(req.params.id, req.body);
      res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
    } else {
      req.flash("notice", "You are not authorized to do that!");
      res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
    }
  } catch (err) {
    res.redirect(401, `/topics/${req.params.topicId}/posts/${req.params.id}/edit`);
  }
}