import { INewsFeed, IStore } from "./types";

export default class Store implements IStore {
  private _feeds: INewsFeed[];
  private _currentPage: number;

  constructor() {
    this._feeds = [];
    this._currentPage = 1;
  }

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(page: number) {
    this._currentPage = page;
  }

  get nextPage(): number {
    return this._currentPage + 1;
  }

  get prevPage(): number {
    return this._currentPage > 1 ? this._currentPage - 1 : 1;
  }

  get numberOfFeed(): number {
    return this._feeds.length;
  }

  get hasFeeds(): boolean {
    return this._feeds.length > 0;
  }

  getAllFeeds(): INewsFeed[] {
    return this._feeds;
  }

  getFeed(index: number): INewsFeed {
    return this._feeds[index];
  }

  setFeeds(feeds: INewsFeed[]): void {
    this._feeds = feeds.map((feed) => {
      console.log(feed);
      return {
        ...feed,
        read: false,
      };
    });
  }

  setRead(id: number): void {
    const feed = this._feeds.find((feed: INewsFeed) => feed.id === id);
    if (feed) feed.read = true;
  }
}
