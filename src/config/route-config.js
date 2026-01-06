import staticRoutes from "../routes/static.js";
import topicRoutes from "../routes/topics.js";
import advertRoutes from "../routes/adverts.js";
import postRoutes from "../routes/post-routes.js";
import flairRoutes from "../routes/flair-routes.js";
import userRoutes from "../routes/users.js";
import commentRoutes from "../routes/comments.js";
import voteRoutes from "../routes/votes.js";
import favoriteRoutes from "../routes/favorites.js";

export function init(app) {
  if (process.env.NODE_ENV === "test") {
    // For now, commenting this out as it requires async handling
    // import("../../spec/support/mock-auth.js").then(mockAuth => mockAuth.fakeIt(app));
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