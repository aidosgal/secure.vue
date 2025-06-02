import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/home"),
  },
  {
    path: "/docs",
    name: "docs",
    component: () => import("@/pages/docs"),
  },
  {
    path: "/help/faq",
    name: "faq",
    component: () => import("@/pages/faq"),
  },
  {
    path: "/storage/files",
    name: "files",
    component: () => import("@/pages/files"),
  },
  {
    path: "/storage/passwords",
    name: "passwords",
    component: () => import("@/pages/passwords"),
  },
  {
    path: "/account/profile",
    name: "profile",
    component: () => import("@/pages/profile"),
  },
  {
    path: "/tools/password-generator",
    name: "password-generator",
    component: () => import("@/pages/password-generator"),
  },
  {
    path: "/tools/leak-check",
    name: "leak-check",
    component: () => import("@/pages/leak-check"),
  },
];
