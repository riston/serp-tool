var map = function() {
	emit(this._id, { keyword: this.keyword.length });
};


var reduce = function(key, values) {
	var sum = 0;
	values.forEach(function(value) {
		sum += value['keyword'];
	});
	return { keyword: sum };
};

/** Map reduce second example, summ all the results urls length**/
var map = function() {
	var self = this;
	this.results.forEach(function(result) {
		emit(self.keyword, { keyword: result.href.length });
	});
	
};


var reduce = function(key, values) {
	var sum = 0;
	values.forEach(function(value) {
		sum += value['keyword'];
	});
	return { keyword: sum };
};
