const expect = require('chai').expect;
const config = require('./config');
const { URL,DATABASE } = config;

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const forum = require('../src')(config);

describe('submitComment', function () {
    let post_first;
    let comment_first;

    before(async function () {
        try {
            let connect = await MongoClient.connect(URL);
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

    it('add comment', async function () {
        var data = {
            'comment_author': 'flt',
            'comment_content': 'hhhh'
        };
        await forum.submitComment(1, new ObjectId("5b5e6ab1d240333a98094490"), data);
        let [post_result, comment_result] = await Promise.all([
            post_first.find({}).sort({}).toArray(),
            comment_first.find({}).sort({}).toArray()
        ]);

        expect(post_result).to.have.lengthOf(1);
        expect(post_result[0].reply_count).to.equal(1);

        expect(comment_result).to.have.lengthOf(1);
        expect(comment_result[0].comment_author).to.equal('flt');
        expect(comment_result[0].comment_content).to.equal('hhhh');
   });
});
