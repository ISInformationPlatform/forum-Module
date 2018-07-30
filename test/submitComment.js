var forum = require('../src');
var expect = require('chai').expect;
const { URL,DATABASE,POST_COLLECTION,COMMENT_COLLECTION } = require('./common');

const MongoClient = require('mongodb').MongoClient;
const mongo = require('kqudie')(URL);

describe('submitComment',function(){
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
        var data = {
            'comment_author': 'flt',
            'comment_content': 'hhhh',
            'reply_to_comment_id': '5'
        };
        await forum.submitComment(1,mongo.String2ObjectId("5b5e6ab1d240333a98094490"), data);
        let [result1,result2] = await Promise.all([comment_collect.find({}).sort({}).toArray(),post_collect.find({}).sort({}).toArray()]);
        

        expect(result1).to.have.lengthOf(1);
        expect(result1[0].comment_author).to.equal('flt');
        expect(result1[0].comment_content).to.equal('hhhh');
        expect(result1[0].reply_to_comment_id).to.equal('5');
        
        expect(result2).to.have.lengthOf(1);
        expect(result2[0].last_comment).to.equal('flt');
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