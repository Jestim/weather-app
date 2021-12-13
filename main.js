const locationInputEl = document.querySelector('input');
const getDataButtonEl = document.querySelector('button');
const mainEl = document.querySelector('main');

getDataButtonEl.addEventListener('click', () => {
    const location = locationInputEl.value;
    getWeatherData(location);
    locationInputEl.value = '';
})

async function getWeatherData(location) {
    if (location == '') { location = 'stockholm'; }
    const locationClean = location.toLowerCase().trim();

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${locationClean}&units=metric&appid=42206c0d3d9495f922799fc44d4d09a2`;

    try {
        const response = await fetch(url, {
            mode: 'cors',
        });
        const weatherData = await response.json();
        const weatherDataObj = processWeatherData(weatherData);
        createWeatherCard(location, weatherDataObj);
    } catch (error) {
        console.log(error);
    }
}

function processWeatherData(weatherDataJson) {
    return {
        weather: weatherDataJson.weather[0].description,
        temperature: weatherDataJson.main.temp,
        wind: weatherDataJson.wind.speed,
        feelsLike: weatherDataJson.main.feels_like,
        gifSearchWord: weatherDataJson.weather[0].main
    };
}

function createWeatherCard(location, weatherDataObj) {
    while (mainEl.firstElementChild) {
        mainEl.lastElementChild.remove();
    }

    const divEl = document.createElement('div');
    divEl.classList.add('weather-card')

    const cityNameEl = document.createElement('p');
    cityNameEl.classList.add('city');
    cityNameEl.textContent = location[0].toUpperCase() + location.slice(1).toLowerCase();
    divEl.appendChild(cityNameEl);

    appendWeatherData(weatherDataObj, divEl);

    mainEl.appendChild(divEl);
    console.log(weatherDataObj.gifSearchWord)
    addGifEl(weatherDataObj.gifSearchWord);
}

function appendWeatherData(weatherDataObj, divEl) {
    const weatherEl = document.createElement('p');
    weatherEl.textContent = `Weather: ${weatherDataObj.weather[0].toUpperCase() + weatherDataObj.weather.slice(1)}`;
    divEl.appendChild(weatherEl);

    const temperatureEl = document.createElement('p');
    temperatureEl.textContent = `Temperature: ${Math.round(weatherDataObj.temperature)} °C`;
    divEl.appendChild(temperatureEl);

    const windEl = document.createElement('p');
    windEl.textContent = `Wind: ${weatherDataObj.wind} m/s`;
    divEl.appendChild(windEl);

    const feelsLikeEl = document.createElement('p');
    feelsLikeEl.textContent = `Feels like: ${Math.round(weatherDataObj.feelsLike)} °C`;
    divEl.appendChild(feelsLikeEl);
}

async function addGifEl(weather) {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=sfSrJvDwvFANdmGRb8sppsQuQIbSw4ZE&s=${weather}`, { mode: 'cors' });
    const gif = await response.json()
    console.log(gif);

    const imgEl = document.createElement('img');
    imgEl.src = gif.data.images.fixed_height.url;

    mainEl.appendChild(imgEl);
}