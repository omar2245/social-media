// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Main from "../page/Main.vue";
import Home from "../page/Home.vue";
import Search from "../page/Search.vue";
import Profile from "../page/Profile.vue";
const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/",
    name: "Home",
    component: Main,
    children: [
      {
        path: "home",
        name: "home",
        component: Home,
      },
      {
        path: "search",
        name: "search",
        component: Search,
      },
      {
        path: "profile",
        name: "profile",
        component: Profile,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
