// weather API url https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
var baseWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
var baseForecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
var parameters = "&units=imperial&appid=9c3cdb77bb5831702f9fec737b8d4601";
var searchButtonEl = document.getElementById("search-button");
var searchInputEl = document.getElementById("search-city");
var searchResultsEl = document.getElementById("dashboard");
var iconLink1 = "https://openweathermap.org/img/wn/"
var iconLink2 = ".png";
// var iconLargeLink2 = "@2x.png";

searchButtonEl.addEventListener('click', function() {
    var cityName = searchInputEl.value;
    showWeatherForecastFor(cityName);
})

function showWeatherForecastFor(cityName) {
  if (cityName.length===0 || cityName.length===undefined || cityName.length===null) {
    return;
  } else {
    cityName = encodeURIComponent(cityName);
  }
  var weatherUrl = baseWeatherUrl+"?q="+cityName+parameters;
  var forecastUrl = baseForecastUrl+"?q="+cityName+parameters;
  searchResultsEl.innerHTML = "";
  showWeather(weatherUrl);
  showForecast(forecastUrl);
}

function showWeather(weatherUrl) {
    fetch(weatherUrl)
    .then(function(response){
        if (response.ok){
            return(response.json())
        } else {
            throw new Error ("Invalid Weather URL or service doesn't respond");
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

        var weatherCard = document.createElement("div");
        weatherCard.className = "card";

        var weatherCardBody = document.createElement("div");
        weatherCardBody.className = "card-body";

        var weatherCardHeader = document.createElement("h4");
        weatherCardHeader.className = "card-title";
        weatherCardHeader.innerHTML = cityName+", "+country+" ("+dateMain+") "+"<span id='weatherIcon'></span>";

        // get icon for current weather and add to the element
        var weatherIconUrl = iconLink1+iconId+iconLink2;
        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", weatherIconUrl);
        iconEl.setAttribute("alt", "icon to show the weather, generated dynamically based on the current weather");

        var tempEl = document.createElement("p");
        tempEl.className = "card-text";
        tempEl.textContent = "Temp: "+temp+"°F";
        var windEl = document.createElement("p");
        windEl.className = "card-text";
        windEl.textContent = "Wind: "+windSpeed+" MPH"
        var humidityEl = document.createElement("p");
        humidityEl.className = "card-text";
        humidityEl.textContent = "Humidity: "+humidity+" %";

        searchResultsEl.appendChild(weatherCard);
        weatherCard.appendChild(weatherCardBody);
        weatherCardBody.appendChild(weatherCardHeader);
        document.getElementById("weatherIcon").appendChild(iconEl);
        weatherCardBody.appendChild(tempEl);
        weatherCardBody.appendChild(windEl);
        weatherCardBody.appendChild(humidityEl);
    })
}

function showForecast(forecastUrl){
    fetch(forecastUrl)
    .then(function(response){
        if (response.ok) {
            return response.json();
        } else {
            throw new Error ("Invalid Forecast URL or service doesn't respond");
        }
    })
    .then(function(data){

        var forecastCardGroupHeaderEl = document.createElement("h3");
        forecastCardGroupHeaderEl.textContent = "5-Day Forecast:";
        var forecastCardGroupEl = document.createElement("div");
        forecastCardGroupEl.className = "card-group";
        // forecastCardGroupEl.setAttribute = ("id","forecast-group");
        searchResultsEl.appendChild(forecastCardGroupHeaderEl);
        searchResultsEl.appendChild(forecastCardGroupEl);

        for (var i=5; i<40; i=i+8) {
            var forDate = new Date(data.list[i].dt*1000).toLocaleDateString("en-US");
            var iconId = data.list[i].weather[0].icon;
            var forecastIconUrl = iconLink1+iconId+iconLink2;
            var temp = data.list[i].main.temp;
            var windSpeed = data.list[i].wind.speed;
            var humidity = data.list[i].weather[0].main.humidity;
            
            var forecastCardEl = document.createElement("div");
            forecastCardEl.className = "card";
    
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
            forecastCardTempEl.textContent = "Temp:"+temp+"°F";

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
    })
}