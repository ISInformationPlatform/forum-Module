const expect = require('chai').expect;
const config = require('./config');
const { URL,DATABASE } = config;

const MongoClient = require('mongodb').MongoClient;
const forum = require('../src')(config);

describe('getAllPost', function () {
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL);
            let db = connect.db(DATABASE);
            let post_first = db.collection('post_first');

            await post_first.deleteMany({});
            await post_first.insertMany([
                {
                    "post_title": 'title1',
                    "tag": 0,
                    "post_author": 'author1',
                    "post_content": 'content1',
                    "reply_count": 0,
                    "visited": 0
                },
                {
                    "post_title": 'title2',
                    "tag": 0,
                    "post_author": 'author2',
                    "post_content": 'content2',
                    "reply_count": 0,
                    "visited": 0
                }
            ]);
        } catch (err) {
            throw err;
        }
    });

    it('test1', async function () {

        let page1 = await forum.getAllPost(1,{
            page_num: 1
        });

        let page2 = await forum.getAllPost(1, {
            page_num: 2 
        });

        let first = page1.post_list[0];
        let second = page2.post_list[0];

        expect(page1.total_page_num).to.be.equal(2);
        expect(page2.total_page_num).to.be.equal(2);

        expect(first.post_title).to.be.equal('title1');
        expect(first.post_author).to.be.equal('author1');
        expect(second.post_title).to.be.equal('title2');
        expect(second.post_author).to.be.equal('author2');
    });

    it('test2', async function () {
        opt = {
            page_num: 2
        }
        let result = await forum.getAllPost(1,opt);
        let first = result.post_list[0];
        expect(first.post_title).to.be.equal('title2');
        expect(first.post_author).to.be.equal('author2');
        expect(result.total_page_num).to.be.equal(2);
    })
});
