var surveys = [];


var survey = null;

var current_edit=0;

var getMySurveys = function() {
  //TODO read surveys from device
    displayMySurveyList(surveys);

}

function  displayMySurveyList(){
    var qa = document.getElementById("QuestionAdder");
    var aa = document.getElementById("AnswerAdder");
    var sm = document.getElementById("ManageSurveys");
    qa.style.display="none";
    sm.style.display="block";
    aa.style.display="none";
    var ans = document.getElementById("MySurveyList");
    ans.innerHTML="";
    //Create possible answer
    for (var i in surveys) {
      console.log(surveys[i]);
      name = surveys[i].title;
        //Create button an spacer div
        var button = document.createElement("div");
        var spacer = document.createElement("div");

        //Set attributes
        button.id = "s"+i;
        button.alt=i;
        button.className = "button";
        button.innerHTML = name;
        ans.appendChild(button);
        button.onclick = function () {


            //Make this servey available online
            //remove Next Lines!!!!!!!! Debug Purposes only
            var p = this.alt;
            survey=surveys[p];
            showAllQuestions();
//////////// Stop remoiviing here

        };


    }
}

function addNewSurvey(){
  survey={
        surveyId: 0,
        title: "",

        questions: []
      };
  document.getElementById("name").value = "";
  showAllQuestions();
}


var createNewSurvey = function(){
  survey.title = document.getElementById("name").value;
  surveys.push(survey);
  displayMySurveyList();
  survey={
        surveyId: 0,
        title: "",

        questions: []
      };
}

function finishEditAnswers(){
  var q = current_edit;
  var question = survey.questions[q];
  question.question = document.getElementById("question").value;
  for(var i=0;i<question.answers.length;i++){
    question.answers[i].answer = document.getElementById("a"+i).value;
    question.answers[i].id=i;
  }
  showAllQuestions();
}

var addNewQuestion = function(){


  var num = survey.questions.length;
  var nq ={
            id:num,
            question: "Question "+(num+1),
            answers: []
          };
  survey.questions.push(nq);
  showAllQuestions();
}

var addNewAnswer = function(){
  var q = current_edit;
  var num = survey.questions[q].answers.length;
  survey.questions[q].question = document.getElementById("question").value;
  for(var i=0;i<num;i++){
    survey.questions[q].answers[i]=
              {
                id:i,
                answer: document.getElementById("a"+i).value
              }
  }
  var na = {
                id:num,
                answer: ""
              }
  survey.questions[q].answers.push(na);
  showAllAnswers(q);
}


function showAllQuestions(){
  var qa = document.getElementById("QuestionAdder");
  var aa = document.getElementById("AnswerAdder");
  var sm = document.getElementById("ManageSurveys");
  aa.style.display="none";
  sm.style.display="none";
  qa.style.display="block";

  var q = document.getElementById("NewQuestions");
  q.innerHTML="";
  for(var i=0;i<survey.questions.length;i++){
    var button = document.createElement("div");
    button.id = "q"+i;
    button.alt=i;
    button.className = "button";
    button.innerHTML = survey.questions[i].question; //Could also display "Question <i+1>"
    q.appendChild(button);
    button.onclick = function () {
      var p = this.alt;
      current_edit=p;
      showAllAnswers(p);
    };
  }
}

function showAllAnswers(q){
  var question = survey.questions[q];
  console.log(q+":"+survey.questions.length);
  var qa = document.getElementById("QuestionAdder");
  var aa = document.getElementById("AnswerAdder");
  var sm = document.getElementById("ManageSurveys");
  qa.style.display="none";
  sm.style.display="none";
  aa.style.display="block";
  document.getElementById("question").value=question.question;
  var na = document.getElementById("NewAnswers");
  na.innerHTML="";
  for(var i=0;i<question.answers.length;i++){
    var answer = document.createElement("input");
    answer.id = "a"+i;
    answer.type = "text";
    answer.value = question.answers[i].answer;
    na.appendChild(answer);
  }
}
