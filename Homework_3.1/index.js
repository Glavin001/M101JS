var MongoClient = require('mongodb').MongoClient // Driver for connecting to MongoDB
var async = require('async');
var _ = require('lodash');

MongoClient.connect('mongodb://localhost:27017/school', function(err, db) {
    "use strict";
    if(err) throw err;

    var students = db.collection('students');

    students.find().toArray(function(err, results) {

      //console.log(results);

      async.map(results, function(student, callback) {
        var scores = student.scores;

        async.sortBy(scores, function(score, callback) {
          return callback(null, score.score);
        }, function(err, scores) {

          var scores2 = _.filter(scores, function(item) {
            var isHomework = (item.type === "homework");
            //console.log(this.isRemoved, isHomework);
            var result = (this.isRemoved && isHomework) || (!isHomework);
            if (isHomework) {
              this.isRemoved = true;
            }
            return result;
          }, { isRemoved: false });

          student.scores = scores2;
          return callback(null, student);

        });

      }, function(err, results) {
          //console.log(JSON.stringify(results, null, 2));

          async.each(results, function(item, callback) {
            students.save(item, function(err, result) {
                return callback(err);
            });
          }, function(err) {
            console.log(!err?'Done':("Error:"+err.message));
            db.close();
          })
      });

    });

});
