const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/flairs/";
const sequelize = require("../../src/db/models/index").sequelize;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {
  beforeEach((done) => {
    this.flair;
    sequelize.sync({force: true}).then((res) => {
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
      request.get(base, (err, res, body) => {
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
      request.get(`${base}new`, (err, res, body) => {
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
        flairName: "Zing Flair",
        flairColor: "grey"
      }
    };
    it("should create a new flair and redirect", (done) => {
      request.post(options, (err, res, body) => {
        Flair.findOne({where: {name: "Zing Flair"}})
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
      request.get(`${base}${this.flair.name}`, (err, res, body) => {
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
    it("should with a form to edit a flair", (done) => {
      request.get(`${base}${this.flair.name}/edit`, (err, res, body) => {
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
          flairName: "Ric Flair WOOOOO",
          flairColor: "purple"
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        Flair.findOne({
          where: { name: this.flair.name }
        }).then((flair) => {
          expect(flair.name).toBe("Ric Flair WOOOOO");
          done();
        });
      });
    });
  });
});