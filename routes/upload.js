"use strict";

var Router = require("koa-router");
var koaBody = require("koa-body")({ multipart: true });
var send = require('koa-send');
var upload = require("../models/upload.js");

var router = Router({
  prefix: "/upload"
});

// handle all the image uploading here
router.post("/", koaBody, async ctx => {
    
    const body = ctx.request.body;
    const {path, type} = ctx.request.files.file;

    if(body.image === 'main') ctx.body = await upload.uploadMainImage(path, type, body.recipeID);
    else if(body.image === 'recipe') ctx.body = await upload.uploadRecipeImage(path, type, body.recipeID, order);
    else if(body.image === 'steps') ctx.body = await upload.uploadStepsImage(path, type, body.recipeID, order);
    else ctx.body = {message:"bad image type selected"};     
    
});

module.exports = router;
