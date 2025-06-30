// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Main from "../page/Main.vue";
import Home from "../page/Home.vue";
import Search from "../page/Search.vue";
import Profile from "../page/Profile.vue";
import Login from "../page/Login.vue";
import Register from "../page/Register.vue";
import PostDetail from "../page/PostDetail.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
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
        path: "/posts/:id",
        name: "PostDetail",
        component: PostDetail,
      },
      {
        path: "/profile/:id",
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
