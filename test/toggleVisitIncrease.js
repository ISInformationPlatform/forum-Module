var forum = require('../src');
var expect = require('chai').expect;
const { URL,DATABASE,POST_COLLECTION,COMMENT_COLLECTION } = require('./common');

const MongoClient = require('mongodb').MongoClient;
const mongo = require('kqudie')(URL);

describe('toggleVisitIncrease',function(){
    before(async function () {
        try {
            let connect = await getConnect();

            let db = connect.db(DATABASE);
            let post_collect = db.collection(POST_COLLECTION);

            await post_collect.deleteMany({});
            await post_collect.insertMany([
                {
                    "visited": 0,
                    "text": 'asdfa'
                },
                {
                    "visited": 0,
                    "text": 'asdfa'
                }
            ]);

            let comment_collect = db.collection(COMMENT_COLLECTION);
            await comment_collect.deleteMany({});

            connect.close();
        } catch (err) {
            throw err;
        }
    });
    it('test', async function () {
        let list = await forum.getAllPost(1);
        await forum.toggleVisitIncrease(1, list[0]['_id']);

        let connect = await getConnect();

        let db = connect.db(DATABASE);
        let post_collect = db.collection(POST_COLLECTION);
        var result = await post_collect.find({}).sort({}).toArray();

        expect(result).to.have.lengthOf(2);
        expect(result[0].visited).to.equal(1);
        expect(result[1].visited).to.equal(0);
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