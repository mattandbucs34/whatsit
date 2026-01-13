import db from "./models/index.js";
const Vote = db.Vote;

export async function createVote(req, val) {
    try {
        const vote = await Vote.findOne({
            where: {
                postId: req.params.postId,
                userId: req.user.id
            }
        });

        if (vote) {
            vote.value = val;
            return await vote.save();
        } else {
            return await Vote.create({
                value: val,
                postId: req.params.postId,
                userId: req.user.id
            });
        }
    } catch (err) {
        throw err;
    }
}