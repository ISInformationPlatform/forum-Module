var forum = require('../src');
var expect = require('chai').expect;
const { URL,DATABASE,POST_COLLECTION,COMMENT_COLLECTION } = require('./common');

const MongoClient = require('mongodb').MongoClient;
const mongo = require('kqudie')(URL);

describe('updateComment',function(){
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
            await comment_collect.insertMany([
                {
                    '_id': mongo.String2ObjectId("5b5e6ab1d240333a98094497"),
                    "post_id": mongo.String2ObjectId("5b5e6ab1d240333a98094490"),
                    "comment_author": "hwfhc",
                    "comment_content": "test"
                }
            ]);
        } catch (err) {
            throw err;
        }
    });
    it('test', async function () {
        var data = {
            'comment_author': 'ji',
            'comment_content': 'laji',
            'reply_to_comment_id': '6'
        };
        await forum.updateComment(1,mongo.String2ObjectId("5b5e6ab1d240333a98094490"),mongo.String2ObjectId("5b5e6ab1d240333a98094497"),data);
        var result= await comment_collect.find({}).sort({}).toArray();

        expect(result).to.have.lengthOf(1);
        expect(result[0].comment_author).to.equal('ji');
        expect(result[0].comment_content).to.equal('laji');
        expect(result[0].reply_to_comment_id).to.equal('6');
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