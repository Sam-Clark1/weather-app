var cityInput = document.querySelector("#city-input");
 
var weatherKey = "3c0ffffa2f1e899bf98403431f25c752";
var milli = 1000;
var historyIdCounter = 0;
var searchHistory = [];
 
// Handles the city name being submited. Sends city name input to function to get coords.
var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = cityInput.value.trim();
    if (cityName) {
        getCityCoords(cityName);
    }
    else {
        alert("Please enter a city name.")
    };
};
//  Recieves city name from submit and applys it to api fetch.
// Retrieves location data and sends it to get weather data.
var getCityCoords = function(cityName) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},US&appid=${weatherKey}`)
    .then(function(response){
        response.json().then(function(data){
            // Checks if city name input is valid city. An invalid city returns an empty array.
            if (data.length === 0){
                cityInput.value = "";
                alert("Please enter a valid city name")
            }
            else {
            getCityWeather(data);
            cityInput.value = ""
            };
        });
    });
};
// Recieves location data and extracts the latitude, logitude, and proper city name.
// Fetches weather data with that information.
var getCityWeather = function(locationData) {
    var lat = locationData[0].lat;
    var lon = locationData[0].lon;
    var city = locationData[0].name;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherKey}`)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
            displayForcast(data);
 
            var newCityCounter = 0;
            // Checks to see if city alreadt exists in local storage.
            if (searchHistory.length > 0) {
                for (var i = 0; i < searchHistory.length; i++) {
                    // Checks to see if city is same at that index.
                    var notSame = searchHistory[i].name.indexOf(city) == -1;
                    // If not same, returns true and add 1 to counter.
                    if(notSame) {
                        newCityCounter++
                        // Once counter reaches local storage length, confirms city has not be searched and adds to searchHistory.
                        if (newCityCounter == searchHistory.length) {
                            var historyObj = {
                                name: city
                            };
                            createNewHistory(historyObj);
                            return;
                        };
                    };
                };
            };
            // If localStorage is empty, creates first entry.
            if (searchHistory.length === 0) {
                var historyObj = {
                    name: city
                };
                createNewHistory(historyObj);
            };
        });
    });
};
// Recieves weather data and city name to display current weather conditions.
var displayWeather = function(weatherData, city) {
    var currentDay = dayjs(weatherData.current.dt * milli).utc().local().format("l")
    var currentUV = weatherData.current.uvi;
    $("#current-box").remove();
    $("#title").remove();
    $("#forcast-row").remove();
   
    $("#current").append($("<div>").addClass("col-12 border border-dark gray").attr("id","current-box"));
 
    $("#current-box").append($("<div>").addClass("row").attr("id","current-row"));
 
    $("#current-row").append($(`<h3>${city} (${currentDay})</h3>`).addClass("col-12 ms-2").attr("id", "current-city-box"));
    $("#current-city-box").append($("<img>").attr("src", `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`));
 
    $("#current-row").append($("<p>Temp: </p>").addClass("col-12 ms-2").attr("id", "current-temp-box"));
    $("#current-temp-box").append($(`<span>${weatherData.current.temp} F</span>`));
 
    $("#current-row").append($("<p>Wind: </p>").addClass("col-12 ms-2").attr("id", "current-wind-box"));
    $("#current-wind-box").append($(`<span>${weatherData.current.wind_speed} MPH</span>`));
 
    $("#current-row").append($("<p>Humidity: </p>").addClass("col-12 ms-2").attr("id", "current-hum-box"));
    $("#current-hum-box").append($(`<span>${weatherData.current.humidity}%</span>`));
 
    $("#current-row").append($("<p>UV Index: </p>").addClass("col-12 ms-2").attr("id", "current-uv-box"));
    $("#current-uv-box").append($(`<span>${currentUV}</span>`).addClass("text-light rounded p-2").attr("id", "uv-color"));
   
    if (currentUV >= 0 && currentUV <= 2.99) {
        $("#uv-color").addClass("bg-success")
    }
    else if (currentUV >= 3.00 && currentUV <= 5.99) {
        $("#uv-color").addClass("bg-warning")
    }
    else if (currentUV >= 6.00 && currentUV <= 7.99) {
        $("#uv-color").addClass("orange")
    }
    else {
        $("#uv-color").addClass("bg-danger")
    };
 
    $("#forcast-title").append($("<h3>5-Day Forcast:</h3>").addClass("col-12 mt-3").attr("id", "title"));
};
 
// Recieves weather data to be used in generating 5 day forcast display.
var displayForcast = function(weatherData) {
    $("#forcast").append($("<div>").addClass("row justify-content-around text-light").attr("id", "forcast-row"));
   
    for (var  i = 1; i < 6; i++) {
        var forcastDate = dayjs(weatherData.daily[i].dt * milli).utc().local().format("l");
        $("#forcast-row").append($("<div>").addClass("card bg-secondary text-md m-3").attr("id", `card-container${i}`).attr("style", "width: 14rem"));
        $(`#card-container${i}`).append($("<div>").addClass("card-body").attr("id",`card-box${i}`));
        $(`#card-box${i}`).append($(`<h4>${forcastDate}</h4>`).addClass("fw-bold"));
   
        $(`#card-box${i}`).append($("<img>").attr("src", `http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}@2x.png`));
   
        $(`#card-box${i}`).append($("<p>Temp: </p>").attr("id", `forcast-temp${i}`));
        $(`#forcast-temp${i}`).append($(`<span>${weatherData.daily[i].temp.day} F</span>`));
   
        $(`#card-box${i}`).append($("<p>Wind: </p>").attr("id", `forcast-wind${i}`));
        $(`#forcast-wind${i}`).append($(`<span>${weatherData.daily[i].wind_speed} MPH</span>`));
   
        $(`#card-box${i}`).append($("<p>Humidity: </p>").attr("id", `forcast-hum${i}`));
        $(`#forcast-hum${i}`).append($(`<span>${weatherData.daily[i].humidity}%</span>`));
    };
};
// When searched city is determined to be new, creates button of that city that can be used to display its info again.
// Sends city name and unique id as an object to be saved in local storage.
var createNewHistory = function(historyObj) {
    $("ul").append($("<li>").addClass("col-12 mt-2 bg-secondary text-light rounded").attr("data-history-id", historyIdCounter).attr("id", historyIdCounter));
    $(`#${historyIdCounter}`).append($(`<button>${historyObj.name}</button>`).addClass("col-12 btn btn-secondary bg-secondary text-light").attr("onclick", `getCityCoords("${historyObj.name}")`));
   
    historyObj.id = historyIdCounter;
 
    searchHistory.push(historyObj);
   
    saveHistory();
   
    historyIdCounter++;
};
// Saves object to local storage.
var saveHistory = function() {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
};
// Creates history buttons from info in local storage.
var loadHistory = function() {
    var savedHistory = localStorage.getItem("searchHistory");
    if (!savedHistory) {
        return false;
    };
    console.log("saved history found");
    savedHistory = JSON.parse(savedHistory);
    for (var i = 0; i < savedHistory.length; i++) {
        createNewHistory(savedHistory[i]);  
    };
 };
// Clears local storage and reloads the page to offically reset searchHistory.length.
var deleteHistory = function() {
    localStorage.clear();
    location.reload();
};
 
// Sends inputed city name from for to form handler.
$("#city-form").on("submit", formSubmitHandler);
// Calls the delete history function.
$("#delete-btn").on("click", deleteHistory);
// Calls loadHistory on page load.
loadHistory();