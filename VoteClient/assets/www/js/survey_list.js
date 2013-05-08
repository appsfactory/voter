var surveys = [];

var getMySurveys = function() {
  //TODO read surveys from device


    displayMySurveyList(surveys);

}

function  displayMySurveyList(surveys){

    var ans = document.getElementById("MySurveyList");
    //Create possible answer
    for (var i in surveys) {
      console.log(surveys[i]);
      name = surveys[i].title;
        //Create button an spacer div
        var button = document.createElement("div");
        var spacer = document.createElement("div");

        //Set attributes
        button.id = surveys[i].surveyId;
        button.className = "button";
        button.innerHTML = name;
        ans.appendChild(button);
        button.onclick = function () {


            //Make this servey available online



        };


    }
}

function addNewSurvey(){
  window.location = "create_survey.html";
}