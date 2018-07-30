const expect = require('chai').expect;
const { URL,DATABASE,POST_COLLECTION,COMMENT_COLLECTION } = require('./common');

const MongoClient = require('mongodb').MongoClient;
const forum = require('../src');
const mongo = require('kqudie')(URL);

describe('submitPost', function () {
    var connect;
    var db;
    var post_collect;
    var comment_collect;
    before(async function () {
        try {
            connect = await getConnect();
            db = connect.db(DATABASE);
            post_collect = db.collection(POST_COLLECTION);
            comment_collect = db.collection(COMMENT_COLLECTION);

            await Promise.all([post_collect.deleteMany({}),comment_collect.deleteMany({})]);
            await post_collect.insertMany([
                {  "_id" : mongo.String2ObjectId("5b5e6ab1d240333a98094490"),
                "post_title" : 'wuwu',
                "tag" : null,
                "post_author" : '龚佑成',
                "post_content" : 'aa',
                "reply_count" : 0,
                "visited" : 0,
                "last_comment" : "null",
                "last_comment_time" : 0 }
            ]);
        } catch (err) {
            throw err;
        }
    });

    it('test', async function () {
        var data = {
            "post_title": "国际化",
            "post_author": "龚佑成",
            "post_content": "婷姐的项目",
            "tag": null,
        };
        try {
            await forum.updatePostList(1,mongo.String2ObjectId("5b5e6ab1d240333a98094490"),data);
            var result = await post_collect.find({}).sort({}).toArray();

            expect(result).lengthOf(1);
            expect(result[0].post_title).to.be.equal("国际化");
            expect(result[0].post_author).to.be.equal("龚佑成");
            expect(result[0].post_content).to.be.equal("婷姐的项目");
        } catch (error) {
            throw error;
        }
    });
});

async function getConnect() {
    try {
        let connect = await MongoClient.connect(URL);

        return connect;
    } catch (err) {
        throw err;
    }
}