// const Inputform = document.querySelector("form");
// const cityInput = document.getElementById("city-name");
// const weatherDiv = document.querySelector(".weather-cards");
// const curretWeatherDiv = document.querySelector(".current-weather");

// const API_KEY = "93ed6b240055167eb7de3ea19b42b7e0";

// const createWeatherCard = (element) => {
//   const card = `
//   <li class="card">
//   <h3>${element.dt_txt}</h3>
//   <img src="https://openweathermap.org/img/wn/${
//     element.weather[0].icon
//   }@2x.png" alt="" />
//   <h4>temperature: ${(element.main.temp - 273).toFixed(2)}</h4>
//   <h4>humidity:${element.main.humidity}</h4>
//   <h4>wind:${element.wind.speed} m/s</h4>
// </li>
// `;
//   return card;
// };

// const createCurrentweather = (cityname, element) => {
//   return `  <div class="details">
//     <h1 class="title">${cityname}</h1>
//     <h4>temperature:${(element.main.temp - 273).toFixed(2)}</h4>
//     <h4>humidity:${element.main.humidity}</h4>
//   <h4>wind:${element.wind.speed} m/s</h4>
// </li>
//   </div>

//   <div class="icon">
//   <img src="https://openweathermap.org/img/wn/${
//     element.weather[0].icon
//   }@2x.png" alt="" />
//     <h4></h4>
//   </div>`;
// };

// const getWeatherDetails = async (cityName, lat, lon) => {
//   const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
//   let res = await fetch(weatherURL);
//   let data = await res.json();
//   console.log(data.list[0]);
//   curretWeatherDiv.insertAdjacentHTML(
//     "beforeend",
//     createCurrentweather(cityName, data.list[0])
//   );

//   const uniqueForcastData = [];
//   const fivedaysforcast = data.list.filter((forcast) => {
//     const forcastDate = new Date(forcast.dt_txt).getUTCDate();

//     if (!uniqueForcastData.includes(forcastDate)) {
//       return uniqueForcastData.push(forcastDate);
//     }
//   });

//   fivedaysforcast.forEach((element) => {
//     weatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(element));
//   });
// };

// const getCityCoordinated = async (e) => {
//   e.preventDefault();
//   const city = cityInput.value.trim();

//   if (!city) return;
//   console.log(city);

//   const geolocation_url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;

//   let res = await fetch(geolocation_url);
//   let data = await res.json();

//   const { name, lat, lon } = data[0];
//   getWeatherDetails(name, lat, lon);
// };

// Inputform.addEventListener("submit", getCityCoordinated);
const Inputform = document.querySelector(".form");
const cityInput = document.getElementById("city-name");
const weatherDiv = document.querySelector(".weather-cards");
const curretWeatherDiv = document.querySelector(".current-weather-details");
const searchedCitiesDiv = document.querySelector(".searched-cities");
const dataCard = document.querySelector(".data");

const API_KEY = "93ed6b240055167eb7de3ea19b42b7e0"; // Replace with your OpenWeatherMap API key

const recentCitiesStack = [];

const createWeatherCard = (element) => {
  const card = `
    <li class="card">
      <h3>${element.dt_txt}</h3>
      <img src="https://openweathermap.org/img/wn/${
        element.weather[0].icon
      }@2x.png" alt="" />
      <h4>temperature: ${(element.main.temp - 273).toFixed(2)}</h4>
      <h4>humidity: ${element.main.humidity}</h4>
      <h4>wind: ${element.wind.speed} m/s</h4>
    </li>
  `;
  return card;
};

const createCurrentweather = (cityname, element) => {
  return `
    <div class="current-weather-icon">
      <img src="https://openweathermap.org/img/wn/${
        element.weather[0].icon
      }@2x.png" alt="Weather Icon" />
    </div>
    <div class="current-weather-info">
      <h2>${cityname}</h2>
      <h4>Temperature: ${(element.main.temp - 273).toFixed(2)}</h4>
      <h4>Humidity: ${element.main.humidity}</h4>
      <h4>Wind: ${element.wind.speed} m/s</h4>
    </div>
  `;
};

const getWeatherDetails = async (cityName, lat, lon) => {
  const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  let res = await fetch(weatherURL);
  let data = await res.json();
  curretWeatherDiv.innerHTML = createCurrentweather(cityName, data.list[0]);

  const uniqueForcastData = [];
  const fivedaysforcast = data.list.filter((forcast) => {
    const forcastDate = new Date(forcast.dt_txt).getUTCDate();
    if (!uniqueForcastData.includes(forcastDate)) {
      return uniqueForcastData.push(forcastDate);
    }
  });

  weatherDiv.innerHTML = "";
  fivedaysforcast.forEach((element) => {
    weatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(element));
  });

  dataCard.style.display = "flex";

  // Add the recent city to the list
  displayRecentCity(cityName);
};

const getCityCoordinates = async (e) => {
  e.preventDefault();
  let city = cityInput.value.trim();

  if (!city) return;

  const geolocation_url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;

  let res = await fetch(geolocation_url);
  let data = await res.json();

  const { name, lat, lon } = data[0];
  getWeatherDetails(name, lat, lon);
  cityInput.value = "";
};

Inputform.addEventListener("submit", getCityCoordinates);

const locationBtn = document.querySelector(".location-btn");

const getMyLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const geolocation_url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${API_KEY}`;
      const res = await fetch(geolocation_url);
      const data = await res.json();
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};

locationBtn.addEventListener("click", getMyLocation);

const displayRecentCity = (cityName) => {
  if (recentCitiesStack.length >= 5) {
    // Remove the oldest city from the stack
    const removedCity = recentCitiesStack.pop();
    // Find the corresponding DOM element and remove it
    const cityElement = document.querySelector(`[data-city="${removedCity}"]`);
    if (cityElement) {
      searchedCitiesDiv.removeChild(cityElement);
    }
  }

  recentCitiesStack.unshift(cityName);

  const recentCityCard = document.createElement("div");
  recentCityCard.textContent = cityName;
  recentCityCard.className = "searched-city-card";
  recentCityCard.dataset.city = cityName; // Add a data attribute to link the card with the city
  recentCityCard.addEventListener("click", () => {
    cityInput.value = cityName;
  });

  searchedCitiesDiv.prepend(recentCityCard);
};
