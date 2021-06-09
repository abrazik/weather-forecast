// setting my variables 
//  var personalAPIKey = "appid=7c42887d53503500bc9a50f4a1c5e31f";
// var unit = "units=imperial";
// var dailyWeatherApiStarts =
//   "https://api.openweathermap.org/data/2.5/weather?q=";
// var dailyUVIndexApiStarts = "https://api.openweathermap.org/data/2.5/uvi?";
// var forecastWeatherApiStarts =
//   "https://api.openweathermap.org/data/2.5/onecall?";
// var searchCityForm = $("#searchCityForm");

// fetch('https://api.openweathermap.org/data/2.5/weather?q=' + input + '&units=imperial' + PersonalAPIKey)
// .then(function (response) {
//     return response.json();
// })
// .then(function (data) {
//     console.log(data);

fetch('https://api.openweathermap.org/data/2.5/weather?q=columbus&appid=7c42887d53503500bc9a50f4a1c5e31f')
  .then(response => response.json())
  .then(data => console.log(data));
