const expect = require('chai').expect;
const config = require('./config');
const { URL,DATABASE } = config;

const MongoClient = require('mongodb').MongoClient;
const forum = require('../src')(config);

describe('getAllPost', function () {
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL);
            let db = connect.db(DATABASE);
            let post_first = db.collection('post_first');

            await post_first.deleteMany({});
            await post_first.insertMany([
                {
                    "post_title": 'title1',
                    "tag": null,
                    "post_author": 'author1',
                    "post_content": 'content1',
                    "reply_count": 0,
                    "visited": 0
                },
                {
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

        let result = await forum.getAllPost(1);

        let first = result[0];
        let second = result[1];

        expect(first.post_title).to.be.equal('title1');
        expect(first.post_author).to.be.equal('author1');
        expect(second.post_title).to.be.equal('title2');
        expect(second.post_author).to.be.equal('author2');
    })
});
