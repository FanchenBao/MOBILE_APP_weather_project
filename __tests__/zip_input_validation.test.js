import {isZipValid} from '../src/functions/zip_input_validation.js';

test('isZipValid validate a correct zip code', () =>
  expect(isZipValid('12345')).toBeTruthy());

test('isZipValid validate a wrong zip code (too many digits)', () =>
  expect(isZipValid('123451')).toBeFalsy());

test('isZipValid validate a wrong zip code (too few digits)', () =>
  expect(isZipValid('1234')).toBeFalsy());

test('isZipValid validate a wrong zip code (contain non-digit)', () =>
  expect(isZipValid('12e45')).toBeFalsy());
