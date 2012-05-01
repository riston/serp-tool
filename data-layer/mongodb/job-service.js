var db        = require(__dirname + '/config.js').db
  , job       = db.collection('job')
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

  updateJobStatus: function(id, newStatus, cb) {
    job.update({ _id: id }, { $set: { status: newStatus } }, function(err, job) {
      if (err) cb(err);
      else cb(null, job)
    });
  }
};

exports.JobService = JobService;