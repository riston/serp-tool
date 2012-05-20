var request     = require('request')
  , _           = require('underscore')
  , util        = require('util')
  , cheerio     = require('cheerio')
  , events      = require('events')
  , qs          = require('querystring')
  , sanitize    = require('validator').sanitize
  , async       = require('async')
  , db          = require(__dirname + '/../web/database.js')
  , Google      = require(__dirname + '/engines/google.js')
  , Neti        = require(__dirname + '/engines/neti.js');

var user_agents = [
  'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
  'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 6.0)',
  'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13',
  'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-GB; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6',
  'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)',
  'Opera/9.20 (Windows NT 6.0; U; en)',
  'Mozilla/5.0 (Windows; U; Windows NT 6.1; ru; rv:1.9.2) Gecko/20100115 Firefox/3.6',
  'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; MS-RTC LM 8)',
  'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/6.0',
  'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_7; en-us) AppleWebKit/533.4 (KHTML, like Gecko) Version/4.1 Safari/533.4',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_6) AppleWebKit/534.22 (KHTML, like Gecko) Chrome/11.0.683.0 Safari/534.22'
];

function Scrape(options) {
  this.searchEngine = this.getSearchEngine(options.source);
  this.keyword = options.keyword;
  this.keywordId = options.keywordId;
  this.index = 0;

  // How many request will be looked through
  this.pageSet = 5;
  this.setRandomUserAgent();
  events.EventEmitter.call(this);
}
util.inherits(Scrape, events.EventEmitter);

Scrape.prototype.setRandomUserAgent = function() {
  this.currentBrowser = user_agents[parseInt(Math.random() * user_agents.length, 10)];  
}

Scrape.prototype.setIndex = function(index) {
  this.index = index;
}

Scrape.prototype.getSite = function(callback) {
  this.searchEngine.setKeyword(this.keyword);
  var options = {
      url: this.searchEngine.getUrl(this.index)
      , headers: {
        'User-Agent': this.currentBrowser
      }
    } 
    , self = this;

  request(options, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      self.searchEngine.htmlContent = body;
      self.searchEngine.scrape(function(err, result) {
        return callback(err, result);
      });
    } else {
      return callback(err);
    }
  }); 
}

Scrape.prototype.getSearchEngine = function(name) {
  var current = null;
  switch (name) {
    case 'google': 
      current = new Google(cheerio, '');
    break;

    case 'neti.ee':
      current = new Neti(cheerio, '');
    break;

    default:
  }

  return current;
}


Scrape.prototype.generatePageFunctions = function() {
  var functionList = new Array(), self = this;

  for (var i = 0; i < this.pageSet; i++) {
    // Isolate the variable i or the var i will be last value
    (function(i) {
      functionList.push(function(cb) {
        // Inner functions which will be called in seriers
        var timeoutTime = parseInt(Math.random() * 5000 + 1000, 10);

        setTimeout(function() {
          self.setIndex(i);
          self.getSite(function(err, result) {
            // Async callback to pass the data
            cb(err, result);
          });
        }, timeoutTime);

      });
    })(i);
  }
  return functionList;
}

Scrape.prototype.run = function(cb) {
  var functionList = this.generatePageFunctions()
    self = this;
  
  async.series(functionList, function(err, results) {
    var index = 1
      , flattenResults = _.flatten(results)
      , indexResults = _.map(flattenResults, function(result) {
          console.log(result);
          if (result !== undefined) {
            result.index = index++;
            return result;  
          }
        });
      
    cb(null, indexResults);
  });
}

module.exports = Scrape;