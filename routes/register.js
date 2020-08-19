"use strict";

var Router = require("koa-router");
var registerModel = require("../models/register.js");
var bodyParser = require("koa-bodyparser");
var validator = require("email-validator");

var router = Router({
  prefix: "/register"
});

router.post("/", bodyParser(), async (ctx, next) => {
  
  let newUser = {
    name: ctx.request.body.values.username,
    email: ctx.request.body.values.email,
    password: ctx.request.body.values.password
  };
  
  //prevent server crash if fields are undefined
  if (newUser.name === "" || newUser.email === "" || newUser.password === "") {
    ctx.body = { message: "Please provide all fields." };
  } else {
    //check if user already exists
    let exists = await registerModel.checkUser(newUser.name, newUser.email);

    if (exists.length) {
      ctx.body = { message: "User already exists." };
    } else {
      //check if email is valid
      console.log(newUser)
      if (validator.validate(newUser.email) === true) {
        await registerModel.registerUser(
          newUser.name,
          newUser.email,
          newUser.password
        );
        ctx.body = { message: "user registered successfully." };
      } else {
        ctx.body = { message: "Unvalid email." };
      }
    }
  }
});

module.exports = router;
