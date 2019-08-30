const mysql = require("mysql2");
const token = require("./token");

require("dotenv").config();

class database {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASS
    });
  }

  createTestingTable() {
    return this.execute("CREATE TABLE IF NOT EXISTS testing(test TEXT)");
  }

  /**
   * Users
   */
  createUsersTable() {
    return this.execute(
      `CREATE TABLE IF NOT EXISTS 
      users(
        id MEDIUMINT NOT NULL AUTO_INCREMENT, 
        username CHAR(30) NOT NULL, 
        PRIMARY KEY (id)
      )`
    );
  }

  removeUsersTable() {
    return this.execute("DROP TABLE IF EXISTS users");
  }

  createUser(username) {
    return this.query("INSERT INTO users (username) VALUES (?)", [username]);
  }

  removeUser(id) {
    return this.query("DELETE FROM users WHERE id=?", [id]);
  }

  getUsers(id) {
    if (id) {
      return this.query("SELECT * FROM users WHERE id=?", [id]);
    } else {
      return this.execute("SELECT * FROM users;");
    }
  }

  /**
   * Portals
   */
  createPortalsTable() {
    return this.execute(`CREATE TABLE IF NOT EXISTS 
    portals(
      id MEDIUMINT NOT NULL AUTO_INCREMENT,
      name CHAR(30) NOT NULL,
      accessKey CHAR(30) NOT NULL,
      secretKey CHAR(80) NOT NULL,
      PRIMARY KEY (id)
    )`);
  }

  removePortalTable() {
    return this.execute("DROP TABLE IF EXISTS portals");
  }

  createPortal(name) {
    return new Promise((res, rej) => {
      let accessKey = token.createAccessKey();
      let secretKey = token.createSecretKey();
      token
        .encryptKey(secretKey)
        .then(hash => {
          this.query(
            "INSERT INTO portals (name, accessKey, secretKey) VALUES (?, ?, ?)",
            [name, accessKey, hash]
          )
            .then(() => {
              res([accessKey, secretKey]);
            })
            .catch(err => {
              rej(err);
            });
        })
        .catch(err => {
          rej(err);
        });
    });
  }

  removePortal(id) {
    return this.query("DELETE FROM portals WHERE id=?", [id]);
  }

  getPortals(id) {
    if (id) {
      return this.query("SELECT * FROM portals WHERE id=?", [id]);
    } else {
      return this.execute("SELECT * FROM portals;");
    }
  }

  /**
   * Helper functions
   */
  execute(query) {
    return new Promise((res, rej) => {
      this.connection
        .promise()
        .execute(query)
        .then(([rows, fields]) => {
          res(rows);
        })
        .catch(err => {
          rej(err);
        });
    });
  }
  query(query, params) {
    return new Promise((res, rej) => {
      this.connection
        .promise()
        .query(query, params)
        .then(([rows, fields]) => {
          res(rows);
        })
        .catch(err => {
          rej(err);
        });
    });
  }
}

module.exports = new database();
