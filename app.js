const btn = document.querySelector("#search_button");
const input = document.querySelector("#city_name");
const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temperature");
const weatherDescription = document.querySelector("#weather-description");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const resultsCard = document.querySelector("#results-card");
const adviceDisplay = document.querySelector("#outfit-recommendation");
const loading = document.querySelector("#loading");
const errorMessage = document.querySelector("#error-message");
const weatherIcon = document.querySelector("#weather_icon");
const toggleButton = document.querySelector("#toggle-button");
const historyDiv = document.querySelector("#search-history");
const adviceTone = document.querySelectorAll('input[name="tone"]');
const forecastStrip = document.querySelector("#forecast-strip");
const threeDayForecast = document.querySelector("#three-day-forecast");
const feelsLike = document.querySelector("#feels-like");
const welcomeMessage = document.querySelector("#welcome-message");
let currentUnit = "metric";

const searchHistory = (JSON.parse(localStorage.getItem("searchHistory")) || []);

function renderHistory() {
    historyDiv.innerHTML = "";

    for (let i = 0; i < searchHistory.length; i++) {
        const button = document.createElement("button");
        button.textContent = searchHistory[i];

        button.addEventListener("click", event => {
            input.value = searchHistory[i];
            getWeather();
        })

        historyDiv.appendChild(button);
    }
}

renderHistory()

async function getWeather() {
    if (input.value === "") {
        return;
    }

    const selectedTone = document.querySelector('input[name="tone"]:checked').value;

    welcomeMessage.style.display = "none";

    loading.style.display = "block";

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=${currentUnit}&appid=5353309fcaa7998aa6dd6c93a676eef6`);
    const data = await response.json();

    errorMessage.textContent = "City not found. Please check the spelling and try again."

    loading.style.display = "none";

    if (data.cod === "404") {
        errorMessage.style.display = "block";
        weatherIcon.style.display = "none";
        resultsCard.style.display = "none";
        return;
    }

    errorMessage.style.display = "none";

    if (!searchHistory.includes(data.name)) {
        searchHistory.push(data.name);

        if (searchHistory.length > 5) {
            searchHistory.shift();
        }
    }
    
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    renderHistory();
    
    const advice = getOutfitAdvice(data.main.temp, data.weather[0].main, selectedTone);

    adviceDisplay.textContent = `Advice: ${advice}`

    weatherIcon.textContent = getWeatherEmoji(data.weather[0].main);

    cityName.textContent = `📍: ${data.name}`;
    
    temperature.textContent = `Temperature: ${data.main.temp.toFixed(1)}${currentUnit === "metric" ? "°C" : "°F"}`;

    feelsLike.textContent = `Feels Like: ${data.main.feels_like.toFixed(1)}${currentUnit === "metric" ? "°C" : "°F"}`;

    weatherDescription.textContent = `Weather Description: ${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}`;

    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    
    windSpeed.textContent = `Wind Speed: ${data.wind.speed}m/s`;

    weatherIcon.style.display = "block";

    resultsCard.style.display = "block";

    updateCardTheme(data.main.temp, data.weather[0].main);

    getForecast();
}
async function getForecast() {
    forecastStrip.innerHTML = "";

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&units=${currentUnit}&appid=5353309fcaa7998aa6dd6c93a676eef6`);
    const forecastData = await forecastResponse.json();

    const filteredData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0,3);

    for (let i = 0; i < filteredData.length; i++) {
        const paragraph1 = document.createElement("p");
        paragraph1.textContent = `Date: ${filteredData[i].dt_txt.slice(0,10)}`;

        const paragraph2 = document.createElement("p");
        paragraph2.textContent = `Emoji: ${getWeatherEmoji(filteredData[i].weather[0].main)}`;
        
        const paragraph3 = document.createElement("p");
        paragraph3.textContent = `Temperature: ${filteredData[i].main.temp.toFixed(1)}${currentUnit === "metric" ? "°C" : "°F"}`;

        const paraDiv = document.createElement("div");
        paraDiv.append(paragraph1, paragraph2, paragraph3);

        forecastStrip.appendChild(paraDiv);
        
    }

    threeDayForecast.style.display = "block";
    forecastStrip.style.display = "flex";
}

function getWeatherEmoji(condition) {
    if (condition === "Thunderstorm") {
        return "⛈️";
    } else if (condition === "Drizzle") {
        return "🌦️";
    } else if (condition === "Rain") {
        return "🌧️";
    } else if (condition === "Snow") {
        return "❄️";
    } else if (condition === "Clear") {
        return "☀️";
    } else if (condition === "Clouds") {
        return "☁️";
    } else if (condition === "Mist" || condition === "Fog" || condition === "Haze") {
        return "🌫️";
    } else {
        return "🌡️";
    }
}

