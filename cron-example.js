
var async 		= require('async');
var Scrape 		= require(__dirname + '/scraper/scrape.js');
var db			= require(__dirname + '/web/database.js');


db.keyword.groupByMatch('4f9bf9f2a1aacdaa3d000004', function(err, results) {
	console.log(results);
});
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