const expect = require('chai').expect;

const url = "mongodb://localhost:27017/";
const MongoClient = require('mongodb').MongoClient;
const mongo = require('kqudie')(url);

const forum = require('../src');

const DATABASE = "ISInformationPlatform";
const COLLECTION = "postlist_1";
const detail_collection = "postdetail_1";

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
        let list = await mongo.find(DATABASE, COLLECTION, {
            find: {}, sort: {}
        });

        let result = await forum.getPostDetail(1, list[0]._id);

        expect(result[0].title).to.be.equal("saber");
        expect(result[0].content).to.be.equal("she");
    });

});

async function getCollect() {
    try {
        let connect = await MongoClient.connect(url);
        let db = connect.db(DATABASE);
        let collect = db.collection(COLLECTION);

        return collect;
    } catch (err) {
        throw err;
    }
}