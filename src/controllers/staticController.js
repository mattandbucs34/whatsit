export function index(req, res, next) {
  res.render("static/index", { title: "Welcome to Whatsit" });
}
export function about(req, res, next) {
  res.render("static/about");
}