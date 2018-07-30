const expect = require('chai').expect;
const { url } = require('./common');

const MongoClient = require('mongodb').MongoClient;
const forum = require('../src');

const DATABASE = "ISInformationPlatform"
const COLLECTION = "postlist_1"
const detail_collection = "postdetail_1"

describe('submitPost', function () {
    before(async function () {
        try {
            let connect = await getConnect();
            let collect = connect.db(DATABASE).collection(COLLECTION);

            await collect.deleteMany({});
            connect.close();
        } catch (err) {
            throw err;
        }
    });

    it('test', async function () {
        var data = {
            "post_title": "saber",
            "post_author": "she",
            "post_content": "hello",
            "tag": null,
        };

        try {
            await forum.submitPost(1, data);
            let connect = await getConnect();
            var result = await connect.db(DATABASE).collection(COLLECTION).find({}).sort({}).toArray();

            expect(result).lengthOf(1);
            expect(result[0].post_title).to.be.equal("saber");
            expect(result[0].post_author).to.be.equal("she");
            expect(result[0].post_content).to.be.equal("hello");
        } catch (error) {
            throw error;
        }
    });
});

async function getConnect() {
    try {
        let connect = await MongoClient.connect(url);

        return connect;
    } catch (err) {
        throw err;
    }
}