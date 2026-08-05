export default [
  {
    path: "/club_public/rytonevent",
    name: "HomeRoute",
    component: () => import("@/components/club_public/EventPublic.vue"),
    meta: {
      title: "Ryton Event",
    }
  }
];