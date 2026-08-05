import { createWebHistory, createRouter } from "vue-router";
import LoginRoute from "@/components/club_admin/LoginRoute.vue";
import ClubLogin from "@/components/club_admin/ClubLogin.vue";
import ClubSignup from "@/components/club_admin/ClubSignup.vue";
import DashboardRoute from "@/components/club_admin/DashboardRoute.vue";
import EventRoute from "@/components/club_admin/EventRoute.vue";
import CompetitionsRoute from "@/components/club_admin/CompetitionsRoute.vue";
import ClubRoute from "@/components/club_admin/ClubRoute.vue";
import CompetitionsEdit from "@/components/club_admin/CompetitionsEdit.vue";
import CompetitionSettings from "@/components/club_admin/CompetitionSettings.vue";
import EventSingle from "@/components/club_admin/EventSingle.vue";
import CompetitionSingle from "@/components/club_admin/CompetitionSingle.vue";
import EventsAdd from "@/components/club_admin/EventsAdd.vue";
import NoticeSingle from "@/components/club_admin/NoticeSingle.vue";
import MemberSingle from "@/components/club_admin/MemberSingle.vue";
import NoticeRoute from "@/components/club_admin/NoticeRoute.vue";
import NewsRoute from "@/components/club_admin/NewsRoute.vue";
import NewsEdit from "@/components/club_admin/NewsEdit.vue";
import NewsSingle from "@/components/club_admin/NewsSingle.vue";
import PagesRoute from "@/components/club_admin/PagesRoute.vue";
import MembersRoute from "@/components/club_admin/MembersRoute.vue";
import MemberAdd from "@/components/club_admin/MemberAdd.vue";
import MembersRequest from "@/components/club_admin/MembersRequest.vue";
import GalleryRoute from "@/components/club_admin/GalleryRoute.vue";
import MemberGallery from "@/components/club_admin/MemberGallery.vue";
import ClubGallery from "@/components/club_admin/ClubGallery.vue";
import KamranGallery from "@/components/club_admin/KamranGallery.vue";
import ClubMemberGallery from "@/components/club_admin/ClubMemberGallery.vue";
import KamranGallerySingle from "@/components/club_admin/KamranGallerySingle.vue";
import ClubGallerySingle from "@/components/club_admin/ClubGallerySingle.vue";
// photographer Admin
import ProfileDashboard from "@/components/photographer/ProfileDashboard.vue"
import PostView from "@/components/photographer/PostView.vue"
import PostNotice from "@/components/photographer/PostNotice.vue"
import PhotographerCompetitions from "@/components/photographer/PhotographerCompetitions.vue"
import PhotographerEvent from "@/components/photographer/PhotographerEvent.vue"
import PhotographerPortfolio from "@/components/photographer/PhotographerPortfolio.vue"
import PhotographerEventSingle from "@/components/photographer/PhotographerEventSingle.vue"
import PhotographerGear from "@/components/photographer/PhotographerGear.vue"
import PhotographerCompSingle from "@/components/photographer/PhotographerCompSingle.vue"
import PhotographerLearning from "@/components/photographer/PhotographerLearning.vue"
import PhotographerPlans from "@/components/photographer/PhotographerPlans.vue"
import LearningNotes from "@/components/photographer/LearningNotes.vue"
// club public
import HomeRoute from "@/components/club_public/HomeRoute.vue"
import EventPublic from "@/components/club_public/EventPublic.vue"
import EventSinglePublic from "@/components/club_public/EventSinglePublic.vue"
import CompetitionSinglePublic from "@/components/club_public/CompetitionSinglePublic.vue"
import CompetitionPublic from "@/components/club_public/CompetitionPublic.vue"
import GalleryPublic from "@/components/club_public/GalleryPublic.vue"
import MemberGalleryPublic from "@/components/club_public/MemberGalleryPublic.vue"
import MemberGallerySingle from "@/components/club_public/MemberGallerySingle.vue"
import RytonMemberSlide from "@/components/club_public/RytonMemberSlide.vue"
import ClubGalleryPublic from "@/components/club_public/ClubGalleryPublic.vue"
import RytonClubGallerySingle from "@/components/club_public/RytonClubGallerySingle.vue"
import RytonClubSlide from "@/components/club_public/RytonClubSlide.vue"
import NewsSinglePublic from "@/components/club_public/NewsSinglePublic.vue"
import NewsPublic from "@/components/club_public/NewsPublic.vue"
import NoticeSinglePublic from "@/components/club_public/NoticeSinglePublic.vue"
import NoticePublic from "@/components/club_public/NoticePublic.vue"
import ClubPublic from "@/components/club_public/ClubPublic.vue"
import RytonCompetitionResults from "@/components/club_public/RytonCompetitionResults.vue"
import RytonSingleResults from "@/components/club_public/RytonSingleResults.vue"
import RytonResultSlide from "@/components/club_public/RytonResultSlide.vue"
const routes = [
  {
    name: "Login",
    path: "/login",
    component: LoginRoute,
  },
  {
    name: "ClubLogin",
    path: "/clublogin",
    component: ClubLogin,
  },
  {
    name: "ClubSignup",
    path: "/signup",
    component: ClubSignup,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    component: DashboardRoute,
  },
  {
    name: "Event",
    path: "/event",
    component: EventRoute,
  },
  {
    name: 'eventsingle',
    path: '/eventsingle/:id',
    component: EventSingle
  },
  {
    name: "events_edit",
    path: '/events_add/edit/:id',
    component: EventsAdd,
  },
  {
    name: "events_add",
    path: '/events_add',
    component: EventsAdd,
  },
  {
    name: "Competitions",
    path: "/competitions",
    component: CompetitionsRoute,
  },
  {
    name: "competitionsingle",
    path: "/competitionsingle/:id",
    component: CompetitionSingle,
  },
  {
    name: "comp_edit",
    path: "/comp_edit/edit/:id",
    component: CompetitionsEdit,
  },
  {
    name: "CompetitionsAdd",
    path: "/comp_edit",
    component: CompetitionsEdit,
  },
  {
    name: "CompetitionSettings",
    path: "/comp_set",
    component: CompetitionSettings,
  },
  {
    name: "MembersRoute",
    path: "/members",
    component: MembersRoute,
  },
  {
    name: "MemberAdd",
    path: "/member_add",
    component: MemberAdd,
  },
  {
    name: "member_edit",
    path: "/member_edit/:id",
    component: MemberAdd,
  },
  {
    name: "MembersRequest",
    path: "/member_request",
    component: MembersRequest,
  },
  {
    name: "MemberSingle",
    path: "/membersingle",
    component: MemberSingle,
  },
  {
    name: "GalleryRoute",
    path: "/gallery",
    component: GalleryRoute,
  },
  {
    name: "MemberGallery",
    path: "/mem_gallery",
    component: MemberGallery,
  },
  {
    name: "ClubGallery",
    path: "/club_gallery",
    component: ClubGallery,
  },
  {
    name: "ClubMemberGallery",
    path: "/club_member_gallery",
    component: ClubMemberGallery,
  },
  {
    name: "ClubGallerySingle",
    path: "/club_gallery_single",
    component: ClubGallerySingle,
  },
  {
    name: "KamranGallery",
    path: "/kam_gallery",
    component: KamranGallery,
  },
  {
    name: "KamranGallerySingle",
    path: "/kamran_gallery_single",
    component: KamranGallerySingle,
  },
  {
    name: "NoticeRoute",
    path: "/notices",
    component: NoticeRoute,
  },
  {
    path: '/notice_single',
    name: 'noticeadd',
    component: NoticeSingle
  },
  {
    path: '/notice_single/edit/:id',
    name: 'noticeedit',
    component: NoticeSingle
  },
  {
    name: "noticesingle",
    path: "/notice_single/:id",
    component: NoticeSingle,
  },
  {
    name: "NewsRoute",
    path: "/news",
    component: NewsRoute,
  },
  {
    name: "newssingle",
    path: "/newssingle/:id",
    component: NewsSingle,
  },
  {
    name: "news_edit",
    path: "/news_edit/edit/:id",
    component: NewsEdit,
  },
  {
    name: "NewsAdd",
    path: "/news_edit",
    component: NewsEdit,
  },
  {
    name: "PagesRoute",
    path: "/pages",
    component: PagesRoute,
  },
  {
    name: "Club",
    path: "/club",
    component: ClubRoute,
  },
  // Photographer
  {
    name: "About",
    path: "/about",
    component: ProfileDashboard,
  },
  {
    name: "Post",
    path: "/post",
    component: PostView,
  },
  {
    name: "PostNotice",
    path: "/postnotice",
    component: PostNotice,
  },
  {
    name: "PhotographerCompetitions",
    path: "/photo_comp",
    component: PhotographerCompetitions,
  },
  {
    name: "PhotographerCompSingle",
    path: "/comp_single",
    component: PhotographerCompSingle,
  },
  {
    name: "PhotographerEvent",
    path: "/photo_event",
    component: PhotographerEvent,
  },
  {
    name: "PhotographerEventSingle",
    path: "/photo_event_single",
    component: PhotographerEventSingle,
  },
  {
    name: "PhotographerPortfolio",
    path: "/portfolio",
    component: PhotographerPortfolio,
  },
  {
    name: "PhotographerGear",
    path: "/gear",
    component: PhotographerGear,
  },
  {
    name: "PhotographerLearning",
    path: "/learn",
    component: PhotographerLearning,
  },
  {
    name: "PhotographerPlans",
    path: "/plans",
    component: PhotographerPlans,
  },
  {
    name: "LearningNotes",
    path: "/learn_notes",
    component: LearningNotes,
  },
  //club public
  {
    name: "HomeRoute",
    path: "/",
    component: HomeRoute,
  },
  {
    name: "EventPublic",
    path: "/rytonevent",
    component: EventPublic,
  },
  {
    name: "EventSinglePublic",
    path: "/rytonsingleevent",
    component: EventSinglePublic,
  },
  {
    name: "CompetitionPublic",
    path: "/rytoncomp",
    component: CompetitionPublic,
  },
  {
    name: "CompetitionSinglePublic",
    path: "/rytonsinglecomp",
    component: CompetitionSinglePublic,
  },
  {
    name: "GalleryPublic",
    path: "/rytongal",
    component: GalleryPublic,
  },
  {
    name: "ClubGalleryPublic",
    path: "/rytonclubgallery",
    component: ClubGalleryPublic,
  },
  {
    name: "RytonClubGallerySingle",
    path: "/rytonsinclubgal/:id",
    component: RytonClubGallerySingle,
  },
  {
    name: "RytonClubslide",
    path: "/rytonclubslide",
    component: RytonClubSlide,
  },
  {
    name: "MemberGalleryPublic",
    path: "/rytonmembergallery",
    component: MemberGalleryPublic,
  },
  {
    name: "MemberGallerySingle",
    path: "/rytonsinmemgal/:id",
    component: MemberGallerySingle,
  },
  {
    name: "RytonMemberslide",
    path: "/rytonmemberslide",
    component: RytonMemberSlide,
  },
  {
    name: "NewsPublic",
    path: "/rytonnews",
    component: NewsPublic,
  },
  {
    name: "NewsSinglePublic",
    path: "/rytonsinglenews",
    component: NewsSinglePublic,
  },
  {
    name: "NoticePublic",
    path: "/rytonnotice",
    component: NoticePublic,
  },
  {
    name: "NoticeSinglePublic",
    path: "/rytonsinglenotice",
    component: NoticeSinglePublic,
  },
  {
    name: "ClubPublic",
    path: "/rytonclub",
    component: ClubPublic,
  },
  {
    name: "RytonCompetitionResults",
    path: "/compresult",
    component: RytonCompetitionResults,
  },
  {
    name: "RytonSingleResults",
    path: "/compsinresult/:id",
    component: RytonSingleResults,
  },
  {
    name: "RytonResultslide",
    path: "/rytonresultslide",
    component: RytonResultSlide,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
