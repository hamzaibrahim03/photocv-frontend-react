export default [
  {
    path: "/club_public/home",
    name: "HomeRoute",
    component: () => import("@/components/club_public/HomeRoute.vue"),
    meta: {
      title: "Ryton Club",
    }
  }
];