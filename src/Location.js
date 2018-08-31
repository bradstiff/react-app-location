import React from 'react';
import { Route, generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import warning from 'warning';
import * as Yup from 'yup';
import qs from 'querystringify';

const isEmptyObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object;
const isEmptyChildren = children => React.Children.count(children) === 0;

export default class Location {
    constructor(path, pathParamDefs, queryStringParamDefs) {
        this._path = path;

        //todo: collisions between route params and qs params?
        if (pathParamDefs && !isEmptyObject(pathParamDefs)) {
            this._pathParamKeys = Object.keys(pathParamDefs);
            this._pathParamDefs = pathParamDefs;
            this._pathSchema = Yup.object().shape(pathParamDefs);
        } else {
            this._pathParamKeys = {};
            this._pathParamDefs = {};
        }

        if (queryStringParamDefs && !isEmptyObject(queryStringParamDefs)) {
            this._queryStringParamKeys = Object.keys(queryStringParamDefs);
            this._queryStringParamDefs = queryStringParamDefs;
            this._queryStringSchema = Yup.object().shape(queryStringParamDefs);
        } else {
            this._queryStringParamKeys = {};
            this._queryStringParamDefs = {};
        }
    }

    get path() {
        return this._path;
    }

    toUrl(params) {
        if (!this.validateParams(params)) {
            //params don't satisfy schema
            return null;
        }

        const path = generatePath(this.path, params);

        const queryStringParams = !isEmptyObject(this._queryStringParamKeys)
            ? Object
                .keys(params || {})
                .filter(key => this._queryStringParamKeys.indexOf(key) > -1)
                .reduce((acc, key) => {
                    const value = params[key] === 'undefined' ? undefined
                        : params[key] === 'null' ? null
                        : params[key];
                    const tokenDef = this._queryStringParamDefs[key];
                    return tokenDef.default() === value
                        ? acc //avoid query string clutter: don't serialize values that are the same as the default
                        : {
                            [key]: params[key],
                            ...acc
                        }
                }, null)
            : null;

        return queryStringParams
            ? `${path}?${qs.stringify(queryStringParams)}`
            : path;
    }

    toLink(children, params, props) {
        let linkProps = props || {}
        warning(!linkProps.to, 'You should not provide a to prop; it will be overwritten');
        linkProps = {
            ...linkProps,
            to: this.toUrl(params), 
        };
        return <Link {...linkProps}>{children}</Link>;
    }

    toRoute(renderOptions, exact = false, strict = false, sensitive = false) {
        const { component, render, children, invalid } = renderOptions;
        warning(component || render || children, 'Location.toRoute requires renderOptions argument, which must include either component, render or children property');
        warning(invalid, 'Location.toRoute requires renderOptions argument, which must include an invalid property, indicating the component to render when the a matched location contains an invalid parameter');

        const routeProps = {
            path: this.path,
            exact,
            strict,
            sensitive,
        };

        const getPropsWithParams = props => {
            const { location, match } = props;
            const tokens = this.parseLocationParams(location, match);
            if (tokens === null) {
                return null;
            }
            //todo: collision between props and tokens?
            return {
                ...props,
                ...tokens,
            };
        }

        if (component) {
            return <Route {...routeProps} render={props => {
                const propsWithParams = getPropsWithParams(props)
                if (propsWithParams === null) {
                    //schema validation error ocurred, render Invalid component
                    return React.createElement(invalid);
                }
                return React.createElement(component, propsWithParams);
            }} />
        } else if (render) {
            return <Route {...routeProps} render={props => {
                const propsWithParams = getPropsWithParams(props)
                if (propsWithParams === null) {
                    //schema validation error ocurred, render Invalid component
                    return React.createElement(invalid);
                }
                return render(propsWithParams);
            }} />
        } else if (typeof children === "function") {
            return <Route {...routeProps} children={props => {
                const { match } = props;
                if (match) {
                    const propsWithParams = getPropsWithParams(props)
                    if (propsWithParams === null) {
                        //schema validation error ocurred, render Invalid component
                        return React.createElement(invalid);
                    }
                    return children(propsWithParams);
                } else {
                    return children(props);
                }
            }} />
        } else if (children && !isEmptyChildren(children)) {
            warning(false, 'Location params are not passed as props to children arrays. Use a children function prop if needed.');
            return <Route {...routeProps} children={children} />
        }
    }

    parseLocationParams(location, match) {
        const queryStringParams = qs.parse(location.search);
        for (const key in queryStringParams) {
            if (queryStringParams[key] === 'null') {
                queryStringParams[key] = null;
            } else if (queryStringParams[key] === 'undefined') {
                queryStringParams[key] = undefined;
            }
        }
        let pathValues, qsValues;
        try {
            pathValues = this._pathSchema
                ? this._pathSchema.validateSync(match.params)
                : {};
            qsValues = this._queryStringSchema
                ? this._queryStringSchema.validateSync(queryStringParams)
                : {};
        } catch (err) {
            const { name, errors } = err;
            if (name === 'ValidationError') {
                warning(false, `Location.parseLocationParams: ${errors[0]}`);
            } else {
                throw err;
            }
            return null;
        }

        return {
            ...pathValues,
            ...qsValues,
        };
    }

    validateParams(params) {
        try {
            if (this._pathSchema) {
                this._pathSchema.validateSync(params);
            }
            if (this._queryStringSchema) {
                this._queryStringSchema.validateSync(params);
            }
        } catch (err) {
            const { name, errors } = err;
            if (name === 'ValidationError') {
                warning(false, `Location.validateParams: ${errors[0]}`);
            } else {
                throw err;
            }
            return false;
        }
        return true;
    }
}
