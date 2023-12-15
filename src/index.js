async function fetchData(city) {
    const data = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=4901752c18324551b2d160311231212&q=${city}&aqi=no&alerts=no`, 
    {
        mode: 'cors'
    });
    const response = await data.json();
    return response;
}

async function dataObject(city) {
    const data = await fetchData(city);
    console.log('full data', data)
    return {
        location: `${data.location.name}, ${data.location.country}`,
        current: {
            condition: data.current.condition.text,
            temp: {celsius: data.current.temp_c, faren: data.current.temp_f},
            tempFeel: {celsius: data.current.feelslike_c, faren: data.current.feelslike_f},
            date: data.current.last_updated,
            uv: data.current.uv,
            humidity: data.current.humidity,
            avg: {celsius: data.forecast.forecastday[0].day.avgtemp_c, faren: data.forecast.forecastday[0].day.avgtemp_f},
            min: {celsius: data.forecast.forecastday[0].day.mintemp_c, faren: data.forecast.forecastday[0].day.mintemp_f},
            max: {celsius: data.forecast.forecastday[0].day.maxtemp_c, faren: data.forecast.forecastday[0].day.maxtemp_f}
        }
    }
}

dataObject('Fortaleza').then((a) => {
    console.log(a)
})