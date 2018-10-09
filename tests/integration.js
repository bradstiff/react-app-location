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

const HomeLocation = new Location('/');
const AboutLocation = new Location('/about');
const AboutStrictLocation = new Location('/about/');
const ResourceListLocation = new Location('/resources', null, {
    typeID: wholeNbr.required(),
    page: naturalNbr.default(0),
    rowsPerPage: Yup.number().oneOf([25, 50, 75, 100]).default(25),
    order: Yup.string().oneOf(['asc', 'desc']).default('asc'),
    isActive: Yup.boolean(),
    categoryID: wholeNbr.nullable(),
});
const ResourceLocation = new Location('/resources/:id', { id: wholeNbr.required() }, { date: isNullableDate });

//placeholder for parsed, type-cast props received by matching location's component
//strictly used for test verification
let receivedProps = {};

const Home = () => <div>Home</div>;
const About = () => <div>About</div>;

const ResourceList = ({ typeID, page, rowsPerPage, order, orderBy, isActive, categoryID, name, location }) => {
    //save the received props for subsequent test verification
    receivedProps = {
        typeID,
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

const NotFound = () => <div>No match</div>;

function LocationTest() {
    return (
        <div>
            <Link to={HomeLocation.toUrl()}>Home</Link>
            <Link to={AboutLocation.toUrl()}>About</Link>
            <Switch>
                {HomeLocation.toRoute({ component: Home, invalid: NotFound }, true)}
                {AboutLocation.toRoute({ render: () => <About />, invalid: NotFound }, true)}
                {ResourceListLocation.toRoute({ component: ResourceList, invalid: NotFound }, true)}
                {ResourceLocation.toRoute({ component: Resource, invalid: NotFound }, true)}
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

test('navigates from one matched location to another, first uses component prop, second uses render prop', () => {
    const { container, getByText } = renderWithRouter(<LocationTest />);
    expect(container.innerHTML).toMatch('Home');
    const leftClick = { button: 0 };
    fireEvent.click(getByText(/about/i), leftClick);
    expect(container.innerHTML).toMatch('About');
})

test('renders <NotFound /> on navigating to non-matching URL', () => {
    const { container } = renderWithRouter(<LocationTest />, '/should-not-match');
    expect(container.innerHTML).toMatch('No match');
})

test('builds and parses URL with int path param and supplied optional qs param', () => {
    const locationParams = { id: 1, date: '2018-08-20' };
    const serializedUrl = ResourceLocation.toUrl(locationParams);
    expect(serializedUrl).toBe('/resources/1?date=2018-08-20');

    const { container } = renderWithRouter(<LocationTest />, serializedUrl);
    expect(container.innerHTML).toMatch('Resource');
    expect(receivedProps.id).toBe(1);
    expect(receivedProps.date).toBe('2018-08-20');
})

test('builds and parses URL with int path param and omitted optional qs param', () => {
    const locationParams = { id: 1 };
    const serializedUrl = ResourceLocation.toUrl(locationParams);
    expect(serializedUrl).toBe('/resources/1');

    const { container } = renderWithRouter(<LocationTest />, serializedUrl);
    expect(container.innerHTML).toMatch('Resource');
    expect(receivedProps.id).toBe(1);
    expect(receivedProps.date).toBe(undefined);
})

test('renders <NotFound /> on URL with invalid int path param', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { }) //suppress console output
    const { container } = renderWithRouter(<LocationTest />, '/resources/a');
    expect(container.innerHTML).toMatch('No match');
})

test('renders <NotFound /> on URL with invalid date qs param', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { }) //suppress console output
    const { container } = renderWithRouter(<LocationTest />, '/resources/1?date=2018-123-123');
    expect(container.innerHTML).toMatch('No match');
})

test('builds and parses URL with omitted-with-default qs params', () => {
    const serializedUrl = ResourceListLocation.toUrl({ typeID: 2 });
    const { container } = renderWithRouter(<LocationTest />, serializedUrl);
    //but are provided as component props
    expect(container.innerHTML).toMatch('Resource List');
    expect(receivedProps.typeID).toBe(2);
    expect(receivedProps.page).toBe(0);
    expect(receivedProps.rowsPerPage).toBe(25);
    expect(receivedProps.order).toBe('asc');
    expect(receivedProps.isActive).toBe(undefined);
})

