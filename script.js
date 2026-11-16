const weatherURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + WEATHER_API_KEY
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=" + WEATHER_API_KEY
const cityLookupURL = "https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&accept-language=ru"
const weatherIconURL = "https://openweathermap.org/img/wn/"
const HPA_TO_MMHG = 1.333

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

function decodeWeather(weatherData){
    weatherData.json().then(dataAsJSON => {
        const currentIcon = document.createElement("img")
        currentIcon.src = `${weatherIconURL}${dataAsJSON.weather[0].icon}@2x.png`
        currentIcon.alt = dataAsJSON.weather[0].description
        document.getElementById("currentWeatherIcon").appendChild(currentIcon)
        document.getElementById("currentTemperatureValue").textContent = Math.round(dataAsJSON.main.temp)
        document.getElementById("currentTemperatureFeelsLikeValue").textContent = Math.round(dataAsJSON.main.feels_like)
        document.getElementById("currentHumidityValue").textContent = dataAsJSON.main.humidity
        document.getElementById("currentPressureValue").textContent = Math.round(dataAsJSON.main.pressure / HPA_TO_MMHG)
        document.getElementById("currentWindSpeedValue").textContent = dataAsJSON.wind.speed
        document.getElementById("currentVisibilityValue").textContent = Math.round(dataAsJSON.visibility / 1000)

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
                days.set(dayKey, { date: entryDate, min: entry.main.temp_min, max: entry.main.temp_max, icon: entry.weather[0].icon, description: entry.weather[0].description })
            }
        })

        const dayTemplate = document.getElementById("nextDayTemplate")
        const placeholders = document.querySelectorAll(".nextDay_placeholder")
        let index = 0
        days.forEach(day => {
            if (index >= placeholders.length) { return }
            const dayElement = dayTemplate.content.firstElementChild.cloneNode(true)
            dayElement.id = "day"+(index+1)
            dayElement.querySelector(".dayDate").textContent = new Intl.DateTimeFormat('ru-RU', options).format(day.date)
            dayElement.querySelector(".dayMinTemp").textContent = Math.round(day.min)
            dayElement.querySelector(".dayMaxTemp").textContent = Math.round(day.max)
            const dayIcon = dayElement.querySelector(".dayIcon")
            dayIcon.src = weatherIconURL+day.icon+".png"
            dayIcon.alt = day.description
            placeholders[index].replaceWith(dayElement)
            index++
        })
        for (; index < placeholders.length; index++) {
            placeholders[index].style.display = 'none'
        }
    }).catch(() => showError("Не удалось обработать прогноз погоды"))
}

function decodeCity(cityData){
    cityData.json().then(dataAsJSON => {
        const cityName = dataAsJSON.address.city
        document.getElementById("currentCity").textContent = cityName
        document.title = `Погода в ${cityName}`
        document.getElementById("currentStateRegion").textContent = dataAsJSON.address.country+", "+dataAsJSON.address.state
    }).catch(() => showError("Не удалось обработать данные о местоположении"))
}

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        fetch(`${weatherURL}&lat=${lat}&lon=${lon}`)
            .then(checkResponse)
            .then(decodeWeather)
            .catch(() => showError("Не удалось загрузить данные о погоде"))

        fetch(`${forecastURL}&lat=${lat}&lon=${lon}`)
            .then(checkResponse)
            .then(decodeForecast)
            .catch(() => showError("Не удалось загрузить прогноз погоды"))

        fetch(`${cityLookupURL}&lat=${lat}&lon=${lon}`)
            .then(checkResponse)
            .then(decodeCity)
            .catch(() => showError("Не удалось определить город"))
    },
    (error) => showError("Не удалось определить местоположение: " + error.message),
    { timeout: 15000, maximumAge: 600000 }
    )
}

window.onload = getWeatherData
