"use strict";

var mysql = require("promise-mysql");
var info = require("../config.js");

//get categories
exports.getCategories = async () => {

  try {
    const connection = await mysql.createConnection(info.config);
    
    const sql = `SELECT * FROM category`;
    let results = await connection.query(sql);

    //increment through all results and put names to categories
    let categories = [];

    for(let i = 0; i < results.length; i++){
      categories.push(results[i].name);
    }
    await connection.end();
    console.log(categories);
    return categories;

  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

};

//get user paginated recipes with parameters
exports.getUserPaginatedRecipes = async (page, category, title) => {

  let limit = 8;
  
  //adding % to strings for SQL
  title = "%" + title + "%";

  category = "%" + category + "%";
  //if we have a category provided, we get it's id from a different DB table
  if (category === "%%") category = "";
  else {
    try {
      //connect to DB
      const connection = await mysql.createConnection(info.config);

      //SQL query
      const sql = `SELECT id FROM category WHERE name LIKE ?`;
      let categoryID = await connection.query(sql, category);

      //assign result values to users variable
      category = [];
      for (var i = 0; i < categoryID.length; i++) {
        category.push(categoryID[i].id);
      }

      await connection.end();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }


  const startIndex = (page - 1) * limit; //this is OFFSET for SQL statement
  
  let paginatedResults = {};

  let users = [];

  //if we have a user provided, we get it's id from a different DB table
  if (title === "%%") title = "";
  else {
    try {
      const connection = await mysql.createConnection(info.config);
      
      const sql = `SELECT id FROM users WHERE username LIKE ?`;
      let userID = await connection.query(sql, title);
      
      for (var i = 0; i < userID.length; i++) {
        users.push(userID[i].id);
      }

      console.log("user ids: ", users);

      await connection.end();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }


  //get the number of pages
  try {
    const connection = await mysql.createConnection(info.config);

    let pages;

    //could not find solutions on how to form a query with an IN operator that has no values, used this instead
    if (title === "" && category === "") {
      pages = await connection.query(
        `SELECT * FROM recipe ORDER BY id DESC`
      );
    } else if (title === "" && category !== "") {
      pages = await connection.query(
        `SELECT * FROM recipe WHERE categoryid IN(?) ORDER BY id DESC`,
        [category]
      );
    } else if (title !== "" && category === "") {
      pages = await connection.query(
        `SELECT * FROM recipe WHERE authorid IN(?) ORDER BY id DESC`,
        [users]
      );
    } else {
      pages = await connection.query(
        `SELECT * FROM recipe WHERE categoryid IN(?) AND authorid IN(?) ORDER BY id DESC`,
        [category, users]
      );
    }

    pages = Math.ceil(pages.length / 8);
    console.log("number of pages: ", pages);
    await connection.end();

    paginatedResults.pageCount = pages;

  } catch (error) {
    console.log(error);
    throw new Error(error);
  }


  //get the recipes. Same code as 'get the number of pages' except with limit and offset added to SQL queries
  try {
    const connection = await mysql.createConnection(info.config);

    let queryResults;

    //could not find solutions on how to form a query with an IN operator that has no values, used this instead
    if (title === "" && category === "") {
      queryResults = await connection.query(
        `SELECT * FROM recipe ORDER BY id DESC LIMIT ? OFFSET ?`,
        [limit, startIndex]
      );
    } else if (title === "" && category !== "") {
      queryResults = await connection.query(
        `SELECT * FROM recipe WHERE categoryid IN(?) ORDER BY id DESC LIMIT ? OFFSET ?`,
        [category, limit, startIndex]
      );
    } else if (title !== "" && category === "") {
      queryResults = await connection.query(
        `SELECT * FROM recipe WHERE authorid IN(?) ORDER BY id DESC LIMIT ? OFFSET ?`,
        [users, limit, startIndex]
      );
    } else {
      queryResults = await connection.query(
        `SELECT * FROM recipe WHERE categoryid IN(?) AND authorid IN(?) ORDER BY id DESC LIMIT ? OFFSET ?`,
        [category, users, limit, startIndex]
      );
    }

    await connection.end();

    paginatedResults.recipes = queryResults;
    //console.log(paginatedResults);
    return paginatedResults;
  } catch (error) {
      console.log(error);
      throw new Error(error);
  }

}

//get paginated recipes with parameters
exports.getPaginatedRecipes = async (page, category, title) => {
  
  
  let limit = 8;
  
  //adding % to strings for SQL
  title = "%" + title + "%";

  category = "%" + category + "%";
  //if we have a category provided, we get it's id from a different DB table
  if (category === "%%") category = "";
  else {
    try {
      //connect to DB
      const connection = await mysql.createConnection(info.config);

      //SQL query
      const sql = `SELECT id FROM category WHERE name LIKE ?`;
      let categoryID = await connection.query(sql, category);

      //assign result values to users variable
      category = [];
      for (var i = 0; i < categoryID.length; i++) {
        category.push(categoryID[i].id);
      }

      await connection.end();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }


  const startIndex = (page - 1) * limit; //this is OFFSET for SQL statement
  
  let paginatedResults = {};


  if (title === "%%") title = "%";

  //get the number of pages
  try {
    const connection = await mysql.createConnection(info.config);

    let pages;

    //could not find solutions on how to form a query with an IN operator that has no values, used this instead
    if (category === "") {
      pages = await connection.query(
        `SELECT * FROM recipe WHERE title LIKE ? ORDER BY id DESC`,
        [title]
      );
    } else {
      pages = await connection.query(
        `SELECT * FROM recipe WHERE categoryid IN(?) AND title LIKE ? ORDER BY id DESC`,
        [category, title]
      );
    }

    pages = Math.ceil(pages.length / 8);

    await connection.end();

    paginatedResults.pageCount = pages;
    //console.log(paginatedResults);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }


  //get the recipes. Same code as 'get the number of pages' except with limit and offset added to SQL queries
  try {
    const connection = await mysql.createConnection(info.config);

    let queryResults;

    //could not find solutions on how to form a query with an IN operator that has no values, used this instead
    if (category === "") {
      queryResults = await connection.query(
        `SELECT * FROM recipe WHERE title LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?`,
        [title, limit, startIndex]
      );
    } else {
      queryResults = await connection.query(
        `SELECT * FROM recipe WHERE categoryid IN(?) AND title LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?`,
        [category, title, limit, startIndex]
      );
    }

    await connection.end();

    paginatedResults.recipes = queryResults;
    //console.log(paginatedResults);
    return paginatedResults;
  } catch (error) {
      console.log(error);
      throw new Error(error);
  }

};

//get latest paginated recipes
exports.getLatestPaginatedRecipes = async (page) => {
  
  let limit = 8;

  //set variables
  const startIndex = (page - 1) * limit;
  let paginatedResults = {};


  //get number of pages
  try {
    const connection = await mysql.createConnection(info.config);

    let pages = await connection.query(
      `SELECT * FROM recipe ORDER BY id DESC`
    );

    pages = Math.ceil(pages.length / 8);

    await connection.end();

    paginatedResults.pageCount = pages;
    //console.log(paginatedResults);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }


  //get latest recipes with limit and offset
  try {
    const connection = await mysql.createConnection(info.config);

    let queryResults = await connection.query(
      `SELECT * FROM recipe ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, startIndex]
    );

    await connection.end();

    paginatedResults.recipes = queryResults;
    //console.log(paginatedResults);
    return paginatedResults;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};