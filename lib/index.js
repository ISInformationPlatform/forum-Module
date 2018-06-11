"use strict";
/**
 ** Forum Module
 **
 ** @version 0.0.1
 **
 */

var forum = module.exports;

var url = "mongodb://mongo:27017/",
    database = "ISInformationPlatform",
    base_postlist_collection = "postlist",
    base_postdetail_collection = "postdetail",
    base_postcomment_collection = "postcomment";

var mongo = require('./mongo.js')(url);

/**
 ** getCurrentTime
 **
 ** @return unix timestamp
 **
 */

function getCurrentTime(){
  return Math.round(new Date().getTime()/1000);
}

/**
 ** getAllPost
 **
 ** @param section_id section id
 ** @param callback
 **
 */

forum.getAllPost = function(section_id, callback){
  var postlist_section_collection = base_postlist_collection + "_" + section_id;
  var findObj = {};
  mongo.find(database, postlist_section_collection, findObj, function(err, result){
    if(err) callback(err);
    console.log(result);
    callback(null, result);
  });
}

/**
 ** getPostDetail
 **
 ** @param section_id section id
 ** @param post_id post id
 ** @param callback
 **
 */

forum.getPostDetail = function(section_id, post_id, callback){
  var postdetail_section_collection = base_postdetail_collection + "_" + section_id;
  var findObj = {
    "post_id" : post_id
  };
  mongo.find(database, postlist_section_collection, findObj, function(err, result){
    if(err) callback(err);
    console.log(result);
    callback(null, result);
  });
}

/**
 ** UpdatePostDetail
 **
 ** @param section_id section id
 ** @param post_id post id
 ** @param data json data
 ** @param callback
 **
 */

forum.UpdatePostDetail = function(section_id, post_id, data, callback){
  var postdetail_section_collection = base_postdetail_collection + "_" + section_id;
  var query = {
    "post_id" : post_id
  };
  var option = {
    "upsert" : false,
    "multi" : false
  };
  var current_time = getCurrentTime();
  var updateObj = {
    $set : {
      "post_title" : data.post_title,
      "post_content" : data.post_content,
      "tag" : data.tag,
      "post_time" : current_time
    }
  };
  mongo.update(database, postdetail_section_collection, query, updateObj, option, function(err, result){
    if(err) callback(err);
    console.log(result.result.n);
    callback(null, result.result.n);
  });
}

/**
 ** toggleVisitIncrease
 **
 ** @param section_id section id
 ** @param post_id post id
 ** @param callback
 **
 */

forum.toggleVisitIncrease = function(section_id, post_id, callback){
  var postdetail_section_collection = base_postdetail_collection + "_" + section_id;
  var postlist_section_collection = base_postlist_collection + "_" + section_id;
  var query = {
    "post_id" : post_id
  };
  var updateObj = {
    $inc : {
      "visited" : 1
    }
  };
  mongo.update(database, postdetail_section_collection, query, updateObj, function(err, results){
    if(err) callback(err);
    else{
      console.log(results.result.n);
      mongo.update(database, postlist_section_collection, query, updateObj, function(err, result){
        if(err) callback(err);
        console.log(result.result.n);
        callback(null, result.result.n);
      });
    }
  });
}

/**
 ** toggleReplyIncrease
 **
 ** @param section_id section id
 ** @param post_id post id
 ** @param callback
 **
 */

forum.toggleReplyIncrease = function(section_id, post_id, callback){
  var postdetail_section_collection = base_postdetail_collection + "_" + section_id;
  var postlist_section_collection = base_postlist_collection + "_" + section_id;
  var query = {
    "post_id" : post_id
  };
  var updateObj = {
    $inc : {
      "reply_count" : 1
    }
  };
  mongo.update(database, postdetail_section_collection, query, updateObj, function(err, results){
    if(err) callback(err);
    else{
      console.log(results.result.n);
      mongo.update(database, postlist_section_collection, query, updateObj, function(err, result){
        if(err) callback(err);
        console.log(result.result.n);
        callback(null, result.result.n);
      });
    }
  });
}

/**
 ** getAllComment
 **
 ** @param section_id section id
 ** @param post_id post id
 ** @param callback
 **
 */

forum.getAllComment = function(section_id, post_id, callback){
  var commentlist_section_collection = base_postcomment_collection + "_" + section_id;
  var findObj = {
    "post_id" : post_id
  };
  mongo.find(database, commentlist_section_collection, findObj, function(err, result){
    if(err) callback(err);
    console.log(result);
    callback(null, result);
  });
}

/**
 ** submitComment
 **
 ** @param section_id section id
 ** @param post_id post id
 ** @param data comment data
 ** @param callback
 **
 */
