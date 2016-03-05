
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
               console.log(result);
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
                //console.log(result);
                var wordLen = result[result.length-1] == undefined ? 1 : result[result.length-1].num+1;
                console.log(wordLen);
                console.log('insert into japenWord values( {wordLen}, "{wordText}", "{meanText}", 1 )'.replace('{wordLen}', wordLen).replace('{wordText}', wordText).replace('{meanText}', meanText));
                client.query('insert into japenWord values( {wordLen}, "{wordText}", "{meanText}", 1 )'.replace('{wordLen}', wordLen).replace('{wordText}', wordText).replace('{meanText}', meanText), function (error, result, fields) {
                    if (error) {
                        console.log(error);
                        console.log('쿼리 문장에 오류가 있습니다.');
                    } else {
                        result.word = wordText;
                        result.mean = meanText;
                        io.sockets.emit('addWord',{msg:result});
                        res.json(result);
                        res.end();
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
                res.end();
            } else {
                console.log(error);
                console.log('쿼리 문장에 오류가 있습니다.');
            }
        });
    },

    updateMean : function (data, res) {
        var thisTrNumber = data.number;
        console.log(thisTrNumber);
        var mean = data.mean;
        console.log("update japenWord set mean='{mean}' where num='{num}'".replace('{mean}', mean).replace('{num}', thisTrNumber));
        client.query("update japenWord set mean='{mean}' where num='{num}'".replace('{mean}', mean).replace('{num}', thisTrNumber), function (error, result, fields) {
            if (error) {
                console.log(error);
                console.log('쿼리 문장에 오류가 있습니다.');
            } else {
                console.log(result);
                result.number = thisTrNumber;
                result.mean = mean;
                io.sockets.emit('updateMean',{msg:result});
                res.json(result);
                res.end();
            }
        });
    } ,
    levelWordViews : function (data, res) {
        var selectLevel = data.level;
        console.log('SELECT * FROM japenWord where level = {level}'.replace('{level}',selectLevel));
        client.query('SELECT * FROM japenWord where level = {level}'.replace('{level}',selectLevel), function (error, result, fields) {
            if (error) {
                console.log(error);
                console.log('쿼리 문장에 오류가 있습니다.');
            } else {
                console.log(result);
                io.sockets.emit('levelWordViews',{msg:result});
                res.json(result);
                res.end();
            }
        });
    }

};