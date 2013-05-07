

/*****************************************************
    Get survey question(s) from the server 
*****************************************************/

function getSurvey() {

    //Invoke service
    //TODO  Invoke endpoint...

    


    //Display the question
    var survey = {
        questionId: 1,
        question: "What colour is the sky?",

        answers: [
            { id: 1, text: "It's blue" },
            { id: 2, text: "It's green" },
            { id: 3, text: "It's yellow" }
        ]


    };

    displaySurvey(survey);

}


/*****************************************************
    Display in the Results Divs the question
*****************************************************/
function displaySurvey(survey) {

    var question = document.getElementById("Question");
    //Display the question
    question.innerHTML = survey.question;

    var ans = document.getElementById("Options");
    //Create possible answer
    for (var i in survey.answers) {
        answer = survey.answers[i]; 
        //Create button an spacer div
        var button = document.createElement("div");
        var spacer = document.createElement("div");

        //Set attributes
        spacer.className = "spacer";
        button.id = answer.id;
        button.className = "button";
        button.innerHTML = answer.text;
        button.style.width = "150px";
        ans.appendChild(button);
        ans.appendChild(spacer);
        button.onclick = function () {
            //Send this response as the correct one for the survey

            var response = {
                surveyId: survey.questionId,
                responseId: this.id

            };

            submitResponse(response);

        };


    }



}

/*****************************************************
    Send response to the server
*****************************************************/
function submitResponse(response) {

    $.post("http://10.172.71.70/ct/ProcessVote.aspx?survey="+response.surveyId+"&answer="+ response.responseId, function (data) {        
        $("#container").hide();
        $("#Thanks").show();
    });

}


/*****************************************************
   Get current Results
*****************************************************/
function getResults() {


    
    



    $.post("http://10.172.71.70/ct/Results.aspx", function (data) {

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
