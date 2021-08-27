const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";

ajax.open("GET", NEWS_URL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);
const $ul = document.createElement("ul");

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

document.getElementById("root").appendChild($ul);
