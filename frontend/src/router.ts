import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "root",
      component: () => import("./views/root/RootView.vue")
    },
    {
      path: "/catch",
      name: "catch",
      component: () => import("./views/catch/CatchView.vue")
    },
    {
      path: "/free",
      name: "free",
      component: () => import("./views/free/FreeView.vue")
    }
  ]
});

export default router;