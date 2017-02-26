
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
       client.query('SELECT * FROM japenWord where level=1', function (error, result, fields) {
           if (error) {
               console.log(error);
               console.log('쿼리 문장에 오류가 있습니다.');
           } else {
               console.log(result);
               res.render('index', { title : "aaa",wordObj: result });

           }
       })
  },
    seletTable2 : function (data, res) {
        console.log("gogo");
        client.query('SELECT * FROM japenWord where level=1', function (error, result, fields) {
            if (error) {
                console.log(error);
                console.log('쿼리 문장에 오류가 있습니다.');
            } else {
                console.log(result);
                res.render('fakePage', { title : "aaa",wordObj: result });

            }
        })
    },
    addWord : function (data, res) {
        console.log(data);
        var wordText = data.word;
        var meanText = data.mean;
        var meanText2 = ' ';
        client.query('SELECT * FROM japenWord', function (error, result, fields) {
            if (!error) {
                //console.log(result);
                var wordLen = result[result.length-1] == undefined ? 1 : result[result.length-1].num+1;
                //console.log(wordLen);

                //var date  = new Date();
                //    date = (date.getMonth() < 10 ? '0' + (date.getMonth()+ 1) : date.getMonth() + 1) + '-' + date.getDate() + '-' +  date.getFullYear();
                function getTimeStamp() {
                    var d = new Date();

                    var s =
                        leadingZeros(d.getFullYear(), 4) + '-' +
                        leadingZeros(d.getMonth() + 1, 2) + '-' +
                        leadingZeros(d.getDate(), 2) + ' ' +

                        leadingZeros(d.getHours(), 2) + ':' +
                        leadingZeros(d.getMinutes(), 2) + ':' +
                        leadingZeros(d.getSeconds(), 2);

                    return s;
                }



                function leadingZeros(n, digits) {
                    var zero = '';
                    n = n.toString();

                    if (n.length < digits) {
                        for (i = 0; i < digits - n.length; i++)
                            zero += '0';
                    }
                    return zero + n;
                }

                var date = getTimeStamp();
                //console.log('insert into japenWord (word, mean, level, addDate) values( "{wordText}", "{meanText}", 1, {date})'.replace('{wordText}', wordText).replace('{meanText}', meanText).replace('{date}','\''+date+'\''));
                client.query('insert into japenWord (word, mean, level, addDate) values( "{wordText}", "{meanText}", 1, {date})'.replace('{wordText}', wordText).replace('{meanText}', meanText).replace('{date}','\''+date+'\''), function (error, result, fields) {
                    if (error) {
                        console.log(error);
                        console.log('쿼리 문장에 오류가 있습니다.');
                    } else {
                        result.word = wordText;
                        result.mean = meanText;
                        io.sockets.emit('wordAdd',{msg:result});
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

    updateMean2 : function (data, res) {
        var thisTrNumber = data.number;
        console.log(thisTrNumber);
        var mean = data.mean;
        //console.log("update japenWord set mean2='{mean}' where num='{num}'".replace('{mean}', mean).replace('{num}', thisTrNumber));
        client.query("update japenWord set mean2='{mean}' where num='{num}'".replace('{mean}', mean).replace('{num}', thisTrNumber), function (error, result, fields) {
            if (error) {
                console.log(error);
                console.log('쿼리 문장에 오류가 있습니다.');
            } else {
                console.log(result);
                result.number = thisTrNumber;
                result.mean = mean;
                io.sockets.emit('updateMean2',{msg:result});
                res.json(result);
                res.end();
            }
        });
    } ,
    levelWordViews : function (data, res) {
        var selectLevel = data.level;
        var queryText ='SELECT * FROM japenWord where level = {level}'.replace('{level}',selectLevel);
        if(selectLevel == 0){
            queryText = 'SELECT * FROM japenWord ';
        }
        client.query(queryText, function (error, result, fields) {
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
    },
    changeWordLevelUp : function (data, res) {
        var selectNumber = data.number;
        console.log(selectNumber);
        console.log('SELECT * FROM japenWord where num = {number}'.replace('{number}',selectNumber));
        client.query('SELECT * FROM japenWord where num = {number}'.replace('{number}',selectNumber), function (error, result, fields) {
            if (error) {
                console.log(error);
                console.log('쿼리 문장에 오류가 있습니다.');
            } else {
                var resultData = JSON.parse(JSON.stringify(result))[0];
                client.query("update japenWord set level='{level}' where num='{num}'".replace('{num}', selectNumber).replace('{level}', resultData.level+1), function (error, result, fields) {
                    if (error) {
                        console.log(error);
                        console.log('쿼리 문장에 오류가 있습니다.');
                    } else {
                        io.sockets.emit('changeWordLevelUp',{msg:result});
                        res.json(result);
                        res.end();
                    }
                });
            }
        });
    },

    changeWordLevelDown : function (data, res) {
        var selectNumber = data.number;
        client.query("update japenWord set level='{level}' where num='{num}'".replace('{num}', selectNumber).replace('{level}', 1), function (error, result, fields) {
            if (error) {
                console.log(error);
                console.log('쿼리 문장에 오류가 있습니다.');
            } else {
                io.sockets.emit('changeWordLevelDown',{msg:result});
                res.json(result);
                res.end();
            }
        });
    }

};