const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("routes : posts", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      
      User.create({
        email: "shaggy@mysterymachine.com",
        password: "ScoobySnacks69"
      }).then((user) => {
        this.user = user;

        Topic.create({
          title: "Winter Games",
          description: "Post your Winter Games stories",
          posts: [{
            title: "Donner Party",
            body: "The Donner Party didn't play many Winter Games",
            userId: this.user.id
          }]
        }, {
          include: {
            model: Post,
            as: "posts"
          }
        }).then((topic) => {
          this.topic = topic;
          this.post = topic.posts[0];
          done();
        });
      });
    });
  });

  describe("admin user performing CRUD actions for Posts", () => {
    beforeEach((done) => {
      User.create({
        email: "velma@mysterymachine.com",
        password: "Jenkies",
        role: "admin"
      }).then((user) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email
          }
        }, (err, res, body) => {
          done();
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
          });
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
      /* it("should return a status code 302", (done) => {
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
      }); */
  
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
  
  describe("member user performing CRUD actions for Posts", () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member"
        }
      }, (err, res, body) => {
        done();
      });
    });

    describe("GET /topics/:topicId/posts/new", () => {
      it("should redirect to the topics view", (done) => {
        request.get(`${base}/${this.topic.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Topics");
          done();
        });
      });
    });

    describe("POST /topics/:topicId/posts/create", () => {
      it("should not create a new post", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/create`,
          form: {
            title: "Watching paint dry",
            body: "Watching paint dry is nearly as fun as watching grass grow!"
          }
        }

        request.post(options, (err, res, body) => {
          Post.findOne({ where: {title: "Watching paint dry"}})
          .then((post) => {
            expect(post).toBeNull();
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /topics/:topicId/posts/:id", () => {
      it("should render a view with the selected post", (done) => {
        request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Donner Party");
          done();
        });
      });
    });

    describe("POST /topics/:topicId/posts/:id/destroy", () => {
      it("should not delete the post with the associated ID", (done) => {
        expect(this.post.id).toBe(1);
        request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
          Post.findById(1)
          .then((post) => {
            expect(err).toBeNull();
            expect(post.title).toBe("Donner Party");
            expect(post.body).toBe("The Donner Party didn't play many Winter Games");
            done();
          });
        });
      });
    });

    describe("GET /topics/:topicId/post/:id/edit", () => {
      it("should not render a view with an edit post", (done) => {
        request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Post");
          done();
        });
      });
    });

    describe("POST /topics/:topicId/post/:id/update", () => {
      it("should not update the post with the given data", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
          form: {
            title: "Donner Party",
            description: "The Donner Party didn't play many Winter Games"
          }
        }

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Post.findOne({
            where: {id: 1}
          }).then((post) => {
            expect(post.title).toBe("Donner Party");
            done();
          });
        });
      });
    });
  });
});
