const WEATHER_API_KEY = 'bbeb34ebf60ad50f7893e7440a1e2b0b';
const API_STEM = 'http://api.openweathermap.org/data/2.5/weather?';

/**
 * Construct the url for API call.
 *
 * @param {string} zip A valid zip code input.
 * @returns {string} constructed url for API call.
 */
function makeUrl(zip) {
  return `${API_STEM}zip=${zip}&units=imperial&APPID=${WEATHER_API_KEY}`;
}

/**
 * Fetch weather info from open weather map, in an async function. Record error
 * message if it occurrs.
 *
 * @param {string} zip A valid zip code input.
 * @returns {Promist} A Promise containing a mapping for all needed info.
 */
async function fetchWeatherInfo(zip) {
  try {
    let resp = await fetch(makeUrl(zip));
    let respJson = await resp.json();
    if (respJson.cod === 200) {
      return {
        main: respJson.weather[0].main,
        description: respJson.weather[0].description,
        temp: respJson.main.temp,
        name: respJson.name,
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
