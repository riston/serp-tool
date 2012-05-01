var db          = require(__dirname + '/config.js').db
  , crypto      = require('crypto');

var salt = 'rtAsfgh';

var getPasswordHash = function(password) {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

var UserService = {
  newUser: function(data, cb) {
    // Crypt database before insertion 
    data['password'] = getPasswordHash(data.password);
    data['joined'] = new Date();

    db.collection('user').insert(data, function(err, user) {
      if (err) cb(err);
      else {
        cb(null, user);
      }
    });
  },

  checkUser: function(data, cb) {
    data['password'] = getPasswordHash(data.password);
    
    db.collection('user').findOne({ email: data.email, password: data.password }, function(err, user) {
      if (err) cb(err)
      else {
        cb(null, user);
      }
    });    
  },

  findByEmail: function(userEmail, cb) {
    db.collection('user').findOne({ email: userEmail }, function(err, user) {
      if (err) cb(err)
      else {
        cb(null, user);
      }
    });
  },

  findAll: function(cb) {
    db.collection('user').find().toArray(function(err, users) {
      if (err) cb(err);
      else {
        cb(null, users);
      }
    });
  }
}

exports.UserService = UserService;