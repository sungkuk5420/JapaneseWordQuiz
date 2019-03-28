var socket = io.connect('http://localhost:7000');
var apiUrl = 'http://localhost:7000';
// var socket = io.connect('http://13.125.125.39:7000');
// var apiUrl = 'http://13.125.125.39:7000';

var wordArr = new Array();
var meanArr = new Array();
var numberObj ="";
var wordArrObj ="";
var meanArrObj ="";
var meanArrObj2 ="";
var meanArrDate ="";
var dbWordArr =new Array();
var isWordAnswerFail = false;
var isClickWordFlag = false;
var isMeanShowFlag = false;


wordObjArr = new Array();

$(document).ready(function (aa,bb) {
	$(document).keydown(function(e){
		//console.log(e.keyCode);
		switch(e.keyCode){
            case 192:
                if(isMeanShowFlag == false){
                    wordTextHide($('.pt-left-word-div'));
                    isMeanShowFlag = true;
                }else{
                    wordTextShow($('.pt-left-word-div'));
                    isMeanShowFlag = false;
                }
                break;
			case 96:
                if(isMeanShowFlag == false){
                    wordTextHide($('.pt-left-word-div'));
                    isMeanShowFlag = true;
                }else{
                    wordTextShow($('.pt-left-word-div'));
                    isMeanShowFlag = false;
                }
			break;
            case 49:
                $('#pt-word-text-0').closest('.pt-right-word-div')[0].onmouseup();
                break;
            case 50:
                $('#pt-word-text-1').closest('.pt-right-word-div')[0].onmouseup();
                break;
            case 51:
                $('#pt-word-text-2').closest('.pt-right-word-div')[0].onmouseup();
                break;
            case 52:
                $('#pt-word-text-3').closest('.pt-right-word-div')[0].onmouseup();
                break;
            case 97:
				$('#pt-word-text-0').closest('.pt-right-word-div')[0].onmouseup();
			break;
			case 98:
				$('#pt-word-text-1').closest('.pt-right-word-div')[0].onmouseup();
			break;
			case 99:
				$('#pt-word-text-2').closest('.pt-right-word-div')[0].onmouseup();
			break;
			case 100:
				$('#pt-word-text-3').closest('.pt-right-word-div')[0].onmouseup();
			break;
		}
	});
    numberObj = ($('#pt-server-side-data').find('.number').text().replace(/ /gi,'').split(';;'));
    wordArrObj = ($('#pt-server-side-data').find('.word').text().replace(/ /gi,'').split(';;'));
    meanArrObj = ($('#pt-server-side-data').find('.mean').text().replace(/ /gi,'').split(';;'));
    meanArrObj2 = ($('#pt-server-side-data').find('.mean2').text().replace(/ /gi,'').split(';;'));
    meanArrDate = ($('#pt-server-side-data').find('.date').text().replace(/ /gi,'').split(';;'));


    for(var i= 0, len = wordArrObj.length ; i <len ; i++){
        if(wordArrObj[i].replace(/ /gi,'') != '' ){
            dbWordArr.push({
                num : numberObj[i],
                word : wordArrObj[i],
                mean : meanArrObj[i],
                mean2 : meanArrObj2[i],
                date : meanArrDate
            });
        }
    }


    wordShuffleChange();
    //GetData();
});

function wordTextHide(thisObj){
    $(thisObj).parent().find('.pt-word-text').hide();
    $(thisObj).parent().find('#pt-word-text-quiz-answer').show();
}

function wordTextShow(thisObj){
    $(thisObj).parent().find('.pt-word-text').show();
    $(thisObj).parent().find('#pt-word-text-quiz-answer').hide();
}

function clickWord(data){
    var thisWord = $(data.self).find('.pt-word-text').text().replace(/ /gi,'');
    var quizAnswer = $("#pt-word-text-quiz-answer").text().replace(/ /gi,'').substr(0,$("#pt-word-text-quiz-answer").text().replace(/ /gi,'').indexOf('('));
    var quizBackgroundColor = $(".pt-left-word-div").css("background-color");
    if(thisWord == quizAnswer && isClickWordFlag == false){
        isClickWordFlag = true;
        if(isWordAnswerFail == false){
            changeWordLevelUp(quizAnswer);
        }
        $('.pt-right-word-div').find('.pt-word-text').css({
            color : quizBackgroundColor
        });
        wordShuffleChange();
    }else{
        changeWordLevelDown(quizAnswer);
        isWordAnswerFail = true;
        $(data.self).find('.pt-word-text').css({
            color : "red"
        });
    }
}

