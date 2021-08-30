import { CONTENT_URL } from "../constants/config";
import { NewsDetailApi } from "../core/api";
import { INewsComment } from "../types";
import View from "../core/view";

export default class NewsDetailView extends View {
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
