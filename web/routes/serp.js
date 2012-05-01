var db = require(__dirname + '/../database.js');

/*
// Route param pre condition
app.param('postid', function(req, res, next, id) {
  

  db.post.findOne({ _id: db.ObjectId(id) }, function(err, post) {
    if (err) return next(new Error('Make sure you provided correct post id'));
    if (!post) return next(new Error('Post loading failed'));
    req.post = post;
    next();
  });
});
*/

exports.checkJobId = function(req, res, next, id) {
	if (id.length != 24) throw next(new Error('The job id is not having correct length'));
	db.job.findOne(id, function(err, job) {
		if (err) return next(new Error('Make sure such id exists'));
		if (!job) return next(new Error('Can not load the job from database'));
		req.job = job;
		next();
	});
};

exports.index = function(req, res) {
	db.job.userJobList(req.session.user._id, function(err, dataJobs) {
		if (err) dataJobs = {};
		res.render('serp/index.jade', {
			title: 'Home'
		  , jobs: dataJobs
		});		
	})
};

exports.new = function(req, res) {
	res.render('serp/new.jade', {
		title: 'New job'
	});
};

exports.stats = function(req, res) {

};

// GET method
exports.delete = function(req, res) {
	res.render('serp/delete.jade', {
		title: 'Delete job'
	  , id: req.params.jobid
	});
};

// POST method for deletion
exports.doDelete = function(req, res) {
	//if (req.body.)
};

exports.jobStats = function(req, res) {
	res.contentType('json');
	db.keyword.totalStats(req.params.jobid, function(err, stats) {
		var output = '';
		if (err) output = JSON.stringify({ code: 400, err: 'Check again the data', });
		else output = JSON.stringify(stats);
		res.send(output);
	});
};

exports.jobOverallStats = function(req, res) {
	res.contentType('json');
	db.keyword.groupByMatch(req.params.jobid, function(err, stats) {
		var output = '';
		if (err) output = JSON.stringify({ code: 400, err: 'Check again the data', });
		else output = JSON.stringify(stats);
		res.send(output);
	});
};

exports.view = function(req, res) {
	db.job.findOne(req.params.jobid, function(err, job) {
		res.render('serp/view.jade', {
			title: 'View of job'
		  , job: job
		});
	});
};

exports.edit = function(req, res) {
	db.job.findOne(req.params.jobid, function(err, job) {
		res.render('serp/edit.jade', {
			title: 'Edit job'
		  , id: req.params.jobid
		  , job: job
		});
	});
};

exports.doEdit = function(req, res) {
	var time = new Date(req.body.startDate);
	time.setMinutes(req.body.startTime.split(':')[1]);
	time.setHours(req.body.startTime.split(':')[0]);

	var editJob = {
		name: 		req.body.name
	  , start: 		time
	  , keywords: 	req.body.keywords.split(',')
	  , urls: 		req.body.urls.split(',')
	  , sources: 	req.body.sources
	  , repeat: 	req.body.repeat
	};
	db.job.update(req.body.jobId, editJob, function(err) {
		if (!err) req.flash('success', 'Edit successfully!');
		else req.flash('error', 'There were problems editing job!');
		res.redirect('/serp');
	});
};

// POST job
exports.addJob = function(req, res) {
	var hoursMinutes = req.body.startTime
	  , time = new Date(req.body.startDate);

	time.setMinutes(hoursMinutes.split(':')[1]);
	time.setHours(hoursMinutes.split(':')[0]);

	var newJobData = {
		name: req.body.name
	  , added: new Date()
	  , start: time
	  , end: null
	  , status: 'waiting'
	  , keywords: req.body.keywords.split(',')
	  , urls: req.body.urls.split(',')
	  , sources: req.body.sources
	  , owner: req.session.user._id
	  , repeat: req.body.repeat
	  , parent: null
	};

	db.job.newJob(newJobData, function(err, job) {
		if (!err && job) {
			req.flash('success', 'New job added successfully!');
		} else {
			req.flash('error', 'There were problems adding new job!');
		}
		res.redirect('/serp');
	});
};