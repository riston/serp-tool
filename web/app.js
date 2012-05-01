
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , expressValidator = require('express-validator')
  , DB = require(__dirname + '/database.js')
  , moment = require('moment');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(expressValidator);
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'TwasdsafeAD' }));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.helpers({
  moment: moment
});

app.dynamicHelpers({
  user: function(req, res) {
    return req.session.user;
  },
  flash: function(req, res) {
    return req.flash();
  }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

// User related routes
app.get('/user/logout', routes.user.logout);
app.post('/user/login', routes.user.login);
app.post('/user/register', routes.user.register);

// Serp tool related routes
app.param('jobid', routes.serp.checkJobId);

app.get('/serp', routes.isUser, routes.serp.index);
app.get('/serp/new', routes.isUser, routes.serp.new);
app.get('/serp/stats', routes.isUser, routes.serp.stats);

app.get('/serp/delete/:jobid', routes.isUser, routes.serp.delete);
app.get('/serp/edit/:jobid', routes.isUser, routes.serp.edit);
app.get('/serp/view/:jobid', routes.isUser, routes.serp.view);
app.get('/serp/stats/:jobid', routes.isUser, routes.serp.jobStats);
app.get('/serp/stats/overall/:jobid', routes.isUser, routes.serp.jobOverallStats);

app.post('/serp/edit', routes.isUser, routes.serp.doEdit);
app.post('/serp/add-job', routes.isUser, routes.serp.addJob);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
