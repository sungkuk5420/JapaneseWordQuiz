
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
       })
  },
    addWord : function (data, res) {
        console.log(data);
        var wordText = data.word;
        var meanText = data.mean;
        client.query('SELECT * FROM japenWord', function (error, result, fields) {
            if (!error) {
                console.log(result);
                console.log(result[result.length-1]);
                var wordLen = result[result.length-1] == undefined ? 1 : result[result.length-1].num+1;
                console.log(wordLen);
                client.query('insert into japenWord values( {wordLen}, "{wordText}", "{meanText}" )'.replace('{wordLen}', wordLen).replace('{wordText}', wordText).replace('{meanText}', meanText), function (error, result, fields) {
                    if (error) {
                        console.log(error);
                        console.log('쿼리 문장에 오류가 있습니다.');
                    } else {
                        result.word = wordText;
                        result.mean = meanText;
                        io.sockets.emit('addWord',{msg:result});
                        //res.json(result)
                    }
                });
            } else {
                console.log(error);
                console.log('쿼리 문장에 오류가 있습니다.');
            }
        });
    },

    deleteWord : function (data, res) {
        console.log(data);
        var thisTrNumber = data.number;
        client.query('delete FROM japenWord where num={num}'.replace('{num}',thisTrNumber), function (error, result, fields) {
            if (!error) {
                io.sockets.emit('deleteWord',{msg:'삭제완료', number : data.number});
            } else {
                console.log(error);
                console.log('쿼리 문장에 오류가 있습니다.');
            }
        });
    }

};