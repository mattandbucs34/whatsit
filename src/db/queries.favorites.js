import Favorite from "./models";
import Authorizer from "../policies/favorite";

export async function createFavorite(req, callback) {
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

export async function deleteFavorite(req, callback) {
    const id = req.params.id;

    try {
        const favorite = await Favorite.findById(id);
        const authorized = new Authorizer(req.user, favorite).destroy();

        if (authorized) {
            await Favorite.destroy({ where: { id } });
            return { error: null };
        } else {
            return { error, message: "You are not authorized to do that!" };
        }

    } catch (error) {
        return { error, message: error.message };
    }
}