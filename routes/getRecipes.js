"use strict";

var Router = require("koa-router");
var getRecipes = require("../models/getRecipes.js");

var router = Router({
  prefix: "/recipes"
});

router.get("/categories", async (ctx, next) => {

  ctx.body = await getRecipes.getCategories();

});

router.get("/", async (ctx, next) => {
    
  const page = parseInt(ctx.request.query.page);  
  const category = ctx.request.query.category;
  const selected = ctx.request.query.selected;
  const title = ctx.request.query.title;

  if(selected === 'users') ctx.body = await getRecipes.getUserPaginatedRecipes(page, category, title);
  else                     ctx.body = await getRecipes.getPaginatedRecipes(page, category, title);
    
});

router.get("/latest", async (ctx, next) => {

  const page = parseInt(ctx.request.query.page);

  ctx.body = await getRecipes.getLatestPaginatedRecipes(page);
  
});

module.exports = router;
