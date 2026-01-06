import db from "./models/index.js";
const Favorite = db.Favorite;
import Authorizer from "../policies/favorite.js";

export async function createFavorite(req) {
    try {
        const response = Favorite.create({
            postId: req.params.postId,
            userId: req.user.id,
        });

        return response;
    } catch (error) {
        return { error, message: error.message };
    }
}

export async function deleteFavorite(req) {
    const id = req.params.id;

    try {
        const favorite = await Favorite.findByPk(id);
        const authorized = new Authorizer(req.user, favorite).destroy();

        if (authorized) {
            await Favorite.destroy({ where: { id } });
            return { error: null };
        } else {
            return { error: "Unauthorized", message: "You are not authorized to do that!" };
        }

    } catch (error) {
        return { error, message: error.message };
    }
}