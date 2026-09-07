import './App.css'
import HomeRoute from './React/HomeRoute'
import EventPublic from './React/EventPublic'
import { Route, Routes } from "react-router";
import CompetitionPublic from './React/CompetitionPublic'
import GalleryPublic from './React/GalleryPublic'
import ClubPublic from './React/ClubPublic'
import NewsPublic from './React/NewsPublic'
import NoticePublic from './React/NoticePublic'
import EventSinglePublic from './React/EventSinglePublic'
import CompetitionSinglePublic from './React/CompetitionSinglePublic'
import NewsSinglePublic from './React/NewsSinglePublic'
import NoticeSinglePublic from './React/NoticeSinglePublic'
import ClubGalleryPublic from './React/ClubGalleryPublic'
import RytonClubGallerySingle from './React/RytonClubGallerySingle'
import MemberGalleryPublic from './React/MemberGalleryPublic'
import RytonMemberGallerySingle from './React/MemberGallerySingle'
import RytonCompetitionResults from './React/RytonCompetitionResults';
import RytonClubSlide from './React/RytonClubSlide';
import RytonMemberSlide from './React/RytonMemberSlide';
import RytonSingleResults from './React/RytonSingleResults';
import RytonResultSlide from './React/RytonResultSlide';
import LoginRoute from './club_admin/LoginRoute';
import DashboardRoute from './club_admin/DashboardRoute';
import EventRoute from './club_admin/EventRoute';
import EventsAdd from './club_admin/EventsAdd';
import EventSingle from './club_admin/EventSingle';
import CompetitionsRoute from './club_admin/CompetitionsRoute';
import CompetitionsEdit from './club_admin/CompetitionsEdit';
import CompetitionSingle from './club_admin/CompetitionSingle';
import MembersRoute from './club_admin/MembersRoute';
import MemberAdd from './club_admin/MemberAdd';
import MembersRequest from './club_admin/MembersRequest';
import MemberSingle from './club_admin/MemberSingle';
import MemberSingleRequest from './club_admin/MemberSingleRequest';
import GalleryRoute from './club_admin/GalleryRoute';
import ClubGalleryRoute from './club_admin/ClubGallery';
import MemberGalleryRoute from './club_admin/MemberGallery';
import KamranGallery from './club_admin/KamranGallery';
import NoticeRoute from './club_admin/NoticeRoute';
import NewsRoute from './club_admin/NewsRoute';
import NewsEdit from './club_admin/NewsEdit';
import PageRoute from './club_admin/PagesRoute';
import ClubRoute from './club_admin/ClubRoute';
import Library from './club_admin/Library';
import ProfileDashboard from './photographer/ProfileDashboard';
import PhotographerPortfolio from './photographer/PhotographerPortfolio';
import PhotographerGear from './photographer/PhotographerGear';
import PhotographerLearning from './photographer/PhotographerLearning';
import PostView from './photographer/PostView';
import PhotographerPlans from './photographer/PhotographerPlans';
import NoticeSingle from './club_admin/NoticeSingle';
import NoticeEdit from './club_admin/NoticeEdit';
import NewsSingle from './club_admin/NewsSingle';
import PageSingle from './club_admin/PageSingle';
import PageEdit from './club_admin/PageEdit';
import ClubSignup from './club_admin/ClubSignup';
import ClubGallerySingle from './club_admin/ClubGallerySingle';
function App() {
    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomeRoute />} />
                <Route path="/rytonevent" element={<EventPublic />} />
                <Route path="/rytoncomp" element={<CompetitionPublic />} />
                <Route path="/rytongal" element={<GalleryPublic />} />
                <Route path="/rytongal/club" element={<ClubGalleryPublic />} />
                <Route path="/rytongal/club/:id" element={<RytonClubGallerySingle />} />
                <Route path="/rytonclubslide" element={<RytonClubSlide />} />
                <Route path="/rytongal/member" element={<MemberGalleryPublic />} />
                <Route path="/rytongal/member/:id" element={<RytonMemberGallerySingle />} />
                <Route path="/rytonmemberslide" element={<RytonMemberSlide />} />
                <Route path="/rytonclub" element={<ClubPublic />} />
                <Route path="/rytonnews" element={<NewsPublic />} />
                <Route path="/rytonnotice" element={<NoticePublic />} />
                <Route path="/rytonevent/:id" element={<EventSinglePublic />} />
                <Route path="/rytoncomp/:id" element={<CompetitionSinglePublic />} />
                <Route path="/rytonnews/:id" element={<NewsSinglePublic />} />
                <Route path="/rytonnotice/:id" element={<NoticeSinglePublic />} />
                <Route path="/rytoncomp/results" element={<RytonCompetitionResults />} />
                <Route path="/rytoncomp/results/:id" element={<RytonSingleResults />} />
                <Route path="/rytoncomp/result/slide" element={<RytonResultSlide />} />
                {/* Club Admin */}
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/signup" element={<ClubSignup />} />
                <Route path="/dashboard" element={<DashboardRoute />} />
                <Route path="/event" element={<EventRoute />} />
                <Route path="/event/create" element={<EventsAdd />} />
                <Route path="/event/:id/edit" element={<EventsAdd />} />
                <Route path="/event/:id" element={<EventSingle />} />
                <Route path="/competitions" element={<CompetitionsRoute />} />
                <Route path="/competitions/:id/edit" element={<CompetitionsEdit />} />
                <Route path="/competitions/create" element={<CompetitionsEdit />} />
                <Route path="/competitions/:id" element={<CompetitionSingle />} />
                <Route path="/members" element={<MembersRoute />} />
                <Route path="/members/create" element={<MemberAdd />} />
                <Route path="/members/:id/edit" element={<MemberAdd />} />
                <Route path="/members/:id" element={<MemberSingle />} />
                <Route path="/members/request" element={<MembersRequest />} />
                <Route path="/memberrequest/:id" element={<MemberSingleRequest />} />
                <Route path="/gallery" element={<GalleryRoute />} />
                <Route path="/gallery/club" element={<ClubGalleryRoute />} />
                <Route path="/gallery/club/:id" element={<ClubGallerySingle />} />
                <Route path="/gallery/member" element={<MemberGalleryRoute />} />
                <Route path="/notices" element={<NoticeRoute />} />
                <Route path="/notices/:id" element={<NoticeSingle />} />
                <Route path="/notices/create" element={<NoticeEdit />} />
                <Route path="/notices/:id/edit" element={<NoticeEdit />} />
                <Route path="/news" element={<NewsRoute />} />
                <Route path="/news/:id/edit" element={<NewsEdit />} />
                <Route path="/news/create" element={<NewsEdit />} />
                <Route path="/news/:id" element={<NewsSingle />} />
                <Route path="/kamran" element={<KamranGallery />} />
                <Route path="/pages" element={<PageRoute />} />
                <Route path="/pages/:id" element={<PageSingle />} />
                <Route path="/pages/create" element={<PageEdit />} />
                <Route path="/pages/:id/edit" element={<PageEdit />} />
                <Route path="/club" element={<ClubRoute />} />
                <Route path="/library" element={<Library />} />
                {/* Member */}
                <Route path="/about" element={<ProfileDashboard />} />
                <Route path="/portfolio" element={<PhotographerPortfolio />} />
                <Route path="/gear" element={<PhotographerGear />} />
                <Route path="/learn" element={<PhotographerLearning />} />
                <Route path="/post" element={<PostView />} />
                <Route path="/plans" element={<PhotographerPlans />} />
            </Routes>
        </>
    )
}
export default App
