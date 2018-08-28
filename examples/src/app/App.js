import React from 'react';
import { Link, BrowserRouter, Switch, Route } from 'react-router-dom';

import Locations from './Locations';
import Home from './Home';
import NotFound from './NotFound';

import ItemList from '../items/ItemList';
import Item from '../items/Item';

const styles = {
    container: {
        display: 'flex',
        width: 500,
        margin: 'auto',
        minHeight: 300,
    },
    menuContainer: {
        width: 60,
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        marginRight: 20,
        backgroundColor: 'silver',
    },
    menu: {
        listStyle: 'none',
        paddingLeft: 5,
    },
    link: {
    },
};

export default () => (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div style={styles.container}>
            <div style={styles.menuContainer}>
                <ul style={styles.menu}>
                    <li><Link to={Locations.Home.toUrl()} style={styles.link}>Home</Link></li>
                    <li><Link to={Locations.ItemList.toUrl()} style={styles.link}>Items</Link></li>
                </ul>
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
