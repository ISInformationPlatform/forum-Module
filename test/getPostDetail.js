const expect = require('chai').expect;
const config = require('./config');
const { URL,DATABASE } = config;

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const forum = require('../src')(config);

describe('getPostDetail', function () {
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL);
            let db = connect.db(DATABASE);
            let post_first = db.collection('post_first');

            await post_first.deleteMany({});
            await post_first.insertMany([
                {
                    "_id": new ObjectId("5b5e6ab1d240333a98094440"),
                    "post_title": 'title1',
                    "tag": null,
                    "post_author": 'author1',
                    "post_content": 'content1',
                    "reply_count": 0,
                    "visited": 0
                },
                {
                    "_id": new ObjectId("5b5e6ab1d240333a98094441"),
                    "post_title": 'title2',
                    "tag": null,
                    "post_author": 'author2',
                    "post_content": 'content2',
                    "reply_count": 0,
                    "visited": 0
                }
            ]);
        } catch (err) {
            throw err;
        }
    });

    it('test', async function () {
        let result = await forum.getPostDetail(1, "5b5e6ab1d240333a98094440");

        expect(result[0].post_title).to.be.equal("title1");
        expect(result[0].post_content).to.be.equal("content1");
        expect(result[0].post_author).to.be.equal("author1");
    });

});
