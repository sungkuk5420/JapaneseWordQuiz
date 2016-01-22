var express = require('express');
var router = express.Router();
var wordDB = require('../worddb');


//client.end();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "" });
});

router.get('/book', function (req, res) {
  console.log("!!");
});

router.get('/words',function(req,res){
  wordDB.seletTable({},res);
});
module.exports = router;
