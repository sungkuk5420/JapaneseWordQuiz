var express = require('express');
var router = express.Router();
var wordDB = require('../worddb');
var request = require('request');
var qs = require('querystring');
const https = require('https');


/* DEFAULT_API_PROXY */
//router.use('/api', function (req, res) {
//  var options = {
//    method : req.method,
//    url : 'https://glosbe.com/gapi/translate?' + qs.stringify(req.query),
//    json : req.body,
//    pool: {maxSockets: 100}
//  };
//  req.pipe(request(options)).pipe(res);
//});

router.use('/api', function (req, res) {
  var host = 'glosbe.com';
  var port = 443;
  //var url = 'https://glosbe.com/gapi/translate?' + qs.stringify(req.query);
  var url = 'https://glosbe.com/gapi/translate?from=jpn&dest=kor&format=json&pretty=true&phrase=%E6%84%9B';
  var options = {
    host: host,
    port: port,
    url: url,
    method: 'POST',
  };
    var req = https.request(options, function(res) {
        res.on('data', function(data) {
          var dataParse = ab2str(data);
          console.log('11',JSON.stringify(dataParse));
          io.sockets.emit('searchWordApi',{msg : dataParse});
        });
    });
    req.end();

    req.on('error', function(e){
      console.error(e);
    });
});
//router.use('/api', function (req, res) {
//  var options = {
//    method : req.method,
//    url : 'https://glosbe.com/gapi/translate?' + qs.stringify(req.query),
//    json : req.body,
//    pool: {maxSockets: 100}
//  };
//  req.pipe(request(options)).pipe(res);
//});


/* GET home page. */
router.get('/', function(req, res, next) {
  wordDB.seletTable({},res);
});

router.get('/word', function (req, res) {
  console.log("!!");
});

router.post('/wordAdd', function (req, res) {
  //console.log(req.body);
  wordDB.addWord(req.body,res);
});

router.post('/wordDelete', function (req, res) {
  console.log(req.body);
  wordDB.deleteWord(req.body,res);
});

router.post('/updateMean', function (req, res) {
  console.log(req.body);
  wordDB.updateMean(req.body,res);
});

router.post('/levelWordViews', function (req, res) {
  console.log(req.body);
  wordDB.levelWordViews(req.body,res);
});

router.post('/changeWordLevelUp', function (req, res) {
  console.log(req.body);
  wordDB.changeWordLevelUp(req.body,res);
});

router.post('/changeWordLevelDown', function (req, res) {
  console.log(req.body);
  wordDB.changeWordLevelDown(req.body,res);
});

module.exports = router;
function ab2str(buf) {
  var str = "";
  var ab = new Uint16Array(buf);
  var abLen = ab.length;
  var CHUNK_SIZE = Math.pow(2, 16);
  var offset, len, subab;
  for (offset = 0; offset < abLen; offset += CHUNK_SIZE) {
    len = Math.min(CHUNK_SIZE, abLen-offset);
    subab = ab.subarray(offset, offset+len);
    str += String.fromCharCode.apply(null, subab);
  }
  return str;
}