export default [
  {
    path: '/club/public/event/:id',
    name: 'EventSinglePublic',
    component: () => import('@/components/club_public/EventSinglePublic.vue'),
    props: true
  }
];