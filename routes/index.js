var express = require('express');
var router = express.Router();
var wordDB = require('../worddb');
var request = require('request');
var qs = require('querystring');

/* DEFAULT_API_PROXY */
router.use('/api', function (req, res) {
  var options = {
    method : req.method,
    url : 'https://glosbe.com/gapi/translate?' + qs.stringify(req.query),
    json : req.body,
    pool: {maxSockets: 100}
  };
  req.pipe(request(options)).pipe(res);
});

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
