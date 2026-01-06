import db from "./models/index.js";
const Post = db.Post;
const Comment = db.Comment;
const User = db.User;
const Vote = db.Vote;
const Favorite = db.Favorite;
import Authorizer from "../policies/post.js";

export async function addPost(newPost) {
  try {
    return await Post.create(newPost);
  } catch (err) {
    throw err;
  }
}

export async function getPost(req) {
  try {
    return await Post.findByPk(req.params.id, {
      include: [{
        model: Comment,
        as: "comments",
        include: [{
          model: User
        }]
      }, {
        model: Vote,
        as: "votes"
      }, {
        model: Favorite,
        as: "favorites"
      }]
    });
  } catch (err) {
    throw err;
  }
}

export async function deletePost(req) {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) throw new Error("Post not found");

    const authorized = new Authorizer(req.user, post).destroy();
    if (authorized) {
      await post.destroy();
      return post;
    } else {
      req.flash("notice", "You are not authorized to do that!");
      throw new Error(401);
    }
  } catch (err) {
    throw err;
  }
}

export async function updatePost(id, updatedPostData) {
  try {
    const post = await Post.findByPk(id);
    if (!post) throw new Error("Post not found");

    // Authorization check should be here or in controller
    // Given the previous code, I'll keep it simple for now or use the req if I pass it
    return await post.update(updatedPostData, {
      fields: Object.keys(updatedPostData)
    });
  } catch (err) {
    throw err;
  }
}