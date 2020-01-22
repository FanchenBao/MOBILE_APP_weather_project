import React from 'react';
import renderer from 'react-test-renderer';
import {
  CityText,
  ErrorText,
  ForecastCategoryText,
  ForecastContentText,
  ErrorBubble,
} from '../src/components/style_components.js';

it('renders CityText correctly', () => {
  const tree = renderer.create(<CityText>Test for CityText</CityText>).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders ErrorText correctly', () => {
  const tree = renderer
    .create(<ErrorText>Test for ErrorText</ErrorText>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders ForecastCategoryText correctly', () => {
  const tree = renderer
    .create(
      <ForecastCategoryText>
        Test for ForecastCategoryText
      </ForecastCategoryText>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders ForecastContentText correctly', () => {
  const tree = renderer
    .create(
      <ForecastContentText>Test for ForecastContentText</ForecastContentText>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders ErrorBubble correctly', () => {
  const tree = renderer
    .create(<ErrorBubble>Test for ErrorBubble</ErrorBubble>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
