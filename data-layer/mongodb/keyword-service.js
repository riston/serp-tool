var db        = require(__dirname + '/config.js').db
  , keyword   = db.collection('keyword')
  , async     = require('async')
  , _         = require('underscore');

var KeywordService = {

  keywordResultLimit: 50,

  hasMatch: function(string, inString) {
    return inString.indexOf(string) != -1
  },

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

  groupStats: function(jobid, cb) {
    var _id = db.ObjectID.createFromHexString(jobid), self = this;

    db.collection('job').findById(jobid, function(err, job) {
      keyword.find({ job: job._id }).toArray(function(err, keywords) {
        if (err) cb(err);
        else {
          var dataSet = [];
          // Go through the all keyword objects
          async.forEach(keywords, function(keyword, cb) {
            job.match.forEach(function(group) {
              group.urls.forEach(function(url) {

                //results = keyword.results.slice(0, self.keywordResultLimit);
                results = keyword.results;
                var findResult = _.find(results, function(result) {
                  return self.hasMatch(url, result.href);
                });

                var keywordData = {
                  keyword:    keyword.keyword, 
                  engine:     keyword.source,
                  group:      group.name,
                  match:      url,
                  title:      findResult == undefined ? '' : findResult.title,
                  url:        findResult == undefined ? '' : findResult.href, 
                  position:   findResult == undefined ? self.keywordResultLimit : findResult.index
                };
                dataSet.push(keywordData);  
              });
            });
            cb(null, keyword);                      
          }, function(err) {
            return cb(null, dataSet);
          });
        }
      });  
    });
  },

  getJobKeywords: function(jobid, cb) {
    db.collection('job').findById(jobid, function(err, job) {
      if (err) return cb(err);
      else return cb(null, job.keywords);      
    });
  },

  getUniqueGroupNames: function(jobid, cb) {
    var _id = db.ObjectID.createFromHexString(jobid);
    db.collection('job').distinct("match.name", { _id: _id }, function(err, names) {
      if (err) return cb(err);
      else return cb(null, names);
    });
  },

  getGroupTotals: function(jobid, cb) {
    var self = this;
    self.groupStats(jobid, function(err, results) {
      self.getJobKeywords(jobid, function(err, keywords) {
        var groupedByEngine = _.groupBy(results, function(elem) {
          return elem.engine;
        });

        var newDataSet = {};
        Object.keys(groupedByEngine).forEach(function(engine) {
          if (newDataSet[engine] == undefined) newDataSet[engine] = {};
          newDataSet[engine].series = [];
          newDataSet[engine].categories = keywords;

          // Get the results grouped by group names
          var grouped = _.groupBy(groupedByEngine[engine], function(elem) {
            return elem.group;
          });
          Object.keys(grouped).forEach(function(group) {
            var item = { name: group, data: [] };
            // Go through all the keywords related to group
            keywords.forEach(function(keyword) {
              var filterByKeywords = _.filter(grouped[group], function(elem) {
                return elem.keyword == keyword;
              });
              filterByKeywords = _.pluck(filterByKeywords, 'position');

              var result = _.reduce(filterByKeywords, function(memo, result) {
                return memo + parseInt(result, 10);
              }, 0);
              item.data.push(result);
            });
            newDataSet[engine].series.push(item);
          });

        });
        return cb(null, newDataSet);
      });
    });
  },

  getGroupedByMatchSet: function(jobid, cb) {
    var self = this;

    self.getJobKeywords(jobid, function(err, keywords) {
      self.getUniqueGroupNames(jobid, function(err, names) {
        self.groupStats(jobid, function(err, result) {
          var uniqueKeywords = keywords;

          var totalKeywordPosition = function(groupName, keyword) {
            var findResults = _.filter(result, function(row) {
              return row.keyword == keyword && row.group == groupName;
            });

            findResults = _.pluck(findResults, 'position');
            return _.reduce(findResults, function(memo, result) {
              return memo + parseInt(result, 10);
            }, 0);
          };

          var resultSet = {};
          resultSet.categories = keywords;
          resultSet.series = [];

          names.forEach(function(name) {
            var object = { 
               'name': name
             , 'data': []
            };
            keywords.forEach(function(keyword) {
              object.data.push(totalKeywordPosition(name, keyword));
            });
            resultSet.series.push(object);
          });
          return cb(null, resultSet);
        });  
      });
    });
  },

  getGroupedByURL: function(jobid, cb) {
    var self = this;
    self.groupStats(jobid, function(err, results) {
      var groupedResults = _.groupBy(results, function(elem) { 
        return elem.match; 
      });

      var newDataSet = {};
      Object.keys(groupedResults).forEach(function(match) {
        var sortByEngineAndKeyword = _.sortBy(groupedResults[match], function(elem) {
            return elem.engine + elem.keyword;
        });
        var keywords = _.uniq(_.pluck(sortByEngineAndKeyword, 'keyword'));
        var engines = _.uniq(_.pluck(groupedResults[match], 'engine'));

        if (newDataSet[match] == undefined) newDataSet[match] = {};
        newDataSet[match]['categories']   = keywords;
        newDataSet[match]['group']        = groupedResults[match][0].group;
        newDataSet[match]['series']       = [];

        engines.forEach(function(engine) {
          var filteredByResults = _.filter(sortByEngineAndKeyword, function(element) {
            return element.engine == engine;
          });
          var positionData = _.map(_.pluck(filteredByResults, 'position'), function(elem) {
            return elem == self.keywordResultLimit ? 0 : elem;
          });
          var item = {
              name: engine
            , data: positionData
          };
          newDataSet[match]['series'].push(item);
        });
      });

      cb(null, newDataSet);
    });
  },

  /**
   * Same as the method getGroupedByURL but longer
   */
  totalStats: function(jobid, cb) {
    this.groupStats(jobid, function(err, result) {
      var dataSet = {}
        , newDataSet = {}
        , uniqueEngines = []
        , uniqueGroups = [];

      // Go through all the items
      result.forEach(function(item) {
        if (dataSet[item.match] == undefined)
          dataSet[item.match] = [];

        uniqueEngines.push(item.engine);
        uniqueGroups.push(item.group);

        dataSet[item.match].push({
            position:   item.position
          , stack:      item.group
          , match:      item.url
          , keyword:    item.keyword
          , engine:     item.engine
        });
      });

      uniqueEngines = _.uniq(uniqueEngines);
      uniqueGroups = _.uniq(uniqueGroups);

      // The mathcing url set
      Object.keys(dataSet).forEach(function(key) {

        var sortByEngineAndKeyword = _.sortBy(dataSet[key], function(elem) {
          return elem.engine + elem.keyword;
        });
        var keywords = _.uniq(_.pluck(sortByEngineAndKeyword, 'keyword'));

        if (newDataSet[key] == undefined) newDataSet[key] = {};
        newDataSet[key].categories = keywords;
        newDataSet[key].series = [];

        //console.log(key, sortByEngineAndKeyword);
        //console.log(keywords);
        
        // Order by the given keywords
        uniqueEngines.forEach(function(engine) {
          uniqueGroups.forEach(function(group) {
            var item = {};
            
            var results = _.filter(sortByEngineAndKeyword, function(element) {
              return element.engine == engine && element.stack == group;
            });

            item.stack    = group;
            results       = _.pluck(results, 'position');
            item.name     = engine;
            item.data     = results;
            
            //console.dir(item);
            newDataSet[key].series.push(item);
          });
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