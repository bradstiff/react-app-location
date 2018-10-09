import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import * as Yup from 'yup';

import Location from '../src/Location';

const isNullableDate = Yup.string().test('is-date', '${path}:${value} is not a valid date', date => !date || !isNaN(Date.parse(date)));
const integer = Yup.number().integer();
const naturalNbr = integer.moreThan(-1);
const wholeNbr = integer.positive();

const ResourceListLocation = new Location('/resources', null, {
    typeID: wholeNbr.required(),
    page: naturalNbr.default(0),
    rowsPerPage: Yup.number().oneOf([25, 50, 75, 100]).default(25),
    order: Yup.string().oneOf(['asc', 'desc']).default('asc'),
    isActive: Yup.boolean(),
    categoryID: wholeNbr.nullable(),
});
const ResourceLocation = new Location('/resources/:id', { id: wholeNbr.required() }, { date: isNullableDate });

afterEach(cleanup);

test('parses URL with path param', () => {
    const location = {
        pathname: '/resources/1',
        search: '',
    }
    const match = {
        params: {
            id: '1'
        }
    };

    const params = ResourceLocation.parseLocationParams(location, match);
    expect(params).toMatchObject({ id: 1 });
})

test('parses URL with path param, match is omitted', () => {
    const location = {
        pathname: '/resources/1',
        search: '',
    }
    const match = {
        params: {
            id: '1'
        }
    };

    const params = ResourceLocation.parseLocationParams(location, match);
    expect(params).toMatchObject({ id: 1 });
})

test('errors on parsing a URL with missing required path params', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { })
    const location = {
        pathname: '/resources/a',
        search: '',
    }
    const match = {
        params: {
            id: 'a'
        }
    };

    const params = ResourceLocation.parseLocationParams(location, match);
    expect(params).toBeNull();
    expect(console.error).toBeCalled();
})

test('parses URL with no path params and omitted-with-default qs params', () => {
    const location = {
        pathname: '/resources',
        search: 'typeID=2',
    }
    const match = {
        params: null,
    };

    const params = ResourceListLocation.parseLocationParams(location, match);
    expect(params).toMatchObject({ typeID: 2, page: 0, rowsPerPage: 25, order: 'asc' });
})

test('parses URL with all qs params supplied', () => {
    const location = {
        pathname: '/resources',
        search: 'typeID=2&page=1&rowsPerPage=50&order=desc&isActive=true',
    }
    const match = {
        params: null,
    };

    const params = ResourceListLocation.parseLocationParams(location, match);
    expect(params).toMatchObject({
        typeID: 2,
        page: 1,
        rowsPerPage: 50,
        order: 'desc',
        isActive: true,
    });
})

test('errors on parsing a URL with missing required qs params', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { })
    const serializedUrl = ResourceListLocation.toUrl({ categoryID: 1 }); //should be typeID:1
    const location = {
        pathname: '/resources',
        search: 'categoryID=1',
    }
    const match = {
        params: null
    };

    const params = ResourceListLocation.parseLocationParams(location, match);
    expect(params).toBeNull();
    expect(console.error).toBeCalled();
})