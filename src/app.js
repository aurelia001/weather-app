let now = new Date();
let hour = addZeroBefore(now.getHours());
let minutes = addZeroBefore(now.getMinutes());
function addZeroBefore(n) {
  return (n < 10 ? `0` : ``) + n;
}
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let time = document.getElementById("date");
time.innerHTML = `${day} ${hour}:${minutes}`;
function changeCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input");
  let city = document.querySelector("h1");
  city.innerHTML = searchInput.value;

  searchCity(searchInput.value);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", changeCity);

function searchCity(city) {
  let apiKey = "73c8674456bc85afaf789af71afc1080";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showStats);
}

function showStats(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  celsiusTemperture = response.data.main.temp;
  document.querySelector("#current-temperture").innerHTML =
    Math.round(celsiusTemperture);
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;
  let windspeed = Math.round(response.data.wind.speed);
  document.querySelector("#windspeed").innerHTML = `${windspeed} km/h`;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document
    .querySelector("#current-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#current-icon")
    .setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

function searchLocation(position) {
  let apiKey = "73c8674456bc85afaf789af71afc1080";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showStats);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", getCurrentLocation);

function convertToFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperture = (celsiusTemperture * 9) / 5 + 32;
  document.querySelector("#current-temperture").innerHTML =
    Math.round(fahrenheitTemperture);
}
function converToCelsius(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  document.querySelector("#current-temperture").innerHTML =
    Math.round(celsiusTemperture);
}
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", converToCelsius);

let celsiusTemperture = null;

function getForecast(coordinates) {
  apiKey = "73c8674456bc85afaf789af71afc1080";
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=metric`;
  console.log(axios.get(apiUrl).then(displayForecast));
}

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily.slice(3);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row forecast">`;
  forecast.forEach(function (forecastDay) {
    forecastHTML =
      forecastHTML +
      `
      <div class="col">
            <div class="weekday">${formatDate(forecastDay.dt)}</div>
            <div class="weather-state">
               <img class="forecast-state"
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
            </div>
            <div class="forecast-temperture"><span class="max-temperture"> ${Math.round(
              forecastDay.temp.max
            )}°</span><span class="min-temperture"> ${Math.round(
        forecastDay.temp.min
      )}°</span></div>
   </div>
  `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

searchCity("Tokyo");
