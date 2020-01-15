const WEATHER_API_KEY = 'bbeb34ebf60ad50f7893e7440a1e2b0b';
const API_STEM = 'http://api.openweathermap.org/data/2.5/weather?';

const urlMakers = {
  zip: zip => `${API_STEM}zip=${zip}&units=imperial&APPID=${WEATHER_API_KEY}`,
  coord: coord =>
    `${API_STEM}lat=${coord.lat}&lon=${
      coord.lon
    }&units=imperial&APPID=${WEATHER_API_KEY}`,
};

/**
 * Fetch weather info from open weather map, in an async function. Record error
 * message if it occurrs.
 *
 * @param {Map} queryTarget A map indicating which query type to use. For zip
 * code, queryTarget = {type: 'zip', value: <zip code>}. For coordinate,
 * queryTarget = {type: 'coord', value: {lat: <latitude>, lon: <longitude>}}
 * @returns {Promise} A Promise containing a mapping for all needed info.
 */
async function fetchWeatherInfo(query) {
  console.log(query);
  try {
    let resp = await fetch(urlMakers[query.type](query.value));
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
