import request from "supertest";
import app from "../../src/app.js";
import { describe, it, beforeEach, expect } from "vitest";
import models from "../../src/db/models/index";
const { sequelize, Topic, Post, User, Favorite } = models;

const base = "/topics";

describe("routes : favorites", () => {
    let user;
    let topic;
    let post;

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        user = await User.create({
            email: "velma@mysterymachine.com",
            password: "jenkies"
        });

        topic = await Topic.create({
            title: "Haunted Mansions Galore",
            description: "Finding monsters one haunted house at a time",
            posts: [{
                title: "Not haunted",
                body: "It was Mr. Wilson in a monster disguise",
                userId: user.id
            }]
        }, {
            include: {
                model: Post,
                as: "posts"
            }
        });

        post = await Post.create({
            title: "Not haunted",
            body: "It was Mr. Wilson in a monster disguise",
            userId: user.id,
            topicId: topic.id
        });
    });

    describe("guest attempting to favorite a post", () => {
        beforeEach(async () => {
            console.log('TOPIC ID: ', topic.id);
            console.log('POST ID: ', post.id);
            try {
                await request(app)
                    .get("/auth/fake")
                    .query({
                        id: user.id
                    });
            } catch (error) {
                console.log('ERROR: ', error);
            }
        });

        describe("POST /topics/:topicId/posts/:postId/favorites/create", () => {
            it("should not create a new favorite", async () => {
                const urlString = `${base}/${topic.id}/posts/${post.id}/favorites/create`;


                const favortiesBeforeCreate = await Favorite.count();

                await request(app).post(urlString);

                const favoritesAfterCreate = await Favorite.count();

                expect(favoritesAfterCreate).toBe(favortiesBeforeCreate + 1);
            });
        });
    });

    describe("signed in user favoriting a post", () => {
        beforeEach(async () => {
            await request(app)
                .get("/auth/fake")
                .query({
                    id: user.id
                });
        });

        describe("POST /topics/:topicId/posts/:postId/favorites/create", () => {
            it("should create a favorite", async () => {
                const urlString = `${base}/${topic.id}/posts/${post.id}/favorites/create`;

                await request(app).post(urlString);

                const favorite = await Favorite.findOne({
                    where: {
                        userId: user.id,
                        postId: post.id
                    }
                });

                expect(favorite).not.toBeNull();
                expect(favorite.userId).toBe(user.id);
                expect(favorite.postId).toBe(post.id);
            });
        });

        describe("POST /topics/:topicId/posts/:postId/favorites/:id/destroy", () => {
            it("should destroy a favorite", async () => {
                const urlString = `${base}/${topic.id}/posts/${post.id}/favorites/create`;

                await request(app).post(urlString);

                const favCountBeforeDelete = await Favorite.count();

                const favorite = await Favorite.findOne({
                    where: {
                        userId: user.id,
                        postId: post.id
                    }
                });

                await request(app).post(`${base}/${topic.id}/posts/${post.id}/favorites/${favorite.id}/destroy`);

                const favCountAfterDelete = await Favorite.count();

                expect(favCountAfterDelete).toBe(favCountBeforeDelete - 1);
            });
        });
    });

    describe("guest attempting to destroy a favorite", () => {
        beforeEach(async () => {
            try {
                await request(app)
                    .get("/auth/fake")
                    .query({
                        id: 0
                    });
            } catch (error) {
                console.log('ERROR: ', error);
            }
        });

        describe("POST /topics/:topicId/posts/:postId/favorites/:id/destroy", () => {
            it("should not destroy a favorite", async () => {
                const urlString = `${base}/${topic.id}/posts/${post.id}/favorites/create`;

                await request(app).post(urlString);

                const favCountBeforeDelete = await Favorite.count();

                const favorite = await Favorite.findOne({
                    where: {
                        userId: user.id,
                        postId: post.id
                    }
                });


                await request(app).post(`${base}/${topic.id}/posts/${post.id}/favorites/${favorite.id}/destroy`);

                const favCountAfterDelete = await Favorite.count();

                expect(favCountAfterDelete).toBe(favCountBeforeDelete);
            });
        });
    });
});