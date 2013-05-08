var currentSurveys = new Array();
var currentSurvey = new Object();
var currentQuestion = null;
var currentQuestions = new Array();
var ENDPOINT="data/";



/*****************************************************
    Retrieves a Survey object by its ID
*****************************************************/
function getSurveyById(id) {
    for (var i in currentSurveys) {
        if (currentSurveys[i].surveyID == id)
            return currentSurveys[i];
    }
    return null;
}


/*****************************************************
    Retrieves a Question object by its ID
*****************************************************/
function getQuestionById(id) {
    for (var i in currentQuestions) {
        if (currentQuestions[i].questionID == id)
            return currentQuestions[i];
    }
    return null;
}


/*****************************************************
    Retrieves a Question index by its ID
*****************************************************/
function getQuestionIndexById(id) {
    for (var i in currentQuestions) {
        if (currentQuestions[i].questionID == id)
            return i;
    }
    return -1;
}

/*****************************************************
    Remove empty or invalid not visibles answers from  the pool
*****************************************************/
function shrinkQuestions() {

    var newArray = new Array();
    for (var i in currentQuestions) {
        var question = currentQuestions[i];
        if (question!=null && question.status=="available") {
            newArray.push(question);           
        }
    }
    currentQuestions = newArray;
}
/*****************************************************
    Get survey question(s) from the server 
*****************************************************/
function getSurveys() {

    $.get(ENDPOINT + "Surveys.js", function (data) {
        currentSurveys = data;
        displaySurveys();

    },"json");


   
}

/*****************************************************
    Display Surveys
*****************************************************/
function displaySurveys() {

    var ans = document.getElementById("Surveys");
    ans.innerHTML = "";
    //Create possible answer
    for (var i in currentSurveys) {
        survey = currentSurveys[i];
        if (survey.status != "available") continue;
        //Create button an spacer div
        var button = document.createElement("div");
        var spacer = document.createElement("div");

        //Set attributes
        spacer.className = "spacer";
        button.id = survey.surveyID;
        button.className = "button";
        button.innerHTML = survey.surveyName;
        button.style.width = "150px";
        ans.appendChild(button);
        ans.appendChild(spacer);
        button.onclick = function () {
           //Set this Survey as the current one..

            $("#Surveys").hide();
            currentSurvey = getSurveyById(this.id);
            getAvailableQuestions();

        };


    }





}
/*****************************************************
    Get available questions from the Server for the given Survey
*****************************************************/
function getAvailableQuestions(survey){

    //Set survey to query
    if (survey == null || survey == "undefined")
        survey = currentSurvey.surveyID;

	//Retrieve current questions..
		
    $.get(ENDPOINT+"Questions.js?id="+survey, function (data) {	

        // For each question validate if it's new or has changed...

        for(var i in data){
            var question=data[i];
            // Validate if it has changed..

            var index = getQuestionIndexById(question.questionID);
            //Replace..

            if (index >= 0) {
                //currentQuestions[index] = question;
            } else {
                //Add new Question
                currentQuestions.push(question);
                if(currentQuestion==null){
                    currentQuestion = question;
                    displayQuestion(question);
                }

            }

        } // End iterating...

        //Remove answers
        shrinkQuestions();
		
    },"json");
	
	
}

/*****************************************************
    Display a question
*****************************************************/

function displayQuestion(survey) {

    var question = document.getElementById("Question");
    //Display the question
    question.innerHTML = survey.question;

    var ans = document.getElementById("Options");
    ans.innerHTML = "";
    //Create possible answer
    for (var i in survey.options) {
        answer = survey.options[i]; 
        //Create button an spacer div
        var button = document.createElement("div");
        var spacer = document.createElement("div");

        //Set attributes
        spacer.className = "spacer";
        button.id = answer.value;
        button.className = "button";
        button.innerHTML = answer.label;
        button.style.width = "150px";
        ans.appendChild(button);
        ans.appendChild(spacer);
        button.onclick = function () {
            //Send this response as the correct one for the survey

            var response = {
                surveyID: currentSurvey.surveyID,
                questionID: survey.questionID,
                responseID: answer.value

            };

            submitResponse(response);

        };


    }



}

/*****************************************************
    Send response to the server
*****************************************************/
function submitResponse(response) {

    // Post the Answer to the Server..
    $.get("ProcessVote.aspx?survey="+response.surveyID+"&question="+response.questionID+"&answer="+ response.responseID, function (data) {        

        var index = getQuestionIndexById(response.questionID);

        if (index >= 0) {
            currentQuestions[index] = null;
            shrinkQuestions();
        }
        

        nextQuestion(response);
        

    });

}

/*****************************************************
   Get current Results
*****************************************************/
function nextQuestion(response) {

    //Replace
    if (currentQuestions.length > 0) {
        $("#container").show();
        currentQuestion = currentQuestions[0];
        displayQuestion(currentQuestion);
    } else {

        waitForQuestionResults(response);
         

    }

    

}



/*****************************************************
   Display waiting div and start pooling for results..
*****************************************************/
function waitForQuestionResults(response) {

    // No more questions to show...
    $("#container").hide();
    $("#Wait").show();

}


/*****************************************************
   Display waiting div and start pooling for results..
*****************************************************/
function checkQuestionResults(response) {

    $.get("Results.aspx", function (data) {

        
        var question = document.getElementById("Question");
        //Display the question
        question.innerHTML = data.question;
        drawBars(data);
    },response);

}




/*****************************************************
   Get current Results
*****************************************************/
function getResults() {

      
    
    
    $.get("Results.aspx", function (data) {

        var question = document.getElementById("Question");
        //Display the question
        question.innerHTML = data.question;
        drawBars(data);
    });

    
}


function drawPie(data) {

    //Set a different color foreach
    var colors = ["#69D2E7", "#E0E4CC", "#F0E4CD"];

    for (var i in data.answers) {
        data.answers[i].color = colors[i];
    }

    //var myPie = new Chart(document.getElementById("canvas").getContext("2d")).Pie(data.answers);
    var myPie = new Chart(document.getElementById("canvas").getContext("2d")).Pie(data.answers);

}
function drawBars(data) {


    var barChartData = {
        //Set them clear
        labels: [],
        datasets: [        
       
            {
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,1)",
                data: []
            }
        ]

    };

    for (var i in data.answers) {
        
        barChartData.labels.push(data.answers[i].label);
        barChartData.datasets[0].data.push( data.answers[i].value       );
    }


    var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Bar(barChartData);



}
