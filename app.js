const ajax = new XMLHttpRequest();

const container = document.getElementById("root");
const $ul = document.createElement("ul");

const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function renderNewsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];

  newsList.push("<ul>");
  newsFeed.forEach((feed) => {
    newsList.push(`
      <li>
        <a href="#${feed.id}">
          ${feed.title} (${feed.comments_count})
        </a>
      </li>
    `);
  });
  newsList.push("</ul>");

  container.innerHTML = newsList.join("");
}

function renderNewsDetail() {
  const id = location.hash.substr(1);
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  container.innerHTML = `
      <h1>${newsContent.title}</h1>
      <div>
        <a href="#">목록</a>
      </div>
    `;
}

function router() {
  const routePath = location.hash;
  if (!routePath) {
    renderNewsFeed();
    return;
  }
  renderNewsDetail();
}

window.addEventListener("hashchange", router);

router();
