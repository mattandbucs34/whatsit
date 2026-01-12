export default {
    fakeIt(app) {
        app.use((req, res, next) => {
            const userId = req.headers["x-test-user-id"];

            if (userId && process.env.NODE_ENV === "test") {
                req.user = {
                    id: parseInt(userId, 10) || userId,
                    email: req.headers["x-test-user-email"] || "test@example.com",
                    role: req.headers["x-test-user-role"] || "member",
                    isAdmin() {
                        return this.role === "admin";
                    }
                };
                return next();
            }

            if (req.session?.mockUser && !req.user) {
                req.user = req.session.mockUser;
            }
            next();
        });

        app.get("/auth/fake", (req, res) => {
            const id = req.query.userId || req.query.id;
            const { role, email } = req.query;

            if (id === "0" || id === 0) {
                delete req.session.mockUser;
            } else if (id) {
                req.session.mockUser = { id, role, email };
            }

            res.redirect("/");
        });

        // let role, id, email;

        // function middleware(req, res, next) {
        //   role = req.body.role || req.query.role || role;
        //   id = req.body.userId || req.query.userId || req.query.id || id;
        //   email = req.body.email || req.query.email || email;

        //   if (id && id != "0") {
        //     req.user = {
        //       "id": id,
        //       "email": email,
        //       "role": role
        //     };
        //   } else if (id == "0") {
        //     delete req.user;
        //   }

        //   if (next) { next(); }
        // }

        // function route(req, res) {
        //   res.redirect("/");
        // }

        // app.use(middleware);
        // app.get("/auth/fake", route);
    }
};