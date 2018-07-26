var forum = require('../src');
var expect = require('chai').expect;
const url = "mongodb://localhost:27017/";
const MongoClient = require('mongodb').MongoClient;
const mongo = require('kqudie')(url);

const DATABASE = "ISInformationPlatform";
const COLLECTION = "postcomment_1";

describe('submitComment',function(){
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
    it('test',async function(){
        var data={ 
            'comment_author':'flt',
            'comment_content':'hhhh',
            'reply_to_comment_id':'5'
        };
            let id = await forum.getAllPost(1);
            forum.submitComment(1,id[0]['_id'],data);
            let collect = await getCollect();
            var result = await collect.find({}).sort({}).toArray();

            expect(result).to.have.lengthOf(4);
            expect(result[3].comment_author).to.equal('flt');
            expect(result[3].comment_content).to.equal('hhhh');
            expect(result[3].reply_to_comment_id).to.equal('5');
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