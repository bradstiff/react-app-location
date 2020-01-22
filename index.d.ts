declare module "react-app-location" {
  import React from "react";
  import {Schema} from "yup";
  import { Link, Route } from "react-router-dom";
  import { LocationDescriptor } from "history";

  type YupParams = Record<string, Schema>;

  export default class RouterLocation {
    constructor(
      path: string,
      pathParamDefs: YupParams = {},
      queryStringParamDefs: YupParams = {}
    );

    path: string;

    toRoute(
      renderOptions: { component?; render?; children?; invalid },
      exact = false,
      strict = false,
      sensitive = false
    ): Route;

    toLink(
      children: React.ReactNode,
      params: YupParams,
      props = {}
    ): Link;

    parseLocationParams(
      location: LocationDescriptor = window.location,
      match?: object
    ): object;

    isValidParams(params?: object): boolean;
  }
}
