const expect = require('chai').expect;
const { URL,DATABASE,POST_COLLECTION,COMMENT_COLLECTION } = require('./common');

const MongoClient = require('mongodb').MongoClient;
const forum = require('../src');

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
        } catch (err) {
            throw err;
        }
    });

    it('test', async function () {
        var data = {
            "post_title": "saber",
            "post_author": "she",
            "post_content": "hello",
            "tag": null,
        };

        try {
            await forum.submitPost(1, data);
            var result = await post_collect.find({}).sort({}).toArray();

            expect(result).lengthOf(1);
            expect(result[0].post_title).to.be.equal("saber");
            expect(result[0].post_author).to.be.equal("she");
            expect(result[0].post_content).to.be.equal("hello");
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