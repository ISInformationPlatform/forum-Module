var forum = require('../src/index.js');

var data = {
  "title" : "Hello World",
  "tag" : ["test"],
  "author" : "admin",
  "content" : "Hello World"
};

var section_id = 1;

forum.submitPost(section_id, data, function(err, result){
  if(err) console.log(err);
  console.log("submitedpost" + result);
});
