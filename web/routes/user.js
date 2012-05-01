var util = require('util')
  , DB = require(__dirname + '/../database.js');

exports.register = function(req, res) {
  assertRegister(req);

  var registerErrors = req.validationErrors(true);
  if (registerErrors) {
    req.flash('error', 'Check the registration form again!');
    req.session.registerErrors = registerErrors;
    res.redirect('/');
  } else {
    // Insert into database
    req.session.registerErrors = {};
    
    var data = {
        email: req.param('email')
      , password: req.param('password')
    }
    DB.user.findByEmail(data.email, function(err, user) {
      if (user) {
        req.flash('error', 'This e-mail has already registred!');
        res.redirect('/');
      } else {
        DB.user.newUser(data, function(err, result) {
          if (!err) {
            req.flash('success', 'Registration successful, login now in!');
            res.redirect('/');
          }
        });
      }
    });
  }
}

exports.login = function(req, res){
  assertLogin(req);

  var loginErrors = req.validationErrors(true);
  if (loginErrors) {
    req.flash('error', 'Check the login form again!');
    req.session.loginErrors = loginErrors;
    res.redirect('/');
  } else {
    // Insert into database
    req.session.loginErrors = {};
    var data = {
        email: req.param('email')
      , password: req.param('password')
    };
    DB.user.checkUser(data, function(err, user) {
      if (!err && user) {
        req.flash('success', 'You are now logged in, welcome!');
        delete user['password'];
        req.session.user = user;
        res.redirect('/serp');
      } else {
        req.flash('error', 'E-mail/password is wrong login failed!');
        res.redirect('/');
      }
    });

  }
};

exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};

var assertRegister = function(req) {
  req.assert('email', 'Check the email format again!').isEmail();
  req.assert('password', 'The password should consist only of a-z A-Z 0-9').is(/^[a-zA-Z0-9]+$/);
  req.assert('password', 'Password length must be longer than 6 letters').min(6);
  req.assert('password2x', 'Repeated password does not match').equals(req.body.password);

  var fields = ['email', 'password', 'password2x'];
  fields.forEach(function(field) {
    req.assert(field, 'The field ' + field + ' should not be empty!').notEmpty();
  });
};

var assertLogin = function(req) {
  var fields = ['email', 'password'];
  fields.forEach(function(field) {
    req.assert(field, 'The field ' + field + ' should not be empty!').notEmpty();
  });
};
