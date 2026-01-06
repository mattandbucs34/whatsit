import db from "./models/index.js";
const User = db.User;
const Post = db.Post;
const Comment = db.Comment;
const Favorite = db.Favorite;
import bcrypt from "bcryptjs";

export async function createUser(newUser) {
  try {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return await User.create({
      email: newUser.email,
      password: hashedPassword
    });
  } catch (err) {
    throw err;
  }
}

export async function getUser(id) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error(404);
    }

    const result = { user };
    result["posts"] = await Post.scope({ method: ["lastFiveFor", id] }).findAll();
    result["comments"] = await Comment.scope({ method: ["lastFiveFor", id] }).findAll();
    result["favorites"] = await Favorite.scope({ method: ["allFavsFor", id] }).findAll();

    return result;
  } catch (err) {
    throw err;
  }
}