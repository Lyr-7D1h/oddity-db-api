const mysql = require("mysql2");

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

  createUsersTable() {
    return this.execute(
      "CREATE TABLE IF NOT EXISTS users(id MEDIUMINT NOT NULL AUTO_INCREMENT, username CHAR(30) NOT NULL, PRIMARY KEY (id))"
    );
  }

  deleteUsersTable() {
    return this.execute("DROP TABLE IF EXISTS users");
  }

  createUser(username) {
    return this.query("INSERT INTO users (username) VALUES (?)", [username]);
  }

  getUsers(id) {
    if (id) {
      return this.query("SELECT * FROM users WHERE id=?", [id]);
    } else {
      return this.execute("SELECT * FROM users;");
    }
  }

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
