var express = require("express");
var app = express();
var bodyParser = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
var router = express.Router();
var path = __dirname + '/public/';

app.set('port', (process.env.PORT || 3000));
router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/signin",function(req,res){
  res.sendFile(path + "signin.html");
});

router.get("/register",function(req,res){
  res.sendFile(path + "register.html");
}).post("/register",function(req,res){
  res.send(req.body);
});

app.use("/",router);
app.use(express.static('static'));


app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(app.get('port'),function(){
  console.log("Live at Port", app.get('port'));
});