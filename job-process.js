var kue       = require('kue')
  , util      = require('util')
  , async     = require('async')
  , Scrape    = require(__dirname + '/scraper/scrape.js')
  , db        = require(__dirname + '/web/database.js')
  , jobs      = kue.createQueue()
  , Job       = kue.Job;

var JobProcceser = {

  process: function() {
    this.listener();
    jobs.process('serp', function(job, done) {
      var frames = job.data.frames;
      console.log('Job process #%d', job.id);

      function startJob() {
        db.job.findById(job.data.id, function(err, fromDbJob) {

          function getLookupList() {
            var list = [];
            for (var x = fromDbJob.sources.length - 1; x >= 0; x--) {
              for (var y = fromDbJob.keywords.length - 1; y >= 0; y--) {
                list.push({
                   source: fromDbJob.sources[x]
                 , keyword: fromDbJob.keywords[y]
                 , jobId: fromDbJob._id
                });
              };
            };
            return list;
          }

          function newKeyword() {
            var list = getLookupList(), index = 1;
            async.forEach(list, function(elem, cb) {
              var newKeyword = {
                  keyword: elem.keyword
                , source: elem.source
                , job: elem.jobId  
              };
              db.keyword.add(newKeyword, function(err, keyword) {
                newKeyword.keywordId = keyword[0]._id;
                var s = new Scrape(newKeyword);
                s.run(function(err, results) {
                  db.keyword.addResult(keyword[0]._id, results, function(err) {
                    if (!err) {
                      console.log('keyword inserted ' + newKeyword.keyword + ' - ' + newKeyword.source);
                      next(index++);
                    }
                  });
                });                  
              });
              cb(null, elem);
            }, function(err) {
              console.log('Called all methods');
            });          
          }

          function next(i) {
            console.log('called next ' + i);
            job.progress(i, frames);
            if (i == frames) {
              console.log('Job marked done');
              done(); 
            }
          }

          newKeyword();
          next(0);
        });
      }
      startJob();
      
    });
  },

  complete: function() {
    jobs.on('job complete', function(id) {
      Job.get(id, function(err, job) {
        if (err) return;
        job.remove(function(err) {
          if (err) throw err;
          console.log('Remove completed job #%d', job.id);
        });
        db.job.ended(job.data.id, function(err, res) { });
      });
      
    });
  },

  listener: function() {
    this.complete();
  }

}

JobProcceser.process();