
var mysql = require('mysql'),
    DATABASE = 'heroku_8440cf98a79afed';

handleDisconnect();

function handleDisconnect() {
  // Recreate the connection, since
  // the old one cannot be reused.
  client = mysql.createConnection({
    host: 'us-cdbr-iron-east-03.cleardb.net',
    port: '3306',
    user: 'b240f3022f197a',
    password: ''
  });

  client.connect(function(err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    }
  });
  client.on("error", function(err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
  client.query("USE " + DATABASE);
}


var mysqlUtil = module.exports = {

   seletTable : function (data, res) {
       client.query('SELECT * FROM japanWord where level=1', function (error, result, fields) {
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
        client.query('SELECT * FROM japanWord where level=1', function (error, result, fields) {
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
        var wordText = data.word;
        var meanText = data.mean;
        var meanText2 = data.mean2;
        console.log(meanText2);
        client.query('SELECT * FROM japanWord', function (error, result, fields) {
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
                //console.log('insert into japanWord (word, mean, level, addDate) values( "{wordText}", "{meanText}", 1, {date})'.replace('{wordText}', wordText).replace('{meanText}', meanText).replace('{date}','\''+date+'\''));
                client.query('insert into japanWord (word, mean, mean2, level, addDate) values( "{wordText}", "{meanText}", "{meanText2}", 1, {date})'.replace('{wordText}', wordText).replace('{meanText}', meanText).replace('{meanText2}', meanText2).replace('{date}','\''+date+'\''), function (error, result, fields) {
                    if (error) {
                        console.log(error);
                        console.log('쿼리 문장에 오류가 있습니다.');
                    } else {
                        result.word = wordText;
                        result.mean = meanText;
                        result.mean2 = meanText2;
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
        client.query('delete FROM japanWord where num={num}'.replace('{num}',thisTrNumber), function (error, result, fields) {
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
        console.log("update japanWord set mean='{mean}' where num='{num}'".replace('{mean}', mean).replace('{num}', thisTrNumber));
        client.query("update japanWord set mean='{mean}' where num='{num}'".replace('{mean}', mean).replace('{num}', thisTrNumber), function (error, result, fields) {
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
        //console.log("update japanWord set mean2='{mean}' where num='{num}'".replace('{mean}', mean).replace('{num}', thisTrNumber));
        client.query("update japanWord set mean2='{mean}' where num='{num}'".replace('{mean}', mean).replace('{num}', thisTrNumber), function (error, result, fields) {
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
        var queryText ='SELECT * FROM japanWord where level = {level}'.replace('{level}',selectLevel);
        if(selectLevel == 0){
            queryText = 'SELECT * FROM japanWord ';
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
        console.log('SELECT * FROM japanWord where num = {number}'.replace('{number}',selectNumber));
        client.query('SELECT * FROM japanWord where num = {number}'.replace('{number}',selectNumber), function (error, result, fields) {
            if (error) {
                console.log(error);
                console.log('쿼리 문장에 오류가 있습니다.');
            } else {
                var resultData = JSON.parse(JSON.stringify(result))[0];
                client.query("update japanWord set level='{level}' where num='{num}'".replace('{num}', selectNumber).replace('{level}', resultData.level+1), function (error, result, fields) {
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
        client.query("update japanWord set level='{level}' where num='{num}'".replace('{num}', selectNumber).replace('{level}', 1), function (error, result, fields) {
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