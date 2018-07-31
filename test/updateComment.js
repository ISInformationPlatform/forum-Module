var expect = require('chai').expect;
const config = require('./config');
const { URL,DATABASE } = config;

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const forum = require('../src')(config);

describe('updateComment',function(){
    let post_first;
    let comment_first;

    before(async function () {
        try {
            let connect = await MongoClient.connect(URL);
            let db = connect.db(DATABASE);
            post_first = db.collection('post_first');
            comment_first = db.collection('comment_first');

            await Promise.all([post_first.deleteMany({}), comment_first.deleteMany({})]);
            await Promise.all([
                post_first.insertMany([
                    {
                        "_id": new ObjectId("5b5e6ab1d240333a98094490"),
                        "post_title": 'title',
                        "tag": null,
                        "post_author": 'author',
                        "post_content": 'content',
                        "reply_count": 0,
                        "visited": 0
                    }
                ]),
                comment_first.insertMany([
                    {
                        '_id': new ObjectId("5b5e6ab1d240333a98094497"),
                        "post_id": new ObjectId("5b5e6ab1d240333a98094490"),
                        "comment_author": "hwfhc",
                        "comment_content": "test"
                    }
                ])
            ]);
        } catch (err) {
            throw err;
        }
    });
    it('test', async function () {
        var data = {
            'comment_author': 'ji',
            'comment_content': 'laji'
        };
        await forum.updateComment(1, new ObjectId("5b5e6ab1d240333a98094490"), new ObjectId("5b5e6ab1d240333a98094497"), data);
        var result = await comment_first.find({}).sort({}).toArray();

        expect(result).to.have.lengthOf(1);
        expect(result[0].comment_author).to.equal('ji');
        expect(result[0].comment_content).to.equal('laji');
    });
});
