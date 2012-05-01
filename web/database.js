var basePath = __dirname + '/../data-layer/mongodb/';

var DB = {
	user: require(basePath + 'user-service.js').UserService
  , job: require(basePath + 'job-service.js').JobService
  , keyword: require(basePath + 'keyword-service.js').KeywordService
};

module.exports = DB;