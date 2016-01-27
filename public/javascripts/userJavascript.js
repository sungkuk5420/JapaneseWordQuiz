var wordArr = new Array();
var meanArr = new Array();
var wordArrObj ="";
var meanArrObj ="";
wordArr = [
    "오요메상",
    "이",
    "제일",
    "좋다",
    "결혼",
    "해야해",
    "愛"
]

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
    wordArrObj = ($('#pt-server-side-data').find('.word').text().split(';;'));
    meanArrObj = ($('#pt-server-side-data').find('.mean').text().split(';;'));

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
    if(thisWord == quizAnswer){
        wordShuffleChange();
        $('.pt-right-word-div').find('.pt-word-text').css({
            color : quizBackgroundColor
        });
    }else{
        $(data.self).find('.pt-word-text').css({
            color : "red"
        });
    }
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
    wordArr = $('#pt-server-side-data').find('.word').text().split(';;');
    meanArr = $('#pt-server-side-data').find('.mean').text().split(';;');
    shuffle(wordArr);
    shuffle(meanArr);
    quizWordShuffleChange();
    var quizAnswer = $(".pt-left-word-div #pt-word-text-quiz-answer").text();
    var test_random_num = Math.floor(Math.random()*4);
    if(  meanArr.indexOf(quizAnswer) > 3 ){
        meanArr[test_random_num] = quizAnswer;
		console.log(meanArr[test_random_num] + '에넣음')
	}
    for(var i=0 ; i<4 ; i++){
        $("#pt-word-text-"+i).text(meanArr[i]);
        var width = $("#pt-word-text-"+i).width()/2;
        $("#pt-word-text-"+i).css({
            left: "calc(50% - "+ width +"px)"
        });
    }

}

function quizWordShuffleChange(){
    $("#pt-word-text-quiz").text(wordArr[0]);
    $(".pt-left-word-div #pt-word-text-quiz-answer").text(meanArrObj[wordArrObj.indexOf(wordArr[0])]);

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
        type: "GET",
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
                meanArr.push( res.tuc[i].phrase.text );
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
            console.log('단어 등록 성공',meanData);
            $.ajax({
                type: 'POST',
                data: JSON.stringify(meanData),
                contentType: 'application/json',
                url: 'http://localhost:3000/wordAdd',
                success: function(data) {
                    console.log('success');
                }
            });
        }, error: function (xhr, status, error) {
            if (window.console) {
                console.log(error);
            }
        }
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
    console.log('단어 삭제 성공',meanData);
    $(thisObj).closest('tr').remove();
    $.ajax({
        type: 'POST',
        data: JSON.stringify(meanData),
        contentType: 'application/json',
        url: 'http://localhost:3000/wordDelete',
        success: function(data) {
            console.log('success');
        }
    });
}