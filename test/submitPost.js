const expect = require('chai').expect;
const config = require('./config');
const { URL, DATABASE } = config;

const MongoClient = require('mongodb').MongoClient;
const forum = require('../src')(config);

describe('submitPost', function () {
    var connect;
    var db;
    var post_first;
    var post_second;

    before(async function () {

        try {
            connect = await MongoClient.connect(URL);
            db = connect.db(DATABASE);
            post_first = db.collection("post_first");
            post_second = db.collection("post_second");

            await Promise.all([post_first.deleteMany({}), post_second.deleteMany({})]);
        } catch (err) {
            throw err;
        }
    });

    it('section 1 insert', async function () {
        var data = {
            "post_title": "saber",
            "post_author": "she",
            "post_content": "hello",
            "tag": null,
        };

        try {
            await forum.submitPost(1, data);
            var result = await post_first.find({}).sort({}).toArray();

            expect(result).lengthOf(1);
            expect(result[0].post_title).to.be.equal("saber");
            expect(result[0].post_author).to.be.equal("she");
            expect(result[0].post_content).to.be.equal("hello");
            expect(result[0].reply_count).to.be.equal(0);
            expect(result[0].visited).to.be.equal(0);
        } catch (error) {
            throw error;
        }
    });

    it('section 2 insert', async function () {
        var data = {
            "post_title": "saber",
            "post_author": "she",
            "post_content": "hello",
            "tag": null,
        };

        try {
            await forum.submitPost(2, data);
            var result = await post_second.find({}).sort({}).toArray();

            expect(result).lengthOf(1);
            expect(result[0].post_title).to.be.equal("saber");
            expect(result[0].post_author).to.be.equal("she");
            expect(result[0].post_content).to.be.equal("hello");
            expect(result[0].reply_count).to.be.equal(0);
            expect(result[0].visited).to.be.equal(0);
        } catch (error) {
            throw error;
        }
    });

    it('section 2 insert(sticky)', async function () {
        var data = {
            "post_title": "saber",
            "post_author": "she",
            "post_content": "hello",
            "tag": null,
        };

        var opt = {
            "sticky" : true
        };

        try {
            await forum.submitPost(2, data, opt);
            var result = await post_second.find({}).sort({}).toArray();

            expect(result).lengthOf(2);
            expect(result[1].post_title).to.be.equal("saber");
            expect(result[1].post_author).to.be.equal("she");
            expect(result[1].post_content).to.be.equal("hello");
            expect(result[1].reply_count).to.be.equal(0);
            expect(result[1].visited).to.be.equal(0);
            expect(result[1].sticky).to.be.equal(true);
        } catch (error) {
            throw error;
        }
    });

});
