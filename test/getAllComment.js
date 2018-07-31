const expect = require('chai').expect;
const config = require('./config');
const { URL,DATABASE } = config;

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const forum = require('../src')(config);

describe('getAllComment', function () {
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL);
            let db = connect.db(DATABASE);
            let comment_first = db.collection('comment_first');

            await comment_first.deleteMany({});
            await comment_first.insertMany([
                {
                    "post_id": new ObjectId("5b5e6ab1d240333a98094490"),
                    "comment_author": "hwfhc",
                    "comment_content": "test"
                }
            ]);
        } catch (err) {
            throw err;
        }
    });

    it('test', async function () {

        let result = await forum.getAllComment(1,new ObjectId("5b5e6ab1d240333a98094490"));

        expect(result[0].post_id.toString()).to.be.equal("5b5e6ab1d240333a98094490");
        expect(result[0].comment_author).to.be.equal("hwfhc");
        expect(result[0].comment_content).to.be.equal("test");
    })
});
