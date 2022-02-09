var cityInput = document.querySelector("#city-input")
 
var weatherKey = "3c0ffffa2f1e899bf98403431f25c752";
var milli = 1000
 
var formSubmitHandler = function(event) {
    event.preventDefault();
   
    var cityName = cityInput.value.trim();
    if (cityName) {
        getCityCoords(cityName);
        // createNewSearchHisItem (cityName)
    }
    else {
        alert("Please enter a city name.")
    };
};
 
// var createNewSearchHisItem = function (cityName) {
//     var cityItem = cityName
//     $("ul").append($(`<li></li>`).addClass("col-12 mt-2 bg-secondary text-light rounded").attr("id", "list1"))
//     $("#list1").append($(`<button>${cityItem}</button>`).addClass(" col-12 btn btn-secondary bg-secondary text-light").attr("onclick", `getCityCoords(city)`))
// };
 
// var loadSearchHistory = function() {
 
// };
 
var getCityCoords = function(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},US&appid=${weatherKey}`)
    .then(function(response){
        response.json().then(function(data){
            if (data.length === 0){
                cityInput.value = "";
                alert("Please enter a valid city name")
            }
            else {
            getCityWeather(data, city);
        };
        });
    });
};
 
var getCityWeather = function(locationData, city) {
    var lat = locationData[0].lat;
    var lon = locationData[0].lon;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherKey}`)
    .then(function(response){
        response.json().then(function(data){
           
           
            displayWeather(data, city);
        });
    });
};
 
var displayWeather = function(weatherData, city) {
   
    var currentDay = dayjs(weatherData.current.dt * milli).utc().local().format("l")
    var currentUV = weatherData.current.uvi;
    $("#current-box").remove();
    $("#forcast-row").remove();
    console.log(weatherData)
 
    $("#current-container").append($("<div>").addClass("col-12 border border-dark").attr("id","current-box"));
 
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
    }
    $("#current-container").append($("<h3>5-Day Forcast:</h3>").addClass("col-12 mt-3"));
 
    displayForcast(weatherData);
   
};
 
var displayForcast = function(weatherData) {
   
    $("#forcast").append($("<div>").addClass("row justify-content-around text-light").attr("id", "forcast-row"));
   
    for (var  i = 0; i < 5; i++) {
        var forcastDate = dayjs(weatherData.daily[i].dt * milli).utc().local().format("l")
        $("#forcast-row").append($("<div>").addClass("card bg-secondary text-md m-3").attr("id", `card-container${i}`).attr("style", "width: 14rem"));
        $(`#card-container${i}`).append($("<div>").addClass("card-body").attr("id",`card-box${i}`));
        $(`#card-box${i}`).append($(`<h4>${forcastDate}</h4>`).addClass("fw-bold"));
   
        $(`#card-box${i}`).append($("<img>").attr("src", `http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}@2x.png`));
   
        $(`#card-box${i}`).append($("<p>Temp: </p>").attr("id", `forcast-temp${i}`));
        $(`#forcast-temp${i}`).append($(`<span>${weatherData.daily[i].temp.day} F</span>`))
   
        $(`#card-box${i}`).append($("<p>Wind: </p>").attr("id", `forcast-wind${i}`));
        $(`#forcast-wind${i}`).append($(`<span>${weatherData.daily[i].wind_speed} MPH</span>`))
   
        $(`#card-box${i}`).append($("<p>Humidity: </p>").attr("id", `forcast-hum${i}`));
        $(`#forcast-hum${i}`).append($(`<span>${weatherData.daily[i].humidity}%</span>`))
 }
}
 
$("#city-form").on("submit", formSubmitHandler);
