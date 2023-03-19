declare module "react-app-location" {
  import React from "react";
  import { Schema } from "yup";
  import { Link, Route } from "react-router-dom";
  import { LocationDescriptor } from "history";

  export type YupParams = Record<string, Schema>;

  export default class RouterLocation {
    constructor(
      path: string,
      pathParamDefs: YupParams | null = {},
      queryStringParamDefs: YupParams | null = {}
    );

    path: string;

    toRoute(
      renderOptions: { component?; render?; children?; invalid },
      exact: boolean = false,
      strict: boolean = false,
      sensitive: boolean = false
    ): Route;

    toLink(children: React.ReactNode, params: YupParams, props = {}): Link;

    toUrl(params?: object): string;

    parseLocationParams(
      location?: LocationDescriptor | Location,
      match?: object
    ): object | null;

    isValidParams(params?: object): boolean;
  }
}
