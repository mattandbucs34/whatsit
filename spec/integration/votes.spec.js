import request from "supertest";
import app from "../../src/app.js";
import models from "../../src/db/models/index.js";
import { describe, it, beforeEach, expect } from "vitest";

const { sequelize, Topic, Post, User, Vote } = models;
const base = `/topics`;

describe("routes : votes", () => {
    let admin;
    let member;
    let topic;
    let post;
    let vote;
    beforeEach(async () => {
        await sequelize.sync({ force: true });

        member = await User.create({
            email: "matt@whatsit.com",
            password: "password",
            role: "member"
        });

        admin = await User.create({
            email: "velma@mysterymachine.com",
            password: "jenkies",
            role: "admin"
        });

        topic = await Topic.create({
            title: "Haunted Mansions Galore",
            description: "Finding monsters one haunted house at a time",
            posts: [{
                title: "Not haunted",
                body: "It was Mr. Wilson in a monster disguise",
                userId: admin.id
            }]
        }, {
            include: {
                model: Post,
                as: "posts"
            }
        });

        post = topic.posts[0];

        vote = await Vote.create({
            userId: admin.id,
            postId: post.id,
            value: 1
        });
    });

    describe("guest attempting to vote on a post", () => {
        describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {
            it("should not create a new vote", async () => {
                const options = {
                    url: `${base}/${topic.id}/posts/${post.id}/votes/upvote`
                };
                await request(app).get(options.url);
                const newVote = await Vote.findOne({
                    where: {
                        userId: 0,
                        postId: post.id
                    }
                });
                expect(newVote).toBeNull();
            });
        });
    });

    describe("signed in user voting on a post", () => {
        describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {
            it("should create an upvote", async () => {
                const options = {
                    url: `${base}/${topic.id}/posts/${post.id}/votes/upvote`
                };
                await request(app)
                    .get(options.url)
                    .set("x-test-user-id", member.id)
                    .set("x-test-user-role", member.role);
                const vote = await Vote.findOne({
                    where: {
                        userId: member.id,
                        postId: post.id
                    }
                });
                expect(vote).not.toBeNull();
                expect(vote.value).toBe(1);
                expect(vote.userId).toBe(member.id);
                expect(vote.postId).toBe(post.id);
            });

            it("should not create an upvote if value is incorrect", async () => {
                const options = {
                    url: `${base}/${topic.id}/posts/${post.id}/votes/mockvote`
                };
                await request(app).get(options.url);
                const vote = await Vote.findOne({
                    where: {
                        value: 2
                    }
                });
                expect(vote).toBeNull();
            });

            it("should not create a second upvote", async () => {
                const options = {
                    url: `${base}/${topic.id}/posts/${post.id}/votes/upvote`
                };
                await request(app)
                    .get(options.url)
                    .set("x-test-user-id", admin.id)
                    .set("x-test-user-role", admin.role);
                const vote = await Vote.findOne({
                    where: {
                        userId: admin.id,
                        postId: post.id
                    }
                });
                expect(vote).not.toBeNull();
            });

            it("should not create a second upvote", async () => {
                const options = {
                    url: `${base}/${topic.id}/posts/${post.id}/votes/upvote`
                };
                await request(app)
                    .get(options.url)
                    .set("x-test-user-id", member.id)
                    .set("x-test-user-role", member.role);
                const vote = await Vote.findOne({
                    where: {
                        userId: member.id,
                        postId: post.id
                    }
                });
                expect(vote).not.toBeNull();
                // await request(app).get(options.url);

                const voteCount = await Vote.findAndCountAll({
                    where: {
                        postId: post.id,
                        userId: member.id
                    }
                });

                expect(voteCount.count).toBe(1);
            });
        });
    });

    describe("GET /topics/:topicId/posts/:postId/votes/downvote", () => {
        it("should create an downvote", async () => {
            const options = {
                url: `${base}/${topic.id}/posts/${post.id}/votes/downvote`
            };
            await request(app)
                .get(options.url)
                .set("x-test-user-id", member.id)
                .set("x-test-user-role", member.role);
            const vote = await Vote.findOne({
                where: {
                    userId: member.id,
                    postId: post.id
                }
            });
            expect(vote).not.toBeNull();
            expect(vote.value).toBe(-1);
            expect(vote.userId).toBe(member.id);
            expect(vote.postId).toBe(post.id);
        });
    });

    describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {
        it("should not create an upvote if value is incorrect", async () => {
            const options = {
                url: `${base}/${topic.id}/posts/${post.id}/votes/upvote`
            };
            await request(app)
                .get(options.url)
                .set("x-test-user-id", member.id)
                .set("x-test-user-role", member.role);
            const vote = await Vote.findAndCountAll({
                where: {
                    postId: post.id,
                    userId: member.id,
                }
            });
            expect(vote.count).toBe(1);
        });
    });

    describe("GET /topics/:topicId/posts/:postId/votes/upvote||downvote", () => {
        it("should update upvote to downvote for signed in user", async () => {
            let options = {
                url: `${base}/${topic.id}/posts/${post.id}/votes/upvote`
            };

            await request(app)
                .get(options.url)
                .set("x-test-user-id", member.id)
                .set("x-test-user-role", member.role);
            const vote = await Vote.findOne({
                where: {
                    userId: member.id,
                    postId: post.id
                }
            });

            console.log('VOTE: ', vote);
            expect(vote).not.toBeNull();
            expect(vote.value).toBe(1);
            options = {
                url: `${base}/${topic.id}/posts/${post.id}/votes/downvote`
            };

            await request(app)
                .get(options.url)
                .set("x-test-user-id", member.id)
                .set("x-test-user-role", member.role);
            const newVote = await Vote.findOne({
                where: {
                    userId: member.id,
                    postId: post.id
                }
            });
            expect(newVote).not.toBeNull();
            expect(newVote.value).toBe(-1);
        });
    });
});
