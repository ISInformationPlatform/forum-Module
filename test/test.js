var url = "mongodb://mongo:27017/";

var mongo = require('../lib/mongo.js')(url);

var database = "test";
var collection = "test";

var findObj1 = {};

mongo.find(database, collection, findObj1, function(err, result){
  if(err) console.log(err);
  console.log(result[0]._id);
  console.log(typeof (result[0]._id).toString());
  console.log(Date.parse((result[0]._id).getTimestamp()));
  console.log(mongo.ObjectId2String(result[0]._id));
  console.log(mongo.ObjectId2UnixTimeStamp(result[0]._id));
});

var findObj2 = "5b1e7f1e24e8ab001663b37a";

mongo.findByObjectId(database, collection, findObj2, function(err, result){
  if(err) console.log(err);
  console.log(result);
});
