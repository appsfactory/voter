var SERVER_ENDPOINT = "http://200.57.186.57/voter/voter.aspx?op=";



/*****************************************************
    Create Account on the server and retrieve
*****************************************************/
function createAccount(myfun) {
	
	//Get values from form
	var user,pass1,pass2;
	user=document.getElementById("username").value;
	pass1=document.getElementById("password").value;
	pass2=document.getElementById("passwordc").value;
	
	if(pass1!=pass2){		
			alert("Passwords don't match");return;
	}
	
	
	 $.post(SERVER_ENDPOINT + "registerUser&username=" + user + "&password=" + pass1, function (data) {

			if(data.result=="OK"){
				
				if(supports_html5_storage()){
					
					localStorage.setItem("username", user);
					localStorage.setItem("token", data.token);

					myfun();
					}
			}else
			{
				
				alert(data.message);	
			}
         
    },"json");
		
}


function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}



/*****************************************************
    Post the newly created survey to the server..
*****************************************************/


function postSurveyToServer(survey)
{
	
	var queryString="id="+encodeURIComponent(survey.surveyId)+"&name="+ encodeURIComponent( survey.title)+"&";
	
	for (var i in survey.questions){		
		var q=survey.questions[i];
			//Add the question
			queryString=queryString+"qu"+encodeURIComponent(q.id)+"="+encodeURIComponent(q.question)+"&";
				
			for(var j in q.answers){
					var ans=q.answers[j];
					queryString=queryString+"qa"+encodeURIComponent(q.id)+"_"+ encodeURIComponent(ans.id)+"="+encodeURIComponent(ans.answer)+"&";
				}
		}
	
	
	  $.post(SERVER_ENDPOINT + "createSurvey", queryString, function (data) {
      
      
    },"json");


	
}



/*****************************************************
    Get survey question(s) from the server 
*****************************************************/
function getAllSurveys() {

    $.post(SERVER_ENDPOINT + "getSurveys", function (data) {
        surveys = data;
        
        for (var i in data){
        	
        	var s=surveys[i];
        	s.id=s.ID;
        	s.title=s.label;
        }
        	
        
        //TODO read surveys from device
    	displayMySurveyList(surveys);

    },"json");


   
}


var usercounttimer=0;
/*****************************************************
    Enables a Survey
*****************************************************/
function enableSurvey() {

    $.post(SERVER_ENDPOINT + "chooseSurvey&id="+encodeURIComponent(survey.id), function (data) {
       
       
       usercounttimer=setInterval(function(){
       
       			 $.post(SERVER_ENDPOINT + "getClients&id="+encodeURIComponent(survey.id), function (data) {
       			 	
       			 	document.getElementById("numconnected").innerHTML="Number of clients connected: "+ data.connections;
       			 },"json");
        	
       	
       	
      },3000);
       

    },"json");



 $.post(SERVER_ENDPOINT + "moveToNextQuestion&id="+encodeURIComponent(survey.id), function (data) {
       

       

    },"json");
   
}


/*****************************************************
    Enables a Survey
*****************************************************/
function loginToServer() {
	
	
	//Get values from form
	var user,pass1,pass2;
	user=document.getElementById("username").value;
	pass1=document.getElementById("password").value;
	 
		if(supports_html5_storage()){
					
					localStorage.setItem("username", "");
					localStorage.setItem("token", "");
					
					
					
					}
					
	
	 $.post(ENDPOINT + "login&username=" + user + "&password=" + pass1, function (data) {

			if(data.token!=""){
				 
				 	if(supports_html5_storage()){
					
					localStorage.setItem("username", user);
					localStorage.setItem("token", data.token);
					
					window.location='admin_ui/choose.html';
					
					}
				 	
			}else
			{
				
				document.getElementById("message").innerHTML="Username/password is incorrect";	
			}
         
    },"json");
		
	
}