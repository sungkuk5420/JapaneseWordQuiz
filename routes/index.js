var express = require('express');
var router = express.Router();
var wordDB = require('../worddb');


//client.end();

/* GET home page. */
router.get('/', function(req, res, next) {
  wordDB.seletTable({},res);
});

router.get('/word', function (req, res) {
  console.log("!!");
});

router.post('/wordAdd', function (req, res) {
  var cookie = eval('(' + JSON.stringify(req.cookies) + ')');
  var bodyKeys = Object.keys(req.body);
  //console.log(cookie);
  //console.log(bodyKeys);
  //console.log(req.body);
  wordDB.addWord(bodyKeys,res);
  //console.log(req);
});

router.get('/words',function(req,res){


});
module.exports = router;
