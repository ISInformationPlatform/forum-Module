const expect = require('chai').expect;
const config = require('./config');
const { URL,DATABASE } = config;

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const forum = require('../src')(config);

describe('updatePostList', function () {
    let post_first;
    let comment_first;

    before(async function () {
        try {
            let connect = await getConnect();
            let db = connect.db(DATABASE);
            post_first = db.collection('post_first');
            comment_first = db.collection('comment_first');

            await Promise.all([post_first.deleteMany({}), comment_first.deleteMany({})]);
            await post_first.insertMany([
                {
                    "_id": new ObjectId("5b5e6ab1d240333a98094490"),
                    "post_title": 'title',
                    "tag": null,
                    "post_author": 'author',
                    "post_content": 'content',
                    "reply_count": 0,
                    "visited": 0
                }
            ]);
        } catch (err) {
            throw err;
        }
    });

    it('test', async function () {
        var data = {
            "post_title": "title2",
            "post_content": "content2",
            "tag": null,
        };
        try {
            await forum.updatePostList(1, "5b5e6ab1d240333a98094490", data);
            var result = await post_first.find({}).sort({}).toArray();

            expect(result).lengthOf(1);
            expect(result[0].post_title).to.be.equal("title2");
            expect(result[0].post_author).to.be.equal("author");
            expect(result[0].post_content).to.be.equal("content2");
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