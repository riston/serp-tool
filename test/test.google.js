var assert = require('assert')
  , Google = require('../scraper/engines/google.js')
  , cheerio = require('cheerio')
  , fs = require('fs')
  , async = require('async')
  , content = '';

var location = __dirname + '/mock-pages/google-result.htm';
try {
  content = fs.readFileSync(location, 'ascii');
} catch(err) {
  console.err('Error reading file ' + location);
}

var google = new Google(cheerio, content);

suite('google search engine', function() {
  test('Does test adding works', function() {
    assert.equal(true, true);
  });

  test('Create the google object', function() {
    assert.equal(true, google instanceof Google);
  });

  test('Is the scrape data loaded', function() {
    google.scrape(function(result) {
      assert.equal(true, result.title.length > 0);
    });
  });

  test('does this contain full information', function() {
    var results = [];
    google.scrape(function(result) {
      results.push(result);
    });
    
    var mockObject = {
      title: 'Avaleht - eesti.ee',
        href: 'http://www.eesti.ee/',
        index: 2
    };

    assert.deepEqual(mockObject, results[2]);
  });

});