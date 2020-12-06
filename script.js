const weatherURL = "https://api.openweathermap.org/data/2.5/onecall?units=metric&appid=892e1d28def1322c2f9b2b9a8cde7908"
const cityLookupURL = "https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&accept-language=ru"

function decodeWeather(weatherData){
    weatherData.json().then(dataAsJSON => {
        document.getElementById("currentWeatherIcon").appendChild(document.createElement("img")).src = " http://openweathermap.org/img/wn/"+dataAsJSON.current.weather[0].icon+"@2x.png"
        document.getElementById("currentTemperatureValue").innerHTML = Math.round(dataAsJSON.current.temp)
        document.getElementById("currentTemperatureFeelsLikeValue").innerHTML = Math.round(dataAsJSON.current.feels_like)
        document.getElementById("currentHumidityValue").innerHTML = dataAsJSON.current.humidity
        document.getElementById("currentPressureValue").innerHTML = dataAsJSON.current.pressure
        document.getElementById("currentWindSpeedValue").innerHTML = dataAsJSON.current.wind_speed
        document.getElementById("currentVisibilityValue").innerHTML = dataAsJSON.current.visibility / 1000
        document.getElementById("currentUVIValue").innerHTML = dataAsJSON.current.uvi
    })
}

function decodeCity(cityData){
    cityData.json().then(dataAsJSON => {
        document.getElementById("currentCity").innerHTML = dataAsJSON.address.city
        document.getElementById("currentStateRegion").innerHTML = dataAsJSON.address.country+", "+dataAsJSON.address.state
    })
}

getWeatherData = function() {

    navigator.geolocation.getCurrentPosition((position) => {

        fetch(weatherURL+"&lat="+position.coords.latitude+"&lon="+position.coords.longitude).then(decodeWeather)
        fetch(cityLookupURL+"&lat="+position.coords.latitude+"&lon="+position.coords.longitude).then(decodeCity)
    },
    (error) => {document.body.innerHTML = error}
    )
}

window.onload = getWeatherData