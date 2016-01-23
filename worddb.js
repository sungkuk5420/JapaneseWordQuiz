
var mysql = require('mysql')
    , DATABASE = 'japenWord'
    , word_TABLE = 'japenWord'
    , NUM = 1
    , client = mysql.createConnection({
    host: '52.34.253.229'
    , port: '3306'
    , user: 'sungkuk.kim'
    , password: '165112'
});
client.connect();
client.query('USE ' + DATABASE);



var mysqlUtil = module.exports = {

   seletTable : function (data, res) {
       console.log("gogo");
       client.query('SELECT * FROM japenWord', function (error, result, fields) {
           if (error) {
               console.log(error);
               console.log('쿼리 문장에 오류가 있습니다.');
           } else {
               res.render('index', { title : "aaa",wordObj: result });

           }
       });
  },
    addWord : function (data, res) {
        console.log(data.word);
        var wordText = data.word;
        client.query('SELECT * FROM japenWord', function (error, result, fields) {
            if (!error) {
                var wordLen = result.length+1;
                client.query('insert into japenWord values( {wordLen}, "{wordText}", "몰라 뜻몰라" )'.replace('{wordLen}', wordLen).replace('{wordText}', wordText), function (error, result, fields) {
                    if (error) {
                        console.log(error);
                        console.log('쿼리 문장에 오류가 있습니다.');
                    } else {
                        console.log("등록완료");
                        //res.json(result)
                    }
                });
            } else {
                console.log(error);
                console.log('쿼리 문장에 오류가 있습니다.');
            }
        });


        //client.query(
        //    'SELECT * FROM ' + book_TABLE + ' WHERE name = ?'
        //  , [book.name]
        //  , function (err, results, fields) {
        //      if (err) {
        //          throw err;
        //      }
        //      if (results.length > 0) {
        //          res.render('bookAddFail', {
        //              title: 'bookAddFail'
        //          });
        //      } else {
        //          mysqlUtil.hasBookName(book, res);
        //      }
        //  });
    }

};