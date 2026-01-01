import { addPost, getPost, deletePost, updatePost } from "../db/queries.posts.js";
import Authorizer from "../policies/post";

export function new (req, res, next) {
  const authorized = new Authorizer(req.user).new();
  if (authorized) {
    res.render("posts/new", { topicId: req.params.topicId });
  } else {
    req.flash("notice", "You are not authorized to do that!");
    res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}/new`);
  }
}
export function create(req, res, next) {
  const authorized = new Authorizer(req.user).create();
  if (authorized) {
    let newPost = {
      title: req.body.title,
      body: req.body.body,
      topicId: req.params.topicId,
      userId: req.user.id
    };
    addPost(newPost, (err, post) => {
      if (err) {
        res.redirect(500, "/posts/new");
      } else {
        res.redirect(303, `/topics/${newPost.topicId}/posts/${post.id}`);
      }
    });
  } else {
    req.flash("notice", "You are not authorized to do that!");
    res.redirect(`/topics/${req.params.topicId}`);
  }
}
export function show(req, res, next) {
  getPost(req, (err, post) => {
    if (err || post == null) {
      res.redirect(404, "/");
    } else {
      res.render("posts/show", { post });
    }
  });
}
export function destroy(req, res, next) {
  deletePost(req, (err, post) => {
    if (err) {
      res.redirect(302, `/topics/${req.params.topicId}/posts/${req.params.id}`);
    } else {
      res.redirect(303, `/topics/${req.params.topicId}`);
    }
  });
}
export function edit(req, res, next) {
  getPost(req, (err, post) => {
    if (err || post == null) {
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
  });
}
export function update(req, res, next) {
  updatePost(req.params.id, req.body, (err, post) => {
    if (err || post == null) {
      res.redirect(401, `/topics/${req.params.topicId}/posts/${req.params.id}/edit`);
    } else {
      res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
    }
  });
}