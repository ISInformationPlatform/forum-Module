var forum = require('../src');
var expect = require('chai').expect;

const url = "mongodb://localhost:27017/";
const MongoClient = require('mongodb').MongoClient;
const mongo = require('kqudie')(url);

const DATABASE = "ISInformationPlatform";
const COMMENT_COLLECTION = "postcomment_1";
const POST_COLLECTION = "postlist_1";

describe('submitComment',function(){
    before(async function () {
        try {
            let connect = await getConnect();

            let db = connect.db(DATABASE);
            let post_collect = db.collection(POST_COLLECTION);

            await post_collect.deleteMany({});
            await post_collect.insertMany([
                { a: 1 }, { a: 2 }, { a: 3 }
            ]);

            let comment_collect = db.collection(COMMENT_COLLECTION);
            await comment_collect.deleteMany({});

            connect.close();
        } catch (err) {
            throw err;
        }
    });
    it('test', async function () {
        var data = {
            'comment_author': 'flt',
            'comment_content': 'hhhh',
            'reply_to_comment_id': '5'
        };

        let id = await forum.getAllPost(1);
        await forum.submitComment(1, id[0]['_id'], data);

        let connect = await getConnect();

        let db = connect.db(DATABASE);
        let post_collect = db.collection(COMMENT_COLLECTION);
        var result = await post_collect.find({}).sort({}).toArray();

        expect(result).to.have.lengthOf(1);
        expect(result[0].comment_author).to.equal('flt');
        expect(result[0].comment_content).to.equal('hhhh');
        expect(result[0].reply_to_comment_id).to.equal('5');
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