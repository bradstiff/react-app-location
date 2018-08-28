import React from 'react';
import { Link, BrowserRouter, Switch, Route } from 'react-router-dom';

import Locations from './Locations';
import Home from './Home';
import ItemList from './ItemList';
import Item from './Item';
import NotFound from './NotFound';

const styles = {
    link: {
        padding: 10,
    },
};

export default () => (
    <BrowserRouter>
        <div>
            <Link to={Locations.Home.toUrl()} style={styles.link}>Home</Link>
            <Link to={Locations.ItemList.toUrl()} style={styles.link}>Items</Link>
            <Switch>
                {Locations.Home.toRoute({ component: Home, invalid: NotFound }, true)}
                {Locations.ItemList.toRoute({ component: ItemList, invalid: NotFound }, true)}
                {Locations.Item.toRoute({ component: Item, invalid: NotFound }, true)}
                <Route component={NotFound} />
            </Switch>
        </div>
    </BrowserRouter>
);
