var currentSurveys = new Array();
var questionPolling = 0;
var questionPollingTime = 5000;
var currentSurvey = new Object();
var currentQuestion = null;
var currentQuestions = new Array();
var ENDPOINT = "http://200.57.186.57/voter/voter.aspx?op=";



/*****************************************************
    Retrieves a Survey object by its ID
*****************************************************/
function getSurveyById(id) {


    for (var i in currentSurveys) {
        if (currentSurveys[i].ID == id)
            return currentSurveys[i];
    }
    return null;
}


/*****************************************************
    Retrieves a Question object by its ID
*****************************************************/
function getQuestionById(id) {
    for (var i in currentQuestions) {
        if (currentQuestions[i].ID == id)
            return currentQuestions[i];
    }
    return null;
}


/*****************************************************
    Retrieves a Question index by its ID
*****************************************************/
function getQuestionIndexById(id) {
    for (var i in currentQuestions) {
        if (currentQuestions[i].ID == id)
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
        //if (question!=null && question.status=="available") {
        if (question != null ) {
            newArray.push(question);           
        }
    }
    currentQuestions = newArray;
}
/*****************************************************
    Get survey question(s) from the server 
*****************************************************/
function getSurveys() {
    $.post(ENDPOINT + "getSurveys", function (data) {
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
    
    var title=document.createElement("h2");
    var br=document.createElement("br");
    var node=document.createTextNode("Available Surveys:");
    title.appendChild(node);
    ans.appendChild(title);
    ans.appendChild(br);
    
    
    
    
    for (var i in currentSurveys) {
        survey = currentSurveys[i];
        if (survey.status != "available") continue;
        //Create button an spacer div
        var button = document.createElement("div");
        var spacer = document.createElement("div");

        //Set attributes
        spacer.className = "spacer";
        button.id = survey.ID;
        button.className = "button";
        button.innerHTML = survey.label;
        ans.appendChild(button);
        ans.appendChild(spacer);
        button.onclick = function () {
           //Set this Survey as the current one..

            $("#Surveys").hide();

            $.post(ENDPOINT + "getSurvey&id=" + this.id, function (data) {
           
                currentSurvey = data;
                getGraphDropDown();
                getAvailableQuestions(currentSurvey);

            }, "json");


             
            

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
		

        // For each question validate if it's new or has changed...

        for(var i in survey.questions){
            var question=survey.questions[i];
            // Validate if it has changed..

            var index = getQuestionIndexById(question.ID);
            //Replace..

            if (index >= 0) {
                //currentQuestions[index] = question;
            } else {
                //Add new Question
                currentQuestions.push(question);
                if(currentQuestion==null){
                    currentQuestion = question;
                    //displayQuestion(question);
					nextQuestion();
                }

            }

        } // End iterating...

        //Remove answers
        shrinkQuestions();
		
    
	
	
}

/*****************************************************
    Display a question
*****************************************************/

function displayQuestion(survey) {

    
    var question = document.getElementById("Question");
    //Display the question
    question.innerHTML = "";

    var ans = document.getElementById("Options");
    ans.innerHTML = "";
    //Create possible answer
    
    
    var title=document.createElement("h2");
    var br=document.createElement("br");
    var node=document.createTextNode(survey.label);
    title.appendChild(node);
    question.appendChild(title);
    question.appendChild(br);
    
    
    
    for (var i in survey.options) {
        answer = survey.options[i]; 
        //Create button an spacer div
        var button = document.createElement("div");
        var spacer = document.createElement("div");

        //Set attributes
        spacer.className = "spacer";
        button.id = answer.ID;
		button.alt=answer.ID;
        button.className = "button";
        button.innerHTML = answer.label;
        ans.appendChild(button);
        ans.appendChild(spacer);
        button.onclick = function () {
            //Send this response as the correct one for the survey

            var response = {
                surveyID: currentSurvey.ID,
                questionID: survey.ID,
                responseID: this.alt

            };

            submitResponse(response);
            
            waitForQuestionResults();

        };


    }



}
var randomID= parseInt(Math.random()*1000);
/*****************************************************
    Send response to the server
*****************************************************/
function getClientID() {

    return "ID"+randomID;

}


/*****************************************************
    Creates a new drop down selector to visualize
    results of questions..
*****************************************************/
function getGraphDropDown() {

    var dropdown = document.getElementById("graphSelect");//;document.createElement("select");
    dropdown.innerHTML = "";

    //Add an option for each question in the current survey

    for (var i in currentSurvey.questions) {

        var opt = document.createElement("option");
        var q= currentSurvey.questions[i];
        opt.text = q.label;
        opt.value = q.ID;
        dropdown.add(opt, null);
        if (i == 0) {
            opt.selected = "selected";
            showGraph();

            }
    }



}

function showGraph() {
    var dropdown = document.getElementById("graphSelect");
    
    $.post(ENDPOINT + "getQuestionResults&id=" + currentSurvey.ID + "&questionId=" + dropdown.options[dropdown.selectedIndex].value, function (data) {

        drawBars(data.results);
    },"json");
}

/*****************************************************
    Send response to the server
*****************************************************/
function submitResponse(response) {

    // Post the Answer to the Server..
    $.post(ENDPOINT+ "respondQuestion&id=" + response.surveyID + "&questionId=" + response.questionID + "&answerId=" + response.responseID+"&customerId="+ getClientID(), function (data) {

        // Get the current Question Index..
        var index = getQuestionIndexById(response.questionID);

        index++;
        if (index < currentQuestions.length && index >0 ) {
            //The curent Question is this one.. wait until it's available
            currentQuestion = currentQuestions[index];
            nextQuestion(currentQuestion);
        } else {



            //End 
            $("#container").hide();
            getGraphDropDown();
            $("#Thanks").show();
            
        }

        
        

    });

}


/*****************************************************
   Get current Results
*****************************************************/
function nextQuestion() {

    //Set a new timer to poll the question..

    $("#container").hide();
    $("#Thanks").hide();
    $("#Waiting").show();

    questionPolling = setInterval(function () {
        //Retrieve status of current question..
        
        $.post(ENDPOINT + "getQuestionStatus&id=" +  currentSurvey.ID + "&questionId=" + currentQuestion.ID , function (data) {

            if (data.status != "created") {

                //Clear the interval
                clearInterval(questionPolling);

                //Display the question

                
                displayQuestion(currentQuestion);
                $("#Waiting").hide();
                $("#container").show();
                

            }
        },"json");

    }, questionPollingTime);

}



/*****************************************************
   Display waiting div and start pooling for results..
*****************************************************/
function waitForQuestionResults() {

    // No more questions to show...
    $("#container").hide();
    $("#Wait").show();

}


/*****************************************************
   Display waiting div and start pooling for results..
*****************************************************/
function checkQuestionResults(response) {

    $.post(ENDPOINT + "getQuestionResults&id=" + response.surveyID+"&questionId="+ response.questionID, function (data) {

        
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

      
     

    
}


function drawPie(data) {

    //Set a different color foreach
    var colors = ["#69D2E7", "#E0E4CC", "#F0E4CD", "#69D2E7", "#E0E4CC", "#F0E4CD"];

    for (var i in data.answers) {
        data[i].color = colors[i];
    }

    //var myPie = new Chart(document.getElementById("canvas").getContext("2d")).Pie(data.answers);
    var myPie = new Chart(document.getElementById("canvas").getContext("2d")).Pie(data);

    $("#canvas").show();

}
function drawBars(data) {


    var barChartData = {
        //Set them clear
        labels: [],
        datasets: [        
       
            {
                fillColor: "rgba(90,0,5,0.75)",
                strokeColor: "rgba(90,0,5,1)",
                data: []
            }
        ]

    };

    for (var i in data) {
        
        barChartData.labels.push(""+data[i].label);
        barChartData.datasets[0].data.push( parseInt(data[i].value )      );
    }


    var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Bar(barChartData);



}

function goHome(){
	window.location="surveyindex.html";
}
