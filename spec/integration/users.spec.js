import request from "supertest";
import app from "../../src/app.js";
const base = "/users";
import models from "../../src/db/models/index";
import { describe, it, beforeEach, expect } from "vitest";
const { sequelize, User, Topic, Post, Comment } = models;

describe("routes : users", () => {
    beforeEach(async () => {
        try {
            await sequelize.sync({ force: true });
        } catch (err) {
            console.log(err);
        }
    });

    describe("GET /users/sign_up", () => {
        it("should render a view with a sign up form", async () => {
            const res = await request(app).get('/users/sign_up');
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain("Sign Up");
        });
    });

    describe("POST /users", () => {
        it("should create a new user with valid values and redirect", async () => {
            const options = {
                url: base,
                form: {
                    email: "user@example.com",
                    password: "1234567890"
                }
            };

            const res = await request(app)
                .post(options.url)
                .type("form")
                .send(options.form);

            const newUser = await User.findOne({
                where: { email: "user@example.com" }
            });

            expect(res.statusCode).toBe(303);
            expect(newUser).not.toBeNull();
            expect(newUser.email).toBe("user@example.com");
            expect(newUser.id).toBe(1);
        });

        it("should not create a new user with invalid attributes and redirect", async () => {

            const options = {
                url: base,
                form: {
                    email: "no",
                    password: "123456789"
                }
            };

            const res = await request(app)
                .post(options.url)
                .type("form")
                .send(options.form);

            const newUser = await User.findOne({
                where: { email: "no" }
            });

            expect(res.statusCode).toBe(302);
            expect(newUser).toBeNull();
        });
    });

    describe("GET /users/sign_in", () => {
        it("should render a view with a sign in form", async () => {
            const res = await request(app).get("/users/sign_in");

            expect(res.statusCode).toBe(200);
            expect(res.text).toContain("Sign In");
        });
    });
});

describe("GET /users/:id", () => {
    let user;
    let post;
    let topic;
    let comment;

    beforeEach(async () => {

        user = await User.create({
            email: "velma@mysterymachine.com",
            password: "jenkies"
        });

        topic = await Topic.create({
            title: "Haunted Mansions Galore",
            description: "Finding monsters one haunted house at a time",
        });

        post = await Post.create({
            title: "Not haunted",
            body: "It was Mr. Wilson in a monster disguise",
            userId: user.id,
            topicId: topic.id
        });

        comment = await Comment.create({
            body: "Zoinks!!!",
            userId: user.id,
            postId: post.id
        });
    });

    it("should present a list of comments and posts a user has created", async () => {

        const res = await request(app).get(`/users/${user.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Not haunted");
        expect(res.text).toContain("Zoinks!!!");
    });
});