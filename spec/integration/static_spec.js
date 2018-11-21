const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("routes : static", () => {

  //#1
  describe("GET /", () => {

    //#2
    it("should return status code 200 and have 'Welcome to Bloccit Whatsit' in the body of the response", (done) => {
      //#3
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain("Welcome to Bloccit Whatsit");
        //#4
        done();
      });
    });
  });

  describe("GET /about", () => {
    it("should return status code 200 and contain 'About Us' in the body", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain("About Us");
        done();
      })
    })
  })

  describe("GET /marco", () => {
    it("should return status code 200", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });
});