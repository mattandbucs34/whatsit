import request from "supertest";
import app from "../../src/app.js";
import models from "../../src/db/models/index";
const { sequelize, Advert } = models;
import { describe, it, beforeEach, expect } from "vitest";

describe("routes : adverts", () => {
  let advert;

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    advert = await Advert.create({
      title: "Advertising at its Finest",
      description: "Everyone loves advertising!"
    });
  });

  describe("GET /adverts", () => {
    it("should return a status of 200 and all adverts", async () => {
      const res = await request(app).get("/adverts");
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("Advertisements");
      expect(res.text).toContain("Advertising at its Finest");
    });
  });

  describe("GET /adverts/new", () => {
    it("should render a new advertisement form", async () => {
      const res = await request(app).get("/adverts/new");
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("New Advertisement");
    });
  });

  describe("POST /adverts/create", () => {
    it("should create a new advertisement and redirect", async () => {
      const res = await request(app)
        .post("/adverts/create")
        .type("form")
        .send({
          title: "Dog Breath",
          description: "Does your breath smell like wet dog?"
        });

      const newAdvert = await Advert.findOne({ where: { title: "Dog Breath" } });
      expect(res.statusCode).toBe(303);
      expect(newAdvert.title).toBe("Dog Breath");
      expect(newAdvert.description).toBe("Does your breath smell like wet dog?");
    });
  });

  describe("GET /adverts/:id", () => {
    it("should render a view with the selected advertisement", async () => {
      const res = await request(app).get(`/adverts/${advert.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("Advertising at its Finest");
    });
  });

  describe("POST /adverts/:id/destroy", () => {
    it("should delete the advertisement with the associated ID", async () => {
      const advertCount = await Advert.count();
      expect(advertCount).toBe(1);

      const res = await request(app).post(`/adverts/${advert.id}/destroy`);
      const finalCount = await Advert.count();
      expect(res.statusCode).toBe(303);
      expect(finalCount).toBe(advertCount - 1);
    });
  });

  describe("GET /adverts/:id/edit", () => {
    it("should render a view with an edit advertisement form", async () => {
      const res = await request(app).get(`/adverts/${advert.id}/edit`);
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("Edit Advertisement");
      expect(res.text).toContain("Advertising at its Finest");
    });
  });

  describe("POST /adverts/:id/update", () => {
    it("should update the advertisement with given values", async () => {
      const res = await request(app)
        .post(`/adverts/${advert.id}/update`)
        .type("form")
        .send({
          title: "Things to Love",
          description: "I love me some good food"
        });

      const updatedAdvert = await Advert.findByPk(advert.id);
      expect(res.statusCode).toBe(303);
      expect(updatedAdvert.title).toBe("Things to Love");
    });
  });
});
