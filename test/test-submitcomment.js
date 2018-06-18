var forum = require('../src/index.js');

var data = {
  "comment_author" : "admin",
  "reply_to_comment_id" : -1,
  "comment_content" : "Test"
};

var section_id = 1;

var post_id = "5b275dd4f2aaec010e82db02";

forum.submitComment(section_id, post_id, data, function(err, result){
  if(err) console.log(err);
  console.log("submitedcomment " + result);
});
