import { get, post } from "request";
const base = "http://localhost:3000/topics/";
import { sequelize } from "../../src/db/models/index";
import { Topic } from "../../src/db/models";
import { User } from "../../src/db/models";

describe("routes : topics", () => {

  beforeEach((done) => {
    this.topic;
    sequelize.sync({ force: true }).then((res) => {
      Topic.create({
        title: "JS Frameworks",
        description: "There are a lot of them"
      })
        .then((topic) => {
          this.topic = topic;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });
  });

  describe("admin user performing CRUD actions for Topic", () => {
    beforeEach((done) => {
      User.create({
        email: "velma@mysterymachine.com",
        password: "jenkies",
        role: "admin"
      }).then((user) => {
        get({
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

    describe("GET /topics", () => {
      it("should return a status code 200 and all topics", (done) => {
        get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Topics");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    describe("GET /topics/new", () => {
      it("should render a new topic form", (done) => {
        get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Topic");
          done();
        });
      });
    });

    describe("POST /topics/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Blink-182 songs",
          description: "What's your favorite Blink 182 song?"
        }
      };
      it("should create a new topic and redirect", (done) => {
        post(options, (err, res, body) => {
          Topic.findOne({ where: { title: "Blink-182 songs" } })
            .then((topic) => {
              expect(res.statusCode).toBe(303);
              expect(topic.title).toBe("Blink-182 songs");
              expect(topic.description).toBe("What's your favorite Blink 182 song?");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
      });
    });

    describe("GET /topics/:id", () => {
      it("should render a view with the selected topic", (done) => {
        get(`${base}${this.topic.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    describe("POST /topics/:id/destroy", () => {
      it("should delete the topic with the associated ID", (done) => {
        Topic.all().then((topics) => {
          const topicCountBeforeDelete = topics.length;

          expect(topicCountBeforeDelete).toBe(1);

          post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
            Topic.all().then((topics) => {
              expect(err).toBeNull();
              expect(topics.length).toBe(topicCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });

    describe("GET /topics/:id/edit", () => {
      it("should render a view with an edit topic form", (done) => {
        get(`${base}${this.topic.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Topic");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    describe("POST /topics/:id/update", () => {
      it("should update the topic with the given values", (done) => {
        const options = {
          url: `${base}${this.topic.id}/update`,
          form: {
            title: "JavaScript Frameworks",
            description: "There are a lot of them"
          }
        };
        post(options, (err, res, body) => {
          expect(err).toBeNull();
          Topic.findOne({
            where: { id: this.topic.id }
          })
            .then((topic) => {
              expect(topic.title).toBe("JavaScript Frameworks");
              done();
            });
        });
      });
    });

    it("should not create a new topic that fails validations", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "xyz",
          description: "zyx"
        }
      };

      post(options, (err, res, body) => {
        Topic.findOne({
          where: { title: "xyz" }
        }).then((topic) => {
          expect(topic).toBeNull();
          done();
        }).catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("member user performing CRUD actions for Topic", () => {

    beforeEach((done) => {
      get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member"
        }
      }, (err, res, body) => {
        done();
      });
    });

    describe("GET /topics", () => {
      it("should return a status code 200 and all topics", (done) => {
        get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Topics");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    describe("GET /topics/new", () => {
      it("should render a new topic form", (done) => {
        get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Topics");
          done();
        });
      });
    });

    describe("POST /topics/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Blink-182 songs",
          description: "What's your favorite Blink 182 song?"
        }
      };
      /* it("should create a new topic and redirect", (done) => {
        request.post(options, (err, res, body) => {
          Topic.findOne({where: {title: "Blink-182 songs"}})
          .then((topic) => {
            expect(res.statusCode).toBe(303);
            expect(topic.title).toBe("Blink-182 songs");
            expect(topic.description).toBe("What's your favorite Blink 182 song?");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      }); */
      it("should not create a new topic", (done) => {
        post(options, (err, res, body) => {
          Topic.findOne({ where: { title: "blink-182 songs" } })
            .then((topic) => {
              expect(topic).toBeNull();
              done();
            }).catch((err) => {
              console.log(err);
              done();
            });
        });
      });
    });

    describe("GET /topics/:id", () => {
      it("should render a view with the selected topic", (done) => {
        get(`${base}${this.topic.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    describe("POST /topics/:id/destroy", () => {
      it("should not delete the topic with the associated ID", (done) => {
        Topic.all().then((topics) => {
          const topicCountBeforeDelete = topics.length;

          expect(topicCountBeforeDelete).toBe(1);

          post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
            Topic.all().then((topics) => {
              expect(topics.length).toBe(topicCountBeforeDelete);
              done();
            });
          });
        });
      });
    });

    describe("GET /topics/:id/edit", () => {
      it("should not render a view with an edit topic form", (done) => {
        get(`${base}${this.topic.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Topic");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    describe("POST /topics/:id/update", () => {
      it("should update the topic with the given values", (done) => {
        const options = {
          url: `${base}${this.topic.id}/update`,
          form: {
            title: "JavaScript Frameworks",
            description: "There are a lot of them"
          }
        };
        post(options, (err, res, body) => {
          expect(err).toBeNull();
          Topic.findOne({
            where: { id: 1 }
          })
            .then((topic) => {
              expect(topic.title).toBe("JS Frameworks");
              done();
            });
        });
      });
    });

    it("should not create a new topic that fails validations", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "xyz",
          description: "zyx"
        }
      };

      post(options, (err, res, body) => {
        Topic.findOne({
          where: { title: "xyz" }
        }).then((topic) => {
          expect(topic).toBeNull();
          done();
        }).catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
});