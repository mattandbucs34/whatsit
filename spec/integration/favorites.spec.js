import { get, post } from "request";
const base = "http://localhost:3000/topics";
import { sequelize } from "../../src/db/models/index";
import { Topic } from "../../src/db/models";
import { Post } from "../../src/db/models";
import { User } from "../../src/db/models";
import { Favorite } from "../../src/db/models";

describe("routes : favorites", () => {
  beforeEach((done) => {
    this.user;
    this.topic;
    this.post;

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

  describe("guest attempting to favorite a post", () => {
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

    describe("POST /topics/:topicId/posts/:postId/favorites/create", () => {
      it("should not create a new favorite", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/favorites/create`
        };

        let favCountBeforeCreate;

        this.post.getFavorites().then((favorites) => {
          favCountBeforeCreate = favorites.length;

          post(options, (err, res, body) => {
            Favorite.all().then((favorite) => {
              expect(favCountBeforeCreate).toBe(favorite.length);
              done();
            }).catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });
    });
  });

  describe("signed in user favoriting a post", () => {
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

    describe("POST /topics/:topicId/posts/:postId/favorites/create", () => {
      it("should create a favorite", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/favorites/create`
        };

        post(options, (err, res, body) => {
          Favorite.findOne({
            where: {
              userId: this.user.id,
              postId: this.post.id
            }
          }).then((favorite) => {
            expect(favorite).not.toBeNull();
            expect(favorite.userId).toBe(this.user.id);
            expect(favorite.postId).toBe(this.post.id);
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("POST /topics/:topicId/posts/:postId/favorites/:id/destroy", () => {
      it("should destroy a favorite", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/favorites/create`
        };

        let favCountBeforeDelete;

        post(options, (err, res, body) => {
          setTimeout(() => {
            this.post.getFavorites().then((favorites) => {
              const favorite = favorites[0];
              favCountBeforeDelete = favorites.length;

              post(`${base}/${this.topic.id}/posts/${this.post.id}/favorites/${favorite.id}/destroy`,
                (err, res, body) => {
                  this.post.getFavorites().then((favorites) => {
                    expect(favorites.length).toBe(favCountBeforeDelete - 1);
                    done();
                  });
                });
            });
          }, 1000);
        });
      });
    });
  });
});