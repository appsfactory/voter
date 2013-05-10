var ENDPOINT_MANAGEMENT = "data/";

/*****************************************************
    Creates a new survey and post it to the server
*****************************************************/
function createSuvey(id,name,questions) {
   
    var survey = {
        surveyID: id,
        surveyName: name,
        options: questions

    };

    // Post the Answer to the Server..
    $.post(ENDPOINT_MANAGEMENT + "/createSurvey", survey, function (data) {

            //TODO 
    });


}