test('builds and parses URL with supplied qs params', () => {
    const locationParams = {
        typeID: 2,
        page: 1,
        rowsPerPage: 50,
        order: 'desc',
        isActive: true,
    };
    const serializedUrl = ResourceListLocation.toUrl(locationParams);
    const { container } = renderWithRouter(<LocationTest />, serializedUrl);
    expect(container.innerHTML).toMatch('Resource List');
    expect(receivedProps.typeID).toBe(2);
    expect(receivedProps.page).toBe(1);
    expect(receivedProps.rowsPerPage).toBe(50);
    expect(receivedProps.order).toBe('desc');
    expect(receivedProps.isActive).toBe(true);
})

test('renders <NotFound /> on parsing URL with missing required qs params', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { }) //suppress console output
    const { container } = renderWithRouter(<LocationTest />, '/resources?categoryID=2');
    expect(container.innerHTML).toMatch('No match');
})

test('renders <NotFound /> on parsing URL with invalid qs params', () => {
    jest.spyOn(global.console, "error").mockImplementation(() => { }) //suppress console output
    const { container } = renderWithRouter(<LocationTest />, '/resources?rowsPerPage=10');
    expect(container.innerHTML).toMatch('No match');
})

test('strict, insensitive match', () => {
    const StrictRoute = () => (
        <Switch>
            {AboutStrictLocation.toRoute({ component: About, invalid: NotFound }, false, true)}
            <Route component={NotFound} />
        </Switch>
    );
    const { container } = renderWithRouter(<StrictRoute />, '/About/');
    expect(container.innerHTML).toMatch('About');
})

test('strict no match', () => {
    const StrictRoute = () => (
        <Switch>
            {AboutStrictLocation.toRoute({ component: About, invalid: NotFound }, false, true)}
            <Route component={NotFound} />
        </Switch>
    );
    const { container } = renderWithRouter(<StrictRoute />, '/about');
    expect(container.innerHTML).toMatch('No match');
})

test('sensitive match', () => {
    const SensitiveRoute = () => (
        <Switch>
            {AboutLocation.toRoute({ component: About, invalid: NotFound }, false, false, true)}
            <Route component={NotFound} />
        </Switch>
    );
    const { container } = renderWithRouter(<SensitiveRoute />, '/about/');
    expect(container.innerHTML).toMatch('About');
})

test('sensitive no match', () => {
    const SensitiveRoute = () => (
        <Switch>
            {AboutLocation.toRoute({ component: About, invalid: NotFound }, false, false, true)}
            <Route component={NotFound} />
        </Switch>
    );
    const { container } = renderWithRouter(<SensitiveRoute />, '/About');
    expect(container.innerHTML).toMatch('No match');
})

test('children match', () => {
    const ChildrenRoute = () => (
        <Switch>
            {ResourceLocation.toRoute({
                children: (props) => <Resource {...props} />,
                invalid: NotFound
            }, true)}
            <Route component={NotFound} />
        </Switch>
    );
    const { container, debug } = renderWithRouter(<ChildrenRoute />, '/resources/1');
    expect(container.innerHTML).toMatch('Resource');
    expect(receivedProps.id).toBe(1);
})

test('children no match, renders anyway without param parsing', () => {
    const ChildrenRoute = () => (
        ResourceLocation.toRoute({
            children: (props) => <Resource {...props} />,
            invalid: NotFound
        }, true)
    );
    const { container, debug } = renderWithRouter(<ChildrenRoute />, '/does-not-match');
    expect(container.innerHTML).toMatch('Resource');
})

test('bypass Location.toRoute', () => {
    const locationParams = { id: 1, date: '2018-08-20' };
    const serializedUrl = ResourceLocation.toUrl(locationParams);
    const ResourceWithManualParams = ({ location, match }) => {
        const { id, date } = ResourceLocation.parseLocationParams(location, match);
        //save the received props for subsequent test verification
        receivedProps = {
            id,
            date
        };
        return <div>Resource</div>;
    };
    const ResourceRoute = () => <Route path={ResourceLocation.path} component={ResourceWithManualParams} exact />;
  const { container } = renderWithRouter(<ResourceRoute />, serializedUrl);
    expect(container.innerHTML).toMatch('Resource');
    expect(receivedProps.id).toBe(1);
    expect(receivedProps.date).toMatch('2018-08-20');
})