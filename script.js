const weatherURL = "https://api.openweathermap.org/data/2.5/onecall?units=metric&appid=892e1d28def1322c2f9b2b9a8cde7908"
const cityLookupURL = "https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&accept-language=ru"
const weatherIconURL = "http://openweathermap.org/img/wn/"

function decodeWeather(weatherData){
    weatherData.json().then(dataAsJSON => {
        document.getElementById("currentWeatherIcon").appendChild(document.createElement("img")).src = weatherIconURL+dataAsJSON.current.weather[0].icon+"@2x.png"
        document.getElementById("currentTemperatureValue").innerHTML = Math.round(dataAsJSON.current.temp)
        document.getElementById("currentTemperatureFeelsLikeValue").innerHTML = Math.round(dataAsJSON.current.feels_like)
        document.getElementById("currentHumidityValue").innerHTML = dataAsJSON.current.humidity
        document.getElementById("currentPressureValue").innerHTML = dataAsJSON.current.pressure
        document.getElementById("currentWindSpeedValue").innerHTML = dataAsJSON.current.wind_speed
        document.getElementById("currentVisibilityValue").innerHTML = dataAsJSON.current.visibility / 1000
        document.getElementById("currentUVIValue").innerHTML = dataAsJSON.current.uvi

        const options = { weekday: 'short', day: 'numeric', month: 'short'}

        for (let index = 0; index < Math.min(5, dataAsJSON.daily.length); index++) {
            const element = dataAsJSON.daily[index];
            const dayDateTIme = element.dt * 1000;
            document.getElementById("day"+(index+1)+"Date").innerHTML = new Intl.DateTimeFormat('ru-RU', options).format(dayDateTIme)
            document.getElementById("day"+(index+1)+"MinTemp").innerHTML = Math.round(element.temp.min)
            document.getElementById("day"+(index+1)+"MaxTemp").innerHTML = Math.round(element.temp.max)
            document.getElementById("day"+(index+1)+"Icon").src = weatherIconURL+element.weather[0].icon+".png"
                
        }

        document.querySelector(".currentConditions_placeholder").style.display = 'none'
        document.querySelectorAll(".nextDay_placeholder").forEach((element) => {
            element.style.display = 'none'
        })

        document.querySelector(".currentConditions").style = null
        document.querySelectorAll(".nextDay").forEach((element) => {
            element.style = null
        })

    })
}

function decodeCity(cityData){
    cityData.json().then(dataAsJSON => {
        const cityName = dataAsJSON.address.city
        document.getElementById("currentCity").innerHTML = cityName
        document.title = 'Погода в '+cityName
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