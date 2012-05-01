var util        = require('util')
  , async       = require('async')
  , qs          = require('querystring')
  , sanitize    = require('validator').sanitize
  , MainSearchEngine = require(__dirname + '/main-searchengine.js');

function Google(cheerio, htmlContent) {
  this.baseUrl = 'http://www.google.ee/search?';
  this.htmlContent = htmlContent;
  this.cheerio = cheerio;

  this.baseIndex = 0;
  this.resultPageStep = 10;
}

Google.prototype.setKeyword = function(keyword) {
  // Google replaces all the spaces with +
  this.keyword = keyword.replace(' ', '+');
}

Google.prototype.getUrl = function(index) {
  this.baseIndex = parseInt(index, 10) * this.resultPageStep;
  this.scrapeUrl = this.baseUrl + qs.stringify({ 
      q: this.keyword
    , start: this.baseIndex
  });
  this.baseIndex += index;

  return this.scrapeUrl;
};

Google.prototype.scrape = function(cb) {
  var $ = this.cheerio.load(this.htmlContent, { ignoreWhitespace: true })
    , found = $('h3.r')
    , self = this
    , results = [];

    function process(element, callback) {
      var href = $(element).find('a').attr('href'), result = {};
      result = {
          title: sanitize($(element).text()).entityDecode().trim()
        , href: href.split(';')[0].replace('/url?q=', '').replace('&amp', '')
      }
      results.push(result);
      return callback(null, result);
    }

    async.forEachSeries(found, process, function(err) {
      cb(err, results);
    });
}

module.exports = Google;