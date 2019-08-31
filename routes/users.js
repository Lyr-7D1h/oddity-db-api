const err = require("restify-errors");
const db = require("../db");

db.removeUsersTable()
  .then(() => {
    console.log("Removed Users Table");
  })
  .catch(err => {
    console.log(err);
  });
db.createUsersTable()
  .then(() => {
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
        res.send(new err.InternalServerError("something went wrong"));
      });
  });

  server.put("/users", (req, res) => {
    if (!req.body) {
      return res.send(new err.BadRequestError("wrong input"));
    }

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const ip = req.body.ip;

    if (username && email && password && role && ip) {
      db.createUser(username, email, password, role, ip)
        .then(v => {
          if (v.affectedRows == 0) {
            return res.send("nothing changed");
          }
          res.send("success");
        })
        .catch(err => {
          console.log(err);
          res.send("something went wrong");
        });
    } else {
      return res.send(
        new err.BadRequestError("not all properties needed given")
      );
    }
  });

  server.del("/users", (req, res) => {
    if (!req.body) {
      return res.send(new err.BadRequestError("wrong input"));
    }

    const id = req.body.id;

    if (id) {
      db.removeUser(id)
        .then(v => {
          if (v.affectedRows == 0) {
            return res.send("nothing changed");
          }
          return res.send("success");
        })
        .catch(err => {
          console.log(err);
          return res.send("something went wrong");
        });
    } else {
      return res.send(new err.BadRequestError("wrong input"));
    }
  });
};
