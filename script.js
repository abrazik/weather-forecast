// setting my variables 
var citiesListArr = [];
var numOfCities = 8;
var personalAPIKey = "appid=7c42887d53503500bc9a50f4a1c5e31f";
var unit = "units=imperial";
var dailyWeatherApiStarts =
  "https://api.openweathermap.org/data/2.5/weather?q=";
var dailyUVIndexApiStarts = "https://api.openweathermap.org/data/2.5/uvi?";
var forecastWeatherApiStarts =
  "https://api.openweathermap.org/data/2.5/onecall?";
var searchCityForm = $("#searchCityForm");
var searchedCities = $("#searchedCityLi");

// getting weather api info
var getCityWeather = function (searchCityName) {
    // format URL
    var apiUrl =
      dailyWeatherApiStarts + searchCityName + "&" + personalAPIKey + "&" + unit;
    // make a request to url
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        return response.json().then(function (response) {
          $("#cityName").html(response.name);
          // displaying the date
          var unixTime = response.dt;
          var date = moment.unix(unixTime).format("MM/DD/YY");
          $("#currentdate").html(date);
          // displaying the weather icon
          var weatherIncoUrl =
            "http://openweathermap.org/img/wn/" +
            response.weather[0].icon +
            "@2x.png";
          $("#weatherIconToday").attr("src", weatherIncoUrl);
          $("#tempToday").html(response.main.temp + " \u00B0F");
          $("#humidityToday").html(response.main.humidity + " %");
          $("#windSpeedToday").html(response.wind.speed + " MPH");
          // returning lat/long for UV index
          var lat = response.coord.lat;
          var lon = response.coord.lon;
          getUVIndex(lat, lon);
          getForecast(lat, lon);
        });
      } else {
        alert("Please provide a valid city name.");
      }
    });
  };

 //this is getting the UVI index
  var getUVIndex = function (lat, lon) {
    // formate the OpenWeather api url
    var apiUrl =
      dailyUVIndexApiStarts +
      personalAPIKey +
      "&lat=" +
      lat +
      "&lon=" +
      lon +
      "&" +
      unit;
    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        $("#UVIndexToday").removeClass();
        $("#UVIndexToday").html(response.value);
        if (response.value < 3) {
          $("#UVIndexToday").addClass("p-1 rounded bg-success text-white");
        } else if (response.value < 8) {
          $("#UVIndexToday").addClass("p-1 rounded bg-warning text-white");
        } else {
          $("#UVIndexToday").addClass("p-1 rounded bg-danger text-white");
        }
      });
  };

  var getForecast = function (lat, lon) {
    // format the URL
    var apiUrl =
      forecastWeatherApiStarts +
      "lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=current,minutely,hourly" +
      "&" +
      personalAPIKey +
      "&" +
      unit;
    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        for (var i = 1; i < 6; i++) {
          //display date
          var unixTime = response.daily[i].dt;
          var date = moment.unix(unixTime).format("MM/DD/YY");
          $("#Date" + i).html(date);
          // display weather icon
          var weatherIncoUrl =
            "http://openweathermap.org/img/wn/" +
            response.daily[i].weather[0].icon +
            "@2x.png";
          $("#weatherIconDay" + i).attr("src", weatherIncoUrl);
          // display temperature
          var temp = response.daily[i].temp.day + " \u00B0F";
          $("#tempDay" + i).html(temp);
          // display humidity
          var humidity = response.daily[i].humidity;
          $("#humidityDay" + i).html(humidity + " %");
        }
      });
  };
 
  // this function helps create the buttons
  var createButton = function (btnText) {
    var btn = $("<button>")
      .text(btnText)
      .addClass("list-group-item list-group-item-action")
      .attr("type", "submit");
    return btn;
  };

  //loads saved cities
  var loadSavedCity = function () {
    citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
    if (citiesListArr == null) {
      citiesListArr = [];
    }
    for (var i = 0; i < citiesListArr.length; i++) {
      var cityNameBtn = createButton(citiesListArr[i]);
      searchedCities.append(cityNameBtn);
    }
  };

  //saves searched cities to local storage
  var saveCityName = function (searchCityName) {
    var newcity = 0;
    citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
    if (citiesListArr == null) {
      citiesListArr = [];
      citiesListArr.unshift(searchCityName);
    } else {
      for (var i = 0; i < citiesListArr.length; i++) {
        if (searchCityName.toLowerCase() == citiesListArr[i].toLowerCase()) {
          return newcity;
        }
      }
      if (citiesListArr.length < numOfCities) {
        // create object
        citiesListArr.unshift(searchCityName);
      } else {
        // control the length of the array. do not allow to save more than 10 cities
        citiesListArr.pop();
        citiesListArr.unshift(searchCityName);
      }
    }
    localStorage.setItem("weatherInfo", JSON.stringify(citiesListArr));
    newcity = 1;
    return newcity;
  };

  //creates buttons with the searched cities inside of them
  var createSearchedCityButton = function (searchCityName) {
    var saveCities = JSON.parse(localStorage.getItem("weatherInfo"));
    // check the searchCityName parameter against all children of citiesListArr
    if (saveCities.length == 1) {
      var cityNameBtn = createButton(searchCityName);
      searchedCities.prepend(cityNameBtn);
    } else {
      for (var i = 1; i < saveCities.length; i++) {
        if (searchCityName.toLowerCase() == saveCities[i].toLowerCase()) {
          return;
        }
      }
      // this checks to see if there are already too many elements in the button list
      if (searchedCities[0].childElementCount < numOfCities) {
        var cityNameBtn = createButton(searchCityName);
      } else {
        searchedCities[0].removeChild(searchedCities[0].lastChild);
        var cityNameBtn = createButton(searchCityName);
      }
      searchedCities.prepend(cityNameBtn);
      $(":button.list-group-item-action").on("click", function () {
        BtnClickHandler(event);
      });
    }
  };
  
  loadSavedCity();
 
  // this is the event handler to submit the form
  var formSubmitHandler = function (event) {
    event.preventDefault();
    // name of the city
    var searchCityName = $("#searchCity").val().trim();
    var newcity = saveCityName(searchCityName);
    getCityWeather(searchCityName);
    if (newcity == 1) {
        createSearchedCityButton(searchCityName);
    }
  };
  var BtnClickHandler = function (event) {
    event.preventDefault();
    // name of the city
    var searchCityName = event.target.textContent.trim();
    getCityWeather(searchCityName);
  };

  // this calls the functions with the submit button
  $("#searchCityForm").on("submit", function () {
    formSubmitHandler(event);
  });
  $(":button.list-group-item-action").on("click", function () {
    BtnClickHandler(event);
  });
