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
        weather: weatherDataJson.weather[0].main,
        temperature: weatherDataJson.main.temp,
        wind: weatherDataJson.wind.speed,
        feelsLike: weatherDataJson.main.feels_like
    };
}

function createWeatherCard(location, weatherDataObj) {
    while (mainEl.firstElementChild) {
        mainEl.lastElementChild.remove();
    }

    const divEl = document.createElement('div');
    const paraEl = document.createElement('p');
    paraEl.textContent = location[0].toUpperCase() + location.slice(1).toLowerCase();
    divEl.appendChild(paraEl);

    for (const [key, value] of Object.entries(weatherDataObj)) {
        const paraEl = document.createElement('p');
        paraEl.textContent = `${key}: ${value}`;
        divEl.appendChild(paraEl);
    }

    mainEl.appendChild(divEl);
    addGifEl(weatherDataObj.weather);
}

async function addGifEl(weather) {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=sfSrJvDwvFANdmGRb8sppsQuQIbSw4ZE&s=${weather}`, { mode: 'cors' });
    const gif = await response.json()
    console.log(gif);

    const imgEl = document.createElement('img');
    imgEl.src = gif.data.images.fixed_height.url;

    mainEl.appendChild(imgEl);
}