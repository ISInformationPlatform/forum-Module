"use strict";
/**
 ** Forum Module
 **
 ** @version 0.0.1
 **
 */

var post_collection_map = new Map();
var comment_collection_map = new Map();
var config;
var mongo;
var database = null;
var post_item_number_a_page;
var sticky_post_item_number_a_page;

var forum = module.exports = function (config_data) {
  if (!config_data)
    throw new Error('config can not be undefined');

  config = config_data;
  mongo = require('kqudie')(config.URL);
  database = config.DATABASE;
  post_item_number_a_page = config.post_item_number_a_page;
  sticky_post_item_number_a_page = config.sticky_post_item_number_a_page;

  post_collection_map = new Map();
  comment_collection_map = new Map();

  config.forum.forEach(item => {
    if (post_collection_map.get(item.section_id))
      throw new Error("section_id can not be duplicated");

    post_collection_map.set(item.section_id, item.post_collection);
    comment_collection_map.set(item.section_id, item.comment_collection);
  });

  return forum;
};

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

function getPostCollectionBySectionId(section_id){
  if (!section_id)
    throw new Error('section_id can not be undefined');

  if (typeof section_id != 'number')
    throw new Error('section_id must be a number');

  return post_collection_map.get(section_id);
}

function getCommentCollectionBySectionId(section_id){
  if (!section_id)
    throw new Error('section_id can not be undefined');

  if (typeof section_id != 'number')
    throw new Error('section_id must be a number');

  return comment_collection_map.get(section_id);
}

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
 **
 ** @param page_num
 */

forum.getAllPost = async function (section_id,opt = {}) {
  const post_collect = getPostCollectionBySectionId(section_id);
  const page_num = parseInt(opt.page_num) || 1;
  const person_post = opt.person_post || null;
  const tag_filter = parseInt(opt.tag_filter) || 0;
  const find_filter = opt.find_filter || 0;
  const sticky = opt.sticky || false;

  var opt = {
    find: {},
    sort: {}
  };

  if (tag_filter !== 0)
    opt.find.post_tag = { $bitsAllSet: tag_filter };

  if (person_post)
    opt.find.post_author = person_post;
  
  if (sticky)
    opt.find.sticky = true;
  
  if(find_filter !== 0)
    opt.find.post_title = { $regex: new RegExp(find_filter) };

  try {
    var data = await mongo.find(database, post_collect, opt);
  }
  catch (error) {
    throw error;
  }

  var pageSize;

  if (sticky)
    pageSize = sticky_post_item_number_a_page;
  else
    pageSize = post_item_number_a_page;

  let total_page_num = Math.ceil(data.length / pageSize);

  if (!page_num)
    return { 
      "post_list": data,
      "total_page_num": total_page_num
    };

  let page_list = [];

  let position = (page_num - 1) * pageSize;
  let finish = position + pageSize;

  for(; position < finish; position++ )
    if (data[position])
      page_list.push(data[position]);

  return { 
    'post_list': page_list,
    'total_page_num': total_page_num
  };
}

/**
 ** getPostDetail
 **
 ** @param section_id section id
 ** @param post_id post id (string)
 **
 */

forum.getPostDetail = async function (section_id, post_id) {
  let post_collect = getPostCollectionBySectionId(section_id);

  var findObj = {
    "_id": mongo.String2ObjectId(post_id)
  };

  return await mongo.find(database, post_collect, {
    find: findObj, sort: {}
  });
}

/**
 ** submitPost
 **
 ** @param section_id section id
 ** @param data post data
 **
 */

forum.submitPost = async function(section_id, data, opt = {}){
  let post_collect = getPostCollectionBySectionId(section_id);

  let sticky = opt.sticky||false;

  var insertListObj = {
    "post_title": data.post_title,
    "post_tag" : data.post_tag,
    "post_author" : data.post_author,
    "post_content" : data.post_content,
    "reply_count" : 0,
    "visited" : 0,
    "sticky" : sticky
  };
  try {
    await mongo.insert(database, post_collect, insertListObj);
    return true;
  } catch (error) {
    throw error;
  }
  return 
}

/**
 ** updatePostDetail
 **
 ** @param section_id section id
 ** @param post_id post id (string)
 ** @param data json data
 **
 */

forum.updatePostList = async function(section_id, post_id, data, opt ={}){
  let post_collect = getPostCollectionBySectionId(section_id);

  let sticky = opt.sticky||false;

  var query = {
    "_id": mongo.String2ObjectId(post_id)
  };
  var option = {
    "upsert": false,
    "multi": false
  };
  var updateObj = {
    $set: {
      "post_title": data.post_title,
      "post_content": data.post_content,
      "tag": data.tag,
      "sticky" : sticky,
      "post_time": getCurrentTime()
    }
  };
  try {
    await mongo.update(database, post_collect, query, updateObj, option);
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 ** toggleVisitIncrease
 **
 ** @param section_id section id
 ** @param post_id post id (string)
 **
 */

forum.toggleVisitIncrease = async function(section_id, post_id){
  let post_collect = getPostCollectionBySectionId(section_id);
  var query = {
    "_id" : mongo.String2ObjectId(post_id)
  };
  var updateObj = {
    $inc : {
      "visited" : 1
    }
  };
  try {
    await mongo.update(database, post_collect, query, updateObj);
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 ** toggleReplyIncrease
 **
 ** @param section_id section id
 ** @param post_id post id (string)
 ** 
 **
 */

forum.toggleReplyIncrease = async function(section_id, post_id){
  let post_collect = getPostCollectionBySectionId(section_id);

  var query = {
    "_id" : mongo.String2ObjectId(post_id)
  };
  var updateObj = {
    $inc : {
      "reply_count" : 1
    }
  };
  try {
    await mongo.update(database, post_collect, query, updateObj);
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 ** getAllComment
 **
 ** @param section_id section id
 ** @param post_id post id (string)
 ** 
 **
 */

forum.getAllComment = async function(section_id, post_id){
  let comment_collect = getCommentCollectionBySectionId(section_id);
  var findObj = {
    "post_id" : mongo.String2ObjectId(post_id)
  };

  return await mongo.find(database, comment_collect, {
    find: findObj
  });
}

/**
 ** submitComment
 **
 ** @param section_id section id
 ** @param post_id post id (string)
 ** @param data comment data
 **
 */

forum.submitComment = async function (section_id, post_id, data) {
  const comment_collect = getCommentCollectionBySectionId(section_id);

  await forum.toggleReplyIncrease(section_id, post_id);

 var insertObj = {
    "post_id": mongo.String2ObjectId(post_id),
    "comment_author": data.comment_author,
    "comment_content": data.comment_content
  };
  try {
    let result = await mongo.insert(database, comment_collect, insertObj);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 ** updateComment
 **
 ** @param section_id section id
 ** @param post_id post id (string)
 ** @param comment_id comment id
 ** @param data comment data
 **
 */

forum.updateComment = async function(section_id, post_id, comment_id, data){
  let post_collect = getPostCollectionBySectionId(section_id);
  let comment_collect = getCommentCollectionBySectionId(section_id);

  var comment_query = {
    "_id": mongo.String2ObjectId(comment_id)
  };
  var update_comment_obj = {
    "post_id": post_id,
    "comment_author": data.comment_author,
    "comment_content": data.comment_content
  };

  try {
    await mongo.update(database, comment_collect, comment_query, update_comment_obj, {
      "upsert": false,
      "multi": false
    });
  } catch (error) {
    throw error;
  }
}
