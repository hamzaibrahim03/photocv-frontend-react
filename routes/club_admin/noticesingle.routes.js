import NoticeForm from "@/partials/club_admin/noticesingle/NoticeForm.vue";

export default [
  {
    path: "/noticesingle/form",
    name: "NoticeForm",
    component: NoticeForm,
    meta: { requiresAuth: true }
  },
];
