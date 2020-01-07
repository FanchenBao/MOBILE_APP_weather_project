const WEATHER_API_KEY = 'bbeb34ebf60ad50f7893e7440a1e2b0b';
const API_STEM = 'http://api.openweathermap.org/data/2.5/weather?';

function makeUrl(zip) {
  return `${API_STEM}zip=${zip}&units=imperial&APPID=${WEATHER_API_KEY}`;
}

async function fetchWeatherInfo(zip) {
  try {
    let resp = await fetch(makeUrl(zip));
    let respJson = await resp.json();
    if (respJson.cod === 200) {
      return {
        main: respJson.weather[0].main,
        description: respJson.weather[0].description,
        temp: respJson.main.temp,
        errorMsg: '',
      };
    } else {
      return {errorMsg: respJson.message};
    }
  } catch (error) {
    console.error(error);
  }
}

export {fetchWeatherInfo};