function changeWordLevelUp(quizAnswer){
    var thisTrNumber = -1;
    for(var i= 0,len=dbWordArr.length ; i <len ; i++){
        if(dbWordArr[i].mean.replace(/ /gi,'') === quizAnswer.replace(/ /gi,'')){
            thisTrNumber =  dbWordArr[i].num;
        }
    }
    var data = {
        number : thisTrNumber
    };
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: apiUrl+'/changeWordLevelUp',
        success: function(data) {
            console.log('success');
        }
    });

    socket.removeListener('changeWordLevelUp');
    socket.on('changeWordLevelUp',function(data){
        result = JSON.parse(JSON.stringify(data.msg));
    });

}

function changeWordLevelDown(quizAnswer){
    var thisTrNumber = -1;
    for(var i= 0,len=dbWordArr.length ; i <len ; i++){
        if(dbWordArr[i].mean.replace(/ /gi,'') === quizAnswer.replace(/ /gi,'')){
            thisTrNumber =  dbWordArr[i].num;
        }
    }
    var data = {
        number : thisTrNumber
    };
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: apiUrl+'/changeWordLevelDown',
        success: function(data) {
            console.log('success');
        }
    });

    socket.removeListener('changeWordLevelDown');
    socket.on('changeWordLevelDown',function(data){
        result = JSON.parse(JSON.stringify(data.msg));
    });

}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function wordShuffleChange(){
    wordArr = [];
    meanArr = [];

    for(var i= 0, len = wordArrObj.length ; i <len ; i++){
        wordArr.push(wordArrObj[i]);
    }
    for(var i= 0, len = meanArrObj.length ; i <len ; i++){
        meanArr.push(meanArrObj[i]);
    }
    $('.pt-word-book-index').text(wordArr.length);
    $('.pt-word-book-total').text(meanArr.length);
    shuffle(wordArr);
    shuffle(meanArr);
    quizWordShuffleChange();
    isWordAnswerFail = false;
    var quizBackgroundColor = $(".pt-left-word-div").css("background-color");
    $('.pt-right-word-div').find('.pt-word-text').css({
        color : quizBackgroundColor
    });
    if(meanArr[3] != undefined){
        for (var i = 0; i < 4; i++) {
            $("#pt-word-text-" + i).text(meanArr[i]);
            var width = $("#pt-word-text-" + i).width() / 2;
            $("#pt-word-text-" + i).css({
                left: "calc(50% - " + width + "px)"
            });
        }
    }
    var isHaveAnswer =false;
    var quizAnswer = $(".pt-left-word-div #pt-word-text-quiz-answer").text();
    var ansewerIndex = 0;
    if(meanArr[3] != undefined) {
        for (var i = 0; i < 4; i++) {
            if (meanArr[i].replace(/ /gi, '') === quizAnswer.replace(/ /gi, '')) {
                isHaveAnswer = true;
            }
        }
    }
    var test_random_num = Math.floor(Math.random()*4);
    if(isHaveAnswer == false){
        for(var i= 0,len=dbWordArr.length ; i <len ; i++){
            if(dbWordArr[i].mean.replace(/ /gi,'') === quizAnswer.replace(/ /gi,'')){
                $("#pt-word-text-"+test_random_num).text(quizAnswer);
                var width = $("#pt-word-text-"+test_random_num).width()/2;
                $("#pt-word-text-"+test_random_num).css({
                    left: "calc(50% - "+ width +"px)"
                });
            }
        }
    }else{
        var width = $("#pt-word-text-"+ansewerIndex).width()/2;
        $("#pt-word-text-"+ansewerIndex).css({
            left: "calc(50% - "+ width +"px)"
        });
    }
    for(var i= 0,len=dbWordArr.length ; i <len ; i++){
        if(dbWordArr[i].mean.replace(/ /gi,'') === quizAnswer.replace(/ /gi,'')){
            $(".pt-left-word-div #pt-word-text-quiz-answer").html(quizAnswer+ ' <br> ( ' +dbWordArr[i].mean2 + ' )') ;
            var width =$(".pt-left-word-div #pt-word-text-quiz-answer").width()/2;
            $(".pt-left-word-div #pt-word-text-quiz-answer").css({
                left: "calc(50% - "+ width +"px)"
            });
        }
    }

}

