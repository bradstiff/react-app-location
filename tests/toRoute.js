import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import * as Yup from 'yup';

import Location from '../src/Location';

const HomeLocation = new Location('/');

const Home = () => <div>Home</div>;
const NotFound = () => <div>No match</div>;

afterEach(cleanup);

test('errors when neither component, render nor children properties are provided', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { })
    HomeLocation.toRoute({ invalid: NotFound });
    expect(console.error).toBeCalled();
})

test('errors when invalid property is not provided', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { })
    HomeLocation.toRoute({ component: Home });
    expect(console.error).toBeCalled();
})

test('warning when children node is provided', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { })
    HomeLocation.toRoute({ children: <Home />, invalid: NotFound });
    expect(console.error).toBeCalled();
})
