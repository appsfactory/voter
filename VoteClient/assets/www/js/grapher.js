var sampledata = {
  answers:[
    {
      label: "Moon",
      value: 33,
      color: "#FFF"
    },
    {
      label: "Titan",
      value: 45,
      color: "#FFF"
    },
    {
      label: "Pluto",
      value: 60,
      color: "#FFF"
    },
    {
      label: "Mercury",
      value: 20,
      color: "#FFF"
    },
  ]
};


function drawGraph(data,canvas,type){
  switch(type){
    case 0: drawBars(data,canvas);break;
    case 1: drawPie(data,canvas);break;
    default:  drawBars(data,canvas);break;
  }
}

function drawPie(data, location) {

    //Set a different color foreach
    var colors = ["#69D2E7", "#E0E4CC", "#F0E4CD"];

    for (var i in data.answers) {
        data.answers[i].color = colors[i];
    }

    //var myPie = new Chart(document.getElementById("canvas").getContext("2d")).Pie(data.answers);
    var myPie = new Chart(document.getElementById(location).getContext("2d")).Pie(data.answers);

}
function drawBars(data, location) {


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


    var myLine = new Chart(document.getElementById(location).getContext("2d")).Bar(barChartData);



}