var assert = require('assert')
  , Neti = require('../scraper/engines/neti.js')
  , cheerio = require('cheerio')
  , fs = require('fs')
  , async = require('async')
  , content = '';

var location = __dirname + '/mock-pages/neti-result.htm';
try {
  content = fs.readFileSync(location, 'ascii');
} catch(err) {
  console.err('Error reading file ' + location);
}

var neti = new Neti(cheerio, content);
neti.setKeyword('Eesti');

suite('neti.ee search engine', function() {
  test('Does test adding works', function() {
    assert.equal(true, true);
  });

  test('Make sure its the Neti object', function() {
    assert.equal(true, neti instanceof Neti);
  });

  test('is the scrape data loaded', function() {
    neti.scrape(function(result) {
      assert.equal(true, result.title.length > 0);
    });
  });

  test('result check based on mock page', function() {
    var results = [];
    neti.scrape(function(result) {
      results.push(result);
    });
    
    var mockObject = {
        title: 'Eesti Kirjandusmuuseum'
      , href: 'http://www.kirmus.ee/'
      , index: 0
    };

    assert.deepEqual(mockObject, results[0]);
  });

});