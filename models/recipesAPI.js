'use strict'

var mysql = require("promise-mysql");
var connectionInfo = require("../config.js");


exports.getRecipe = async (recipeId) => {
    try {
        const connection = await mysql.createConnection(connectionInfo.config)

        const sql = 'SELECT * FROM recipe WHERE id = ?'
        let recipeData = await connection.query(sql, recipeId)

        await connection.end

        return recipeData

    } catch (error) {
        console.log(error)
        throw new Error(error)
    } 
}

exports.insertRecipe = async (title, subtitle, description, categoryid, authorid, mainImageUrl) => {
    try {
        const connection = await mysql.createConnection(connectionInfo.config)

        const sql = 'INSERT INTO recipe (title, subtitle, description, categoryid, authorid, mainImageUrl) VALUES (?, ?, ?, ?, ?, ?)'
        let values = [title, subtitle, description, categoryid, authorid, mainImageUrl]
        await connection.query(sql, values)
        await connection.end
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

exports.deleteRecipe = async (recipeId) => {
    try {
        const connection = await mysql.createConnection(connectionInfo.config)

        const sql = 'DELETE FROM recipe WHERE id = ?'
        await connection.query(sql, recipeId)
        await connection.end
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

exports.editRecipe = async (recipeid, title, subtitle, description, categoryid, mainImageUrl) => {
    try {
        const connection = await mysql.createConnection(connectionInfo.config)

        const sql = 'UPDATE recipe SET title = ?, subtitle = ?, description = ?, categoryid = ?, mainimageurl = ? WHERE id = ?'
        let values = [title, subtitle, description, categoryid, mainImageUrl, recipeid]

        await connection.query(sql, values)
        await connection.end
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}