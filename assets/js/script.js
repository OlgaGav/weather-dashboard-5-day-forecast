// openweather API 
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

var baseWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
var baseForecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
var parameters = "&units=imperial&appid=9c3cdb77bb5831702f9fec737b8d4601";
var searchButtonEl = document.getElementById("search-button");
var searchInputEl = document.getElementById("search-city");
var searchResultsWEl = document.getElementById("weather-area");
var searchResultsFEl = document.getElementById("forecast-area");
var searchHistoryEl = document.getElementById("search-history");
var searchHistory;
var iconLink1 = "https://openweathermap.org/img/wn/"
var iconLink2 = ".png";
// var iconLargeLink2 = "@2x.png";

// clear search field, search results area
searchResultsWEl.innerHTML="";
searchResultsFEl.innerHTML="";
searchInputEl.value="";
searchHistory = JSON.parse(localStorage.getItem("weather-search-history"));
if (searchHistory!==null){
  renderCitiesFromSearchHistory();
}

searchButtonEl.addEventListener('click', function() {
    let cityNameSearch = searchInputEl.value;
    cityNameSearch.trim();
    if (cityNameSearch.length>0){
      showWeatherForecastFor(cityNameSearch);
    }
})

// https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
// Execute a function when the user presses a key on the keyboard
searchInputEl.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    searchButtonEl.click();
  }
});

// function to show search results for city
function showWeatherForecastFor(cityName) {
  // clear the previous results if any
  searchInputEl.value = "";
  searchResultsWEl.innerHTML="";
  searchResultsFEl.innerHTML="";
  // configure URLs to api to get data
  var weatherUrl = baseWeatherUrl+"?q="+encodeURIComponent(cityName)+parameters;
  var forecastUrl = baseForecastUrl+"?q="+encodeURIComponent(cityName)+parameters;
  showWeather(weatherUrl);
  showForecast(forecastUrl);
}

// function to get information to show the weather for today in main widget
// return the object with values to render on the widget
function showWeather(weatherUrl) {
    fetch(weatherUrl)
    .then(function(response){
        if (response.ok){
            return(response.json())
        } else {
            throw new Error ("Invalid Weather URL or service doesn't respond");
            return;
        }
    })
    .then(function(data){
        var cityName = data.name;
        var country = data.sys.country;
        var dateMain = new Date(data.dt*1000).toLocaleDateString("en-US");
        var iconId = data.weather[0].icon;
        var temp = data.main.temp;
        var windSpeed = data.wind.speed;
        var humidity = data.main.humidity;

        var cityWeatherObject = {
            "city" : cityName,
            "country" : country,
            "date": dateMain,
            "icon": iconId,
            "temp": temp,
            "wind": windSpeed,
            "humidity": humidity,
        }

        renderWeather(cityWeatherObject);
        addToHistory(cityName);
    })
}

// function to get information with forecast for 5 days
// return array with forecast data for 5 days with 3h interval
function showForecast(forecastUrl){
    fetch(forecastUrl).then(function(response){
        if (response.ok) {
            return response.json();
        } else {
            throw new Error ("Invalid Forecast URL or service doesn't respond");
            return;
        }
    })
    .then(function(data){
      console.log("data.list: ", data.list);
      renderForecast(data.list);
    })
}

// add search city value to localStorage
function addToHistory(cityName) {
  searchHistory = JSON.parse(localStorage.getItem("weather-search-history"));
  if (searchHistory===null){
    searchHistory = [];
  }
  // validation for duplicates. don't add city if user search city from the search history
  if (searchHistory.indexOf(cityName) !== -1) {
    return;
  }
  // add search city name to localStorage
    searchHistory.unshift(cityName);
    localStorage.setItem("weather-search-history", JSON.stringify(searchHistory));
    renderCitiesFromSearchHistory(); 
}

// rendering cities from localStorage if any on the left hand side pane
function renderCitiesFromSearchHistory() {
  searchHistoryEl.innerHTML="";
  searchHistory = JSON.parse(localStorage.getItem("weather-search-history"));
  if (searchHistory===null){
    return;
  } 
  for (var j=0; j<searchHistory.length; j++) {
    var searchHistoryCity = document.createElement("a");
    searchHistoryCity.className = "btn btn-city";
    searchHistoryCity.setAttribute("name", searchHistory[j]);
    searchHistoryCity.textContent = searchHistory[j];
    searchHistoryEl.appendChild(searchHistoryCity);

    searchHistoryCity.addEventListener('click', function(){
        let city = this.getAttribute("name");
        showWeatherForecastFor(city);
        });
  }
}

