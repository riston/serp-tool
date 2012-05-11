exports.user = require('./user');
exports.serp = require('./serp');

exports.index = function(req, res){
  if (req.session.user) {
    res.redirect('/serp');
  } else {
    // Display page only not logged in users
    res.render('index', { 
        title: 'Express' 
      , registerErrors: req.session.registerErrors
    })
  }
};

exports.isUser = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next(new Error('You must login to access this page'));
  }
};