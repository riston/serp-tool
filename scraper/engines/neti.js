var util        = require('util')
  , async       = require('async')
  , qs          = require('querystring')
  , sanitize    = require('validator').sanitize
  , MainSearchEngine = require(__dirname + '/main-searchengine.js');

function Neti(cheerio, htmlContent) {
  this.baseUrl = 'http://www.neti.ee/cgi-bin/otsing?';
  this.htmlContent = htmlContent;
  this.cheerio = cheerio;

  this.baseIndex = 0;
  this.resultPageStep = 20;
}

Neti.prototype.setKeyword = function(keyword) {
  // Google replaces all the spaces with +
  this.keyword = keyword.replace(' ', '+');
}

Neti.prototype.getUrl = function(index) {
  this.baseIndex = parseInt(index, 10) * this.resultPageStep;
  this.scrapeUrl = this.baseUrl + qs.stringify({ 
      query: this.keyword
    , src: 'web'
    , alates: this.baseIndex
  });
  this.baseIndex += index;

  return this.scrapeUrl;
};

Neti.prototype.scrape = function(cb) {
  var $ = this.cheerio.load(this.htmlContent, { ignoreWhitespace: true })
    , found = $('h3.inline-block')
    , self = this
    , results = [];

  function process(element, callback) {
    var href = $(element).find('a'), result = {};
    if (href.attr('title') != undefined) {
      result = {
          title: sanitize(href.attr('title')).entityDecode().trim()
        , href: href.attr('href')
      }
      results.push(result);
      return callback(null, result);
    }
    return callback(null, null);    
  }

  async.forEachSeries(found, process, function(err) {
    cb(err, results);
  });
}

module.exports = Neti;