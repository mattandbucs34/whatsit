import request from "supertest";
import app from "../../src/app.js";
import models from "../../src/db/models/index.js";
const { sequelize, Topic, Post, User } = models;
import { describe, it, beforeEach, expect } from "vitest";

describe("routes : posts", () => {
  let topic;
  let post;
  let owner;
  let otherUser;
  let admin;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    owner = await User.create({
      email: "shaggy@mysterymachine.com",
      password: "ScoobySnacks69",
      role: "member"
    });

    otherUser = await User.create({
      email: "scrappy@mysterymachine.com",
      password: "ScoobySnacksPhew",
      role: "member"
    });

    admin = await User.create({
      email: "velma@mysterymachine.com",
      password: "Jenkies",
      role: "admin"
    });

    topic = await Topic.create({
      title: "Winter Games",
      description: "Post your Winter Games stories",
      posts: [{
        title: "Donner Party",
        body: "The Donner Party didn't play many Winter Games",
        userId: owner.id
      }]
    }, {
      include: {
        model: Post,
        as: "posts"
      }
    });

    post = topic.posts[0];
  });

  describe("admin user performing CRUD actions for Posts", () => {
    describe("GET /topics/:topicId/posts/new", () => {
      it("should render a new post form", async () => {
        const res = await request(app)
          .get(`/topics/${topic.id}/posts/new`)
          .set("x-test-user-id", admin.id)
          .set("x-test-user-role", admin.role);

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("New Post");
      });
    });

    describe("POST /topics/:topicId/posts/create", () => {
      it("should create a new post and redirect", async () => {
        const res = await request(app)
          .post(`/topics/${topic.id}/posts/create`)
          .set("x-test-user-id", admin.id)
          .set("x-test-user-role", admin.role)
          .type("form")
          .send({
            title: "Watching paint dry",
            body: "Watching paint dry is nearly as fun as watching grass grow!"
          });

        const newPost = await Post.findOne({ where: { title: "Watching paint dry" } });
        expect(res.statusCode).toBe(303);
        expect(newPost).not.toBeNull();
        expect(newPost.title).toBe("Watching paint dry");
        expect(newPost.topicId).toBe(topic.id);
      });
    });

    describe("GET /topics/:topicId/posts/:id", () => {
      it("should render a view with the selected posts", async () => {
        const res = await request(app)
          .get(`/topics/${topic.id}/posts/${post.id}`)
          .set("x-test-user-id", admin.id)
          .set("x-test-user-role", admin.role);

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Donner Party");
      });
    });

    describe("POST /topics/:topicId/posts/:id/destroy", () => {
      it("should delete the post with the associated ID", async () => {
        const res = await request(app)
          .post(`/topics/${topic.id}/posts/${post.id}/destroy`)
          .set("x-test-user-id", admin.id)
          .set("x-test-user-role", admin.role);

        const deletedPost = await Post.findByPk(post.id);
        expect(res.statusCode).toBe(303);
        expect(deletedPost).toBeNull();
      });
    });

    describe("GET /topics/:topicId/posts/:id/edit", () => {
      it("should render a view with an edit post form", async () => {
        const res = await request(app)
          .get(`/topics/${topic.id}/posts/${post.id}/edit`)
          .set("x-test-user-id", admin.id)
          .set("x-test-user-role", admin.role);

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Edit Post");
        expect(res.text).toContain("Donner Party");
      });
    });

    describe("POST /topics/:topicId/posts/:id/update", () => {
      it("should update the post with the given values", async () => {
        const res = await request(app)
          .post(`/topics/${topic.id}/posts/${post.id}/update`)
          .set("x-test-user-id", admin.id)
          .set("x-test-user-role", admin.role)
          .type("form")
          .send({
            title: "Snowman building competition",
            body: "Do you wanna build a snowman?"
          });

        const updatedPost = await Post.findByPk(post.id);
        expect(res.statusCode).toBe(302); // Controller uses default 302 for update
        expect(updatedPost.title).toBe("Snowman building competition");
      });
    });

    it("should not create a post that fails validation", async () => {
      const res = await request(app)
        .post(`/topics/${topic.id}/posts/create`)
        .set("x-test-user-id", admin.id)
        .set("x-test-user-role", admin.role)
        .type("form")
        .send({
          title: "a",
          body: "b"
        });

      const failedPost = await Post.findOne({ where: { title: "a" } });
      expect(failedPost).toBeNull();
    });
  });

  describe("member user (non-owner) performing CRUD actions for Posts", () => {
    describe("GET /topics/:topicId/posts/new", () => {
      it("should render the new post form (members can create)", async () => {
        const res = await request(app)
          .get(`/topics/${topic.id}/posts/new`)
          .set("x-test-user-id", otherUser.id)
          .set("x-test-user-role", otherUser.role);

        expect(res.statusCode).toBe(200);
      });
    });

    describe("POST /topics/:topicId/posts/create", () => {
      it("should create a new post", async () => {
        const res = await request(app)
          .post(`/topics/${topic.id}/posts/create`)
          .set("x-test-user-id", otherUser.id)
          .set("x-test-user-role", otherUser.role)
          .type("form")
          .send({
            title: "Member Post",
            body: "I am a member and I can post!"
          });

        const newPost = await Post.findOne({ where: { title: "Member Post" } });
        expect(newPost).not.toBeNull();
        expect(newPost.userId).toBe(otherUser.id);
      });
    });

    describe("GET /topics/:topicId/posts/:id/edit", () => {
      it("should not render a view with an edit post if not owner", async () => {
        const res = await request(app)
          .get(`/topics/${topic.id}/posts/${post.id}/edit`)
          .set("x-test-user-id", otherUser.id)
          .set("x-test-user-role", otherUser.role);

        expect(res.text).not.toContain("Edit Post");
        expect(res.statusCode).toBe(302); // Redirect to topics
      });
    });

    describe("POST /topics/:topicId/posts/:id/destroy", () => {
      it("should not delete the post if not owner", async () => {
        const res = await request(app)
          .post(`/topics/${topic.id}/posts/${post.id}/destroy`)
          .set("x-test-user-id", otherUser.id)
          .set("x-test-user-role", otherUser.role);

        const postStillExists = await Post.findByPk(post.id);
        expect(postStillExists).not.toBeNull();
      });
    });
  });

  describe("guest user performing CRUD actions for Posts", () => {
    describe("GET /topics/:topicId/posts/new", () => {
      it("should redirect to the show topic view", async () => {
        const res = await request(app)
          .get(`/topics/${topic.id}/posts/new`);

        expect(res.statusCode).toBe(302);
      });
    });

    describe("GET /topics/:topicId/posts/:id", () => {
      it("should render a view with the selected post", async () => {
        const res = await request(app)
          .get(`/topics/${topic.id}/posts/${post.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Donner Party");
      });
    });

    describe("POST /topics/:topicId/posts/:id/destroy", () => {
      it("should not delete the post", async () => {
        const res = await request(app)
          .post(`/topics/${topic.id}/posts/${post.id}/destroy`);

        const postStillExists = await Post.findByPk(post.id);
        expect(postStillExists).not.toBeNull();
      });
    });
  });
});
