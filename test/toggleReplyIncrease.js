var forum = require('../src');
var expect = require('chai').expect;
const { URL,DATABASE,POST_COLLECTION,COMMENT_COLLECTION } = require('./common');

const MongoClient = require('mongodb').MongoClient;
const mongo = require('kqudie')(URL);

describe('toggleReplyIncrease',function(){
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
                "post_author" : 'hhji',
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
        await forum.toggleReplyIncrease(1,mongo.String2ObjectId("5b5e6ab1d240333a98094490"));
        var result = await post_collect.find({}).sort({}).toArray();

        expect(result).to.have.lengthOf(1);
        expect(result[0].reply_count).to.equal(1);
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