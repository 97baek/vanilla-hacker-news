const ajax = new XMLHttpRequest();

const container = document.getElementById("root");
const $content = document.createElement("div");
const $ul = document.createElement("ul");

const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL);

window.addEventListener("hashchange", () => {
  const id = location.hash.substr(1);
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#">목록</a>
    </div>
  `;
});

newsFeed.forEach((feed) => {
  const $div = document.createElement("div");

  $div.innerHTML = `
    <li>
      <a href="#${feed.id}">
        ${feed.title} (${feed.comments_count})
      </a>
    </li>
  `;

  $ul.appendChild($div.firstElementChild);
});

container.appendChild($ul);
container.appendChild($content);
