//var socket = io.connect('http://localhost:3000');
var socket = io.connect('http://ec2-52-34-253-229.us-west-2.compute.amazonaws.com:8000');

var apiUrl = 'http://ec2-52-34-253-229.us-west-2.compute.amazonaws.com:8000';
//var apiUrl = 'http://localhost:3000';
var wordArr = new Array();
var meanArr = new Array();
var numberObj ="";
var wordArrObj ="";
var meanArrObj ="";
var dbWordArr =new Array();
var isWordAnswerFail = false;
var isClickWordFlag = false;

wordObjArr = new Array();

$(document).ready(function (aa,bb) {

	$(document).keydown(function(e){
		console.log(e.keyCode);
		switch(e.keyCode){
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
    console.log($('#pt-server-side-data').find('.number').text());
    numberObj = ($('#pt-server-side-data').find('.number').text().replace(/ /gi,'').split(';;'));
    wordArrObj = ($('#pt-server-side-data').find('.word').text().replace(/ /gi,'').split(';;'));
    meanArrObj = ($('#pt-server-side-data').find('.mean').text().replace(/ /gi,'').split(';;'));


    for(var i= 0, len = wordArrObj.length ; i <len ; i++){
        if(wordArrObj[i].replace(/ /gi,'') != '' ){
            dbWordArr.push({
                num : numberObj[i],
                word : wordArrObj[i],
                mean : meanArrObj[i]
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
    var thisWord = $(data.self).find('.pt-word-text').text();
    var quizAnswer = $("#pt-word-text-quiz-answer").text();
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
    console.log(data.number);
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
    console.log(data.number);
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
    for(var i=0 ; i<4 ; i++){
        $("#pt-word-text-"+i).text(meanArr[i]);
        var width = $("#pt-word-text-"+i).width()/2;
        $("#pt-word-text-"+i).css({
            left: "calc(50% - "+ width +"px)"
        });
    }
    var isHaveAnswer =false;
    var quizAnswer = $(".pt-left-word-div #pt-word-text-quiz-answer").text();
    var ansewerIndex = 0;
    for(var i=0 ; i<4 ; i++){
        if(meanArr[i].replace(/ /gi,'') === quizAnswer.replace(/ /gi,'')) {
            isHaveAnswer = true;
        }
    }
    var test_random_num = Math.floor(Math.random()*4);
    if(isHaveAnswer == false){
        console.log('aa');
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

function searchWordApi(wordText){
    var data = {
        query : wordText //string
    };
    $.ajax({
        type: "POST",
        data : {
            from : 'jpn',
            dest : 'kor',
            format : 'json',
            pretty : 'true',
            phrase : data.query
        },
        dataType:'json',
        url: "/api",
        success: function (res) {
            var meanArr = new Array();

            for(var i= 0,len = res.tuc.length; i<len ; i++){
                if(res.tuc[i].phrase != undefined){
                    meanArr.push("aaa");
                }else{
                    meanArr.push( res.tuc[i].phrase.text );
                }
            }
            console.log(meanArr);
            console.log(wordText);
            if( meanArr.length == 0){
                alert('해당 단어의 뜻을 찾을 수 없습니다.');
                return false;
            }
            var meanData = {
                word : wordText,
                mean : meanArr[0]
            };

            $.ajax({
                type: 'POST',
                data: JSON.stringify(meanData),
                contentType: 'application/json',
                url: apiUrl+'/wordAdd',
                success: function(data) {
                    console.log('success');
                }
            });
            socket.on('addWord',function(data){
                console.log('등록완료'+meanData);
                result = JSON.parse(JSON.stringify(data.msg));
                var dom = '<tr>'
                    dom += '<td scope="row">{affectedRows}</td>'
                    dom += '<td style="display : none;">{insertId}</td>'
                    dom += '<td>恋</td>'
                    dom += '<td>사랑</td>'
                    dom += '<td>'
                    dom += '<button class="pt-word-delete-btn form-control btn-hover" style=" margin : auto;" onclick="wordDelete(this);"> 삭제 </button>'
                    dom += '</td>'
                    dom += '</tr>'
                var replaceHTML = dom.replace('{insertId}',result.insertId).replace('{affectedRows}',parseInt($('tr:last').find('td:first').text())+1);
                console.log(replaceHTML);
                $('.pt-word-table').find('tr:last').after(replaceHTML);
                $('.pt-word-add-form')[0].value = '';
            });
        }, error: function (xhr, status, error) {
            if (window.console) {
                console.log(error);
            }
        }
    });
}

function addWordApi(wordText,meanText){

    var $wordList = $('.pt-word-table').find('tr').find('td:first-child+td+td+td');
    var isHaveWord = false;
    for(var i= 0,len = $wordList.length ; i < len ; i++){
        if($wordList.eq(i).text().replace(/ /gi, '')==wordText.replace(/ /gi, '')){
            isHaveWord = true;
        }
    }
    $('.pt-word-add-form')[0].value = '';
    $('.pt-mean-add-form')[0].value = '';
    if(isHaveWord){
        alert('['+ wordText.replace(/ /gi, '') +']'+'이미 있는 단어입니다.');

        $('.pt-word-add-form').focus();
        return false;
    }
    var wordData = {
        word : wordText,
        mean : meanText
    };

    $.ajax({
        type: 'POST',
        data: JSON.stringify(wordData),
        contentType: 'application/json',
        url: apiUrl+'/wordAdd',
        success: function(data) {
            console.log('success');
        }
    });
    socket.removeListener('addWord');
    socket.on('addWord',function(data){
        console.log('등록완료'+wordData);
        result = JSON.parse(JSON.stringify(data.msg));
        var dom = '<tr>'
        dom += '<td scope="row">{affectedRows}</td>'
        dom += '<td style="display : none;">{insertId}</td>'
        dom += '<td >{level}</td>'
        dom += '<td>{word}</td>'
        dom += '<td>{mean}</td>'
        dom += '<td>'
        dom += '<button class="pt-word-delete-btn form-control btn-hover" style=" margin : auto;" onclick="wordDelete(this);"> 삭제 </button>'
        dom += '</td>'
        dom += '</tr>'
        var replaceHTML = dom.replace('{insertId}',result.insertId).replace('{word}',result.word).replace('{mean}',result.mean).replace('{level}',1)
            .replace('{affectedRows}',parseInt($('tr:last').find('td:first').text())+1);
        console.log(replaceHTML);
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
    console.log(thisObj);
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
        console.log('삭제완료'+meanData);
        console.log('메세지 받앗음!'+ JSON.parse(JSON.stringify(data)));
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

function deleteMode(){
    var $wordTableTr = $('.pt-word-table').find('tr');
    $wordTableTr.find('th:last').show();
    $wordTableTr.find('td:last').find('button').removeClass('hide').show();
}

function updateMean(thisObj){
   console.log(thisObj);
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
                $wordTableTr.eq(i+1).find('td:first + td +td +td + td').find('input').focus();
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
        console.log('레벨별 단어 변경'+data);
        result = JSON.parse(JSON.stringify(data.msg));
        $('.pt-word-table').find('tbody').eq(1).empty();
        wordArrObj = [];
        meanArrObj = [];
        for(var i= 0, len = result.length ; i <len ; i++){
            wordArrObj.push(result[i].word);
            meanArrObj.push(result[i].mean);
        }
        wordShuffleChange();
        for(var i= 0,len = result.length; i<len ; i++) {
            var htmlElement = '';
            htmlElement += '<tr>';
            htmlElement += '<td scope="row">{index}</td>';
            htmlElement += '<td class="hide">{num}</td>';
            htmlElement += '<td >{level}</td>';
            htmlElement += '<td>{word}</td>';
            htmlElement += '<td>{mean}</td>';
            htmlElement += '<td >';
            htmlElement += '<button class="pt-word-delete-btn form-control btn-hover hide" style=" margin : auto; " onclick="wordDelete(this);"> 삭제 </button>';
            htmlElement += '</td>';
            htmlElement += '</tr>';
            htmlElement = htmlElement.replace('{index}',i+1).replace('{num}',result[i].num).replace('{level}',result[i].level).replace('{word}',result[i].word).replace('{mean}',result[i].mean);
            $('.pt-word-table').find('tbody').eq(1).append(htmlElement);
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
