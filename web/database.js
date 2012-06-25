var basePath = __dirname + '/../data-layer/mongodb/';

var DB = {
	user: 		require(basePath + 'user-service.js').UserService
  , job: 		require(basePath + 'job-service.js').JobService
  , keyword: 	require(basePath + 'keyword-service.js').KeywordService
  , util: 		require(basePath + 'util-service.js').UtilService
};

module.exports = DB;