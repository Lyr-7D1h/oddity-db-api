const users = require("./users");
const portals = require("./portals");

module.exports = server => {
  users(server);
  portals(server);
};
