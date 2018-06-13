var express = require('express');
var forum = require('../lib/index.js');
var router = express.Router();

router.get('/:sectionID/post', function(req, res, next) {
  var sectionID = req.params['sectionID'];
  forum.getAllPost(sectionID, function(err, result){
    if(err) console.log(err);
    console.log(result);
    var sendData = {
      "status" : 1,
      "message" : "SUCCESS",
      "data" : result
    };
    res.jsonp(sendData);
  });
});

router.post('/:sectionID/post', function(req, res, next) {
  var sectionID = req.params['sectionID'];
  var data = req.body.data;
  forum.submitPost(sectionID, data, function(err, result){
    if(err) console.log(err);
    console.log(result);
    if(result){
      var successMsg = {
        "code" : 1,
        "message" : "SUCCESS"
      };
      res.jsonp(successMsg);
    }else{
      var errMsg = {
        "code" : 2,
        "message" : "UNKNOWN_ERR"
      };
      res.jsonp(errMsg);
    }
  });
});

router.get('/:sectionID/post/:postID', function(req, res, next) {
  var sectionID = req.params['sectionID'];
  var postID = req.params['postID'];
  forum.toggleVisitIncrease(sectionID, postID);
  forum.getPostDetail(sectionID, postID, function(err, result){
    if(err) console.log(err);
    console.log(result);
    var sendData = {
      "code" : 1,
      "message" : "SUCCESS",
      "data" : result
    };
    res.jsonp(sendData);
  });
});

router.post('/:sectionID/post/:postID', function(req, res, next) {
  var sectionID = req.params['sectionID'];
  var postID = req.params['postID'];
  var data = req.body.data;
  forum.updatePostDetail(sectionID, postID, data, function(err, result){
    if(err) console.log(err);
    console.log(result);
    if(result){
      var successMsg = {
        "code" : 1,
        "message" : "SUCCESS"
      };
      res.jsonp(successMsg);
    }else{
      var errMsg = {
        "code" : 2,
        "message" : "UNKNOWN_ERR"
      };
      res.jsonp(errMsg);
    }
  });
});

router.get('/:sectionID/post/:postID/comment', function(req, res, next) {
  var sectionID = req.params['sectionID'];
  var postID = req.params['postID'];
  forum.getAllComment(sectionID, postID, function(err, result){
    if(err) console.log(err);
    console.log(result);
    var sendData = {
      "code" : 1,
      "message" : "SUCCESS",
      "data" : result
    };
    res.jsonp(sendData);
  });
});

router.post('/:sectionID/post/:postID/comment', function(req, res, next) {
  var sectionID = req.params['sectionID'];
  var postID = req.params['postID'];
  var data = req.body.data;
  forum.toggleReplyIncrease(sectionID, postID);
  forum.submitComment(sectionID, postID, data, function(err, result){
    if(err) console.log(err);
    console.log(result);
    if(result){
      var successMsg = {
        "code" : 1,
        "message" : "SUCCESS"
      };
      res.jsonp(successMsg);
    }else{
      var errMsg = {
        "code" : 2,
        "message" : "UNKNOWN_ERR"
      };
      res.jsonp(errMsg);
    }
  });
});

router.post('/:sectionID/post/:postID/comment/:commentID', function(req, res, next) {
  var sectionID = req.params['sectionID'];
  var postID = req.params['postID'];
  var commentID = req.params['commentID'];
  var data = req.body.data;
  forum.updateComment(sectionID, postID, commentID, data, function(err, result){
    if(err) console.log(err);
    console.log(result);
    if(result){
      var successMsg = {
        "code" : 1,
        "message" : "SUCCESS"
      };
      res.jsonp(successMsg);
    }else{
      var errMsg = {
        "code" : 2,
        "message" : "UNKNOWN_ERR"
      };
      res.jsonp(errMsg);
    }
  });
});

module.exports = router;
