function start(){
    document.getElementById("countryId").addEventListener("change", loadGraph, false);
    document.getElementById("countryId").addEventListener("select", loadGraph, false);
}

window.onload = function(){
    $.getJSON("https://api.covid19api.com/summary", addCountriesToList);
    start();
}

function addCountriesToList(data){
    data = data.Countries;
    var countryList = document.getElementById('countryId');
    for(var i=0; i<data.length; i++){
        var opt = document.createElement('option');
        opt.value = data[i].Slug;
        opt.innerHTML = data[i].Country;
        countryList.appendChild(opt);
    }
    loadGraph();
}

function updateCases(data){
    
    var totalCases = document.getElementById('totalCases');
    var activeCases = document.getElementById('activeCases');
    var deaths = document.getElementById('deaths');
    var recovered = document.getElementById('recovered');
    var title = document.getElementById('header-title');

    var temp = data;
    if(temp.toString().length !== 0){
        var currentCountry = data = data[data.length-1];
        totalCases.innerHTML = currentCountry.Confirmed;
        activeCases.innerHTML = (currentCountry.Confirmed - (currentCountry.Deaths + currentCountry.Recovered));
        deaths.innerHTML = currentCountry.Deaths;
        recovered.innerHTML = currentCountry.Recovered;
        title.innerHTML = "Cases in "+currentCountry.Country;
    }
    else{
        totalCases.innerHTML = 0;
        activeCases.innerHTML = 0;
        deaths.innerHTML = 0;
        recovered.innerHTML = 0;
        title.innerHTML = "Cases";
    }
}
  
function loadGraph() {
    var dailycases = [];
    var recovered= [];
    var fatality = [];
     
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        backgroundColor: "transparent",
        theme: "light2",
        zoomEnabled: true,
        title: {
            text: "COVID 19 Curve",
            fontSize: 16
        },
        axisY: {
            title: "Cases",
            titleFontSize: 12,
            prefix: ""
        },
        legend: {
            horizontalAlign: "center",
            verticalAlign: "bottom",
            fontSize: 11
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
        ,
        data: [{
            type: "line",
            legendText: "Daily Cases",
            showInLegend: true,
            yValueFormatString: "0",
            dataPoints: dailycases
        }, 
        {
            type: "line",
            legendText: "Recovered",
            showInLegend: true,
            yValueFormatString: "0",
            dataPoints: recovered
        },
        {
            type: "line",
            legendText: "Deaths",
            showInLegend: true,
            yValueFormatString: "0",
            dataPoints: fatality
        }]
    });

    function addData(data){
        var pDailyCase = 0, pDeaths = 0, pRecoveries = 0;
        for (var i = 0; i < data.length-1; i++) {

            dailycases.push({
                x: new Date(data[i].Date),
                y: Math.abs(pDailyCase - data[i].Confirmed)
            });

            recovered.push({
                x: new Date(data[i].Date),
                y: Math.abs(pRecoveries - data[i].Recovered)
            });
             
            fatality.push({
                x: new Date(data[i].Date),
                y: Math.abs(pDeaths - data[i].Deaths)
            });

            pDailyCase = data[i].Confirmed;
            pDeaths = data[i].Deaths;
            pRecoveries = data[i].Recovered;
        }
        chart.render();
        updateCases(data);
    }
    
    var country = document.getElementById('countryId').value + "";
    var url = "https://api.covid19api.com/total/country/"+country;
    $.getJSON(url, addData);
}