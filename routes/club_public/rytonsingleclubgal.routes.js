export default [
  {
    path: '/rytonsinclubgal/:id',
    name: 'RytonClubGallerySingle',
    component: () => import('@/components/club_public/RytonClubGallerySingle.vue'),
    props: true
  }
];