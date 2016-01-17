var express = require('express');
var router = express.Router();
var worddb = require('../worddb');


//client.end();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  worddb.seletTable();
});

router.get('/book', function (req, res) {
  console.log("!!");
});

module.exports = router;
