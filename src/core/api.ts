import { INewsDetail, INewsFeed } from "../types";
import { CONTENT_URL } from "../constants/config";

export class Api {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  protected async request<AjaxResponse>(): Promise<AjaxResponse> {
    const response = await fetch(this.url);
    return (await response.json()) as AjaxResponse;
  }
}

export class NewsFeedApi extends Api {
  getData() {
    return this.request<INewsFeed[]>();
  }
}

export class NewsDetailApi extends Api {
  constructor(id: string) {
    super(CONTENT_URL.replace("@id", id));
  }

  getData() {
    return this.request<INewsDetail>();
  }
}
