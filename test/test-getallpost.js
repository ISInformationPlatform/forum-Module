var forum = require('../src/index.js');

var section_id = 1;

forum.getAllPost(section_id, function(err, result){
  if(err) console.log(err);
  console.log(result);
});
