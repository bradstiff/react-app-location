import React from 'react';
import { Link, BrowserRouter, Switch, Route } from 'react-router-dom';

import Locations from './Locations';
import Home from './Home';
import Items from './Items';
import Item from './Item';
import NotFound from './NotFound';

export default () => (
    <BrowserRouter>
        <div>
            <Link to={Locations.Home.toUrl()}>Home</Link>
            <Link to={Locations.Items.toUrl()}>Items</Link>
            <Switch>
                {Locations.Home.toRoute({ component: Home, invalid: NotFound }, true)}
                {Locations.Items.toRoute({ component: Items, invalid: NotFound }, true)}
                {Locations.Item.toRoute({ component: Item, invalid: NotFound }, true)}
                <Route component={NotFound} />
            </Switch>
        </div>
    </BrowserRouter>
);
