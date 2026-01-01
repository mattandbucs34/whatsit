import app from "./app";
import http from "http";
//const server = http.createServer(app);

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

//server.listen(3000);
server.listen(port);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

server.on("listening", () => {
  console.log(`server is listening for requests on port ${server.address().port}`);
});