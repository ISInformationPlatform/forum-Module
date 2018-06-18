var forum = require('../src/index.js');

var section_id = 1;

var post_id = "5b275dd4f2aaec010e82db02";

forum.getAllComment(section_id, post_id, function(err, result){
  if(err) console.log(err);
  console.log(result);
});
