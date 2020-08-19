const passport = require("koa-passport");
const BasicStrategy = require("passport-http").BasicStrategy;

const User = require("./models/login");

//implement the basic auth strategy
passport.use(
  new BasicStrategy(
    //function that receives email and password from the header
    function(username, password, done) {
      User.findUser({ username: username, password: password }, function(
        err,
        user
      ) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);
