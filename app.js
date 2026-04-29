const btn = document.querySelector("#search_button");
const input = document.querySelector("#city_name");
const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temperature");
const weatherDescription = document.querySelector("#weather-description");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const resultsCard = document.querySelector("#results-card");

async function getWeather() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=metric&appid=5353309fcaa7998aa6dd6c93a676eef6`);
    const data = await response.json();

    console.log(data);

    cityName.textContent = `📍: ${data.name}`;
    
    temperature.textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;

    weatherDescription.textContent = `Weather Description: ${data.weather[0].description}`;

    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    
    windSpeed.textContent = `Wind Speed: ${data.wind.speed}m/s`;

    resultsCard.style.display = "block";
}

btn.addEventListener("click", (event) => {
    getWeather();
})