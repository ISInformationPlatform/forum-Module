const expect = require('chai').expect;

const forum = require('../src');
const mongo = require('kqudie')("mongodb://mongo:27017/");

const database = "ISInformationPlatform"
const list_collection = "postlist_1"
const detail_collection = "postdetail_1"

describe('submitPost', function () {
    before(async function (){
        mongo.remove(database,list_collection,{deleteAll:true},async function (err,result){
            if(err) console.log(err);
        });
    });

    it('testsubmitPost', function () {
        var data = {
            "post_title": "saber",
            "post_author": "she",
            "post_content": "hello",
            "tag": null,
        };

        forum.submitPost(1, data)
            .then(() => {
                mongo.find(database, list_collection, {}, {}, function (err, result) {
                    let item = result[0];

                    expect(item.post_title).to.be.equal("saber");
                    expect(item.post_author).to.be.equal("she");
                    expect(item.post_content).to.be.equal("hello");
                })
            }).catch(e => {
                console.log(e);
            });
    });

});

describe('getAllPost', function () {
    before(async function () {
        await mongo.remove(database, list_collection, {}, {deleteAll: true}, async function (err, result) {
            if(err) console.log(err);
        });
        var insertDetailObj = {
            "_id" : "5b513ec751f6ea0cd4ef5c74",
            "post_title" : "saber",
            "tag" : null,
            "post_content" : "hello",
            "post_author" : "she",
            "reply_count" : 0,
            "visited" : 0
          };
          await mongo.insertOne(database, detail_collection, insertDetailObj, function(err, result){
            if(err) console.log(err);
          });
    });

    it('testgetAllPost', function () {

        forum.getAllPost(1)
            .then(() => {
                mongo.find(database, list_collection, {}, {}, function (err, result) {
                    let item = result[0];

                    expect(item.post_title).to.be.equal("saber");
                    expect(item.post_author).to.be.equal("she");
                    expect(item.post_content).to.be.equal("hello");
                })
            }).catch(e => {
                console.log(e);
            });
    });

});

describe('getPostDetail', function () {
  var new_ObjectId;
    before(async function () {
        await mongo.remove(database, detail_collection, {}, {deleteAll: true}, async function(err, result){
          if(err) console.log(err);

          var insertDetailObj = {
            "_id" : "5b513ec751f6ea0cd4ef5c74",
            "post_title" : "saber",
            "tag" : null,
            "post_content" : "hello",
            "post_author" : "she",
            "reply_count" : 0,
            "visited" : 0
          };

          await mongo.insertOne(database, detail_collection, insertDetailObj, function(err, result){
            if(err) console.log(err);
          });
        });

    });

    it('testgetPostDetail', function () {
        forum.getPostDetail(1, mongo.ObjectId2String("5b513ec751f6ea0cd4ef5c74"))
            .then(() => {
                mongo.find(database, detail_collection, {}, {}, function (err, result) {
                    let item = result[0];

                    expect(item.post_title).to.be.equal("saber");
                    expect(item.post_author).to.be.equal("she");
                    expect(item.post_content).to.be.equal("hello");
                })
            }).catch(e => {
                console.log(e);
            });
    });

});
