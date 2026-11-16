const weatherURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + WEATHER_API_KEY
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=" + WEATHER_API_KEY
const cityLookupURL = "https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&accept-language=ru"
const weatherIconURL = "https://openweathermap.org/img/wn/"

function checkResponse(response) {
    if (!response.ok) {
        throw new Error("HTTP " + response.status)
    }
    return response
}

function showError(message) {
    document.querySelector(".currentConditions_placeholder").style.display = 'none'
    document.querySelectorAll(".nextDay_placeholder").forEach((element) => {
        element.style.display = 'none'
    })
    document.querySelector(".errorMessage").textContent = message
    document.querySelector(".errorMessage").style.display = 'block'
}

function revealCurrentConditions() {
    document.querySelector(".currentConditions_placeholder").style.display = 'none'
    document.querySelector(".currentConditions").style = null
}

function revealForecast() {
    document.querySelectorAll(".nextDay_placeholder").forEach((element) => {
        element.style.display = 'none'
    })
    document.querySelectorAll(".nextDay").forEach((element) => {
        element.style = null
    })
}

function decodeWeather(weatherData){
    weatherData.json().then(dataAsJSON => {
        document.getElementById("currentWeatherIcon").appendChild(document.createElement("img")).src = weatherIconURL+dataAsJSON.weather[0].icon+"@2x.png"
        document.getElementById("currentTemperatureValue").innerHTML = Math.round(dataAsJSON.main.temp)
        document.getElementById("currentTemperatureFeelsLikeValue").innerHTML = Math.round(dataAsJSON.main.feels_like)
        document.getElementById("currentHumidityValue").innerHTML = dataAsJSON.main.humidity
        document.getElementById("currentPressureValue").innerHTML = Math.round(dataAsJSON.main.pressure / 1.333)
        document.getElementById("currentWindSpeedValue").innerHTML = dataAsJSON.wind.speed
        document.getElementById("currentVisibilityValue").innerHTML = dataAsJSON.visibility / 1000

        revealCurrentConditions()
    }).catch(() => showError("Не удалось обработать данные о погоде"))
}

function decodeForecast(forecastData){
    forecastData.json().then(dataAsJSON => {
        const options = { weekday: 'short', day: 'numeric', month: 'short'}

        const days = new Map()
        dataAsJSON.list.forEach(entry => {
            const entryDate = new Date(entry.dt * 1000)
            const dayKey = entryDate.toDateString()
            if (days.has(dayKey)) {
                const day = days.get(dayKey)
                day.min = Math.min(day.min, entry.main.temp_min)
                day.max = Math.max(day.max, entry.main.temp_max)
            } else {
                days.set(dayKey, { date: entryDate, min: entry.main.temp_min, max: entry.main.temp_max, icon: entry.weather[0].icon })
            }
        })

        let index = 0
        days.forEach(day => {
            if (index >= 5) { return }
            document.getElementById("day"+(index+1)+"Date").innerHTML = new Intl.DateTimeFormat('ru-RU', options).format(day.date)
            document.getElementById("day"+(index+1)+"MinTemp").innerHTML = Math.round(day.min)
            document.getElementById("day"+(index+1)+"MaxTemp").innerHTML = Math.round(day.max)
            document.getElementById("day"+(index+1)+"Icon").src = weatherIconURL+day.icon+".png"
            index++
        })

        revealForecast()
    }).catch(() => showError("Не удалось обработать прогноз погоды"))
}

function decodeCity(cityData){
    cityData.json().then(dataAsJSON => {
        const cityName = dataAsJSON.address.city
        document.getElementById("currentCity").innerHTML = cityName
        document.title = 'Погода в '+cityName
        document.getElementById("currentStateRegion").innerHTML = dataAsJSON.address.country+", "+dataAsJSON.address.state
    }).catch(() => showError("Не удалось обработать данные о местоположении"))
}

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        fetch(weatherURL + "&lat=" + lat + "&lon=" + lon)
            .then(checkResponse)
            .then(decodeWeather)
            .catch(() => showError("Не удалось загрузить данные о погоде"))

        fetch(forecastURL + "&lat=" + lat + "&lon=" + lon)
            .then(checkResponse)
            .then(decodeForecast)
            .catch(() => showError("Не удалось загрузить прогноз погоды"))

        fetch(cityLookupURL + "&lat=" + lat + "&lon=" + lon)
            .then(checkResponse)
            .then(decodeCity)
            .catch(() => showError("Не удалось определить город"))
    },
    (error) => showError("Не удалось определить местоположение: " + error.message),
    { timeout: 15000, maximumAge: 600000 }
    )
}

window.onload = getWeatherData
