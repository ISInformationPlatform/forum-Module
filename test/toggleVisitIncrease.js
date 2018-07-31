var expect = require('chai').expect;
const config = require('./config');
const { URL,DATABASE } = config;

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const forum = require('../src')(config);

describe('toggleVisitIncrease',function(){
    var post_first;

    before(async function () {
        try {
            let connect = await MongoClient.connect(URL);
            let db = connect.db(DATABASE);
            post_first = db.collection('post_first');

            await post_first.deleteMany({});
            await post_first.insertMany([
                {
                    "_id": new ObjectId("5b5e6ab1d240333a98094400"),
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
        await forum.toggleVisitIncrease(1, new ObjectId("5b5e6ab1d240333a98094400"));
        var result = await post_first.find({}).sort({}).toArray();

        expect(result).to.have.lengthOf(1);
        expect(result[0].visited).to.equal(1);
    });
});
