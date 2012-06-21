var db          = require(__dirname + '/config.js').db;

var UtilService = {

  /**
   * Ping utility for database connection check.
   */
  ping: function(cb) {
    db.command( { ping: 1 }, function(err, result) {
      if (err) return cb(err);
      else return cb(null, result);
    })
  }
}

exports.UtilService = UtilService;