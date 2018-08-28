import React from 'react';
import { Route, generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import warning from 'warning';
import * as Yup from 'yup';
import qs from 'querystringify';

const isEmptyObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object;
const isEmptyChildren = children => React.Children.count(children) === 0;

export default class Location {
    constructor(path, pathTokenDefs, qsTokenDefs) {
        this._path = path;

        //todo: collisions between route params and qs params?
        if (pathTokenDefs && !isEmptyObject(pathTokenDefs)) {
            this._pathTokenKeys = Object.keys(pathTokenDefs);
            this._pathTokens = pathTokenDefs;
            this._pathSchema = Yup.object().shape(pathTokenDefs);
        }

        if (qsTokenDefs && !isEmptyObject(qsTokenDefs)) {
            this._qsTokenKeys = Object.keys(qsTokenDefs);
            this._qsTokens = qsTokenDefs;
            this._qsSchema = Yup.object().shape(qsTokenDefs);
        }
    }

    get path() {
        return this._path;
    }

    toUrl(tokens) {
        const path = generatePath(this.path, tokens);

        const qsTokens = this._qsTokenKeys
            ? Object
                .keys(tokens || {})
                .filter(key => this._qsTokenKeys.includes(key))
                .reduce((acc, key) => {
                    const value = tokens[key];
                    const tokenDef = this._qsTokens[key];
                    return tokenDef.default() === value
                        ? acc //avoid query string clutter: don't serialize values that are the same as the default
                        : {
                            [key]: tokens[key],
                            ...acc
                        }
                }, null)
            : null;

        return qsTokens
            ? `${path}?${qs.stringify(qsTokens)}`
            : path;
    }

    toLink = tokens => props => <Link {...props} to={this.toUrl(tokens)} />;

    toRoute(renderOptions, exact = false, strict = false, sensitive = false) {
        const { component, render, children, invalid } = renderOptions;
        warning(component || render || children, "renderOptions must include either component, render or children prop");
        warning(invalid, "renderOptions must include an invalid prop, which is the component to render when the location contains an invalid token");

        const routeProps = {
            path: this.path,
            exact,
            strict,
            sensitive,
        };

        if (component) {
            return <Route {...routeProps} render={this.wrapComponentWithTokens(component, invalid)} />
        } else if (render) {
            return <Route {...routeProps} render={this.wrapRenderPropWithTokens(render, invalid)} />
        } else if (typeof children === "function") {
            return <Route {...routeProps} children={this.wrapChildrenPropWithTokens(children, invalid)} />
        } else if (children && !isEmptyChildren(children)) {
            //todo: Maybe this case shouldn't be supported
            return <Route {...routeProps} children={children} />
        }
    }

    wrapComponentWithTokens = (component, invalid) => props => {
        const propsWithTokens = this.propsWithTokens(props)
        if (propsWithTokens === null) {
            //schema validation error ocurred, render Invalid component
            return React.createElement(invalid);
        }
        return React.createElement(component, propsWithTokens);
    }

    wrapRenderPropWithTokens = (render, invalid) => props => {
        const propsWithTokens = this.propsWithTokens(props)
        if (propsWithTokens === null) {
            //schema validation error ocurred, render Invalid component
            return React.createElement(invalid);
        }
        return render(propsWithTokens);
    }

    wrapChildrenPropWithTokens = (children, invalid) => props => {
        const { match } = props;
        if (match) {
            const propsWithTokens = this.propsWithTokens(props)
            if (propsWithTokens === null) {
                //schema validation error ocurred, render Invalid component
                return React.createElement(invalid);
            }
            return children(propsWithTokens);
        } else {
            return children(props);
        }
    }

    propsWithTokens(props) {
        const { location, match } = props;
        const tokens = this.parseTokens(location, match);
        if (tokens === null) {
            return null;
        }
        //todo: collision between props and tokens?
        return {
            ...props,
            ...tokens,
        };
    }

    parseTokens(location, match) {
        const qsParams = qs.parse(location.search);
        for (const key in qsParams) {
            if (qsParams[key] === 'null') {
                qsParams[key] = null;
            } else if (qsParams[key] === 'undefined') {
                qsParams[key] = undefined;
            }
        }
        let pathValues, qsValues;
        try {
            pathValues = this._pathSchema
                ? this._pathSchema.validateSync(match.params)
                : {};
            qsValues = this._qsSchema
                ? this._qsSchema.validateSync(qsParams)
                : {};
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.log(err);
            }
            return null;
        }

        return {
            ...pathValues,
            ...qsValues,
        };
    }
}
