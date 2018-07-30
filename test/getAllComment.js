const expect = require('chai').expect;
const { URL,DATABASE,POST_COLLECTION,COMMENT_COLLECTION } = require('./common');

const MongoClient = require('mongodb').MongoClient;
const forum = require('../src');
const mongo = require('kqudie')(URL);

describe('getAllComment', function () {
    before(async function () {
        try {
            let collect = await getCollect();

            await collect.deleteMany({});
            await collect.insertMany([
                {
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

        let result = await forum.getAllComment(1,mongo.String2ObjectId("5b5e6ab1d240333a98094490"));

        expect(mongo.ObjectId2String(result[0].post_id)).to.be.equal("5b5e6ab1d240333a98094490");
        expect(result[0].comment_author).to.be.equal("hwfhc");
        expect(result[0].comment_content).to.be.equal("test");
    })
});

async function getCollect() {
    try {
        let connect = await MongoClient.connect(URL);
        let db = connect.db(DATABASE);
        let collect = db.collection(COMMENT_COLLECTION);

        return collect;
    } catch (err) {
        throw err;
    }
}