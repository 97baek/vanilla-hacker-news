import View from "../core/view";

export interface IStore {
  getAllFeeds: () => INewsFeed[];
  getFeed: (index: number) => INewsFeed;
  setFeeds: (feeds: INewsFeed[]) => void;
  setRead: (id: number) => void;
  hasFeeds: boolean;
  currentPage: number;
  numberOfFeed: number;
  nextPage: number;
  prevPage: number;
}

export interface INews {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

export interface INewsFeed extends INews {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean;
}

export interface INewsDetail extends INews {
  readonly comments: INewsComment[];
}

export interface INewsComment extends INews {
  readonly comments: INewsComment[];
  readonly level: number;
}

export interface IRoute {
  path: string;
  page: View;
  params: RegExp | null;
}
