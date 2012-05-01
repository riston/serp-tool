var qs          = require('querystring')
  , util        = require('util')
  , async       = require('async')
  , sanitize    = require('validator').sanitize;

function MainSearchEngine(cheerio, htmlContent) {
  this.baseUrl = 'http://www.main.ee/search?';
  this.scrapeUrl = '';
  this.keyword = '';

  this.htmlContent = htmlContent;
  this.cheerio = cheerio;
  this.baseIndex = 0;
  this.resultPageStep = 10;
}

MainSearchEngine.prototype.setKeyword = function(keyword) {
  // Google replaces all the spaces with +
  this.keyword = keyword.replace(' ', '+');
}

MainSearchEngine.prototype.getUrl = function(index) {
  this.baseIndex = parseInt(index, 10) * this.resultPageStep;
  this.scrapeUrl = this.baseUrl + qs.stringify({ 
      q: this.keyword
    , start: this.baseIndex
  });
  this.baseIndex += index;

  return this.scrapeUrl;
}

MainSearchEngine.prototype.scrape = function(cb) {
  return cb(new Error(), null);
}

module.exports = MainSearchEngine;