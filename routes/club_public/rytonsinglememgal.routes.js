export default [
  {
    path: '/rytonsinmemgal/:id',
    name: 'MemberGallerySingle',
    component: () => import('@/components/club_public/MemberGallerySingle.vue'),
    props: true
  }
];