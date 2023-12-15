import { format, parse } from 'date-fns';

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
    console.log('raw data:', data)
    return {
        location: `${data.location.name}, ${data.location.country}`,
        current: {
            condition: data.current.condition.text,
            condIcon: data.current.condition.icon,
            temp: {celsius: data.current.temp_c, faren: data.current.temp_f},
            tempFeel: {celsius: data.current.feelslike_c, faren: data.current.feelslike_f},
            date: data.current.last_updated,
            humidity: data.current.humidity,
            avg: {celsius: data.forecast.forecastday[0].day.avgtemp_c, faren: data.forecast.forecastday[0].day.avgtemp_f},
            min: {celsius: data.forecast.forecastday[0].day.mintemp_c, faren: data.forecast.forecastday[0].day.mintemp_f},
            max: {celsius: data.forecast.forecastday[0].day.maxtemp_c, faren: data.forecast.forecastday[0].day.maxtemp_f},
            wind: data.current.wind_kph
        }
    }
}

let unit = 'C';

function formatDate(date) {
    return format(new Date(date), 'iiii H:m')
}

function loadDisplay(data) {
    const condition = document.querySelector('div.condition');
    const location = document.querySelector('div.location');
    const temp = document.querySelector('div.temp');
    const humidity = document.querySelector('div.humidity');
    const wind = document.querySelector('div.wind');
    const date = document.querySelector('div.date');
    // const extra = document.querySelector('div.extra-temps');

    condition.innerHTML = `<img src=${data.current.condIcon} alt='${data.current.condition}'>${data.current.condition}`

    location.textContent = data.location;

    if (unit === 'C') {
        temp.textContent = `${data.current.temp.celsius} ºC (feels ${data.current.tempFeel.celsius} ºC)`;
        // extra.textContent = `Average of ${data.current.avg.celsius} ºC, minimum of ${data.current.min.celsius} ºC, max of ${data.current.max.celsius} ºC`
    } else {
        temp.textContent = `${data.current.temp.faren} ºF (feels ${data.current.tempFeel.faren} ºF)`
        // extra.textContent = `Average of ${data.current.avg.faren} ºF, minimum of ${data.current.min.faren} ºF, max of ${data.current.max.faren} ºF`
    }

    humidity.textContent = `Humidity: ${data.current.humidity}%`;

    wind.textContent = `Wind: ${data.current.wind} km/h`;

    date.textContent = `${formatDate(data.current.date)}`
}

console.clear()

let dataSet;

filterData('Fortaleza').then((d) => {dataSet = d; console.log('filtered data:', dataSet); loadDisplay(dataSet)});

const searchBtn = document.querySelector('button#search');
const searchInput = document.querySelector('input');
const unitSwitch = document.querySelector('button#unit-switch')

searchBtn.addEventListener('click', () => {
    if (searchInput.value) {
        filterData(searchInput.value).then((d) => {
            dataSet = d;
            loadDisplay(dataSet);
        })
        .catch((error) => {
            alert('Error: Location not found')
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
    loadDisplay(dataSet);
})

