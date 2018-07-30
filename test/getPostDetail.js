const expect = require('chai').expect;
const { URL,DATABASE,POST_COLLECTION,COMMENT_COLLECTION } = require('./common');

const MongoClient = require('mongodb').MongoClient;
const mongo = require('kqudie')(URL);

const forum = require('../src');

describe('getPostDetail', function () {
    before(async function () {
        try {
            let collect = await getCollect();

            await collect.deleteMany({});
            await collect.insertOne({
                'title': 'saber',
                'content': 'she',
            });
        } catch (err) {
            throw err;
        }
    });

    it('test', async function () {
        let list = await mongo.find(DATABASE, POST_COLLECTION, {
            find: {}, sort: {}
        });

        let result = await forum.getPostDetail(1, list[0]._id);

        expect(result[0].title).to.be.equal("saber");
        expect(result[0].content).to.be.equal("she");
    });

});

async function getCollect() {
    try {
        let connect = await MongoClient.connect(URL);
        let db = connect.db(DATABASE);
        let collect = db.collection(POST_COLLECTION);

        return collect;
    } catch (err) {
        throw err;
    }
}