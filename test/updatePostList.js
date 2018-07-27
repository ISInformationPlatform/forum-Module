const expect = require('chai').expect;

const url = "mongodb://localhost:27017/";
const MongoClient = require('mongodb').MongoClient;
const forum = require('../src');

const DATABASE = "ISInformationPlatform";
const COLLECTION = "postlist_1";

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
            "post_title": "国际化",
            "post_author": "龚佑成",
            "post_content": "婷姐的项目",
            "tag": null,
        };
        var data1 = {
            "post_title": "saber",
            "post_author": "she",
            "post_content": "hello",
            "tag": null,
        };

        try {
            await forum.submitPost(1, data1);
            let post_id = await forum.getAllPost(1);
            await forum.updatePostList(1,post_id[0]['_id'],data);
            let connect = await getConnect();
            var result = await connect.db(DATABASE).collection(COLLECTION).find({}).sort({}).toArray();

            expect(result).lengthOf(1);
            expect(result[0].post_title).to.be.equal("国际化");
            expect(result[0].post_author).to.be.equal("she");
            expect(result[0].post_content).to.be.equal("婷姐的项目");
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