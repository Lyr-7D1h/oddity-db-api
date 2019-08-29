const db = require("../db");

db.deleteUsersTable()
  .then(v => {
    console.log("Removed Users Table");
  })
  .catch(err => {
    console.log(err);
  });
db.createUsersTable()
  .then(v => {
    console.log(v);
    console.log("Created Users Table");
  })
  .catch(err => {
    console.log(err);
  });

module.exports = server => {
  server.get("/users/:id", (req, res) => {
    db.getUsers(req.params.id)
      .then(v => {
        res.send(v);
      })
      .catch(err => {
        console.log(err);
        res.send("something went wrong");
      });
  });

  server.post("/users", (req, res) => {
    const username = req.body.username;

    db.createUser(username)
      .then(v => {
        res.send(v);
      })
      .catch(err => {
        console.log(err);
        res.send("something went wrong");
      });
  });
};
