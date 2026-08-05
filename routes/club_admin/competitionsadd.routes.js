import FormAdd from "@/partials/club_admin/competitionsadd/FormAdd.vue";
import GlobalSettings from "@/partials/club_admin/competitionsadd/GlobalSettings.vue";
import ProfileWithoutSearch from "@/partials/club_admin/competitionsadd/ProfileWithoutSearch.vue";

export default [
  {
    path: "/competitionsadd/form",
    name: "FormAdd",
    component: FormAdd,
    meta: { requiresAuth: true }
  },
  {
    path: "/competitionsadd/settings",
    name: "GlobalSettings",
    component: GlobalSettings,
    meta: { requiresAuth: true }
  },
  {
    path: "/competitionsadd/profile",
    name: "ProfileWithoutSearch",
    component: ProfileWithoutSearch,
    meta: { requiresAuth: true }
  },
];
