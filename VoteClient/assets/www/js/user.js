function login(){
  var usr = document.getElementById("username").value;
  var pass = document.getElementById("password").value;
  if(usr!="username" || pass!="password"){
    document.getElementById("message").innerHTML="Incorrect login info";
    document.getElementById("password").value = "";
  }else{
    localStorage.username = usr;
    localStorage.password = pass;
    window.location="admin_ui/choose.html";
    resetLogin();
  }
}

function resetLogin(){
  if(localStorage.username){
    document.getElementById("username").value = localStorage.username;
  }else{
    document.getElementById("username").value = "";
  }
  document.getElementById("password").value = "";
  document.getElementById("message").innerHTML="Note: You must log in to create a survey";
}

function createUser(){
  var usr = document.getElementById("username").value;
  var pass = document.getElementById("password").value;
  var passc = document.getElementById("passwordc").value;
  if(pass!=passc){
    document.getElementById("password").value = "";
    document.getElementById("passwordc").value = "";
    document.getElementById("message").innerHTML="Paswords do not match";
    return;
  }


  
  localStorage.username=usr;
  localStorage.password=pass;

  //TODO create new user on server
createAccount(function(){
 
 	window.location="choose.html";
  //resetNewLogin();
}
);

 

}

function resetNewLogin(){
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("passwordc").value = "";
  document.getElementById("message").innerHTML="";
}

function cancelLogin(){
  resetLogin();
  window.location = "client_ui.html";
}

function cancelCreate(){
  resetNewLogin();
  windo.location = "../surveyindex.html";
}