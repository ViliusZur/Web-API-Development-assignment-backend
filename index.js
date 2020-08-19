"use strict";

var Koa = require("koa");
var passport = require("koa-passport");
const cors = require("@koa/cors");
const mount = require('koa-mount');
const serve = require('koa-static');

var app = new Koa();

require("./auth.js");
app.use(passport.initialize());
app.use(cors());
app.use(mount('/public', serve('./public')));

//import all routes
var users = require("./routes/users.js");
var register = require("./routes/register.js");
var login = require("./routes/login.js");
var getRecipes = require("./routes/getRecipes.js");
var upload = require("./routes/upload.js");
var recipesAPI = require("./routes/recipesAPI");

app.use(users.routes());
app.use(register.routes());
app.use(login.routes());
app.use(getRecipes.routes());
app.use(upload.routes());
app.use(recipesAPI.routes());

var port = process.env.PORT || 3300;
app.listen(port);
