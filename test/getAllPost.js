const expect = require('chai').expect;
const { url } = require('./common');

const MongoClient = require('mongodb').MongoClient;
const forum = require('../src');

const DATABASE = "ISInformationPlatform"
const COLLECTION = "postlist_1"
const detail_collection = "postdetail_1"

describe('getAllPost', function () {
    before(async function () {
        try {
            let collect = await getCollect();

            await collect.deleteMany({});
            await collect.insertMany([
                { a: 1 }, { a: 2 }, { a: 3 }
            ]);
        } catch (err) {
            throw err;
        }
    });

    it('test', async function () {

        let result = await forum.getAllPost(1);
        let first = result[0];
        let second = result[1];
        let third = result[2];

        expect(first.a).to.be.equal(1);
        expect(second.a).to.be.equal(2);
        expect(third.a).to.be.equal(3);
    })
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