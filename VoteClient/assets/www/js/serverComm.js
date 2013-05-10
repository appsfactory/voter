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


function showAdminDropDownGraph() {
    var dropdown = document.getElementById("graphSelect");
    
    $.post(SERVER_ENDPOINT + "getQuestionResults&id=" + survey.ID + "&questionId=" + dropdown.options[dropdown.selectedIndex].value, function (data) {

        drawAdminBars(data.results,"SurveyGraph");
    },"json");
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


/*****************************************************
    Get survey question(s) from the server 
*****************************************************/
function setQuestionStatus(status) {

    $.post(SERVER_ENDPOINT + "setQuestionStatus&id="+encodeURIComponent(survey.id)+"&questionId="+ encodeURIComponent(survey.questions[current_edit].ID)+"&status="+encodeURIComponent(status), function (data) {
      
        
        	
      

    },"json");


   
}


/*****************************************************
    Get survey object
*****************************************************/
function getSurveyObject(myfun) {

    $.post(SERVER_ENDPOINT + "getSurvey&id="+encodeURIComponent(survey.id), function (data) {
        survey = data;
        survey.id=survey.ID;
       	survey.title=survey.label;
       	
       	for(var i in survey.questions){
       			
       			var q=survey.questions[i];
       			
       			q.question=q.label;
       			q.answers=q.options;
       			q.id=q.ID;
       			
       			for(var j in q.answers){
       				
       				var a=q.answers[j];
       				a.answer=a.label;
       				
       			}
       	}
       	
         myfun();
    },"json");


   
}
/*****************************************************
    Get Admin Graph
*****************************************************/
function showAdminGraph() {
    
    $.post(SERVER_ENDPOINT + "getQuestionResults&id=" + encodeURIComponent(survey.id )+ "&questionId=" + encodeURIComponent(survey.questions[current_edit].ID), function (data) {

        drawAdminBars(data.results);
    },"json");
}



/*****************************************************
    Draw Admin Graph
*****************************************************/
function drawAdminBars(data,canvas) {
clearPoolInterval();

if(canvas=="undefined" ||canvas==null)canvas="QuestionGraph";

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

    for (var i in data) {
        
        barChartData.labels.push(""+data[i].label);
        barChartData.datasets[0].data.push( parseInt(data[i].value  )     );
    }

    var myLine = new Chart(document.getElementById(canvas).getContext("2d")).Bar(barChartData);



}


function clearPoolInterval(){
	
		if(usercounttimer!=0){
			clearInterval(usercounttimer);
			usercounttimer=0;
		}
}

var usercounttimer=0;
/*****************************************************
    Enables a Survey
*****************************************************/
function enableSurvey() {

clearPoolInterval();
    $.post(SERVER_ENDPOINT + "chooseSurvey&id="+encodeURIComponent(survey.id), function (data) {
       
       
       usercounttimer=setInterval(function(){
       
       			 $.post(SERVER_ENDPOINT + "getClients&id="+encodeURIComponent(survey.id), function (data) {
       			 	
       			 	document.getElementById("numconnected").innerHTML="Number of clients connected: "+ data.connections;
       			 },"json");
        	
       	
       	
      },3000);
      

    },"json");




   
}

function enableQuestion(){
	
	
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
					
	
	 $.post(SERVER_ENDPOINT + "login&username=" + user + "&password=" + pass1, function (data) {

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