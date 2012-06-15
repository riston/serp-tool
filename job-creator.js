var kue     = require('kue')
  , DB      = require(__dirname + '/web/database.js')
  , cron    = require('cron')
  , jobs    = kue.createQueue()
  , Job     = kue.Job;

var cronRunTime = '*/10 * * * *'
  , jobFailCheckTime = '*/5 * * * *';

// Execute the node cron jobs
try {

  var newInterval = new cron.CronJob(cronRunTime, function() {
    JobCreator.addNew();
  }, null, true);

  var failedJobInterval = new cron.CronJob(jobFailCheckTime, function() {
    JobFail.check();
  }, null, true);
  
} catch (ex) {
  console.log('Invalid cron pattern ', ex);
}

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
};

var JobFail = {

  check: function() {

  }
};

// Web interface for the kue
kue.app.listen(3030);