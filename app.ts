type StoreType = {
  currentPage: number;
  feeds: NewsFeedType[];
};

type NewsType = {
  id: number;
  time_ago: string;
  title: string;
  url: string;
  user: string;
  content: string;
};

type NewsFeedType = NewsType & {
  comments_count: number;
  points: number;
  read?: boolean;
};

type NewsDetailType = NewsType & {
  comments: NewsCommentType[];
};

type NewsCommentType = NewsType & {
  comments: NewsCommentType[];
  level: number;
};

const ajax = new XMLHttpRequest();

const container: HTMLElement | null = document.getElementById("root");
const $ul = document.createElement("ul");

const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;

const store: StoreType = {
  currentPage: 1,
  feeds: [],
};

function getData<AjaxResponse>(url: string): AjaxResponse {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function updateView(html: string): void {
  if (container) {
    container.innerHTML = html;
    return;
  }
  console.error("최상위 컨테이너가 없습니다.");
}

function makeFeed(feeds: NewsFeedType[]): NewsFeedType[] {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }
  return feeds;
}

function renderNewsFeed(): void {
  const newsList = [];
  let newsFeed: NewsFeedType[] = store.feeds;

  if (newsFeed.length === 0) {
    store.feeds = makeFeed(getData<NewsFeedType[]>(NEWS_URL));
    newsFeed = store.feeds;
  }

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

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <div class="p-6 ${
        newsFeed[i].read ? "bg-red-500" : "bg-white"
      } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
              newsFeed[i].comments_count
            }</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>
        </div>
      </div>
    `);
  }

  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    String(store.currentPage > 1 ? store.currentPage - 1 : 1)
  );
  template = template.replace("{{__next_page__}}", String(store.currentPage + 1));

  updateView(template);
}

function renderNewsDetail(): void {
  const id = location.hash.substr(7);
  const newsContent = getData<NewsDetailType>(CONTENT_URL.replace("@id", id));
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>
        {{__comments__}}
      </div>
    </div>
  `;

  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === parseInt(id)) {
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(template.replace("{{__comments__}}", renderComment(newsContent.comments)));
}

function renderComment(comments: NewsCommentType[]): string {
  const commentString = [];

  for (let i = 0; i < comments.length; i++) {
    const { level, user, time_ago, content } = comments[i];
    commentString.push(`
      <div style="padding-left: ${level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${user}</strong> ${time_ago}
        </div>
        <p class="text-gray-700">${content}</p>
      </div>
    `);

    if (comments[i].comments.length > 0) {
      commentString.push(renderComment(comments[i].comments));
    }
  }

  return commentString.join("");
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
