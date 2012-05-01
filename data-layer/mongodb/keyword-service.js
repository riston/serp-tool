var db        = require(__dirname + '/config.js').db
  , keyword   = db.collection('keyword')
  , async     = require('async')
  , util      = require('util')
  , _         = require('underscore');

var KeywordService = {

  addResult: function(keywordId, result, cb) {
    keyword.update({ _id: keywordId }, { $set: { results: result } }, function(err) {
      if (err) cb(err);
      else cb(null);
    });
  },

  add: function(keywordObject, cb) {
    keywordObject.start = new Date();
    keywordObject.results = [];

    keyword.insert(keywordObject, function(err, result) {
      if (err) cb(err);
      else cb(null, result);      
    });
  },

  stats: function(jobid, cb) {
    var _id = db.ObjectID.createFromHexString(jobid);

    db.collection('job').findById(jobid, function(err, job) {
      keyword.find({ job: job._id }).toArray(function(err, keywords) {
        if (err) cb(err);
        else {
          var dataSet = [];
          // Go through the all keyword objects
          async.forEach(keywords, function(keyword, cb) {
            job.urls.forEach(function(url) {

              var findResult = _.find(keyword.results, function(result) {
                return result.href.match(url)
              });
              var keywordData = {
                keyword:    keyword.keyword, 
                engine:     keyword.source, 
                match:      url,
                url:        findResult == undefined ? '' : findResult.href, 
                position:   findResult == undefined ? 0 : findResult.index

              };
              dataSet.push(keywordData);  
              
            });
            cb(null, keyword);                      
          }, function(err) {
            return cb(null, dataSet);
          });
        }
      });  
    });
  },

  totalStats: function(jobid, cb) {
    this.stats(jobid, function(err, result) {
      var dataSet = {}
        , newDataSet = {}
        , uniqueEngines = [];

      result.forEach(function(item) {
        if (dataSet[item.match] == undefined)
          dataSet[item.match] = [];

        uniqueEngines.push(item.engine);
        dataSet[item.match].push({
            keyword:    item.keyword
          , engine:     item.engine
          , position:   item.position
        });
      });

      uniqueEngines = _.uniq(uniqueEngines);
      Object.keys(dataSet).forEach(function(key) {
        if (newDataSet[key] == undefined) newDataSet[key] = {};
        newDataSet[key].categories = _.uniq(_.pluck(dataSet[key], 'keyword'));
        newDataSet[key].series = [];
        
        uniqueEngines.forEach(function(engine) {
          var item = {};
          var results = _.filter(dataSet[key], function(element) {
            return element.engine == engine;
          });
          results = _.pluck(results, 'position');
          item.name = engine;
          item.data = results;
          newDataSet[key].series.push(item);
        });
      });
      
      cb(null, newDataSet);
    });

  },

  groupByMatch: function(jobid, cb) {
    this.totalStats(jobid, function(err, result) {
      if (err) return cb(err);

      var stackBy = Object.keys(result)
        , dataSet = {};

      // Set the keywords
      dataSet.categories = result[stackBy[0]].categories;
      dataSet.series = [];
      stackBy.forEach(function(stack) {
        result[stack].series.forEach(function(seria) {
          var item = {};
          item = {
              name: seria.name + ' - ' + stack
            , data: seria.data
            , stack: stack
          };
          dataSet.series.push(item);
        });
      });
      return cb(null, dataSet);
    });
  }
};

exports.KeywordService = KeywordService;