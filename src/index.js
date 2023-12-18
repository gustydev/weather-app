import { format } from 'date-fns';

async function fetchData(city) {
    const data = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=4901752c18324551b2d160311231212&q=${city}&aqi=no&alerts=no`, 
    {
        mode: 'cors'
    });
    const response = await data.json();
    return response;
}

async function filterData(city) {
    const data = await fetchData(city);
    return {
        location: `${data.location.name}, ${data.location.country}`,
        current: {
            condition: data.current.condition.text,
            condIcon: data.current.condition.icon,
            temp: {celsius: data.current.temp_c, faren: data.current.temp_f},
            tempFeel: {celsius: data.current.feelslike_c, faren: data.current.feelslike_f},
            date: data.current.last_updated,
            humidity: data.current.humidity,
            wind: data.current.wind_kph
        }
    }
}

let unit = 'C';

function formatDate(date) {
    return format(new Date(date), 'iiii H:mm')
}

function loadDisplay(data) {
    const condition = document.querySelector('div.condition');
    const location = document.querySelector('div.location');
    const temp = document.querySelector('div.temp');
    const humidity = document.querySelector('div.humidity');
    const wind = document.querySelector('div.wind');
    const date = document.querySelector('div.date');
    const condImg = document.querySelector('img#cond-img')

    condition.textContent = `${data.current.condition}`
    condImg.src = `${data.current.condIcon}` 
    condImg.alt = `${data.current.condition}`

    location.textContent = data.location;

    if (unit === 'C') {
        temp.textContent = `${data.current.temp.celsius} ºC (feels ${data.current.tempFeel.celsius} ºC)`;
    } else {
        temp.textContent = `${data.current.temp.faren} ºF (feels ${data.current.tempFeel.faren} ºF)`
    }

    humidity.textContent = `Humidity: ${data.current.humidity}%`;

    wind.textContent = `Wind: ${data.current.wind} km/h`;

    date.textContent = `${formatDate(data.current.date)}`
}

let currentData;

filterData('Fortaleza').then((d) => {currentData = d; loadDisplay(currentData)});

const searchBtn = document.querySelector('button#search');
const searchInput = document.querySelector('input');
const unitSwitch = document.querySelector('button#unit-switch')

searchBtn.addEventListener('click', () => {
    if (searchInput.value) {
        filterData(searchInput.value).then((d) => {
            currentData = d;
            loadDisplay(currentData);
        })
        .catch((error) => {
            alert('Location not found.')
        })
    }
})

unitSwitch.addEventListener('click', () => {
    if (unit === 'C') {
        unit = 'F';
        unitSwitch.textContent = `Switch to ºC`;
    } else {
        unit = 'C';
        unitSwitch.textContent = `Switch to ºF`;
    }
    loadDisplay(currentData);
})

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
})
