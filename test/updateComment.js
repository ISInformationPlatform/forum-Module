var forum = require('../src');
var expect = require('chai').expect;
const { URL,DATABASE,POST_COLLECTION,COMMENT_COLLECTION } = require('./common');

const MongoClient = require('mongodb').MongoClient;
const mongo = require('kqudie')(URL);

describe('updateComment',function(){
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
        var data1 = {
            "post_title": "saber",
            "post_author": "she",
            "post_content": "hello",
            "tag": null,
        };
        await forum.submitPost(1, data1);
        var data2 = {
            'comment_author': 'ji',
            'comment_content': 'laji',
            'reply_to_comment_id': '6'
        };
        let post_id = await forum.getAllPost(1);
        await forum.submitComment(1, post_id[0]['_id'], data);  
        let connect = await getConnect();
        let db = connect.db(DATABASE);
        let post_collect = db.collection(COMMENT_COLLECTION);
        var result = await post_collect.find({}).sort({}).toArray();
        await forum.updateComment(1,post_id[0]['_id'],result[0]['_id'],data2);
        result= await post_collect.find({}).sort({}).toArray();

        expect(result).to.have.lengthOf(1);
        expect(result[0].comment_author).to.equal('ji');
        expect(result[0].comment_content).to.equal('laji');
        expect(result[0].reply_to_comment_id).to.equal('6');
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