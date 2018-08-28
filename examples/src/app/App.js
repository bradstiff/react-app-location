import React from 'react';
import { Link, BrowserRouter, Switch, Route } from 'react-router-dom';

import Locations from './Locations';
import Home from './Home';
import NotFound from './NotFound';

import ItemList from '../items/ItemList';
import Item from '../items/Item';

const styles = {
    container: {
        maxWidth: 700,
        margin: 'auto',
    },
    link: {
        padding: 10,
    },
};

export default () => (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div style={styles.container}>
            <div>
                <Link to={Locations.Home.toUrl()} style={styles.link}>Home</Link>
                <Link to={Locations.ItemList.toUrl()} style={styles.link}>Items</Link>
            </div>
            <Switch>
                {Locations.Home.toRoute({ component: Home, invalid: NotFound }, true)}
                {Locations.ItemList.toRoute({ component: ItemList, invalid: NotFound }, true)}
                {Locations.Item.toRoute({ component: Item, invalid: NotFound }, true)}
                <Route component={NotFound} />
            </Switch>
        </div>
    </BrowserRouter>
);