// redndering card with weather for today
function renderWeather(weatherTodayData) {
    searchResultsWEl.innerHTML="";

    var weatherCard = document.createElement("div");
    weatherCard.className = "card card-weather";

    var weatherCardBody = document.createElement("div");
    weatherCardBody.className = "card-body";

    var weatherCardHeader = document.createElement("h4");
    weatherCardHeader.className = "card-title";
    weatherCardHeader.innerHTML = weatherTodayData.city+", "+weatherTodayData.country+" ("+weatherTodayData.date+") "+"<span id='weatherIcon'></span>";

    // get icon for current weather and add to the element
    var weatherIconUrl = iconLink1+weatherTodayData.icon+iconLink2;
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", weatherIconUrl);
    iconEl.setAttribute("alt", "icon to show the weather, generated dynamically based on the current weather");

    var tempEl = document.createElement("p");
    tempEl.className = "card-text";
    tempEl.textContent = "Temp: "+weatherTodayData.temp+"°F";
    var windEl = document.createElement("p");
    windEl.className = "card-text";
    windEl.textContent = "Wind: "+weatherTodayData.wind+" MPH"
    var humidityEl = document.createElement("p");
    humidityEl.className = "card-text";
    humidityEl.textContent = "Humidity: "+weatherTodayData.humidity+" %";

    searchResultsWEl.appendChild(weatherCard);
    weatherCard.appendChild(weatherCardBody);
    weatherCardBody.appendChild(weatherCardHeader);
    document.getElementById("weatherIcon").appendChild(iconEl);
    weatherCardBody.appendChild(tempEl);
    weatherCardBody.appendChild(windEl);
    weatherCardBody.appendChild(humidityEl);
}

// redndering cards with forecast weather
function renderForecast(forecastData) {
  searchResultsFEl.innerHTML="";
  
  var forecastCardGroupHeaderEl = document.createElement("h3");
  forecastCardGroupHeaderEl.textContent = "5-Day Forecast:";
  var forecastCardGroupEl = document.createElement("div");
  forecastCardGroupEl.className = "card-deck";
  searchResultsFEl.appendChild(forecastCardGroupHeaderEl);
  searchResultsFEl.appendChild(forecastCardGroupEl);

  for (var i=5; i<40; i=i+8) {
      var forDate = new Date(forecastData[i].dt*1000).toLocaleDateString("en-US");
      var iconId = forecastData[i].weather[0].icon;
      var forecastIconUrl = iconLink1+iconId+iconLink2;
      var temp = forecastData[i].main.temp;
      var windSpeed = forecastData[i].wind.speed;
      var humidity = forecastData[i].main.humidity;
      
      var forecastCardEl = document.createElement("div");
      forecastCardEl.className = "card card-forecast";

      var forecastCardBodyEl = document.createElement("div");
      forecastCardBodyEl.className = "card-body";

      var forecastCardHeaderEl = document.createElement("h4");
      forecastCardHeaderEl.className = "card-title";
      forecastCardHeaderEl.textContent = forDate;

      var forecastCardIconEl = document.createElement("img");
      forecastCardIconEl.className = "card-text";
      forecastCardIconEl.setAttribute("src", forecastIconUrl);
      forecastCardIconEl.setAttribute("alt", "icon to show the weather, generated dynamically based on the current weather");
      
      var forecastCardTempEl = document.createElement("p");
      forecastCardTempEl.className = "card-text";
      forecastCardTempEl.textContent = "Temp: "+temp+"°F";

      var forecastCardWindEl = document.createElement("p");
      forecastCardWindEl.className = "card-text";
      forecastCardWindEl.textContent = "Wind: "+windSpeed+" MPH";

      var forecastCardHumEl = document.createElement("p");
      forecastCardHumEl.className = "card-text";
      forecastCardHumEl.textContent = "Humidity: "+humidity+" %";

      forecastCardGroupEl.appendChild(forecastCardEl);
      forecastCardEl.appendChild(forecastCardBodyEl);
      forecastCardBodyEl.appendChild(forecastCardHeaderEl);
      forecastCardBodyEl.appendChild(forecastCardIconEl);
      forecastCardBodyEl.appendChild(forecastCardTempEl);
      forecastCardBodyEl.appendChild(forecastCardWindEl);
      forecastCardBodyEl.appendChild(forecastCardHumEl);
  }
}