import React from 'react';
import { Link, BrowserRouter, Switch, Route } from 'react-router-dom';

import Locations from './Locations';
import Home from './Home';
import ItemList from './ItemList';
import Item from './Item';
import NotFound from './NotFound';

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    link: {
        padding: 10,
    },
};

export default () => (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div style={styles.container}>
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
