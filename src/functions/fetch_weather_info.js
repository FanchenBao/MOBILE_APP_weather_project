import AsyncStorage from '@react-native-community/async-storage';
import {CONFIG} from '../config.js';

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
 * queryTarget = {type: 'coord', value: {lat: <latitude>, lon: <longitude>}}.
 * For error, queryTargt = {type: 'error', value: <error msg>}.
 * @returns {Promise} A Promise containing a mapping for all needed info.
 */
async function fetchWeatherInfo(query) {
  console.log(query);
  if (query.type === 'error') {
    return {errorMsg: query.value};
  }
  try {
    let resp = await fetch(urlMakers[query.type](query.value));
    let respJson = await resp.json();
    let res = null;
    if (respJson.cod === 200) {
      res = {
        main: respJson.weather[0].main,
        description: respJson.weather[0].description,
        temp: respJson.main.temp,
        name: respJson.name,
        errorMsg: '',
      };
      // save the last successful weather info for cache.
      await AsyncStorage.setItem(
        CONFIG.asyncStorageKeys.cachedWeatherInfo,
        JSON.stringify(res),
      );
    } else {
      res = {errorMsg: respJson.message};
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}

export {fetchWeatherInfo, urlMakers};
