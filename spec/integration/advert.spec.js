const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/adverts/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advert = require("../../src/db/models").Advert;

describe("routes : adverts", () => {

  beforeEach((done) => {
    this.advert;
    sequelize.sync({force: true}).then((res) => {
      Advert.create({
        title: "Advertising at its Finest",
        description: "Everyone loves advertising!"
      })
      .then((advert) => {
        this.advert = advert;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("GET /adverts", () => {
    it("should return a status of 200 and all adverts", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Advertisements");
        expect(body).toContain("Advertising at its Finest");
        done();
      });
    });
  });

  describe("GET /adverts/new", () => {
    it("should render a new advertisement form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Advertisement");
        done();
      });
    });
  });

  describe("POST /adverts/create", () => {
    const adInfo = {
      url: `${base}create`,
      form: {
        title: "Dog Breath",
        description: "Does your breath smell like wet dog?"
      }
    };

    it("should create a new advertisement and redirect", (done) => {
      request.post(adInfo, (err, res, body) => {
        Advert.findOne({where: {title: "Dog Breath"}})
        .then((advert) => {
          expect(res.statusCode).toBe(303);
          expect(advert.title).toBe("Dog Breath");
          expect(advert.description).toBe("Does your breath smell like wet dog?");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /adverts/:id", () => {
    it("should render a view with the selected advertisement", (done) => {
      request.get(`${base}${this.advert.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Advertising at its Finest");
        done();
      });
    });
  });

  describe("POST /adverts/:id/destroy", () => {
    it("should delete the advertisement with the associated ID", (done) => {
      Advert.all().then((adverts) => {
        const advertCount = adverts.length;
        expect(advertCount).toBe(1);

        request.post(`${base}${this.advert.id}/destroy`, (err, res, body) => {
          Advert.all().then((adverts) => {
            expect(err).toBeNull();
            expect(adverts.length).toBe(advertCount - 1);
            done();
          })
        });
      });
    });
  });

  describe("GET /adverts/:id/edit", () => {
    it("should render a view with an edit advertisement form", (done) => {
      request.get(`${base}${this.advert.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Advertisement");
        expect(body).toContain("Advertising at its Finest");
        done();
      });
    });
  });

  describe("POST /adverts/:id/update", () => {
    it("should update the topic with given values", (done) => {
      const adInfo = {
        url: `${base}${this.advert.id}/update`,
        form: {
          title: "Things to Love",
          description: "I love me some good food"
        }
      };

      request.post(adInfo, (err, res, body) => {
        expect(err).toBeNull();
        Advert.findOne({
          where: {id: this.advert.id}
        }).then((advert) => {
          expect(advert.title).toBe("Things to Love");
          done();
        });
      });
    });
  });
});