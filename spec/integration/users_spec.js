const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users";
const User = require('../../src/db/models').User;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Comment = require("../../src/db/models").Comment;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {
  beforeEach((done) => {
    sequelize.sync({force: true}).then(() => {
      done();
    }).catch((err) => {
      console.log(err);
      done();
    });
  });

  describe("GET /users/sign_up", () => {
    it("should render a view with a sign up form", (done) => {
      request.get(`${base}/sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign Up");
        done();
      });
    });
  });

  describe("POST /users", () => {
    it("should create a new user with valid values and redirect", (done) => {
      const options = {
        url: base,
        form: {
          email: "user@example.com",
          password: "1234567890"
        }
      }

      request.post(options, (err, res, body) => {
        User.findOne({where: {email: "user@example.com"}}).then((user) => {
          expect(user).not.toBeNull();
          expect(user.email).toBe("user@example.com");
          expect(user.id).toBe(1);
          done();
        }).catch((err) => {
          console.log(err);
          done();
        });
      });
    });

    it("should not create a new user with invalid attributes and redirect", (done) => {
      request.post({
        url: base,
        form: {
          email: "no",
          password: "123456789"
        }
      },
      (err, res, body) => {
        User.findOne({where: {email: "no"}}).then((user) => {
          expect(user).toBeNull();
          done();
        }).catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /users/sign_in", () => {
    it("should render a view with a sign in form", (done) => {
      request.get(`${base}/sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign In");
        done();
      });
    });
  });

  describe("GET /users/:id", () => {
    beforeEach((done) => {
      this.user;
      this.post;
      this.comment;

      User.create({
        email: "velma@mysterymachine.com",
        password: "jenkies"
      }).then((user) => {
        this.user = user;

        Topic.create({
          title: "Haunted Mansions Galore",
          description: "Finding monsters one haunted house at a time",
          posts: [{
            title: "Not haunted",
            body: "It was Mr. Wilson in a monster disguise",
            userId: this.user.id
          }]
        }, {
          include: {
            model: Post,
            as: "posts"
          }
        }).then((res) => {
          this.post = res.posts[0];

          Comment.create({
            body: "Zoinks!!!",
            userId: this.user.id,
            postId: this.post.id
          }).then((comment) => {
            this.comment = comment;
            done();
          });
        });
      });
    });

    it("should present a list of comments and posts a user has created", (done) => {
      request.get(`${base}/${this.user.id}`, (err, res, body) => {
        expect(body).toContain("Not haunted");
        //expect(body).toContain("Zoinks!!!");
        done();
      });
    });
  });
});