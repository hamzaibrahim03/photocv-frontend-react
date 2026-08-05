import EventsForm from "@/partials/club_admin/eventsedit/EventsForm.vue";

export default [
  {
    path: "/eventsedit/form",
    name: "EventsForm",
    component: EventsForm,
    meta: { requiresAuth: true }
  },
];
