import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Locations from './Locations';

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
};

const NotFound = () => (
    <div style={styles.container}>
        <div>
            <h1>Page Not Found</h1>
            <h3>Looks like you've followed a broken link or entered a URL that doesn't exist on this site.</h3>
            <Button color='primary' component={Link} to={Locations.Home.toUrl()}>
                &lt; Back to Home
            </Button>
        </div>
    </div>
);

NotFound.propTypes = {
    message: PropTypes.string,
}

export default NotFound;