import { route } from "quasar/wrappers";
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from "vue-router";
import { AppState } from "../store";
import routes from "./routes";
import { Cookies } from "quasar";
import { getRefreshToken } from "src/boot/cookies";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route<AppState>(function(/* {store , ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    )
  });

  Router.beforeEach(async (to, from, next) => {
    let access_token: string = Cookies.get("access_token");
    const refresh_token: string = Cookies.get("refresh_token");
    if (!access_token && refresh_token) {
      access_token = await getRefreshToken();
    }
    if (to.meta.auth && !refresh_token) {
      return next({ path: "/log-in" });
    }
    return next();
  });
  return Router;
});
