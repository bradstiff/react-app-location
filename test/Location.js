import React from 'react';
import { withRouter } from 'react-router';
import { Link, Route, Router, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, fireEvent, cleanup } from 'react-testing-library';
import * as Yup from 'yup';

import Location from '../src/Location';

const isNullableDate = Yup.string().test('is-date', '${path}:${value} is not a valid date', date => !date || !isNaN(Date.parse(date)));
const string = Yup.string();
const integer = Yup.number().integer();
const naturalNbr = integer.moreThan(-1);
const wholeNbr = integer.positive();

const Locations = {
    Home: new Location('/'),
    About: new Location('/about'),
    ResourceList: new Location('/resources', null, {
        page: naturalNbr.default(0),
        rowsPerPage: Yup.number().oneOf([25, 50, 75, 100]).default(25),
        order: Yup.string().oneOf(['asc', 'desc']).default('asc'),
        isActive: Yup.boolean(),
        categoryID: wholeNbr.nullable(), 
    }),
    Resource: new Location('/resources/:id', { id: wholeNbr.required() }, { date: isNullableDate }), 
};

//placeholder for parsed, type-cast props received by matching location's component
//strictly used for test verification
let receivedProps = {};

const Home = () => <div>Home</div>
const About = () => <div>About</div>

const ResourceList = ({ page, rowsPerPage, order, orderBy, isActive, categoryID, name, location }) => {
    //save the received props for subsequent test verification
    receivedProps = {
        page,
        rowsPerPage,
        order,
        isActive,
    };
    return <div>Resource List</div>;
};

const Resource = ({ id, date }) => {
    //save the received props for subsequent test verification
    receivedProps = {
        id,
        date
    };
    return <div>Resource</div>;
};

const NotFound = () => <div>No match</div>

function LocationTest() {
    return (
        <div>
            <Link to={Locations.Home.toUrl()}>Home</Link>
            <Link to={Locations.About.toUrl()}>About</Link>
            <Switch>
                {Locations.Home.toRoute({ component: Home, invalid: NotFound }, true)}
                {Locations.About.toRoute({ render: () => <About />, invalid: NotFound }, true)}
                {Locations.ResourceList.toRoute({ component: ResourceList, invalid: NotFound }, true)}
                {Locations.Resource.toRoute({ component: Resource, invalid: NotFound }, true)}
                <Route component={NotFound} />
            </Switch>
        </div>
    )
}

afterEach(() => {
    cleanup();
    receivedProps = {};
});

function renderWithRouter(ui, url = '/') {
    const history = createMemoryHistory({ initialEntries: [url] });
    return {
        ...render(<Router history={history}>{ui}</Router>),
        history,
    }
}

test('navigating from one matched location to another, first uses component prop, second uses render prop', () => {
    const { container, getByText } = renderWithRouter(<LocationTest />);
    expect(container.innerHTML).toMatch('Home');
    const leftClick = { button: 0 };
    fireEvent.click(getByText(/about/i), leftClick);
    expect(container.innerHTML).toMatch('About');
})

test('navigating to non-matching URL', () => {
    const { container } = renderWithRouter(<LocationTest />, '/should-not-match');
    expect(container.innerHTML).toMatch('No match');
})

test('building and parsing URL with int path param and supplied optional qs param', () => {
    const locationParams = { id: 1, date: '2018-08-20' };
    const serializedUrl = Locations.Resource.toUrl(locationParams);
    expect(serializedUrl).toBe('/resources/1?date=2018-08-20');

    const { container } = renderWithRouter(<LocationTest />, serializedUrl);
    expect(container.innerHTML).toMatch('Resource');
    expect(receivedProps.id).toBe(1);
    expect(receivedProps.date).toBe('2018-08-20');
})

test('building and parsing URL with int path param and omitted optional qs param', () => {
    const locationParams = { id: 1 };
    const serializedUrl = Locations.Resource.toUrl(locationParams);
    expect(serializedUrl).toBe('/resources/1');

    const { container } = renderWithRouter(<LocationTest />, serializedUrl);
    expect(container.innerHTML).toMatch('Resource');
    expect(receivedProps.id).toBe(1);
    expect(receivedProps.date).toBe(undefined);
})

test('parsing URL with invalid int path param', () => {
    const { container } = renderWithRouter(<LocationTest />, '/resources/a');
    expect(container.innerHTML).toMatch('No match');
})

test('parsing URL with invalid date qs param', () => {
    const { container } = renderWithRouter(<LocationTest />, '/resources/1?date=2018-123-123');
    expect(container.innerHTML).toMatch('No match');
})

test('building and parsing URL with omitted-with-default qs params', () => {
    const serializedUrl = Locations.ResourceList.toUrl();
    expect(serializedUrl).toBe('/resources'); //to avoid clutter, omitted-with-default qs params are not written to the url

    const { container } = renderWithRouter(<LocationTest />, serializedUrl);
    //but are provided as component props
    expect(container.innerHTML).toMatch('Resource List');
    expect(receivedProps.page).toBe(0);
    expect(receivedProps.rowsPerPage).toBe(25);
    expect(receivedProps.order).toBe('asc');
    expect(receivedProps.isActive).toBe(undefined);
})

test('building and parsing URL with supplied qs params', () => {
    const locationParams = {
        page: 1,
        rowsPerPage: 50,
        order: 'desc',
        isActive: true,
    };
    const serializedUrl = Locations.ResourceList.toUrl(locationParams);
    expect(serializedUrl).toBe('/resources?isActive=true&order=desc&rowsPerPage=50&page=1');

    const { container } = renderWithRouter(<LocationTest />, serializedUrl);
    expect(container.innerHTML).toMatch('Resource List');
    expect(receivedProps.page).toBe(1);
    expect(receivedProps.rowsPerPage).toBe(50);
    expect(receivedProps.order).toBe('desc');
    expect(receivedProps.isActive).toBe(true);
})

test('parsing URL with invalid qs params', () => {
    const { container } = renderWithRouter(<LocationTest />, '/resources?rowsPerPage=10');
    expect(container.innerHTML).toMatch('No match');
})
