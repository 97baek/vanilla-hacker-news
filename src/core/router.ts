import { IRoute } from "../types";
import View from "./view";

export default class Router {
  private isStart: boolean;
  routeTable: IRoute[];
  defaultRoute: IRoute | null;

  constructor() {
    window.addEventListener("hashchange", this.route.bind(this));

    this.isStart = false;
    this.routeTable = [];
    this.defaultRoute = null;
  }

  setDefaultPage(page: View, params: RegExp | null = null): void {
    this.defaultRoute = {
      path: "",
      page,
      params,
    };
  }

  addRoutePath(path: string, page: View, params: RegExp | null = null): void {
    this.routeTable.push({ path, page, params });

    if (!this.isStart) {
      this.isStart = true;
      setTimeout(this.route.bind(this), 0);
    }
  }

  route() {
    const routePath = location.hash;

    if (routePath === "" && this.defaultRoute) {
      this.defaultRoute.page.render();
    }

    for (const routeInfo of this.routeTable) {
      if (routePath.indexOf(routeInfo.path) >= 0) {
        if (routeInfo.params) {
          const parseParams = routePath.match(routeInfo.params);

          if (parseParams) {
            routeInfo.page.render.apply(null, [parseParams[1]]);
            return;
          }
          routeInfo.page.render();
          return;
        }
      }
    }
  }
}
