var _ 			= require('underscore');
var async 		= require('async');
var Scrape 		= require(__dirname + '/scraper/scrape.js');
var db			= require(__dirname + '/web/database.js');
var util	 	= require('util');

var newKeyword = {
	  keyword: 'nodejs'
	, source: 'google'
};
console.log('test');
console.log(util.format(newKeyword));
/*
var s = new Scrape(newKeyword);
s.run(function(err, result) {
	console.log(result);
});*/
//http://localhost:3000/serp/view/
/*
db.keyword.findJobKeywordPositionInTime('4fbbd0d016fd19d42c000007', function(err, results) {
	console.dir(results);
});

db.job.delete('4fbd3c5b16fd19d42c000070', function(err) {

});

db.job.cleanJob('4fbbd1cb16fd19d42c00001d', function(err, job) {

});
*/
/*
db.keyword.getGroupTotals('4fabd9c547ee0ebf78000007', function(err, results) {
	console.log(util.inspect(results, false, null));
	//console.dir(results.series);
});

db.keyword.groupStats('4fabd9c547ee0ebf78000007', function(err, results) {
	console.log(util.inspect(results, false, null));
	//console.dir(results.series);
});
*/

/*
db.keyword.findParentAndChildren('4fabd9c547ee0ebf78000007', function(err, results) {
	console.log(util.inspect(results, false, null));
	//console.dir(results.series);
});*/
/*
db.keyword.getUniqueGroupNames('4faa2cf24f9c874f0b000001', function(err, results) {
	console.log(results);
});
*/
/*
db.keyword.getGroupedByMatchSet('4faa2cf24f9c874f0b000001', function(err, results) {
	console.log(results);
	console.log(results.series[0].data);
});
*/
/*
db.keyword.totalStats('4faa2cf24f9c874f0b000001', function(err, results) {
	console.log(results['www.ttu.ee'].series);
	//console.log(_.filter(results, function(result) { return result.engine == 'neti.ee' }));
});
*/
/*
db.keyword.groupStats('4faa2cf24f9c874f0b000001', function(err, results) {
	console.log(_.filter(results, function(result) { return result.engine == 'neti.ee' }));
});

db.keyword.groupByMatch('4faa2cf24f9c874f0b000001', function(err, results) {
	console.log(results);
});
*/
// db.keyword.find( { _id: ObjectId('4f9457a3bdb.keyword.find( { _id: ObjectId('4f9457a3b65babf521000001')})65babf521000001')})
/*
db.keyword.totalStats('4f9bf9f2a1aacdaa3d000004', function(err, results) {
	//console.log(err, results);
	console.log(err, results);
	results['arvutikeskus.ee']['series'].forEach(function(series) {
		console.log(series.name, series.data);
	});
});*/
/*
db.keyword.stats('4f9bf9f2a1aacdaa3d000004', function(err, results) {
	console.log(results);
});
*/
/*
var elements = [], items = [1, 2, 3, 4];
items.forEach(function(elem) {
	console.log('+ ', elem);
	elements.push(elem);		
});

var elems = [];

for (var i = items.length - 1; i >= 0; i--) {
	elems.push(items[i]);
}
console.log(elems)

console.log(elements);

db.job.ended('4f9457a3b65babf521000001', function(err, res) {
	console.log('Done', res);
});

var functionArray = [];
for (i = 0; i < 4; i++) {
	(function(i) {
		functionArray.push(function(cb) {
			console.log('Inner circle ' + i);
			setTimeout(function() {
				console.log('Timeout call ' + i);
				cb(null, i);
			}, Math.random() * 5000 + 3000);

		});
	})(i);
}

console.log(functionArray);

async.series(functionArray, function() {
	console.log('Job completed');
})


var names = ['Juhan', 'Mikk', 'Tuuli', 'Oskar'];
var newList = [];

function welcome(name, callback) {
	name += ', hello';
	console.log(name);	
	newList.push(name);
	callback(null, name);
}

async.forEach(names, welcome, function(err) {
	console.log('Completed');
	console.log(newList);
});
*/
/*
var s = new Scrape({ source: 'google', keyword: 'queen', keywordId: '4543543' }).run();


var f = new Scrape({ source: 'neti', keyword: 'hendrik ilves', keywordId: '4543543' });
f.run();*/