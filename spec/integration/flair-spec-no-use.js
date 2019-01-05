const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/flairs/";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({force: true}).then((res) => {
      Flair.create({
        name: "Green Flair",
        color: "green"
      }).then((flair) => {
        this.flair = flair;
      }).catch((err) => {
        console.log(err);
        done();
      });

      Topic.create({
        title: "Hunger Games",
        description: "How do you want to be remembered?"
      }).then((topic) => {
        this.topic = topic;

        Post.create({
          title: "Tributes",
          body: "They wouldn't let poor Rudolph play in any Hunger Games",
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

  describe("GET /flairs/new", () => {
    it("should render a form to create a new flair", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Flair");
        done();
      });
    });
  });

  describe("POST /flairs/create", () => {
    it("should created a new flair and redirect", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          name: "Pink is a Warning",
          color: "pink"
        }
      };
      request.post(options, (err, res, body) => {
        Flair.findOne({where: {name: "Pink is a Warning"}})
        .then((flair) => {
          expect(flair.name).toBe("Pink is a Warning");
          expect(flair.color).toBe("pink");
          done();
        }).catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /flairs/:name", () => {
    it("should render a view with the selected Flair", (done) => {
      request.get(`${base}${this.flair.name}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Green Flair");
        done();
      });
    });
  });

  describe("POST /flairs/:name/destroy", () => {
    it("should delete the flair with the associated color", (done) => {
      Flair.all().then((flairs) => {
        const flairCountBeforeDelete = flairs.length;

        expect(flairCountBeforeDelete).toBe(1);

        request.post(`${base}${this.flair.name}/destroy`, (err, res, body) => {
          Flair.all().then((flairs) => {
            expect(err).toBeNull();
            expect(flairs.length).toBe(flairCountBeforeDelete - 1);
            done();
          })
        });
      });
    });
  });

  describe("GET /flairs/:name/edit", () => {
    it("should render a view with a Flair edit form", (done) => {
      request.get(`${base}${this.flair.name}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Flair");
        expect(body).toContain("Green Flair");
        done();
      });
    });
  });

  describe("POST /flairs/:name/update", () => {
    it("should update the flair with the given values", (done) => {
      const options = {
        url: `${base}${this.flair.name}/update`,
        form: {
          name: "Not for the squeamish",
          color: "olive"
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        Flair.findOne({
          where: {name: "Not for the squeamish"}
        }).then((flair) => {
          expect(flair.name).toBe("Not for the squeamish");
          expect(flair.color).toBe("olive");
          done();
        });
      });
    });
  });
});