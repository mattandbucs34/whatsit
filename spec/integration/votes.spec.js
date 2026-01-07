import { get } from "request";
const base = "http://localhost:3000/topics";
import { sequelize } from "../../src/db/models/index";
import { Topic } from "../../src/db/models";
import { Post } from "../../src/db/models";
import { User } from "../../src/db/models";
import { Vote } from "../../src/db/models";

describe("routes : votes", () => {
  beforeEach((done) => {
    this.user;
    this.topic;
    this.post;
    this.comment;
    this.vote;

    sequelize.sync({ force: true }).then((res) => {
      User.create({
        email: "velma@mysterymachine.com",
        password: "jenkies"
      }).then((res) => {
        this.user = res;

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
        }).then((res) => {
          this.topic = res;
          this.post = this.topic.posts[0];
          done();

        }).catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("guest attempting to vote on a post", () => {
    beforeEach((done) => {
      get({
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: 0
        }
      }, (err, res, body) => {
        done();
      });
    });

    describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {
      it("should not create a new vote", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/votes/upvote`
        };
        get(options, (err, res, body) => {
          Vote.findOne({
            where: {
              userId: this.user.id,
              postId: this.post.id
            }
          }).then((vote) => {
            expect(vote).toBeNull();
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
  });

  describe("signed in user voting on a post", () => {
    beforeEach((done) => {
      get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member",
          userId: this.user.id
        }
      }, (err, res, body) => {
        done();
      });
    });

    describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {
      it("should create an upvote", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/votes/upvote`
        };
        get(options, (err, res, body) => {
          Vote.findOne({
            where: {
              userId: this.user.id,
              postId: this.post.id
            }
          }).then((vote) => {
            expect(vote).not.toBeNull();
            expect(vote.value).toBe(1);
            expect(vote.userId).toBe(this.user.id);
            expect(vote.postId).toBe(this.post.id);
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      it("should not create an upvote if value is incorrect", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/votes/mockvote`
        };
        get(options, (err, res, body) => {
          Vote.findOne({
            where: {
              value: 2
            }
          }).then((vote) => {
            expect(vote).toBeNull();
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      it("should not create a second upvote", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/votes/upvote`
        };
        get(options, (err, res, body) => {
          Vote.findOne({
            where: {
              userId: this.user.id,
              postId: this.post.id
            }
          }).then((vote) => {
            expect(vote).not.toBeNull();
          }).then(() => {
            get(options, (err, res, body) => {
              Vote.findOne({
                where: {
                  userId: this.user.id,
                  postId: this.post.id
                }
              }).then((newVote) => {
                this.post.getPoints().then((voteCount) => {
                  expect(voteCount).toBe(1);
                });
                expect(newVote).not.toBeNull();
                expect(newVote.value).toBe(1);
                expect(newVote.userId).toBe(this.user.id);
                expect(newVote.postId).toBe(this.post.id);
                done();
              });
            });
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /topics/:topicId/posts/:postId/votes/downvote", () => {
      it("should create an downvote", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/votes/downvote`
        };
        get(options, (err, res, body) => {
          Vote.findOne({
            where: {
              userId: this.user.id,
              postId: this.post.id
            }
          }).then((vote) => {
            expect(vote).not.toBeNull();
            expect(vote.value).toBe(-1);
            expect(vote.userId).toBe(this.user.id);
            expect(vote.postId).toBe(this.post.id);
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {
      it("should not create an upvote if value is incorrect", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/votes/upvote`
        };
        get(options, (err, res, body) => {
          Vote.findOne({
            where: {
              postId: this.post.id
            }
          }).then((vote) => {
            return this.post.getPoints().then((voteCount) => {
              expect(voteCount).toBe(1);
              done();
            });

          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /topics/:topicId/posts/:postId/votes/upvote||downvote", () => {
      it("should update upvote to downvote for signed in user", (done) => {
        let options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/votes/upvote`
        };

        get(options, (err, res, body) => {
          Vote.findOne({
            where: {
              userId: this.user.id,
              postId: this.post.id
            }
          }).then((vote) => {
            expect(vote).not.toBeNull();
            expect(vote.value).toBe(1);
          }).then(() => {
            options = {
              url: `${base}/${this.topic.id}/posts/${this.post.id}/votes/downvote`
            };

            get(options, (err, res, body) => {
              Vote.findOne({
                where: {
                  userId: this.user.id,
                  postId: this.post.id
                }
              }).then((vote) => {
                expect(vote).not.toBeNull();
                expect(vote.value).toBe(-1);
                done();
              });
            });
          });
        });
      });
    });
  });
});