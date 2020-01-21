import {
  fetchWeatherInfo,
  urlMakers,
} from '../src/functions/fetch_weather_info.js';

test('urlMakers for zip code and coordination', () => {
  expect(urlMakers.zip('12345')).toBe(
    'http://api.openweathermap.org/data/2.5/weather?zip=12345&units=imperial&APPID=bbeb34ebf60ad50f7893e7440a1e2b0b',
  );
  expect(urlMakers.coord({lat: '10', lon: '20'})).toBe(
    'http://api.openweathermap.org/data/2.5/weather?lat=10&lon=20&units=imperial&APPID=bbeb34ebf60ad50f7893e7440a1e2b0b',
  );
});

test('fetchWeatherInfo receives error query', async () => {
  await expect(
    fetchWeatherInfo({type: 'error', value: 'error message'}),
  ).resolves.toEqual({errorMsg: 'error message'});
});

const mockSuccessResp = {
  json: () =>
    JSON.parse(
      '{"coord":{"lon":-73.94,"lat":42.81},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base":"stations","main":{"temp":21.13,"feels_like":8.55,"temp_min":15.01,"temp_max":26.6,"pressure":1030,"humidity":45},"visibility":16093,"wind":{"speed":11.41,"deg":280},"clouds":{"all":1},"dt":1579641641,"sys":{"type":1,"id":5782,"country":"US","sunrise":1579609222,"sunset":1579643589},"timezone":-18000,"id":0,"name":"Schenectady","cod":200}',
    ),
};

const mockFailResp = {
  json: () => JSON.parse('{"cod":"404","message":"city not found"}'),
};

test('fetch weather info succeeds', async () => {
  global.fetch = jest.fn().mockResolvedValue(mockSuccessResp);
  await expect(
    fetchWeatherInfo({type: 'zip', value: '12345'}),
  ).resolves.toEqual({
    main: 'Clear',
    description: 'clear sky',
    temp: 21.13,
    name: 'Schenectady',
    errorMsg: '',
  });
});

test('fetch weather info fails', async () => {
  global.fetch = jest.fn().mockResolvedValue(mockFailResp);
  await expect(
    fetchWeatherInfo({type: 'zip', value: '99999'}),
  ).resolves.toEqual({
    errorMsg: 'city not found',
  });
});

test('fetch weather info error', async () => {
  let console_spy = jest.spyOn(global.console, 'error');
  global.fetch = jest.fn().mockRejectedValue('oops');
  await fetchWeatherInfo({type: 'zip', value: '99999'});
  expect(console_spy).toHaveBeenCalledTimes(1);
  expect(console_spy).toHaveBeenLastCalledWith('oops');
});