function quizWordShuffleChange(){
    $("#pt-word-text-quiz").text(wordArr[0]);
    var quizAnswer = '';
    var removeIndex = wordArrObj.indexOf(wordArr[0]);
    if(removeIndex != -1){
        Array.remove(wordArrObj,removeIndex);
        //Array.remove(meanArrObj,removeIndex);
    }else{
        console.log(wordArr[0]);
    }

    isClickWordFlag = false;
    for(var i= 0,len=dbWordArr.length ; i <len ; i++){
        if(dbWordArr[i].word.replace(/ /gi,'') === wordArr[0].replace(/ /gi,'')){
            quizAnswer = dbWordArr[i].mean;
        }
    }
    $(".pt-left-word-div #pt-word-text-quiz-answer").text(quizAnswer);

    var quizWidth = $("#pt-word-text-quiz").width()/2;
    var quizHeight = $("#pt-word-text-quiz").height()/2;
    var width = $("#pt-word-text-quiz-answer").width()/2;
    var height = $("#pt-word-text-quiz-answer").height()/2;


    $("#pt-word-text-quiz").css({
        left: "calc(50% - "+ quizWidth +"px)",
        top:"calc(50% - "+ quizHeight +"px)"
    });

    $(".pt-left-word-div #pt-word-text-quiz-answer").css({
        left: "calc(50% - "+ width +"px)",
        top:"calc(50% - "+ height +"px)",
        position: "absolute"
    });
}

function searchWordApi(parameterWordText){
    console.log('search!!');
    $('.pt-word-add-form')[0].value = '';
    $('.pt-mean-add-form')[0].value = '';
    var $wordList =  $('.pt-word-table').find('.word');
    var isHaveWord = false;
    for(var i= 0,len = $wordList.length ; i < len ; i++){
        if($wordList.eq(i).text().replace(/ /gi, '')==parameterWordText.replace(/ /gi, '')){
            isHaveWord = true;
        }
    }
    if(isHaveWord){
        $('.pt-word-add-form').focus();
        return false;
    }
    console.log('ajax!!');
    var data = {
        query : parameterWordText //string
    };
    $.ajax({
        type: "GET",
        beforeSend: function (request) {
            request.setRequestHeader("content-type", 'text/javascript');
        },
        data : {
            // from : 'kor',
            // dest : 'jpn',
            // format : 'json',
            // pretty : 'true',
            // phrase : data.query
            query : data.query,
            direct : false
        },
        scriptCharset: 'UTF-8',
        dataType:'json',
        url: "/crawler",
        success: function (res) {
            console.log('success');
            var wordText = parameterWordText;
            var response = res === 'error' ? '' :res;
            console.log(response);
            addWordApi(wordText,response.kanji,response.undoku);
            // var wordText = res.phrase;
            // var meanArr = new Array();
            // var res = JSON.parse(res);
            // wordText = res.phrase;
            // for(var i= 0,len = res.tuc.length; i<len ; i++){
            //     if(res.tuc[i].phrase == undefined){
            //         meanArr.push("");
            //     }else{
            //         meanArr.push( res.tuc[i].phrase.text );
            //     }
            // }
            // if( meanArr.length == 0){
            //     addWordApi(wordText,'');
            //     return false;
            // }
            // var meanData = {
            //     word : wordText,
            //     mean : meanArr[0]
            // };

            // $.ajax({
            //     type: 'POST',
            //     data: JSON.stringify(meanData),
            //     contentType: 'application/json',
            //     url: apiUrl+'/wordAdd',
            //     success: function(data) {
            //         console.log('success');
            //     }
            // });
        },
        error : function( res ) {
            console.log('error!!!',res);
            var wordText = parameterWordText;
            var response = res.responseText === 'error' ? {kanji:'',undoku:''} :JSON.parse(res);
            console.log(response);
            addWordApi(wordText,response.kanji,response.undoku);
        }
    });

    socket.removeListener('wordAdd');
    socket.on('wordAdd',function(data){
        result = JSON.parse(JSON.stringify(data.msg));
        var htmlElement = '<tr>';
        htmlElement += '<td scope="row">{affectedRows}</td>';
        htmlElement += '<td class="hide">{insertId}</td>';
        htmlElement += '<td>{level}</td>';
        htmlElement += '<td class="word">{word}</td>';
        htmlElement += '<td class="mean1" onclick="if(event.target.tagName != \'INPUT\'){thisWordCellUpdate(this);}">{mean}</td>';
        htmlElement += '<td class="mean2" onclick="if(event.target.tagName != \'INPUT\'){thisWordCellUpdate(this);}">{mean2}</td>';
        htmlElement += '<td>';
        htmlElement += '<button class="pt-word-delete-btn form-control btn-hover hide" style=" margin : auto; " onclick="wordDelete(this);"> 삭제 </button>';
        htmlElement += '</td>';
        htmlElement += '</tr>';
        var replaceHTML = htmlElement.replace('{insertId}',result.insertId).replace('{word}',result.word).replace('{mean}',result.mean).replace('{level}',1)
            .replace('{affectedRows}',parseInt($('tr:last').find('td:first').text())+1).replace('{mean2}','');
        $('.pt-word-table').find('tr:last').after(replaceHTML);
        $('.pt-word-add-form').focus();
    });
}

