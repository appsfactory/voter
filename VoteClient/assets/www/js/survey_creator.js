var survey =
      {
        surveyId: 0,
        title: "",

        questions: []
      };

var current_edit=0;



var createNewSurvey = function(){

  //Make survey

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
  aa.style.display="none";
  qa.style.display="block";
  var q = document.getElementById("NewQuestions");
  q.innerHTML="";
  for(var i=0;i<survey.questions.length;i++){
    var button = document.createElement("div");
    button.id = "q"+i;
    button.alt=i;
    button.className = "button";
    button.innerHTML = "Question "+(i+1); //Could also display question text
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
  qa.style.display="none";
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