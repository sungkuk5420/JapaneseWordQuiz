var wordArr = new Array();
wordArr = [
    "오요메상",
    "이",
    "제일",
    "좋다",
    "결혼",
    "해야해",
    "愛"
]
$(document).ready(function () {
    wordShuffleChange();
    GetData();
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
    //data{
    //    self : this;
    //}
    console.log(data.self);
    var thisWord = $(data.self).find('.pt-word-text').text()
    var quizAnswer = $("#pt-word-text-quiz-answer").text();
    var quizBackgroundColor = $(".pt-left-word-div").css("background-color");
    console.log(quizBackgroundColor);

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


function GetData(cell,row){
    //익플
    var iedetect = 0;
    if(window.ActiveXObject || "ActiveXObject" in window)
    {
        iedetect = 1;
    }
    console.log( (typeof ActiveXObject ) );
    if(iedetect === 1){
        var excel = new ActiveXObject("Excel.Application");
        //var excel_file = excel.Workbooks.Open("C:/Users/sungkuk/Documents/카카오톡 받은 파일/일본어/일본어/일본어/ccc.xlsx");
        var excel_file = excel.Workbooks.Open("C:/Users/김/Documents/project/일본어/ccc.xlsx");
        var excel_sheet = excel.Worksheets("Sheet1");
        //var data = excel_sheet.Cells(cell,row).Value;
        //console.log(data);

        var result = "";
        var i = 1;
        while(result != undefined){
            result = excel_sheet.Cells(i,2).Value;
            wordArr.push(result);
            i++;
        }
        wordShuffleChange();
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

    //console.log(wordArr);
    shuffle(wordArr);
    quizWordShuffleChange();
    for(var i=1 ; i<5 ; i++){
        $("#pt-word-text-"+i).text(wordArr[i]);
        var width = $("#pt-word-text-"+i).width()/2;
        $("#pt-word-text-"+i).css({
            left: "calc(50% - "+ width +"px)"
        });
    }

}

function quizWordShuffleChange(){
    $("#pt-word-text-quiz").text(wordArr[1]);
    $(".pt-left-word-div #pt-word-text-quiz-answer").text(wordArr[1]);

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