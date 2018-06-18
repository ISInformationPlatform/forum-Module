var url = "mongodb://127.0.0.1:27017/";

var mongo = require('../lib/mongo')(url);

mongo.find("test", "test", {}, function(err, result){
    if(err) console.log(err);
    console.log(result);
});
