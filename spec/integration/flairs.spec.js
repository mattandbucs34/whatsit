import request from "supertest";
import app from "../../src/app";
import models from "../../src/db/models/index";
const { sequelize, Flair } = models;

import { describe, it, beforeEach, expect } from "vitest";

const base = "/flairs";

describe("routes : flairs", () => {
    let flair;
    beforeEach(async () => {
        await sequelize.sync({ force: true });
        try {
            flair = await Flair.create({
                name: "What a Flair!",
                color: "pink"
            });
        } catch (error) {
            console.log(error);
        }
    });

    describe("GET /flairs", () => {
        it("should return a status code of 200 and all flairs", async () => {
            const res = await request(app).get(base);

            expect(res.statusCode).toBe(200);
            expect(res.text).toContain("What a Flair!");
            expect(res.text).toContain("pink");
        });
    });

    describe("GET /flairs/new", () => {
        it("should render a new flair form", async () => {
            const res = await request(app).get(`${base}/new`);

            expect(res.statusCode).toBe(200);
            expect(res.text).toContain("New Flair");
        });
    });

    describe("POST /flairs/create", () => {
        const options = {
            url: `${base}/create`,
            form: {
                name: "Zing Flair",
                color: "grey"
            }
        };
        it("should create a new flair and redirect", async () => {
            const res = await request(app)
                .post(options.url)
                .type("form")
                .send({ name: "Zing Flair", color: "grey" });

            const flair = await Flair.findOne({
                where: {
                    name: "Zing Flair"
                }
            });

            console.log('FLAIR: ', flair);

            expect(res.statusCode).toBe(303);
            expect(flair.name).toBe("Zing Flair");
            expect(flair.color).toBe("grey");
        });
    });

    describe("GET /flairs/:name", () => {
        it("should render a view with the selected flair", async () => {
            const res = await request(app).get(`${base}/${flair.name}`);

            expect(res.statusCode).toBe(200);
            expect(res.text).toContain("What a Flair!");
        });
    });

    describe("POST /flairs/:name/destroy", () => {
        it("should delete the flair with the associated name", async () => {
            const flairsBeforeDelete = await Flair.count();

            expect(flairsBeforeDelete).toBe(1);

            await request(app)
                .post(`${base}/${flair.name}/destroy`);

            const flairsAfterDelete = await Flair.count();

            expect(flairsAfterDelete).toBe(flairsBeforeDelete - 1);
        });
    });

    describe("GET /flairs/:name/edit", () => {
        it("should with a form to edit a flair", async () => {
            const res = await request(app).get(`${base}/${flair.name}/edit`);

            expect(res.statusCode).toBe(200);
            expect(res.text).toContain("Edit Flair");
            expect(res.text).toContain("What a Flair!");
        });
    });

    describe("POST /flairs/:name/update", () => {
        it("should update the flair with the given information", async () => {
            const options = {
                url: `${base}/${flair.name}/update`,
                form: {
                    name: "Ric Flair WOOOOO",
                    color: "purple"
                }
            };

            const res = await request(app)
                .post(options.url)
                .type("form")
                .send(options.form);

            const updatedFlair = await Flair.findOne({
                where: { id: flair.id }
            });

            expect(res.statusCode).toBe(302);
            expect(updatedFlair.name).toBe("Ric Flair WOOOOO");
        });
    });
});