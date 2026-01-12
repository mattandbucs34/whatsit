import request from "supertest";
import app from "../../src/app";
import models from "../../src/db/models/index";
import { describe, it, beforeEach, expect } from "vitest";

const { sequelize, Topic, User } = models;
const base = "/topics";

describe("routes : topics", () => {
    let admin;
    let member;
    let topic;

    beforeEach(async () => {
        await sequelize.sync({ force: true });

        admin = await User.create({
            email: "velma@mysterymachine.com",
            password: "jenkies",
            role: "admin"
        });

        member = await User.create({
            email: "daphne@mysterymachine.com",
            password: "jenkies",
            role: "member"
        });

        topic = await Topic.create({
            title: "JS Frameworks",
            description: "There are a lot of them."
        });
    });

    describe("admin user performing CRUD actions for Topic", () => {
        describe("GET /topics", () => {
            it("should return a status code 200 and all topics", async () => {
                const res = await request(app)
                    .get(base)
                    .set("x-test-user-id", admin.id)
                    .set("x-test-user-role", admin.role);

                expect(res.statusCode).toBe(200);
                expect(res.text).toContain("Topics");
                expect(res.text).toContain("JS Frameworks");
            });
        });

        describe("GET /topics/new", () => {
            it("should render a new topic form", async () => {
                const res = await request(app)
                    .get(`${base}/new`)
                    .set("x-test-user-id", admin.id)
                    .set("x-test-user-role", admin.role);

                expect(res.statusCode).toBe(200);
                expect(res.text).toContain("New Topic");
            });
        });

        describe("POST /topics/create", () => {
            const options = {
                url: `${base}/create`,
                form: {
                    title: "Blink-182 songs",
                    description: "What's your favorite Blink 182 song?"
                }
            };
            it("should create a new topic and redirect", async () => {
                const res = await request(app)
                    .post(options.url)
                    .set("x-test-user-id", admin.id)
                    .set("x-test-user-role", admin.role)
                    .type("form")
                    .send(options.form);

                const newTopic = await Topic.findOne({ where: { title: "Blink-182 songs" } });

                expect(res.statusCode).toBe(303);
                expect(newTopic.title).toBe("Blink-182 songs");
                expect(newTopic.description).toBe("What's your favorite Blink 182 song?");
            });
        });

        describe("GET /topics/:id", () => {
            it("should render a view with the selected topic", async () => {
                const res = await request(app)
                    .get(`${base}/${topic.id}`)
                    .set("x-test-user-id", admin.id)
                    .set("x-test-user-role", admin.role);

                expect(res.statusCode).toBe(200);
                expect(res.text).toContain("JS Frameworks");
            });
        });

        describe("POST /topics/:id/destroy", () => {
            it("should delete the topic with the associated ID", async () => {
                const topicCountBeforeDelete = await Topic.count();

                expect(topicCountBeforeDelete).toBe(1);

                await request(app)
                    .post(`${base}/${topic.id}/destroy`)
                    .set("x-test-user-id", admin.id)
                    .set("x-test-user-role", admin.role);

                const topicCountAfterDelete = await Topic.count();

                expect(topicCountAfterDelete).toBe(topicCountBeforeDelete - 1);
            });
        });

        describe("GET /topics/:id/edit", () => {
            it("should render a view with an edit topic form", async () => {
                const res = await request(app)
                    .get(`${base}/${topic.id}/edit`)
                    .set("x-test-user-id", admin.id)
                    .set("x-test-user-role", admin.role);

                expect(res.statusCode).toBe(200);
                expect(res.text).toContain("Edit Topic");
                expect(res.text).toContain("JS Frameworks");
            });
        });

        describe("POST /topics/:id/update", () => {
            it("should update the topic with the given values", async () => {
                const options = {
                    url: `${base}${topic.id}/update`,
                    form: {
                        title: "JavaScript Frameworks",
                        description: "There are a lot of them."
                    }
                };
                await request(app)
                    .post(`${base}/${topic.id}/update`)
                    .set("x-test-user-id", admin.id)
                    .set("x-test-user-role", admin.role)
                    .type("form")
                    .send(options.form);

                const updatedTopic = await Topic.findOne({ where: { id: topic.id } });

                expect(updatedTopic.title).toBe("JavaScript Frameworks");
                expect(updatedTopic.description).toBe("There are a lot of them.");
            });
        });

        describe("POST /topics/:id/update", () => {
            it("should not create a new topic that fails validations", async () => {
                const options = {
                    url: `${base}/${topic.id}/update`,
                    form: {
                        title: "xyz",
                        description: "zyx"
                    }
                };
                await request(app)
                    .post(`${base}/${topic.id}/update`)
                    .set("x-test-user-id", admin.id)
                    .set("x-test-user-role", admin.role)
                    .type("form")
                    .send(options.form);

                const updatedTopic = await Topic.findOne({ where: { id: topic.id } });

                expect(updatedTopic.title).toBe("JS Frameworks");
                expect(updatedTopic.description).toBe("There are a lot of them.");
            });

            it("should not create a new topic that fails validations", async () => {
                const options = {
                    url: `${base}create`,
                    form: {
                        title: "xyz",
                        description: "zyx"
                    }
                };

                const res = await request(app)
                    .post(`${base}create`)
                    .set("x-test-user-id", admin.id)
                    .set("x-test-user-role", admin.role)
                    .type("form")
                    .send(options.form);

                const updatedTopic = await Topic.findOne({ where: { id: topic.id } });

                expect(updatedTopic.title).toBe("JS Frameworks");
                expect(updatedTopic.description).toBe("There are a lot of them.");
            });

            it("should not create a new topic that fails validations", async () => {
                const options = {
                    url: `${base}create`,
                    form: {
                        title: "xyz",
                        description: "zyx"
                    }
                };

                const res = await request(app)
                    .post(`${base}/create`)
                    .set("x-test-user-id", admin.id)
                    .set("x-test-user-role", admin.role)
                    .type("form")
                    .send(options.form);

                const updatedTopic = await Topic.findOne({ where: { id: topic.id } });

                expect(updatedTopic.title).toBe("JS Frameworks");
                expect(updatedTopic.description).toBe("There are a lot of them.");
            });
        });
    });

    describe("member user performing CRUD actions for Topic", () => {
        describe("GET /topics", () => {
            it("should return a status code 200 and all topics", async () => {
                const res = await request(app)
                    .get(base)
                    .set("x-test-user-id", member.id)
                    .set("x-test-user-role", member.role);

                expect(res.statusCode).toBe(200);
                expect(res.text).toContain("Topics");
                expect(res.text).toContain("JS Frameworks");
            });
        });

        describe("GET /topics/new", () => {
            it("should not render a new topic form and redirect to /topics", async () => {
                const res = await request(app)
                    .get(`${base}/new`)
                    .set("x-test-user-id", member.id)
                    .set("x-test-user-role", member.role);

                expect(res.statusCode).toBe(302);
                expect(res.text).toContain("Found. Redirecting to /topics");
            });
        });

        describe("POST /topics/create", () => {
            const options = {
                url: `${base}/create`,
                form: {
                    title: "Blink-182 songs",
                    description: "What's your favorite Blink 182 song?"
                }
            };
            it("should not create a new topic", async () => {
                const res = await request(app)
                    .post(`${base}/create`)
                    .set("x-test-user-id", member.id)
                    .set("x-test-user-role", member.role)
                    .type("form")
                    .send(options.form);

                expect(res.statusCode).toBe(302);
                expect(res.text).toContain("Found. Redirecting to /topics");
            });
        });

        describe("GET /topics/:id", () => {
            it("should render a view with the selected topic", async () => {
                const res = await request(app)
                    .get(`${base}/${topic.id}`)
                    .set("x-test-user-id", member.id)
                    .set("x-test-user-role", member.role);

                expect(res.statusCode).toBe(200);
                expect(res.text).toContain("JS Frameworks");
            });
        });

        describe("POST /topics/:id/destroy", () => {
            it("should not delete the topic with the associated ID", async () => {
                const { count } = await Topic.findAndCountAll();

                expect(count).toBe(1);

                request(app).post(`${base}/${topic.id}/destroy`);
                const { count: afterCount } = await Topic.findAndCountAll();

                expect(count).toBe(afterCount);
            });
        });

        describe("GET /topics/:id/edit", () => {
            it("should not render a view with an edit topic form", async () => {
                const res = await request(app)
                    .get(`${base}/${topic.id}/edit`)
                    .set("x-test-user-id", member.id)
                    .set("x-test-user-role", member.role);

                expect(res.statusCode).toBe(302);
                expect(res.text).toContain("Found. Redirecting to /topics");
            });
        });

        describe("POST /topics/:id/update", () => {
            it("should not update the topic with the given values", async () => {
                const options = {
                    url: `${base}/${topic.id}/update`,
                    form: {
                        title: "JavaScript Frameworks",
                        description: "There are a lot of them."
                    }
                };
                request(app)
                    .post(options.url)
                    .set("x-test-user-id", member.id)
                    .set("x-test-user-role", member.role)
                    .type("form")
                    .send(options.form);
                const updatedTopic = await Topic.findOne({ where: { id: topic.id } });

                expect(updatedTopic.title).toBe("JS Frameworks");
            });
        });

    });
});
