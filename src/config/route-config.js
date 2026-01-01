import staticRoutes from "../routes/static";
import topicRoutes from "../routes/topics";
import advertRoutes from "../routes/adverts";
import postRoutes from "../routes/post-routes";
import flairRoutes from "../routes/flair-routes";
import userRoutes from "../routes/users";
import commentRoutes from "../routes/comments";
import voteRoutes from "../routes/votes";
import favoriteRoutes from "../routes/favorites";

if (process.env.NODE_ENV === "test") {
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