function updateCardTheme(temp, condition) {
    resultsCard.classList.remove("weather-rainy", "weather-stormy", "weather-hot", "weather-cold");

    if (condition === "Thunderstorm") {
        resultsCard.classList.add("weather-stormy");
    } else if (condition === "Rain" || condition === "Drizzle") {
        resultsCard.classList.add("weather-rainy");
    } else if (temp > 25) {
        resultsCard.classList.add("weather-hot");
    } else if (temp < 15) {
        resultsCard.classList.add("weather-cold");
    } else {
        resultsCard.classList.add("weather-neutral")
    }
}

toggleButton.addEventListener("click", (event) => {
    if (currentUnit === "metric") {
        currentUnit = "imperial";
        toggleButton.textContent = "Switch to °C"
    } else {
        currentUnit = "metric";
        toggleButton.textContent = "Switch to °F"
    }

    getWeather();
})

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
})

btn.addEventListener("click", (event) => {
    getWeather();
})

for (let i = 0; i < adviceTone.length; i++) {
    adviceTone[i].addEventListener("click", event => {
        getWeather();
    })
}

function getOutfitAdvice(temp, condition, tone) {
    if (condition === "Thunderstorm") {
        if (tone === "fun") {
            return "Girl, stay HOME! The sky is literally falling out there — grab snacks and Netflix!⛈️"
        } else if (tone === "formal") {
            return "Severe weather and conditions are present. It is strongly advised to remain indoors and avoid unnecessary travel."
        } else {
            return "Stay inside."
        }
    } else if (condition === "Snow") {
        if (tone === "fun") {
            return "IT'S GIVING WINTER WONDERLAND!! Bundle up bestie, it's snow day energy!❄️"
        } else if (tone === "formal") {
            return "Snowfall is occuring. Thermal layers, insulated footwear, and a heavy coat are essential."
        } else {
            return "Heavy coat. Warm boots."
        }
    } else if (condition === "Mist" || condition === "Fog" || condition === "Haze") {
        if (tone === "fun") {
            return "Spooky fog era!! Wear something bright so people can actually see you out there.👻"
        } else if (tone === "formal") {
            return "Visibility is reduced due to atmospheric conditions. Bright or reflective clothing is advisable."
        } else {
            return "Wear bright colours. Drive carefully."
        }
    } else if (condition === "Rain" || condition === "Drizzle") {
        if (tone === "fun") {
            return "Umbrella szn! Grab your cutest raincoat and jump in some puddles!🌧️"
        } else if (tone === "formal") {
            return "Precipitation is expected. A waterproof outer layer and umbrella are recommended."
        } else {
            return "Raincoat. Umbrella."
        }
    } else if (condition === "Clear" && temp > 30) {
        if (tone === "fun") {
            return "SCORCHING our here!! Sundress, SPF, and a cold drink — that's your whole personality today.☀️"
        } else if (tone === "formal") {
            return "Temperatures are significantly elevated. Lightweight, breathable clothing and sun protection are advised."
        } else {
            return "Light clothes. Sunscreen."
        }
    } else if (condition === "Clear" && temp >= 20 && temp <= 30) {
        if (tone === "fun") {
            return "Perfect weather bestie!! T-shirt and jeans energy, go outside and LIVE!☀️"
        } else if (tone === "formal") {
            return "Conditions are pleasant today. Light, comfortable clothing is appropriate."
        } else {
            return "T-shirt and jeans."
        }
    } else if (condition === "Clouds" && temp < 20) {
        if (tone === "fun") {
            return "Grey skies and chilly vibes — cozy sweater szn is HERE bestie.🧥"
        } else if (tone === "formal") {
            return "Cool, overcast conditions are present. A warm sweater or mid-layer is recommended."
        } else {
            return "Sweater. Jacket."
        }
    } else if (condition === "Clouds" && temp >= 20) {
        if (tone === "fun") {
            return "Cloudy but make it cute! A light long-sleeve or denim jacket and you're good to go.☁️"
        } else if (tone === "formal") {
            return "Overcast but mild conditions. A light layer over casual clothing is sufficient."
        } else {
            return "Light jacket."
        }
    } else if (temp < 10) {
        if (tone === "fun") {
            return "IT IS COLD COLD!! Scarf, gloves, big coat — layer everything you own bestie.🥶"
        } else if (tone === "formal") {
            return "Temperatures are critically low. Full winter attire including coat, scarf, and gloves is essential."
        } else {
            return "Heavy coat. Scarf. Gloves."
        }
    }  else {
        if (tone === "fun") {
            return "Honestly? Layer up and see how it goes! Fashion is about taking risks anyway.😌"
        } else if (tone === "formal") {
            return "Conditions are variable. Dressing in adaptable layers is the most practical approach."
        } else {
            return "Wear layers."
        }
    }
}


