const err = require("restify-errors");
const db = require("../db");

db.removePortalTable()
  .then(() => {
    console.log("Portal Table removed");
  })
  .catch(err => {
    console.log(err);
  });

db.createPortalsTable()
  .then(() => {
    console.log("Portal Table created");
  })
  .catch(err => {
    console.log(err);
  });

module.exports = server => {
  server.get("/portals/:id", (req, res) => {
    db.getPortals(req.params.id)
      .then(v => {
        res.send(v);
      })
      .catch(err => {
        console.log(err);
        res.send(new err.InternalServerError("something went wrong"));
      });
  });

  server.put("/portals", (req, res) => {
    if (!req.body) {
      return res.send(new err.BadRequestError("wrong input"));
    }

    const name = req.body.name;

    db.createPortal(name)
      .then(([accessKey, secretKey]) => {
        res.send({ accessKey: accessKey, secretKey: secretKey });
      })
      .catch(err => {
        console.log(err);
        res.send("something went wrong");
      });
  });

  server.del("/portals", (req, res) => {
    if (!req.body) {
      return res.send(new err.BadRequestError("wrong input"));
    }

    const id = req.body.id;

    db.removePortal(id)
      .then(() => {
        res.send("success");
      })
      .catch(err => {
        console.log(err);
        res.send("something went wrong");
      });
  });
};
