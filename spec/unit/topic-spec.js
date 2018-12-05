const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    sequelize.sync({force: true}).then((res) => {

      Topic.create({
        title: "What's in a title?",
        description: "Titles are insignifigant"
      }).then((topic) => {
        this.topic = topic;

        Post.create({
          title: "A good title makes the difference",
          body: "Kings and Queens have titles, as do peasants and peons",
          topicId: this.topic.id
        }).then((post) => {
          this.post = post;
          done();
        });

      }).catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#create", () => {
    it("should create a topic which have posts associated with", (done) => {
      Topic.create({
        title: "Will the real Title please stand up",
        description: "The real Title is standing",
      }).then((topic) => {
        expect(topic.title).toBe("Will the real Title please stand up");
        expect(topic.description).toBe("The real Title is standing");
        done();
      }).catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#getPosts()", () => {
    it("should return an associated post with the given topic", (done) => {
      this.topic.getPosts().then((associatedPost) => {
        expect(associatedPost[0].title).toBe("A good title makes the difference");
        expect(associatedPost[0].body).toBe("Kings and Queens have titles, as do peasants and peons");
        expect(associatedPost[0].topicId).toBe(this.topic.id);
        done();
      });
    });
  });
}); 