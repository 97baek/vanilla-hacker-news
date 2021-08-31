import { NewsDetailView, NewsFeedView } from "./page";
import Router from "./core/router";
import Store from "./store";

const store = new Store();

const newsDetailView = new NewsDetailView("root", store);
const newsFeedView = new NewsFeedView("root", store);
const router: Router = new Router();

router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);

router.route();
