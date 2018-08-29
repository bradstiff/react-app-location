import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Locations from './Locations';

const NotFound = () => (
    <div>
        <div>
            <h3>Page Not Found</h3>
            <h4>Looks like you've followed a broken link or entered a URL that doesn't exist on this site.</h4>
            <Link to={Locations.Home.toUrl()}>
                &lt; Back to Home
            </Link>
        </div>
    </div>
);

NotFound.propTypes = {
    message: PropTypes.string,
}

export default NotFound;