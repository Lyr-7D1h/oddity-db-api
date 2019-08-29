const restify = require("restify");
const restifyLogger = require("restify-pino-logger");
const routes = require("./routes");

const PORT = process.env.PORT || 3000;

const server = restify.createServer();

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
  res.send("OddityStation API");
});

routes(server);

server.listen(PORT, function() {
  console.log("%s listening at %s", server.name, server.url);
});
