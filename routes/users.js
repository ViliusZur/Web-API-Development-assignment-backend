"use strict";

var Router = require("koa-router");
var passport = require("koa-passport");
var usersModel = require("../models/users.js");

var router = Router({
  prefix: "/users"
});

router.get("/", async (ctx, next) => {
  //to protect the resource, only authenticated users can access it
  return passport.authenticate("basic", async function(
    err,
    user,
    info,
    status
  ) {
    if (err) ctx.body = err;
    else if (user === false) {
      ctx.body = { success: false };
      ctx.throw(401);
    } else ctx.body = await usersModel.getAllUsers();
  })(ctx);
});

module.exports = router;