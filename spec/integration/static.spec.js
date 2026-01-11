import { describe, it, expect } from "vitest";
import supertest from "supertest";
import app from "../../src/app.js";

const request = supertest(app);

describe("routes : static", () => {

  describe("GET /", () => {
    it("should return status code 200 and have 'Universe of Whatsit' in the body", async () => {
      const res = await request.get("/");
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("Universe of Whatsit");
    });
  });

  describe("GET /about", () => {
    it("should return status code 200 and contain 'About Us' in the body", async () => {
      const res = await request.get("/about");
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("About Us");
    });
  });
});