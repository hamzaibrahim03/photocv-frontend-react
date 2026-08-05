import CalendarDashboard from '@/components/club_admin/Calendars/CalendarDashboard.vue'
import QuickFilters from "@/partials/club_admin/events/QuickFilters.vue";

export default [
  {
    path: "/events/calendar",
    name: "CalendarDashboard",
    component: CalendarDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: "/events/quickfilters",
    name: "QuickFilters",
    component: QuickFilters,
    meta: { requiresAuth: true }
  }
];
