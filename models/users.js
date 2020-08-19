"use strict";

// This is to connect to DB
var mysql = require("promise-mysql");
var info = require("../config.js");

//get all usernames from DB
exports.getAllUsers = async () => {
  try {
    //connect to DB
    const connection = await mysql.createConnection(info.config);

    //this is the SQL statement to execute
    let sql = `SELECT username FROM users`;
    let data = await connection.query(sql);

    //close the connection to DB
    await connection.end();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
