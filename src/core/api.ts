import { INewsDetail, INewsFeed } from "../types";

export class Api {
  url: string;
  ajax: XMLHttpRequest;

  constructor(url: string) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  protected getRequest<AjaxResponse>(): AjaxResponse {
    this.ajax.open("GET", this.url, false);
    this.ajax.send();

    return JSON.parse(this.ajax.response);
  }
}

export class NewsFeedApi extends Api {
  getData() {
    return this.getRequest<INewsFeed[]>();
  }
}

export class NewsDetailApi extends Api {
  getData() {
    return this.getRequest<INewsDetail>();
  }
}
