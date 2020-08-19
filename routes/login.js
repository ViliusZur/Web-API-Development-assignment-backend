"use strict";

var Router = require("koa-router");
var passport = require("koa-passport");
//var loginModel = require('../models/login.js');
//var bodyParser = require('koa-bodyparser');
//var bcrypt = require('bcrypt');

var router = Router({
  prefix: "/login"
});

router.post("/", async (ctx, next) => {
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
    } else ctx.body = { message: "Logged in successfully" };
  })(ctx);
});

module.exports = router;
