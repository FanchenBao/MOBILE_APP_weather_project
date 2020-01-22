import {Forecast} from '../src/components/Forecast/index.js';
import React from 'react';
import renderer from 'react-test-renderer';

it('renders correctly with city name and forecast', () => {
  const tree = renderer
    .create(
      <Forecast
        main="Clear"
        description="clear sky"
        temp="21.13"
        errorMsg=""
        name="Schenectady"
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly with error message', () => {
  const tree = renderer.create(<Forecast errorMsg="Some error" />).toJSON();
  expect(tree).toMatchSnapshot();
});
