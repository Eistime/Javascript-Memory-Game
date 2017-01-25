var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var projectUrl = 'mongodb://localhost:27017/memo';
var db;

var findScores = function(callback){
  MongoClient.connect(projectUrl, function(err, db){
    var scoresCollection = db.collection('scores');
    scoresCollection.find({}).sort( { timeStamp: -1 } ).toArray(function(err, scores){
      assert.equal(err, null);
      callback(scores);
    });
  });
};

function save(score, callback){
  MongoClient.connect(projectUrl, function(err, db){
    assert.equal(null, err);
    db = db;
    insertData(db, score, function(){
      db.close();
      callback();
    });
  });
};

var insertData = function(db, data, callback){
  var scoreCollection = db.collection('scores');
  scoreCollection.insert([data], (err, result) => {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    callback(result);
  });
};

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/scores', (req, res) => {
  var scores = findScores((scores) => {
    res.json(scores);
  });
});

app.post('/scores', (req, res) => {
  var timeStamp = Math.floor(Date.now() / 1000);
  var data = req.body;
  data.timeStamp = timeStamp;
  save(data, () => {
    res.send('ok');
  });
});

app.listen(3000, () => {
  console.log('server up!');
});
