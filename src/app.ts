import { NewsDetailView, NewsFeedView } from "./page";
import Router from "./core/router";
import { IStore } from "./types";

const store: IStore = {
  currentPage: 1,
  feeds: [],
};

const newsDetailView = new NewsDetailView("root");
const newsFeedView = new NewsFeedView("root");
const router: Router = new Router();

router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);

router.route();