function addWordApi(wordText,meanText,meanText2){

    var $wordList = $('.pt-word-table').find('tr').find('td:first-child+td+td+td');
    var isHaveWord = false;
    for(var i= 0,len = $wordList.length ; i < len ; i++){
        if($wordList.eq(i).text().replace(/ /gi, '')==wordText.replace(/ /gi, '')){
            isHaveWord = true;
        }
    }
    if(isHaveWord){
        alert('['+ wordText.replace(/ /gi, '') +']'+'이미 있는 단어입니다.');

        $('.pt-word-add-form').focus();
        return false;
    }
    var wordData = {
        word : wordText,
        mean : meanText,
        mean2 : meanText2
    };

    console.log(wordData);
    $.ajax({
        type: 'POST',
        data: JSON.stringify(wordData),
        contentType: 'application/json',
        url: apiUrl+'/wordAdd',
        success: function(data) {
            console.log('success');
        }
    });
    socket.removeListener('wordAdd');
    socket.on('wordAdd',function(data){
        result = JSON.parse(JSON.stringify(data.msg));
        var htmlElement = '<tr>';
        htmlElement += '<td scope="row">{affectedRows}</td>';
        htmlElement += '<td class="hide">{insertId}</td>';
        htmlElement += '<td>{level}</td>';
        htmlElement += '<td class="word">{word}</td>';
        htmlElement += '<td class="mean1" onclick="if(event.target.tagName != \'INPUT\'){thisWordCellUpdate(this);}">{mean}</td>';
        htmlElement += '<td class="mean2" onclick="if(event.target.tagName != \'INPUT\'){thisWordCellUpdate(this);}">{mean2}</td>';
        htmlElement += '<td>';
        htmlElement += '<button class="pt-word-delete-btn form-control btn-hover hide" style=" margin : auto; " onclick="wordDelete(this);"> 삭제 </button>';
        htmlElement += '</td>';
        htmlElement += '</tr>';
        var replaceHTML = htmlElement.replace('{insertId}',result.insertId).replace('{word}',result.word).replace('{mean}',result.mean).replace('{mean2}',result.mean2).replace('{level}',1)
            .replace('{affectedRows}',parseInt($('tr:last').find('td:first').text())+1);
        $('.pt-word-table').find('tr:last').after(replaceHTML);
        $('.pt-word-add-form').focus();
    });

}

function wordAddPageShow(){
    $('.pt-word-add-page').show();
    $('.pt-word-page').hide();
}

function quizShow(){
    $('.pt-word-add-page').hide();
    $('.pt-word-page').show();
}

function wordDelete(thisObj){
    var thisWordNumber = parseInt( $(thisObj).closest('tr').find('td:first-child +td').text() );
    var thisWord = $(thisObj).closest('tr').find('td:first-child + td + td').text();
    var thisWordMean = $(thisObj).closest('tr').find('td:first-child + td + td + td').text();

    if( thisWordNumber.toString() == 'NaN'){
        alert('단어를 삭제하지 못했습니다.');
        return false;
    }
    var meanData = {
        number : thisWordNumber,
        word : thisWord,
        mean : thisWordMean
    };
    $.ajax({
        type: 'POST',
        data: JSON.stringify(meanData),
        contentType: 'application/json',
        url: apiUrl+'/wordDelete',
        success: function(data) {
            console.log('success');
        }
    });
    socket.removeListener('deleteWord');
    socket.on('deleteWord',function(data){
        var $wordTableTr = $('.pt-word-table').find('tr');

        for(var i= 1,len = $wordTableTr.length+1; i<len ; i++){
            if(parseInt($wordTableTr.eq(i).find('td:first-child +td').text()) == JSON.parse(JSON.stringify(data)).number){
                $wordTableTr.eq(i).remove();
            }
        }
    });
}

