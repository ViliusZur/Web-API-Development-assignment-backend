'use strict';

const mysql = require('promise-mysql');
var info = require("../config.js");
const fs = require('fs-extra');
const mime = require('mime-types');

exports.uploadMainImage = async (path, mimeType, recipeID) => {
    try{
        const connection = await mysql.createConnection(info.config);
        // grab extension and create a new file in public/recipeImages/mainImages
        const extension = mime.extension(mimeType);
        await fs.copy(path, `public/recipeImages/mainImages/${recipeID}.${extension}`);

        const sql = `UPDATE recipe SET mainImageUrl = '${recipeID}.${extension}' WHERE id = ${recipeID}`;
        await connection.query(sql);
        await connection.end();

        return;
    } catch(error) {
        throw error;
    }
};

exports.uploadRecipeImage = async (path, mimeType, recipeID, order) => {
    try{
        const connection = await mysql.createConnection(info.config);
        // grab extension and create a new file in public/recipeImages/recipeImages
        const extension = mime.extension(mimeType);
        await fs.copy(path, `public/recipeImages/recipeImages/${recipeID}-${order}.${extension}`);

        const sql = `INSERT INTO recipeImages (url, orderInRecipe, recipeid)
                        VALUES ('${recipeID}-${order}.${extension}', ${order}, ${recipeID})`;
        await connection.query(sql);
        await connection.end();

        const message = { message: "successfully uploaded an image" };
        return message;
    } catch(error) {
        throw error;
    }
};

exports.uploadStepsImage = async (path, mimeType, recipeID, order) => {
    try{
        const connection = await mysql.createConnection(info.config);
        // grab extension and create a new file in public/recipeImages/stepsImages
        const extension = mime.extension(mimeType);
        await fs.copy(path, `public/recipeImages/stepsImages/${recipeID}-${order}.${extension}`);

        const sql = `INSERT INTO stepsImages (url, orderInSteps, recipeid)
                        VALUES ('${recipeID}-${order}.${extension}', ${order}, ${recipeID})`;
        await connection.query(sql);
        await connection.end();

        return;
    } catch(error) {
        throw error;
    }
};

exports.getMainImageUrl = async (id) => {
    try{
        const connection = await mysql.createConnection(info.config);
        const sql = `SELECT mainImageUrl FROM recipe WHERE id = ${id}`;
        let imageUrl = await connection.query(sql);
        await connection.end();
        imageUrl = imageUrl[0].mainImageUrl;
        
        return imageUrl;
    } catch(error) {
        throw error;
    }
};
