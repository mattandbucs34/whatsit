const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("routes : posts", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Winter Games",
        description: "Post your Winter Games stories"
      }).then((topic) => {
        this.topic = topic;

        Post.create({
          title: "Donner Party",
          body: "The Donner Party didn't play many Winter Games",
          topicId: this.topic.id
        }).then((post) => {
          this.post = post;
          done();
        }).catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /topics/:topicId/posts/new", () => {
    it("should render a new post form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Post");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/create", () => {
    it("should create a new post and redirect", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/create`,
        form: {
          title: "Watching paint dry",
          body: "Watching paint dry is nearly as fun as watching grass grow!"
        }
      };
      request.post(options, (err, res, body) => {
        Post.findOne({where: {title: "Watching paint dry"}})
        .then((post) => {
          expect(post).not.toBeNull();
          expect(post.title).toBe("Watching paint dry");
          expect(post.body).toBe("Watching paint dry is nearly as fun as watching grass grow!");
          expect(post.topicId).not.toBeNull();
          done();
        });
      });
    });
  });

  describe("GET /topics/:topicId/posts/:id", () => {
    it("should render a view with the selected posts", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Donner Party");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/destroy", () => {
    it("should delete the post with the associated ID", (done) => {
      expect(this.post.id).toBe(1);
      request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
        Post.findById(1)
        .then((post) => {
          expect(err).toBeNull();
          expect(post).toBeNull();
          done();
        })
      });
    });
  });

  describe("GET /topics/:topicId/posts/:id/edit", () => {
    it("should render a view with an edit post form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Post");
        expect(body).toContain("Donner Party");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/update", () => {
    it("should return a status code 302", (done) => {
      request.post({
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman building competition",
          body: "Do you wanna build a snowman?"
        }
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302);
        done();
      });
    });

    it("should update the post with the given values", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman building competition"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Post.findOne({
          where: {id: this.post.id}
        }).then((post) => {
          expect(post.title).toBe("Donner Party");
          done();
        });
      });
    });
  });

  it("should not create a post that fails validation", (done) => {
    const options = {
      url: `${base}/${this.topic.id}/posts/create`,
      form: {
        title: "a",
        body: "b"
      }
    };

    request.post(options, (err, res, body) => {
      Post.findOne({where: {title: "a"}}).then((post) => {
        expect(post).toBeNull();
        done();
      }).catch((err) => {
        console.log(err);
        done();
      });
    });
  });
});
