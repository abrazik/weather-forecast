// declaring variables

var city=""; 
var url="";
var key="";
var urlAddingCityandKey ="";
var currenturl = "";
var SearchedCities = document.getElementById("searchedcities");
// var lat = weather.coord.lat;
// var lon = weather.coord.lon;

//setting an empty array
let cities = []; 
init(); 
listClicker(); 
searchClicker(); 

//this function takes saved cities from local storage and fills the array with it
function init(){
    let savedcities = JSON.parse(localStorage.getItem("cities"));

    if (savedcities !== null){
        cities = savedcities
    }   
    
    renderButtons(); 
}

//this function sets localstorage for searched cities
function SaveDisplaySearchedCities(){
    localStorage.setItem("cities", JSON.stringify(cities)); 
}


// this function turns each searched city into a button
function renderButtons(){
    SearchedCities.innerHTML = ""; 
    if(cities == null){
        return;
    }
    let unique_cities = [...new Set(cities)];
    for(let i=0; i < unique_cities.length; i++){
        let cityName = unique_cities[i]; 

        let buttonEl = document.createElement("button");
        buttonEl.textContent = cityName; 
        buttonEl.setAttribute("class", "listbtn"); 

        SearchedCities.appendChild(buttonEl);
        listClicker();
      }
    }
//this is the on click function for searched cities buttons
function listClicker(){
$(".listbtn").on("click", function(event){
    event.preventDefault();
    city = $(this).text().trim();
    APIcalls(); 
})
}



//on click function for main search bar
function searchClicker() {
$("#searchbtn").on("click", function(event){
    event.preventDefault();
    city = $(this).prev().val().trim()
    
    //this pushes the city that you type in into the cities array
    cities.push(city);
    //this makea sure the cities array length does exceed 6
    if(cities.length > 6){
        cities.shift()
    }
    //return from function early if form is blank
    if (city == ""){
        return; 
    }
    APIcalls();
    SaveDisplaySearchedCities(); 
    renderButtons();
})
}

//runs 2 API calls, current weather data five-day forecast then populates text areas
function APIcalls(){
    
    url = "https://api.openweathermap.org/data/2.5/forecast?q=";    
    currenturl = "https://api.openweathermap.org/data/2.5/weather?q=";
    key = "&appid=7c42887d53503500bc9a50f4a1c5e31f";
    urlAddingCityandKey = url + city + key;
    weathertodayurl = currenturl + city + key; 
    
    $("#cityname").text("Today's Weather for: " + city);
    $.ajax({
        url: urlAddingCityandKey,
        method: "GET",
        
    }).then(function(response){
        var day_number = 0; 
        
        //looping
        for(var i=0; i< response.list.length; i++){
            
            //split function to isolate the time from the time/data aspect of weather data, and only select weather reports for 3pm
            if(response.list[i].dt_txt.split(" ")[1] == "15:00:00")
            {
                //if time of report is 3pm, populate text areas accordingly
                var day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                var month = response.list[i].dt_txt.split("-")[1];
                var year = response.list[i].dt_txt.split("-")[0];
                $("#" + day_number + "date").text(month + "/" + day + "/" + year); 
                var temp = Math.round(((response.list[i].main.temp - 273.15) *9/5+32));
                $("#" + day_number + "tempfiveday").text("Temp: " + temp + String.fromCharCode(176)+"F");
                $("#" + day_number + "humidityfiveday").text("Humidity: " + response.list[i].main.humidity);
                $("#" + day_number + "fivedaypic").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                console.log(response.list[i].dt_txt.split("-"));
                console.log(day_number);
                console.log(response.list[i].main.temp);
                day_number++; 
                        }   
        }
    });


    //displays data in main div 
     $.ajax({
         url:weathertodayurl,
         method: "GET", 
     }).then(function(current_data){
         console.log(current_data);
         var temp = Math.round(((current_data.main.temp - 273.15) * 9/5 + 32))
         console.log("The temperature in " + city + " is: " + temp);
         $("#temptoday").text("Temperature: " + temp + String.fromCharCode(176)+"F");
         $("#humiditytoday").text("Humidity: " + current_data.main.humidity);
         $("#windspeedtoday").text("Wind Speed: " + current_data.wind.speed);
        //  $("#uvindextoday").text("UV index: " + current_data.uv.index);
         $("#icontoday").attr({"src": "http://openweathermap.org/img/w/" + current_data.weather[0].icon + ".png",
          "height": "100px", "width":"100px"});
     })
    

}
