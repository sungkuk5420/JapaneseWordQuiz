var express = require('express');
var router = express.Router();
var wordDB = require('../worddb');
var request = require('request');
var qs = require('querystring');
var https = require('https');
const axios = require('axios');
const cheerio = require('cheerio');


router.use('/api', function (req, res) {
  console.log(qs.stringify(req.query));
  var host = 'glosbe.com';
  var port = 443;
  var url = 'https://glosbe.com/gapi/translate?' + qs.stringify(req.query);
  //var url = 'https://glosbe.com/gapi/translate?from=jpn&dest=kor&format=json&pretty=true&phrase=愛';
  var options = {
    host: host,
    port: port,
    url: url,
    method: 'GET',
    headers: {
      'Content-Type': 'text/javascript; charset=UTF-8'
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info.stargazers_count + " Stars");
      console.log(info.forks_count + " Forks");
      res.end(JSON.stringify(response.body));
    } else {
      console.log(error);
      res.end('error');
    }
  }

  request(options, callback);



  /*
    request(options, function(err, response, body) {

      if(err) {
        return res.send({
          success : false,
          data : {}
        });
      }
      response.pipe(res);


        return res.send({
          success : true,
          data : body
        });


      ////res.headers = ('Content-Type', 'text/plain');
      //console.log('statusCode: ', res.statusCode);
      //console.log('headers: ', res.headers);
      //
      //  res.on('data', function(data) {
      //    //console.log( JSON.stringify(ab2str(data)));
      //    io.sockets.emit('searchWordApi',{msg : ab2str(data)});
      //  });
    });
    */
  //console.log(req);
  //  req.end();
  //
  //  req.on('error', function(e){
  //    console.error(e);
  //  });
});

router.use('/crawler', function (req, res) {
  console.log('https://ja.dict.naver.com/search.nhn?range=all&' + qs.stringify(req.query) + '&sm=jpd_hty');
  const crawler = async () => {
    const response = await axios.get('https://ja.dict.naver.com/search.nhn?range=all&' + qs.stringify(req.query) + '&sm=jpd_hty');
    //한자 검색후 자동 입력.
    if (response.status === 200) {
      const html = response.data;
      // console.log(html);
      const $ = cheerio.load(html);
      const $content = $('#content');
      const $resultLink = $content.find('.section.all.section_word .srch_box .entry.type_hj span.jp');
      if ($resultLink.length !== 0) {
        var hanjaText = $resultLink.eq(0).text();
        var queryString = {
          q: hanjaText
        };
        console.log('https://ja.dict.naver.com/search.nhn?range=all&' + qs.stringify(queryString) + '&sm=jpd_hty?');
        const response2 = await axios.get('https://ja.dict.naver.com/search.nhn?range=all&' + qs.stringify(queryString) + '&sm=jpd_hty?');
        //한자를 찾은후 그 한자로 음독훈독 검색
        if (response2.status === 200) {
          const html2 = response2.data;
          // console.log(html2);
          const $2 = cheerio.load(html2);
          const $content2 = $2('#content');
          // const $resultLink2 = $content2.find('.section_word');
          const $resultLink2 = $content2.find('.section.all.section_word .srch_box').eq(0).find('.top_dn>dd.jp span');
          console.log($resultLink2.length);
          var undokuArr = [];
          for (var i = 0, len = $resultLink2.length; i < len; i++) {
            var element = $resultLink2.eq(i);
            if (element.hasClass('bar')) {
              break;
            }
            undokuArr.push($resultLink2.eq(i).text());
          }
          console.log(undokuArr);
          if ($resultLink2.length !== 0) {
            var hanjaUndoku = undokuArr.join().replace(/,/gi, ''); //음독 검색
            res.send(JSON.stringify({
              'kanji': hanjaText,
              'undoku': hanjaUndoku
            }));
            res.end();
          } else {
            res.send('error');
            res.end();
          }
        }
      } else {
        res.send('error');
        res.end();
      }
    }
  };

  crawler();
});

