const restify = require("restify");
const restifyLogger = require("restify-logger");
const corsMiddleware = require("restify-cors-middleware");
const fs = require("fs");
const routes = require("./routes");

const PORT = process.env.PORT || 3000;

const server = restify.createServer({
  name: "OddityStation API",
  certificate: fs.readFileSync("./.cred/cert.pem", "utf8"),
  key: fs.readFileSync("./.cred/key.pem", "utf8"),
  ignoreTrailingSlash: true
});

require("./db")
  .getPortals()
  .then(portals => {
    portals = portals
      .map(portal => {
        if (portal.url) {
          return portal.url;
        }
      })
      .filter(url => {
        if (url) {
          return true;
        }
      });
    const cors = corsMiddleware({
      preflightMaxAge: 5, //Optional
      origins: portals,
      allowHeaders: ["API-Token"],
      exposeHeaders: ["API-Token-Expiry"]
    });
    server.pre(cors.preflight);
    server.use(cors.actual);
  })
  .catch(err => {
    console.log(err);
  });

server.use(restifyLogger("short"));

server.use(
  restify.plugins.queryParser({
    mapParams: true
  })
);
server.use(
  restify.plugins.bodyParser({
    mapParams: true
  })
);

server.get("/", (req, res) => {
  res.send(server.name);
});

routes(server);

server.listen(PORT, function() {
  console.log("%s listening at %s", server.name, server.url);
});
