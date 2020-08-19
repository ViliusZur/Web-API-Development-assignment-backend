"use strict";

var mysql = require("promise-mysql");
var info = require("../config.js");
var bcrypt = require("bcrypt");

//check if user exists in DB
exports.checkUser = async (username, email) => {
  try {
    //connect to DB
    const connection = await mysql.createConnection(info.config);

    let sql = `SELECT username FROM users WHERE username LIKE ? OR email LIKE ?`;

    let data = await connection.query(sql, [username, email]);
    await connection.end();

    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

//register a user to DB
exports.registerUser = async (username, email, password) => {
  try {
    const connection = await mysql.createConnection(info.config);

    let sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    let values = [username, email, hashedPassword];

    await connection.query(sql, values);
    await connection.end();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
