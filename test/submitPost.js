const expect = require('chai').expect;

const forum = require('../src');
const mongo = require('kqudie')("mongodb://localhost:27017/");

const database = "ISInformationPlatform"
const list_collection = "postlist_1"
const detail_collection = "postdetail_1"

describe('submitPost', function () {
    before(function (done) {
        mongo.remove(database, list_collection, {}, {}, function (err, result) {
            done();
        });
    });

    it('test', function () {
        var data = {
            "post_title": "saber",
            "post_author": "she",
            "post_content": "hello",
            "tag": null,
        };

        forum.submitPost(1, data)
            .then(() => {
                mongo.find(database, list_collection, {}, {}, function (err, result) {
                    let item = result[0];

                    expect(item.post_title).to.be.equal("saber");
                    expect(item.author).to.be.equal("she");
                    expect(item.content).to.be.equal("hello");
                })
            }).catch(e => {
                console.log(e);
            });
    });

});