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
const image = document.querySelector("#weather_icons");
const toggleButton = document.querySelector("#toggle-button");
let currentUnit = "metric";

async function getWeather() {
    if (input.value === "") {
        return;
    }

    loading.style.display = "block";

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=${currentUnit}&appid=5353309fcaa7998aa6dd6c93a676eef6`);
    const data = await response.json();

    errorMessage.textContent = "City not found. Please check the spelling and try again."

    loading.style.display = "none";

    if (data.cod === "404") {
        errorMessage.style.display = "block";
        resultsCard.style.display = "none";
        return;
    }

    errorMessage.style.display = "none";

    console.log(data);
    
    const advice = getOutfitAdvice(data.main.temp, data.weather[0].main);

    adviceDisplay.textContent = `Advice: ${advice}`

    image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    cityName.textContent = `📍: ${data.name}`;
    
    temperature.textContent = `Temperature: ${data.main.temp.toFixed(1)}${currentUnit === "metric" ? "°C" : "°F"}`;

    weatherDescription.textContent = `Weather Description: ${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}`;

    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    
    windSpeed.textContent = `Wind Speed: ${data.wind.speed}m/s`;

    resultsCard.style.display = "block";

    
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

function getOutfitAdvice(temp, condition) {
    if (condition === "Thunderstorm") {
        return "Stay indoors! It's safer to watch the lightning from your window.";
    } else if (condition === "Snow") {
        return "Time for thermal layers, a heavy puffer coat, and boots with good grip."
    } else if (condition === "Mist" || condition === "Fog" || condition === "Haze") {
        return "Visibility is low today — drive carefully and wear bright colours."
    } else if (condition === "Rain" || condition === "Drizzle") {
        return "Carry a waterproof jacket and an umbrella. Stay dry!"
    } else if (condition === "Clear" && temp > 30) {
        return "It's scorching! Wear light linen clothes, a hat, and don't forget sunblock."
    } else if (condition === "Clear" && temp >= 20 && temp <= 30) {
        return "Perfect weather! A light t-shirt and shorts or a summer dress will be great."
    } else if (condition === "Clouds" && temp < 20) {
        return "A bit chilly and grey. A sweater or a light denim jacket is a safe bet."
    } else if (condition === "Clouds" && temp >= 20) {
        return "It's cloudy but warm! A comfortable t-shirt or long-sleeve shirt is all you need."
    } else if (temp < 10) {
        return "It's freezing! Grab your scarf, gloves, and a warm wool coat."
    }  else {
        return "Dress in comfortable layers so you can adjust throughout the day."
    }
}


