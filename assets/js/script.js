var form = document.querySelector("#form");
var cityInput = document.querySelector("#city");
var article = document.querySelector("article");
//custom api key
var apiKey = "ae1bb438ea1280f801137813e453bc1e";


//history
var searchHistory = [];
var searchHistoryEl = document.querySelector("#history");

//search city handler
var buttonHandler = function(event) {
    var targetEl = event.target;

    targetEl.matches("button") 
        article.innerHTML = "";

        var city = targetEl.textContent;
         getLocation(city);    
    
};

//find location and get coordinates
var getLocation = function(city) {
    //url to plug city to get lon and lat
 var geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
    fetch(geoUrl).then(function(response) {
        response.json().then(function(geoData) {
            //get lat and lon coordinates
            getWeatherData(geoData);
        });  
    });
};

var getWeatherData = function(geoData) {
    //url to plugin lon and lat
var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geoData[0].lat + "&lon=" + geoData[0].lon + "&units=imperial&appid=" + apiKey;
    fetch(oneCallUrl).then(function(response) {
        response.json().then(function(weatherData) {
            //display the one call (weather) info from the coordinates
            displayWeatherData(geoData, weatherData);
        });
    });
};
//form submition
var formSubmitHandler = function(event) {
    event.preventDefault();
    
//replace existing entry
    article.innerHTML = "";

    var saveCity = true;
   
var city = cityInput.value.trim();

//add up cities to the search history bar
if(city) {
        getLocation(city);
        cityInput.value = "";
        i = 0;
        while (i < searchHistory.length)
        {i++;} 
            {
            
        if(city === searchHistory[i]) {
            saveCity = false;
            }
        }
        if(saveCity === true) {
            searchHistory.push(city);
        }
        
        saveSearch();
        displaySearchHistory();
        }
       };

   saveSearch = function(){
          localStorage.setItem("history", JSON.stringify(searchHistory));  
    };

//display the weather elements

var displayWeatherData = function(geoData, weatherData) {
    var currentDate = new Date();

    var current = document.createElement("section")
    current.className = "current";
    var header = document.createElement("div");
//date
    var headerText = document.createElement("h2");
    headerText.textContent = geoData[0].name + " (" + String(currentDate.getMonth() + 1).padStart(2, '0') + "/" + String(currentDate.getDate()).padStart(2, '0') + "/" + currentDate.getFullYear() + ")";
    header.appendChild(headerText);
//images
    var image = document.createElement("img");
    image.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + "@2x.png");
    header.appendChild(image);
    current.appendChild(header);
//temperature
    var currentTempEl = document.createElement("p");
    currentTempEl.textContent = "Temp: " + weatherData.current.temp + "°F";
    current.appendChild(currentTempEl);
//wind
    var currentWindEl = document.createElement("p");
    currentWindEl.textContent = "Wind: " + weatherData.current.wind_speed + " MPH";
    current.appendChild(currentWindEl);
//humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + weatherData.current.humidity + " %";
    current.appendChild(humidityEl);
//UV
    var uv = document.createElement("p");
    uv.textContent = "UV Index: ";

//uv color selector
    var color = document.createElement("span");
    if(weatherData.current.uvi < 2.99) {
        color.className = "low";
    } else if(weatherData.current.uvi < 5.99) {
        color.className = "moderate";
    } else if(weatherData.current.uvi < 7.99) {
        color.className = "high";
    } else if(weatherData.current.uvi <= 9.99) {
        color.className = "very-high";
    } else {
        color.className = "extreme";
    }


    color.textContent = weatherData.current.uvi;
    article.appendChild(current);
    uv.appendChild(color);
    current.appendChild(uv);
  

    var forecast = document.createElement("h3");
    forecast.textContent = "5-Day Forecast:";
    article.appendChild(forecast);

    var box = document.createElement("section");
    box.className = "box";

    for(var i = 0; i < 5; i++)
    
     {

        var card = document.createElement("div");
        
        card.className = "forecast-card";


        var date = new Date();
        
        date.setDate(date.getDate() + i + 1);

//date
        var dateEl = document.createElement("h4");
        
        dateEl.textContent = String(date.getMonth() + 1).padStart(2, '0') + "/" + String(date.getDate()).padStart(2, '0') + "/" + date.getFullYear();
        
        card.appendChild(dateEl);


//image      
        var image = document.createElement("img");
        
        image.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + "@2x.png");
        
        card.appendChild(image);


//temperature        
        var tempEl = document.createElement("p");
        
        tempEl.textContent = "Temp: " + weatherData.daily[i].temp.max + " °F";
        
        card.appendChild(tempEl);


//wind        
        var windEl = document.createElement("p");
        
        windEl.textContent = "Wind: " + weatherData.daily[i].wind_speed + " MPH";
        
        card.appendChild(windEl);


//humidity        
        var humidityEl = document.createElement("p");
        
        humidityEl.textContent = "Humidity: " + weatherData.daily[i].humidity + " %";
        
        card.appendChild(humidityEl);


        
        box.appendChild(card);
    }


    article.appendChild(box);
};


//search history
var loadSearchHistory = function() {
    var savedHistory = localStorage.getItem("history");
     searchHistory = JSON.parse(savedHistory);
    displaySearchHistory();
};

var displaySearchHistory = function() {
    searchHistoryEl.innerHTML = "";

    for(var i = searchHistory.length - 1; i >= 0; i--) {
        var historyItemEl = document.createElement("button");
        historyItemEl.textContent = searchHistory[i];
        searchHistoryEl.appendChild(historyItemEl);
    }
};

form.addEventListener("submit", formSubmitHandler);
searchHistoryEl.addEventListener("click", buttonHandler);
loadSearchHistory();