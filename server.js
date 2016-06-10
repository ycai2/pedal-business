var express = require('express');
var firebase = require("firebase");

var app = express();

app.use(express.static('public'));

firebase.initializeApp({
  serviceAccount: __dirname + "/pedal-business-7fc769ba153b.json",
  databaseURL: "https://pedal-business.firebaseio.com"
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});