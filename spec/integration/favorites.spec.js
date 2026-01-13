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
            password: "jenkies",
            role: "member"
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

        post = topic.posts[0];
    });

    describe("guest attempting to favorite a post", () => {
        describe("POST /topics/:topicId/posts/:postId/favorites/create", () => {
            it("should not create a new favorite", async () => {
                const urlString = `${base}/${topic.id}/posts/${post.id}/favorites/create`;
                const favortiesBeforeCreate = await Favorite.count();

                const res = await request(app).post(urlString);

                const favoritesAfterCreate = await Favorite.count();

                expect(res.statusCode).toBe(302); // Redirect to sign in/notice
                expect(favoritesAfterCreate).toBe(favortiesBeforeCreate);
            });
        });
    });

    describe("signed in user favoriting a post", () => {
        describe("POST /topics/:topicId/posts/:postId/favorites/create", () => {
            it("should create a favorite", async () => {
                const urlString = `${base}/${topic.id}/posts/${post.id}/favorites/create`;

                const res = await request(app)
                    .post(urlString)
                    .set("x-test-user-id", user.id)
                    .set("x-test-user-role", user.role);

                const favorite = await Favorite.findOne({
                    where: {
                        userId: user.id,
                        postId: post.id
                    }
                });

                expect(res.statusCode).toBe(302); // Redirect back to post
                expect(favorite).not.toBeNull();
                expect(favorite.userId).toBe(user.id);
                expect(favorite.postId).toBe(post.id);
            });
        });

        describe("POST /topics/:topicId/posts/:postId/favorites/:id/destroy", () => {
            it("should destroy a favorite", async () => {
                // First create a favorite
                const createUrl = `${base}/${topic.id}/posts/${post.id}/favorites/create`;
                await request(app)
                    .post(createUrl)
                    .set("x-test-user-id", user.id)
                    .set("x-test-user-role", user.role);

                const favorite = await Favorite.findOne({
                    where: {
                        userId: user.id,
                        postId: post.id
                    }
                });

                const favCountBeforeDelete = await Favorite.count();

                const res = await request(app)
                    .post(`${base}/${topic.id}/posts/${post.id}/favorites/${favorite.id}/destroy`)
                    .set("x-test-user-id", user.id)
                    .set("x-test-user-role", user.role);

                const favCountAfterDelete = await Favorite.count();

                expect(res.statusCode).toBe(302);
                expect(favCountAfterDelete).toBe(favCountBeforeDelete - 1);
            });
        });
    });

    describe("guest attempting to destroy a favorite", () => {
        describe("POST /topics/:topicId/posts/:postId/favorites/:id/destroy", () => {
            it("should not destroy a favorite", async () => {
                // First create a favorite as a signed in user
                const createUrl = `${base}/${topic.id}/posts/${post.id}/favorites/create`;
                await request(app)
                    .post(createUrl)
                    .set("x-test-user-id", user.id)
                    .set("x-test-user-role", user.role);

                const favorite = await Favorite.findOne({
                    where: {
                        userId: user.id,
                        postId: post.id
                    }
                });

                const favCountBeforeDelete = await Favorite.count();

                // Now try to destroy as a guest (no auth headers)
                const res = await request(app)
                    .post(`${base}/${topic.id}/posts/${post.id}/favorites/${favorite.id}/destroy`);

                const favCountAfterDelete = await Favorite.count();

                expect(res.statusCode).toBe(302);
                expect(favCountAfterDelete).toBe(favCountBeforeDelete);
            });
        });
    });
});