const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("Flair", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;
    sequelize.sync({force: true}).then((res) => {
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

        Flair.create({
          name: "Green Flair",
          color: "green"
        }).then((flair) => {
          this.flair = flair;
          this.topic.setFlair(this.flair);
          done();
        }).catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("#create()", () => {
    it("should create a flair object with a name and a color", (done) => {
      Flair.create({
        name: "Red Tag",
        color: "red"
      }).then((flair) => {
        expect(flair.name).toBe("Red Tag");
        expect(flair.color).toBe("red");
        done();
      }).catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#setFlair()", () => {
    it("should associate a flair with a topic", (done) => {
      Flair.create({
        name: "Blue Flair",
        color: "navy"
      }).then((newFlair) => {
        
        this.topic.setFlair(newFlair).then((flair) => {
          expect(flair.color).toBe("navy");
          done();
        });
      });
    });
  });

  describe("#getFlair()", () => {
    it("should return the associated flair", (done) => {
      //console.log(this.topic.getFlair());
      this.topic.getFlair().then((associatedFlair) => {
        expect(associatedFlair.color).toBe("green");
        done();
      });
      done();
    });
  });
});