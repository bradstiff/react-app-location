import qs from 'querystringify';

export function parseQueryString(queryString) {
    const queryStringParams = qs.parse(queryString);
    for (const key in queryStringParams) {
        if (queryStringParams[key] === 'null') {
            queryStringParams[key] = null;
        } else if (queryStringParams[key] === 'undefined') {
            queryStringParams[key] = undefined;
        }
    }
    return queryStringParams;
}

