const ajax = new XMLHttpRequest();

const container = document.getElementById("root");
const $content = document.createElement("div");
const $ul = document.createElement("ul");

const newsFeed = JSON.parse(ajax.response);

const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;

ajax.open("GET", NEWS_URL, false);
ajax.send();

window.addEventListener("hashchange", () => {
  const id = location.hash.substr(1);

  ajax.open("GET", CONTENT_URL.replace("@id", id), false);
  ajax.send();

  const newsContent = JSON.parse(ajax.response);
  const $title = document.createElement("h1");

  $title.innerHTML = newsContent.title;

  $content.appendChild($title);
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
