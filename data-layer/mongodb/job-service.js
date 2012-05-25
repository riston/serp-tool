var db        = require(__dirname + '/config.js').db
  , job       = db.collection('job')
  , _         = require('underscore')
  , moment    = require('moment');

var JobService = {

  newJob: function(data, cb) {
    data['owner'] = db.ObjectID.createFromHexString(data['owner']);
    job.insert(data, function(err, user) {
      if (err) cb(err);
      else {
        cb(null, user);
      }
    });
  },

  findOne: function(id, cb) {
    id = db.ObjectID.createFromHexString(id);
    job.findOne({ _id: id }, cb);
  },

  findById: function(id, cb) {
    job.findById(id, cb);
  },

  repeat: function(startDate, repeation) {
    var nextDate;
    function getNext(name, add) {
      return moment(startDate).add(name, add).toDate();
    }

    switch(repeation) {
      case 'day':
        nextDate = getNext('days', 1);
      break;

      case 'week':
        nextDate = getNext('weeks', 1);
      break;

      case 'month':
        nextDate = getNext('months', 1);
      break;

      default:
        nextDate = undefined;
    }
    return nextDate;
  },

  ended: function(id, cb) {
    var self = this;
    this.findById(id, function(err, dbJob) {
      job.update({ _id: dbJob._id }, {
        $set: { end: new Date(), status: 'finished' }
      }, function(err) {
        var repeation = self.repeat(dbJob.start, dbJob.repeat);
        if (!err && repeation) {
          // Clone the previous job
          dbJob.start = repeation;
          dbJob.parent = dbJob._id;
          dbJob.status = 'waiting';
          dbJob.added = new Date();
          delete dbJob._id;

          job.insert(dbJob, function(err, insertedJob) {
            cb(null, insertedJob);
          })
        } else {
          cb(err);
        }
      });
    });
  },

  userJobList: function(userId, cb) {
    var _id = db.ObjectID.createFromHexString(userId);
    job.find({ owner: _id }).sort( { added: -1 }).toArray(function(err, jobs) {
      if (err) cb(err);
      else cb(null, jobs);
    });
  },

  userJobListGroupByName: function(userId, cb) {
    this.userJobList(userId, function(err, jobs) {
      if (err) return cb(err);
      else {
        return cb(null, 
          _.groupBy(jobs, function(job) {
            return job.name;
          })
        );
      }
    });
  },

  findJobToProcess: function(cb) {
    var query = {
        start: { $lte: new Date() }
      , status: 'waiting'
    };

    job.find(query).toArray(function(err, jobs) {
      if (err) cb(err);
      else cb(null, jobs)
    });
  },

  update: function(id, updatedJob, cb) {
    id = db.ObjectID.createFromHexString(id);
    
    job.update({ _id: id }, { $set: updatedJob }, function(err) {
      if (err) return cb(err);
      return cb(null);
    });
  },

  delete: function(jobId, cb) {
    var id = db.ObjectID.createFromHexString(jobId);
    job.findOne({ _id: id }, function(err, jobResult) {
      if (err) return cb(err);
      else {
        // Find next job
        job.findOne({ parent: id}, function(err, jobNext) {
          // Find previous job
          job.findOne({ _id: jobResult.parent }, function(err, jobPrev) {
            if (jobPrev == null || jobPrev == undefined) {
              // No previous job, modify the next job parent only
              job.update({ parent: id }, { $set: { parent: null } }, function(err) {
                removeJob(id, cb);                
              });
            } else if (jobNext != null || jobNext != undefined) {
              job.update({ _id: jobNext.id }, { $set: { parent: jobPrev.id } }, function(err) {
                removeJob(id, cb);
              });
            }
          });
        });
      }
    });

    function removeJob(id, funCb) {
      job.remove({ _id: id }, function(err) {
        if (!err) return funCb(err);
        else return funCb(null);
      });      
    }
  },

  deleteAll: function(jobId, cb) {
    id = db.ObjectID.createFromHexString(jobId);
    
    job.remove({ _id: id }, function(err) {
      if (err) return cb(err);
      else {
        job.remove({ parent: id }, function(err) {
          if (err) return cb(err);
          else {
            db.collection('keyword').remove( { job: id }, function(err) {
              if (err) return cb(err);
              else {
                return cb(null, true);
              }
            });
          }
        });
      }
    })
  },

  /**
   * Remove all the keywords and set the status again to waiting.
   */ 
  cleanJob: function(jobId, cb) {
    var id = db.ObjectID.createFromHexString(jobId)
      , self = this;
    db.collection('keyword').remove({ job: id }, function(err) {
      if (!err) {
        self.updateJobStatus(id, 'waiting', function(err, job) {
          if (err) return cb(err);
          else return(null, job);
        });        
      } else {
        return cb(err);
      }
    });

  },

  updateJobStatus: function(id, newStatus, cb) {
    job.update({ _id: id }, { $set: { status: newStatus } }, function(err, job) {
      if (err) return cb(err);
      else return cb(null, job)
    });
  }
};

exports.JobService = JobService;