router.use('/crawlerJLPT', function (req, res) {
  console.log('https://ja.dict.naver.com/search.nhn?range=all&' + qs.stringify(req.query) + '&sm=jpd_hty');
  const crawler = async () => {
    const response = await axios.get('https://ja.dict.naver.com/search.nhn?range=all&' + qs.stringify(req.query) + '&sm=jpd_hty');
    //한자 검색후 자동 입력.
    if (response.status === 200) {
      const html = response.data;
      // console.log(html);
      const $ = cheerio.load(html);
      const $content = $('#content');
      let $resultLink = $content.find('.section.all.section_word .srch_box:nth-child(2) .srch_top .entry a.mw'); // 음독
      let $resultLinkHasATag = $content.find('.section.all.section_word .srch_box:nth-child(2) .srch_top>a'); // 음독
      console.log($resultLinkHasATag.length);
      let $resultLink2 = $content.find('.section.all.section_word .srch_box:nth-child(2) .lst.lst_v3'); //뜻
      if ($resultLink2.length === 0) {
        $resultLink2 = $content.find('.section.all.section_word .srch_box:nth-child(2) .pin span.lst_txt'); //뜻
      }
      if(($resultLinkHasATag.length === 0) || ($resultLink2.length === 0)){//첫번째행에 음독이 안나올경우 두번째행부터 탐색.
        $resultLinkHasATag = $content.find('.section.all.section_word .srch_box:nth-child(4) .srch_top>a'); // 음독
        if($resultLinkHasATag.length !== 0){
          $resultLink = $content.find('.section.all.section_word .srch_box:nth-child(4) .entry a.mw'); //음독
          $resultLink2 = $content.find('.section.all.section_word .srch_box:nth-child(4) .lst.lst_v3'); //뜻
          if ($resultLink2.length === 0) {
            $resultLink2 = $content.find('.section.all.section_word .srch_box:nth-child(4) .pin span.lst_txt'); //뜻
          }
        }else{
          $resultLink = $content.find('.section.all.section_word .srch_box:nth-child(6) .entry a.mw'); //음독
          $resultLink2 = $content.find('.section.all.section_word .srch_box:nth-child(6) .lst.lst_v3'); //뜻
          if ($resultLink2.length === 0) {
            $resultLink2 = $content.find('.section.all.section_word .srch_box:nth-child(6) .pin span.lst_txt'); //뜻
          }
        }
      }
      if(($resultLink.length === 0) || ($resultLink2.length === 0)){
        $resultLink = $content.find('.section.all.section_word .srch_box .srch_top .entry a.mw');
        $resultLink2 = $content.find('.section.all.section_word .srch_box .lst.lst_v3'); //뜻
        if ($resultLink2.length === 0) {
          $resultLink2 = $content.find('.section.all.section_word .srch_box .pin span.lst_txt'); //뜻
        }
        if ($resultLink2.length === 0) {
          $resultLink2 = $content.find('.section.all.section_word .srch_box span.lst_txt'); //뜻
        }
      }
      console.log($resultLink.length);
      console.log($resultLink2.length);
      if ($resultLink2.length !== 0) {
        var hanjaUndoku = $resultLink.eq(0).text();
        var mean = $resultLink2.eq(0).text();
        console.log(hanjaUndoku);
        console.log(mean);
        if (hanjaUndoku.length !== "") {
          res.send(JSON.stringify({
            'kanji': mean,
            'undoku': hanjaUndoku
          }));
          res.end();
        } else {
          res.send('error');
          res.end();
        }
      }
    }
  };

  crawler();
});

/* GET home page. */
router.get('/', function (req, res, next) {
  wordDB.seletTable({}, res);
});

router.get('/word', function (req, res) {
  console.log("!!");
});

router.post('/wordAdd', function (req, res) {
  console.log(req.body);
  wordDB.addWord(req.body, res);
});

router.post('/wordDelete', function (req, res) {
  console.log(req.body);
  wordDB.deleteWord(req.body, res);
});

router.post('/updateMean', function (req, res) {
  console.log(req.body);
  wordDB.updateMean(req.body, res);
});

router.post('/updateMean2', function (req, res) {
  console.log(req.body);
  wordDB.updateMean2(req.body, res);
});

router.post('/levelWordViews', function (req, res) {
  console.log(req.body);
  wordDB.levelWordViews(req.body, res);
});

router.post('/changeWordLevelUp', function (req, res) {
  console.log(req.body);
  wordDB.changeWordLevelUp(req.body, res);
});

router.post('/changeWordLevelDown', function (req, res) {
  console.log(req.body);
  wordDB.changeWordLevelDown(req.body, res);
});

module.exports = router;

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}