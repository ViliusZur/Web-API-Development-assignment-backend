"use strict";

var mysql = require("promise-mysql");
var info = require("../config.js");
var bcrypt = require("bcrypt");

//finds a user in DB
exports.findUser = async (authData, callback) => {
  try {
    const connection = await mysql.createConnection(info.config);

    //ask wheather to use ? and provide in mysql.query or \'${authData.email}\'
    let sql = `SELECT * FROM users WHERE username = \'${authData.username}\'`;
    let data = await connection.query(sql);

    await connection.end();

    if (data.length > 0) {
      //check if the hashed passwords match
      let pass = bcrypt.compareSync(authData.password, data[0].password);

      //if yes callback with the user data
      if (pass) callback(null, data[0]);
      //otherwise callback with false
      else callback(null, false);
    } else {
      //no such email was found
      callback(null, false);
    }
  } catch (error) {
    if (error.status === undefined) error.status = 500;
    //if an error occured please log it and throw an exception
    callback(error);
  }
};
