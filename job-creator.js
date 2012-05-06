var kue     = require('kue')
  , DB      = require(__dirname + '/web/database.js')
  , cron    = require('cron')
  , jobs    = kue.createQueue()
  , Job     = kue.Job;

var cronRunTime = '*/10 * * * *';

var newInterval = cron.CronJob(cronRunTime, function() {
  JobCreator.addNew();
});

var JobCreator = {
  addNew: function() {
    DB.job.findJobToProcess(function(err, dataJobs) {
      if (!err) {
        dataJobs.forEach(function(job) {
          var current = jobs.create('serp', {
              title: job.name
            , id: job._id
            , dbId: job._id
            , frames: job.keywords.length * job.sources.length
          }).save();
          console.log('Added job #' + current.id);

          DB.job.updateJobStatus(job._id, 'queued', function(err, job) {
            if (!err) console.log('Job changed status ');
          })
        });
      } else {
        console.log('Error found: ', err);
      }
    });    
  }
}

// Web interface for the kue
//kue.app.listen(3000);