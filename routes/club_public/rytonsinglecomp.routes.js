export default [
  {
    path: '/club/public/competition/:id',
    name: 'CompetitionSinglePublic',
    component: () => import('@/components/club_public/CompetitionSinglePublic.vue'),
    props: true
  }
];