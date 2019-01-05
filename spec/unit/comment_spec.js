const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("Comment", () => {
  beforeEach((done) => {
    this.user;
    this.topic;
    this.post;
    this.comment;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "velma@mysterymachine.com",
        password: "jenkies"
      }).then((user) => {
        this.user = user;

        Topic.create({
          title: "Haunted Mansions Galore",
          description: "Finding monsters one haunted house at a time",
          posts: [{
            title: "Not haunted",
            body: "It was Mr. Wilson in a monster disguise",
            userId: this.user.id
          }]
        }, {
          include: {
            model: Post,
            as: "posts"
          }
        }).then((topic) => {
          this.topic = topic;
          this.post = this.topic.posts[0];

          Comment.create({
            body: "Zoinks!!!",
            userId: this.user.id,
            postId: this.post.id
          }).then((comment) => {
            this.comment = comment;
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
  });

  describe("#create()", () => {
    it("should create a comment object with a body, assigned to post and user", (done) => {
      Comment.create({
        body: "Graveyards are haunted too",
        postId: this.post.id,
        userId: this.user.id
      }).then((comment) => {
        expect(comment.body).toBe("Graveyards are haunted too");
        expect(comment.postId).toBe(this.post.id);
        expect(comment.userId).toBe(this.user.id);
        done();
      }).catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not created a comment with a missing body, assigned post or user", (done) => {
      Comment.create({
        body: "Are there masks to be found?"
      }).then((comment) => {
        done();
      }).catch((err) => {
        expect(err.message).toContain("Comment.userId cannot be null");
        expect(err.message).toContain("Comment.postId cannot be null");
        done();
      });
    });
  });

  describe("#setUser()", () => {
    it("should associate a comment and a user together", (done) => {
      User.create({
        email: "shaggy@mysterymachine.com",
        password: "password"
      }).then((newUser) => {
        expect(this.comment.userId).toBe(this.user.id);
        
        this.comment.setUser(newUser).then((comment) => {
          expect(comment.userId).toBe(newUser.id);
          done();
        });
      });
    });
  })

  describe("#getUser()", () => {
    it("should return the associated user", (done) => {
      this.comment.getUser().then((associatedUser) => {
        expect(associatedUser.email).toBe("velma@mysterymachine.com");
        done();
      });
    });
  });

  describe("#setPost()", () => {
    it("should associate a post and a comment together", (done) => {
      Post.create({
        title: "Swampy haunted marshes",
        body: "Yesterday I saw a ghost in the swampy marsh",
        topicId: this.topic.id,
        userId: this.user.id
      }).then((newPost) => {
        expect(this.comment.postId).toBe(this.post.id);

        this.comment.setPost(newPost).then((comment) => {
          expect(comment.postId).toBe(newPost.id);
          done();
        });
      });
    });
  });

  describe("#getPost()", () => {
    it("should return the associated post", (done) => {
      this.comment.getPost().then((associatedPost) => {
        expect(associatedPost.title).toBe("Not haunted");
        done();
      });
    });
  });
});