function insertMode(){
    var $wordTableTr = $('.pt-word-table').find('tr');

    var html  = '<form method="post" action="#" style= " max-width : 100px;" onsubmit="updateMean(this);  return false;"> <input type="text"> </form>';
    for(var i= 1,len = $wordTableTr.length; i<len ; i++){
        if( $wordTableTr.eq(i).find('td:first + td + td + td + td').html().replace(/ /gi, '') == ''){
            $wordTableTr.eq(i).find('td:first + td + td + td + td').append(html);
        }
    }
}
function insertMode2(){
    var $wordTableTr = $('.pt-word-table').find('tr');

    var html  = '<form method="post" action="#" style= " max-width : 100px;" onsubmit="updateMean2(this);  return false;"> <input type="text"> </form>';
    for(var i= 1,len = $wordTableTr.length; i<len ; i++){
        if( $wordTableTr.eq(i).find('td:first + td + td + td + td + td ').html().replace(/null/gi, '').replace(/ /gi, '') == ''){
            $wordTableTr.eq(i).find('td:first + td + td + td + td + td ').append(html);
        }
    }
}

function deleteMode(){
    var $wordTableTr = $('.pt-word-table').find('tr');
    $wordTableTr.find('th:last').show();
    $wordTableTr.find('td:last').show();
    $wordTableTr.find('td:last').find('button').removeClass('hide').show();
}

function updateMean(thisObj){
    var mean = $(thisObj).find('input').val();
    var trNumber = $(thisObj).closest('tr').find('td:first + td').text();

    var meanData = {
        number : trNumber,
        mean : mean
    };
    $.ajax({
        type: 'POST',
        data: JSON.stringify(meanData),
        contentType: 'application/json',
        url: apiUrl+'/updateMean',
        success: function(data) {
            console.log('success');
        }
    });

    socket.removeListener('updateMean');
    socket.on('updateMean',function(data){
        result = JSON.parse(JSON.stringify(data.msg));
        var $wordTableTr = $('.pt-word-table').find('tr');
        for(var i= 1,len = $wordTableTr.length; i<len ; i++) {
            if( $wordTableTr.eq(i).find('td:first + td ').text() == result.number){
                $wordTableTr.eq(i).find('td:first + td +td +td + td').empty().text(result.mean);
                $('input').not('.form-control').eq(0).focus();
            }
        }
    });
}

function updateMean2(thisObj){
    var mean = $(thisObj).find('input').val();
    var trNumber = $(thisObj).closest('tr').find('td:first + td').text();

    var meanData = {
        number : trNumber,
        mean : mean
    };
    $.ajax({
        type: 'POST',
        data: JSON.stringify(meanData),
        contentType: 'application/json',
        url: apiUrl+'/updateMean2',
        success: function(data) {
            console.log('success');
        }
    });

    socket.removeListener('updateMean2');
    socket.on('updateMean2',function(data){
        result = JSON.parse(JSON.stringify(data.msg));
        var $wordTableTr = $('.pt-word-table').find('tr');
        for(var i= 1,len = $wordTableTr.length; i<len ; i++) {
            if( $wordTableTr.eq(i).find('td:first + td ').text() == result.number){
                $wordTableTr.eq(i).find('td:first + td +td +td + td + td ').empty().text(result.mean);
                $('input').not('.form-control').eq(0).focus();
            }
        }
    });
}

