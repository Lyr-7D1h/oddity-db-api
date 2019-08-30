const bcrypt = require("bcrypt");
const crypto = require("crypto");

const saltRounds = 10;

exports.createAccessKey = () => {
  return crypto.randomBytes(10).toString("hex");
};

exports.createSecretKey = () => {
  return crypto.randomBytes(15).toString("hex");
};

exports.encryptKey = key => {
  return new Promise((res, rej) => {
    bcrypt.hash(key, saltRounds, (err, hash) => {
      if (err) {
        rej(err);
      }
      res(hash);
    });
  });
};
