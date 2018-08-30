import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import * as Yup from 'yup';

import Location from '../src/Location';

const isNullableDate = Yup.string().test('is-date', '${path}:${value} is not a valid date', date => !date || !isNaN(Date.parse(date)));
const string = Yup.string();
const integer = Yup.number().integer();
const naturalNbr = integer.moreThan(-1);
const wholeNbr = integer.positive();

const HomeLocation = new Location('/');
const AboutLocation = new Location('/about');

const ResourceListLocation = new Location('/resources', null, {
    typeID: wholeNbr.required(),
    page: naturalNbr.default(0),
    rowsPerPage: Yup.number().oneOf([25, 50, 75, 100]).default(25),
    order: Yup.string().oneOf(['asc', 'desc']).default('asc'),
    isActive: Yup.boolean(),
    categoryID: wholeNbr.nullable(),
});
const ResourceLocation = new Location('/resources/:id', { id: wholeNbr.required() }, { date: isNullableDate });

const NotFound = () => <div>No match</div>;
const Home = () => <div>Home</div>;
const About = () => <div>About</div>;

afterEach(cleanup);

test('builds URL with omitted-with-default qs params', () => {
    const serializedUrl = ResourceListLocation.toUrl({ typeID: 2 });
    expect(serializedUrl).toBe('/resources?typeID=2'); //to avoid clutter, omitted-with-default qs params are not written to the url
})

test('builds URL with supplied qs params', () => {
    const locationParams = {
        typeID: 2,
        page: 1,
        rowsPerPage: 50,
        order: 'desc',
        isActive: true,
    };
    const serializedUrl = ResourceListLocation.toUrl(locationParams);
    expect(serializedUrl).toBe('/resources?isActive=true&order=desc&rowsPerPage=50&page=1&typeID=2');
})

test('errors on building a URL with missing required path params', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { })
    const serializedUrl = ResourceLocation.toUrl({ resourceID: 1 }); //should be id:1
    expect(console.error).toBeCalled();
})

test('errors on building a URL with missing required qs params', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { })
    const serializedUrl = ResourceListLocation.toUrl({ categoryID: 1 }); //should be typeID:1
    expect(console.error).toBeCalled();
})

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
