'use strict'

var Router = require ('koa-router')
var recipesAPI = require("../models/recipesAPI")

var router = Router({
    prefix: "/api/v1.0/recipes"
})

router.get("/", async (ctx, next) => {
    ctx.body = await recipesAPI.getRecipe(ctx.request.query.id)
})

router.post("/", async (ctx, next) => {
    await recipesAPI.insertRecipe(ctx.request.query.title, ctx.request.query.subtitle, ctx.request.query.description, ctx.request.query.categoryid, ctx.request.query.authorid, ctx.request.query.mainimageurl);
    ctx.body = "Post sucessful"
})

router.delete("/", async (ctx, next) => {
    await recipesAPI.deleteRecipe(ctx.request.query.recipeid)
    ctx.body = "Deletion sucessful"
})

router.put("/", async (ctx, next) => {
    await recipesAPI.editRecipe(ctx.request.query.recipeid, ctx.request.query.title, ctx.request.query.subtitle, ctx.request.query.description, ctx.request.query.categoryid, ctx.request.query.mainimageurl)
    ctx.body = "Edit sucessful"
})

module.exports = router;