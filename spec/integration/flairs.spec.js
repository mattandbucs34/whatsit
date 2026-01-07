import { get, post } from "request";
const base = "http://localhost:3000/flairs/";
import { sequelize } from "../../src/db/models/index";
import { Flair } from "../../src/db/models";

describe("routes : flairs", () => {
  beforeEach((done) => {
    this.flair;
    sequelize.sync({ force: true }).then((res) => {
      Flair.create({
        name: "What a Flair!",
        color: "pink"
      }).then((flair) => {
        this.flair = flair;
        done();
      }).catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("GET /flairs", () => {
    it("should return a status code of 200 and all flairs", (done) => {
      get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("What a Flair!");
        expect(body).toContain("pink");
        done();
      });
    });
  });

  describe("GET /flairs/new", () => {
    it("should render a new flair form", (done) => {
      get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Flair");
        done();
      });
    });
  });

  describe("POST /flairs/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        name: "Zing Flair",
        color: "grey"
      }
    };
    it("should create a new flair and redirect", (done) => {
      post(options, (err, res, body) => {
        Flair.findOne({ where: { name: "Zing Flair" } })
          .then((flair) => {
            expect(res.statusCode).toBe(303);
            expect(flair.name).toBe("Zing Flair");
            expect(flair.color).toBe("grey");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /flairs/:name", () => {
    it("should render a view with the selected flair", (done) => {
      get(`${base}${this.flair.name}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("What a Flair!");
        done();
      });
    });
  });

  describe("POST /flairs/:name/destroy", () => {
    it("should delete the flair with the associated name", (done) => {
      Flair.all().then((flairs) => {
        const flairCountBeforeDelete = flairs.length;

        expect(flairCountBeforeDelete).toBe(1);

        post(`${base}${this.flair.name}/destroy`, (err, res, body) => {
          Flair.all().then((flairs) => {
            expect(err).toBeNull();
            expect(flairs.length).toBe(flairCountBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });

  describe("GET /flairs/:name/edit", () => {
    it("should with a form to edit a flair", (done) => {
      get(`${base}${this.flair.name}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Flair");
        expect(body).toContain("What a Flair!");
        done();
      });
    });
  });

  describe("POST /flairs/:name/update", () => {
    it("should update the flair with the given information", (done) => {
      const options = {
        url: `${base}${this.flair.name}/update`,
        form: {
          name: "Ric Flair WOOOOO",
          color: "purple"
        }
      };

      post(options, (err, res, body) => {
        expect(err).toBeNull();
        Flair.findOne({
          where: { id: this.flair.id }
        }).then((flair) => {
          expect(flair.name).toBe("Ric Flair WOOOOO");
          done();
        });
      });
    });
  });
});