import MemberList from "@/partials/club_admin/members/MemberList.vue";

export default [
  {
    path: "/competitions/memberlist",
    name: "MemberList",
    component: MemberList,
    meta: { requiresAuth: true }
  },
];