function showLevelWordView(level){
    var data = {
        level : level
    };
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: apiUrl+'/levelWordViews',
        success: function(data) {
            console.log('success');
        }
    });
    socket.removeListener('levelWordViews');
    socket.on('levelWordViews',function(data){
        result = JSON.parse(JSON.stringify(data.msg));
        $('.pt-word-table').find('tbody').eq(1).empty();
        numberObj = [];
        wordArrObj = [];
        meanArrObj = [];
        meanArrObj2 = [];
        for(var i= 0, len = result.length ; i <len ; i++){
            numberObj.push(result[i].num);
            wordArrObj.push(result[i].word);
            meanArrObj.push(result[i].mean);
            meanArrObj2.push(result[i].mean2);
        }
        for(var i= 0, len = wordArrObj.length ; i <len ; i++){
            if(wordArrObj[i].replace(/ /gi,'') != '' ){
                dbWordArr.push({
                    num : numberObj[i],
                    word : wordArrObj[i],
                    mean : meanArrObj[i],
                    mean2 : meanArrObj2[i]
                });
            }
        }
        wordShuffleChange();
        var wordTextArr = [];
        var meanTextArr = [];
        var meanTextArr2 = [];
        for(var i= 0,len = result.length; i<len ; i++) {
            if(result[i].mean2 == null){
                result[i].mean2 = "";
            }
            var htmlElement = '';
            htmlElement += '<tr>';
            htmlElement += '<td scope="row">{index}</td>';
            htmlElement += '<td class="hide">{num}</td>';
            htmlElement += '<td>{level}</td>';
            htmlElement += '<td class="word">{word}</td>';
            htmlElement += '<td class="mean1" onclick="if(event.target.tagName != \'INPUT\'){thisWordCellUpdate(this);}">{mean}</td>';
            htmlElement += '<td class="mean2" onclick="if(event.target.tagName != \'INPUT\'){thisWordCellUpdate(this);}">{mean2}</td>';
            htmlElement += '<td>';
            htmlElement += '<button class="pt-word-delete-btn form-control btn-hover hide" style=" margin : auto; " onclick="wordDelete(this);"> 삭제 </button>';
            htmlElement += '</td>';
            htmlElement += '</tr>';
            htmlElement = htmlElement.replace('{index}',i+1).replace('{num}',result[i].num).replace('{level}',result[i].level).replace('{word}',result[i].word).replace('{mean}',result[i].mean).replace('{mean2}',result[i].mean2);
            wordTextArr.push($('.pt-word-table').find('tbody').eq(1).find("tr:last").find(".word").text());
            meanTextArr.push($('.pt-word-table').find('tbody').eq(1).find("tr:last").find(".mean1").text());
            meanTextArr2.push($('.pt-word-table').find('tbody').eq(1).find("tr:last").find(".mean2").text());
            $('.pt-word-table').find('tbody').eq(1).find('');
            $('.pt-word-table').find('tbody').eq(1).append(htmlElement.replace('{mean2}',''));


            if((meanTextArr.indexOf(result[i].mean) != -1) || ( ( result[i].mean2 != '' ) && (meanTextArr2.indexOf(result[i].mean2) != -1) ) || (wordTextArr.indexOf(result[i].word) != -1)){
                if(result[i].mean != '') {
                    $('.pt-word-table').find('tbody').eq(1).find("tr:last").css({
                        "background-color": "yellow",
                        color: 'black'
                    });
                }
            }
            if((meanTextArr.indexOf(result[i].mean) != -1) && (meanTextArr2.indexOf(result[i].mean2) != -1)){
                if(result[i].mean != '') {
                    $('.pt-word-table').find('tbody').eq(1).find("tr:last").css({
                        "background-color": "red",
                        color: 'white'
                    });
                }
            }

        }



    });
}


Array.remove = function(array, from,cb) {
    var rest = array.slice((from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    if(cb){
        cb();
    }
    return array.push.apply(array, rest);
};


function thisWordCellUpdate(){
    if($(event.target).find('input').length == 0 ){
        var meanText = $(event.target).text();
        var html  = '';
        if($(event.target).hasClass('mean1') == true){
            html = '<form method="post" action="#" style= " max-width : 100px;" onsubmit="updateMean(this);  return false;"> <input type="text"> </form>';
        }else if($(event.target).hasClass('mean2') == true){
            html = '<form method="post" action="#" style= " max-width : 100px;" onsubmit="updateMean2(this);  return false;"> <input type="text"> </form>';
        }
        if(($(event.target).hasClass('mean1') == true ) || ($(event.target).hasClass('mean2') == true) ){
            $(event.target).empty().append(html);
            $(event.target).find('input').val(meanText);
            $(event.target).find('input').focus();
        }
    }

}