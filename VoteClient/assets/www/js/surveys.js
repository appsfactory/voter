var surveys = [];


var survey = null;

var current_edit=0;

var getMySurveys = function() {
  
  
  	getAllSurveys();
    displayMySurveyList(surveys);

}

function goHome(){
  window.location="choose.html";
}

function  displayMySurveyList(){
    display("ManageSurveys");
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


            var p = this.alt;
            survey=surveys[p];
            current_edit=0;
            
            getSurveyObject(function(){
            startMySurvey();
          });
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
  if(survey.questions.length==0){
    return;
  }
  survey.title = document.getElementById("name").value;
  surveys.push(survey);
  postSurveyToServer(survey);
  
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
  if(question.answers.length==0){
    return;
  }
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
  if(survey.questions[q].answers.length>=5){
    return;
  }
  survey.questions[q].answers.push(na);
  showAllAnswers(q);
}


function showAllQuestions(){
  display("QuestionAdder");

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
  display("AnswerAdder");
  document.getElementById("question").value=question.question;
  var na = document.getElementById("NewAnswers");
  na.innerHTML="";
  for(var i=0;i<question.answers.length;i++){
    var ans=document.createElement("p");
    var br=document.createElement("br");
    var node=document.createTextNode((i+1)+". ");
    ans.appendChild(node);
    na.appendChild(node);
    var answer = document.createElement("input");
    answer.id = "a"+i;
    answer.type = "text";
    answer.value = question.answers[i].answer;
    na.appendChild(answer);
    na.appendChild(br);
  }
}

function returnToSurvey(){
	finishSurvey();
  survey=null;
  current_edit=0;1;
	display("ManageSurveys");
}


function display(div){
  document.getElementById("StartSurvey").style.display="none";
  document.getElementById("Question").style.display="none";
  document.getElementById("EndSurvey").style.display="none";
  document.getElementById("QuestionAdder").style.display="none";
  document.getElementById("AnswerAdder").style.display="none";
  document.getElementById("ManageSurveys").style.display="none";

  document.getElementById(div).style.display="block";
}


function startMySurvey(){
  //   Tell server to accept clients
  enableSurvey();
  display("StartSurvey");
  document.getElementById("surveyname").innerHTML=survey.title;

  


}

function gotoNextQuestion(){
  current_edit+=1;
  if(current_edit>=survey.questions.length){
    viewEndSurvey();
  }else{
    viewQuestion();
  }
}

function viewQuestion(){
  document.getElementById("Answers").innerHTML="";
  display("Question");
  document.getElementById("questionname").innerHTML=survey.questions[current_edit].question;
  document.getElementById("start").innerHTML="Start Poll";
  document.getElementById("start").style.display="block";
  for(var i=0;i<survey.questions[current_edit].answers.length;i++){
    var ans=document.createElement("p");
    var br=document.createElement("br");
    var node=document.createTextNode((i+1)+". "+ survey.questions[current_edit].answers[i].answer);
    ans.appendChild(node);
    document.getElementById("Answers").appendChild(node);
    document.getElementById("Answers").appendChild(br);
  }

   showAdminGraph() ;


}

function toggleAccepting(){

  if(document.getElementById("start").innerHTML=="Start Poll"){
    document.getElementById("start").innerHTML="Stop Poll";
    document.getElementById("next").style.display="none";
    setQuestionStatus("open");
    
    
  }else{
    document.getElementById("start").style.display="none";
    document.getElementById("next").style.display="block";
    setQuestionStatus("closed");
  }
  

}


function viewEndSurvey(){
  //display results
  document.getElementById("surveyname2").innerHTML=survey.title;
  display("EndSurvey");

	getAdminGraphDropDown();

}


/*****************************************************
    Creates a new drop down selector to visualize
    results of questions..
*****************************************************/
function getAdminGraphDropDown() {

		var surveyname2=document.getElementById("surveyname2");
		var parent=document.getElementById("EndSurvey");
		surveyname2.innerHTML=survey.title;		
    var dropdown = document.getElementById("graphSelect");//;
    if(dropdown==null){
    			dropdown=document.createElement("select");
    			dropdown.id="graphSelect";
    			dropdown.onchange=showAdminDropDownGraph;
    			parent.insertBefore(dropdown,surveyname2);
    	}
    dropdown.innerHTML = "";

    //Add an option for each question in the current survey

    for (var i in survey.questions) {

        var opt = document.createElement("option");
        var q= survey.questions[i];
        opt.text = q.label;
        opt.value = q.ID;
        dropdown.add(opt, null);
        if (i == 0) {
            opt.selected = "selected";
            showAdminDropDownGraph();

            }
    }



}
