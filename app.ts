interface IStore {
  currentPage: number;
  feeds: INewsFeed[];
}

interface INews {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

interface INewsFeed extends INews {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean;
}

interface INewsDetail extends INews {
  readonly comments: INewsComment[];
}

interface INewsComment extends INews {
  readonly comments: INewsComment[];
  readonly level: number;
}

const ajax = new XMLHttpRequest();

const container: HTMLElement | null = document.getElementById("root");
const $ul = document.createElement("ul");

const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;

const store: IStore = {
  currentPage: 1,
  feeds: [],
};

class Api {
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

class NewsFeedApi extends Api {
  getData() {
    return this.getRequest<INewsFeed[]>();
  }
}

class NewsDetailApi extends Api {
  getData() {
    return this.getRequest<INewsDetail>();
  }
}

class View {
  template: string;
  renderedTemplate: string;
  container: HTMLElement;
  htmlList: string[];

  constructor(containerId: string, template: string) {
    const $container = document.getElementById(containerId);

    if (!$container) {
      throw "최상위 컨테이너가 없어 UI를 그릴 수 없습니다.";
    }

    this.container = $container;
    this.template = template;
    this.renderedTemplate = template;
    this.htmlList = [];
  }

  updateView(): void {
    this.container.innerHTML = this.renderedTemplate;
    this.renderedTemplate = this.template;
  }

  addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }

  getHtml(): string {
    const snapshot = this.htmlList.join("");
    this.clearHtmlList();
    return snapshot;
  }

  setTemplateData(key: string, value: string): void {
    this.renderedTemplate = this.renderedTemplate.replace(`{{__${key}__}}`, value);
  }

  clearHtmlList(): void {
    this.htmlList = [];
  }
}

class NewsFeedView extends View {
  api: NewsFeedApi;
  feeds: INewsFeed[];

  constructor(containerId: string) {
    let template = `
      <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                  Previous
                </a>
                <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                  Next
                </a>
              </div>
            </div> 
          </div>
        </div>
        <div class="p-4 text-2xl text-gray-700">
          {{__news_feed__}}
        </div>
      </div>
    `;

    super(containerId, template);

    this.api = new NewsFeedApi(NEWS_URL);
    this.feeds = store.feeds;

    if (this.feeds.length === 0) {
      store.feeds = this.api.getData();
      this.feeds = store.feeds;
      this.makeFeed();
    }
  }

  render(): void {
    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
      const { read, id, title, comments_count, user, points, time_ago } = this.feeds[i];
      this.addHtml(`
        <div class="p-6 ${
          read ? "bg-red-500" : "bg-white"
        } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
          <div class="flex">
            <div class="flex-auto">
              <a href="#/show/${id}">${title}</a>
            </div>
            <div class="text-center text-sm">
              <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
            </div>
          </div>
          <div class="flex mt-3">
            <div class="grid grid-cols-3 text-sm text-gray-500">
              <div><i class="fas fa-user mr-1"></i>${user}</div>
              <div><i class="fas fa-heart mr-1"></i>${points}</div>
              <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
            </div>
          </div>
        </div>
      `);
    }

    this.setTemplateData("news_feed", this.getHtml());
    this.setTemplateData("prev_page", String(store.currentPage > 1 ? store.currentPage - 1 : 1));
    this.setTemplateData("next_page", String(store.currentPage + 1));
    this.updateView();
  }

  makeFeed(): void {
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  }
}

class NewsDetailView extends View {
  constructor(containerId: string) {
    let template = `
      <div class="bg-gray-600 min-h-screen pb-8">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__currentPage__}}" class="text-gray-500">
                  <i class="fa fa-times"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="h-full border rounded-xl bg-white m-6 p-4 ">
          <h2>{{__title__}}</h2>
          <div class="text-gray-400 h-20">
            {{__content__}}
          </div>
          {{__comments__}}
        </div>
      </div>
    `;

    super(containerId, template);
  }

  render() {
    const id = location.hash.substr(7);
    const api = new NewsDetailApi(CONTENT_URL.replace("@id", id));
    const newsDetail = api.getData();

    for (let i = 0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === parseInt(id)) {
        store.feeds[i].read = true;
        break;
      }
    }

    this.setTemplateData("comments", this.renderComment(newsDetail.comments));
    this.setTemplateData("currentPage", String(store.currentPage));
    this.setTemplateData("title", newsDetail.title);
    this.setTemplateData("content", newsDetail.content);

    this.updateView();
  }

  renderComment(comments: INewsComment[]): string {
    for (let i = 0; i < comments.length; i++) {
      const { level, user, time_ago, content } = comments[i];
      this.addHtml(`
      <div style="padding-left: ${level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${user}</strong> ${time_ago}
        </div>
        <p class="text-gray-700">${content}</p>
      </div>
    `);

      if (comments[i].comments.length > 0) {
        this.addHtml(this.renderComment(comments[i].comments));
      }
    }

    return this.getHtml();
  }
}

function router(): void {
  const routePath = location.hash;
  if (!routePath) {
    renderNewsFeed();
    return;
  }
  if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = parseInt(routePath.substr(7));
    renderNewsFeed();
    return;
  }
  renderNewsDetail();
}

window.addEventListener("hashchange", router);

router();
