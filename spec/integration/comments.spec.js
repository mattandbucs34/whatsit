import request from "supertest";
import app from "../../src/app.js";
import { describe, it, beforeEach, expect } from "vitest";
import models from "../../src/db/models/index";
const { sequelize, Topic, Post, User, Comment } = models;
const base = "/topics";

describe("routes : comments", () => {
    let user;
    let admin;
    let topic;
    let post;
    let comment;
    beforeEach(async () => {
        await sequelize.sync({ force: true });

        user = await User.create({
            email: "velma@mysterymachine.com",
            password: "jenkies",
            role: "member"
        });

        admin = await User.create({
            email: "admin@mysterymachine.com",
            password: "jenkies",
            role: "admin"
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

        comment = await Comment.create({
            body: "Zoinks!!!",
            userId: user.id,
            postId: post.id
        });
    });

    describe("guest attempting to perform CRUD operations for Comment", () => {
        describe("POST /topics/:topicId/posts/:postId/comments/create", () => {
            it("should not create a new comment", async () => {
                const options = {
                    url: `${base}/${topic.id}/posts/${post.id}/comments/create`,
                    form: {
                        body: "This comment is amazing!"
                    }
                };
                await request(app)
                    .post(options.url)
                    .set("x-test-user-id", 0)
                    .set("x-test-user-role", "guest")
                    .type("form")
                    .send(options.form);

                const newComment = await Comment.findOne({ where: { body: "This comment is amazing!" } });

                expect(newComment).toBeNull();
            });
        });

        describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {
            it("should not delete the comment with the associated ID", async () => {
                const { count: beforeCount } = await Comment.findAndCountAll();

                expect(beforeCount).toBe(1);

                await request(app)
                    .post(
                        `${base}/${topic.id}/posts/${post.id}/comments/${comment.id}/destroy`
                    )
                    .set("x-test-user-id", 0)
                    .set("x-test-user-role", "guest");

                const { count: afterCount } = await Comment.findAndCountAll();

                expect(afterCount).toBe(1);
                expect(afterCount).toBe(beforeCount);
            });
        });
    });

    describe("signed in user performing CRUD operations for Comment", () => {
        describe("POST /topics/:topicId/posts/:postId/comments/create", () => {
            it("should create a new comment and redirect", async () => {
                const options = {
                    url: `${base}/${topic.id}/posts/${post.id}/comments/create`,
                    form: {
                        body: "This comment is amazing!",
                        userId: user.id,
                        postId: post.id
                    }
                };

                const res = await request(app)
                    .post(options.url)
                    .set("x-test-user-id", user.id)
                    .set("x-test-user-role", user.role)
                    .type("form")
                    .send(options.form);

                expect(res.statusCode).toBe(302);

                const newComment = await Comment.findOne({
                    where: {
                        body: "This comment is amazing!"
                    }
                });

                expect(newComment).not.toBeNull();
                expect(newComment.body).toBe("This comment is amazing!");
                expect(newComment.id).not.toBeNull();
            });
        });

        describe("POST /topics/:topicId/posts/:postId/comments/destroy", () => {
            it("should delete the comment with the associated ID", async () => {
                const { count: beforeCount } = await Comment.findAndCountAll();

                expect(beforeCount).toBe(1);

                await request(app)
                    .post(
                        `${base}/${topic.id}/posts/${post.id}/comments/${comment.id}/destroy`)
                    .set("x-test-user-id", user.id)
                    .set("x-test-user-role", user.role);

                const { count: afterCount } = await Comment.findAndCountAll();

                expect(afterCount).toBe(beforeCount - 1);
            });
        });
    });

    describe("member attempting to perform CRUD operations for Comment by other user", () => {
        describe("POST /topics/:topicId/posts/:postId/comments/destroy", () => {
            it("should not delete the comment with the associated user ID", async () => {
                const { count: beforeCount } = await Comment.findAndCountAll();

                expect(beforeCount).toBe(1);

                await request(app)
                    .post(
                        `${base}/${topic.id}/posts/${post.id}/comments/${comment.id}/destroy`)
                    .set("x-test-user-id", 0)
                    .set("x-test-user-role", "member");

                const { count: afterCount } = await Comment.findAndCountAll();

                expect(afterCount).toBe(beforeCount);
            });
        });
    });

    describe("admin attempting to delete a user Comment", () => {
        it("should delete the comment from a user via admin validation", async () => {
            const { count: beforeCount } = await Comment.findAndCountAll();

            expect(beforeCount).toBe(1);

            const res = await request(app)
                .post(
                    `${base}/${topic.id}/posts/${post.id}/comments/${comment.id}/destroy`)
                .set("x-test-user-id", admin.id)
                .set("x-test-user-role", admin.role);

            expect(res.statusCode).toBe(302);
            const { count: afterCount } = await Comment.findAndCountAll();
            expect(afterCount).toBe(beforeCount - 1);
        });
    });
});
