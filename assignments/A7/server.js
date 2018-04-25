var MS = require("mongoskin");
var db = MS.db("mongodb://localhost:27017/ame470");
var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./credentials.json');
var s3 = new AWS.S3();

var express = require("express");
var app = express();
var bodyParser = require('body-parser');

var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;
app.use(methodOverride());
//app.use(bodyParser());
app.use(require('connect').bodyParser());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

app.get("/", function (req, res) {
    res.redirect("index.html");
});

app.post('/uploadImage', function(req, res){
    var intname = req.body.fileInput;
    var s3Path = '/' + intname;
    var buf = new Buffer(req.body.data.replace(/^data:image\/\w+;base64,/, ""),'base64');
    var params = {
        Bucket:'ame4702018erickfowler',
        ACL:'public-read',
        Key:intname,
        Body: buf,
        ServerSideEncryption : 'AES256'
    };
    s3.putObject(params, function(err, data) {
        console.log(err);
        res.end("success");
    });
});

app.post('/uploadFile', function(req, res){
    var intname = req.body.fileInput;
    var filename = req.files.input.name;
    var fileType =  req.files.input.type;
    var tmpPath = req.files.input.path;
    var s3Path = '/' + intname;
    
    fs.readFile(tmpPath, function (err, data) {
        var params = {
            Bucket:'ame4702018erickfowler',
            ACL:'public-read',
            Key:intname,
            Body: data,
            ServerSideEncryption : 'AES256'
        };
        s3.putObject(params, function(err, data) {
            res.end("success");
            console.log(err);
        });
    });
  });
  
app.get("/getImage", function (req, res) {
	var data = req.query;
	  var id = data.id;
	  db.collection("img").findOne({id:id}, function(err, result){
	        res.end(JSON.stringify(result));
	  });
});

app.get("/getAllImgs", function (req, res) {
  db.collection('img').find().toArray(function(err, items) {
    console.log(err, items);
    if(!items) items = [];
    res.send(items);
  });
});

app.get("/addImg", function (req, res) {
  var data = req.query;
  db.collection("img").insert(data, function(err, result){
    res.send("1");
  });
});


app.get("/renameImg", function (req, res) {
  var data = req.query;
  var newName = data.name;
  var id = data.id;
  console.log(newName, id);
  db.collection("img").findOne({id:id}, function(err, result){
      result.name = newName;
      db.collection("img").save(result, function(err){
        res.end("1");
      });
  });
});

app.get("/imgFilter", function (req, res) {
	var data = req.query;
	var keys = Object.keys(data);
	var id = data.id;
	
    db.collection("img").findOne({id:id}, function(err, result){
		
		for(var i = 0; i < keys.length; i++){
			var key = keys[i];
			result[key] = data[key];
		}
		
        db.collection("img").save(result, function(err){
        res.end("1");
        });
});
 
});


app.get("/deleteImg", function (req, res) {
  var data = req.query;
  var id = data.id;
  db.collection("img").remove({id:id}, function(err, result){
     res.end("1");
  });
});


app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
