var mongo = require('mongoskin');

exports.mongoskin = mongo;
exports.db = mongo.db('localhost:27017/serptool');