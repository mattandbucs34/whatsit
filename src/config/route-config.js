module.exports = {
  init(app) {
    const staticRoutes = require("../routes/static");
    const topicRoutes = require("../routes/topics");
    const advertRoutes = require("../routes/adverts");
    const postRoutes = require("../routes/post-routes");
    const flairRoutes = require("../routes/flair-routes");
    const userRoutes = require("../routes/users");
    const commentRoutes = require("../routes/comments");
    const voteRoutes = require("../routes/votes");
    const favoriteRoutes = require("../routes/favorites");

    if(process.env.NODE_ENV === "test") {
      const mockAuth = require("../../spec/support/mock-auth.js");
      mockAuth.fakeIt(app);
    }

    app.use(staticRoutes);
    app.use(topicRoutes);
    app.use(advertRoutes);
    app.use(postRoutes);
    app.use(flairRoutes);
    app.use(userRoutes);
    app.use(commentRoutes);
    app.use(voteRoutes);
    app.use(favoriteRoutes);
  }
}