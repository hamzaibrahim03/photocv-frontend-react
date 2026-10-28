import HomeRoute from './Ryton/HomeRoute'
import EventPublic from './Ryton/EventPublic'
import { Route, Routes } from "react-router";
import CompetitionPublic from './Ryton/CompetitionPublic'
import GalleryPublic from './Ryton/GalleryPublic'
import ClubPublic from './Ryton/ClubPublic'
import NewsPublic from './Ryton/NewsPublic'
import NoticePublic from './Ryton/NoticePublic'
import EventSinglePublic from './Ryton/EventSinglePublic'
import CompetitionSinglePublic from './Ryton/CompetitionSinglePublic'
import NewsSinglePublic from './Ryton/NewsSinglePublic'
import NoticeSinglePublic from './Ryton/NoticeSinglePublic'
import ClubGalleryPublic from './Ryton/ClubGalleryPublic'
import RytonClubGallerySingle from './Ryton/RytonClubGallerySingle'
import MemberGalleryPublic from './Ryton/MemberGalleryPublic'
import RytonMemberGallerySingle from './Ryton/MemberGallerySingle'
import RytonCompetitionResults from './Ryton/RytonCompetitionResults';
import RytonClubSlide from './Ryton/RytonClubSlide';
import RytonMemberSlide from './Ryton/RytonMemberSlide';
import RytonSingleResults from './Ryton/RytonSingleResults';
import RytonResultSlide from './Ryton/RytonResultSlide';
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
import NoticeRoute from './club_admin/NoticeRoute';
import NewsRoute from './club_admin/NewsRoute';
import NewsEdit from './club_admin/NewsEdit';
import PageRoute from './club_admin/PagesRoute';
import ClubRoute from './club_admin/ClubRoute';
import Library from './club_admin/Library';
import ProfileDashboard from './photographer/ProfileDashboard';
import PhotographerPortfolio from './photographer/PhotographerPortfolio';
import MySales from './photographer/MySales';
import PhotographerSaleAdd from './photographer/PhotographerSaleAdd';
import PhotographerSaleSingle from './photographer/PhotographerSaleSingle';
import PhotographerGear from './photographer/PhotographerGear';
import PhotographerGearAdd from './photographer/PhotographerGearAdd';
import PhotographerGearSingle from './photographer/PhotographerGearSingle';
import PhotographerGearList from './photographer/PhotographerGearList';
import PhotographerGearLibrary from './photographer/PhotographerGearLibrary';
import PhotographerLearning from './photographer/PhotographerLearning';
import PhotographerWishlistAdd from './photographer/PhotographerWishlistAdd';
import PhotographerCheatsheet from './photographer/PhotographerCheatsheet';
import PhotographerCheatSheetView from './photographer/PhotographerCheatSheetView';
import PhotographerCompetitions from './photographer/PhotographerCompetitions';
import PhotographerCompSingle from './photographer/PhotographerCompSingle';
import PhotographerCompEntries from './photographer/PhotographerCompEntries';
import PhotographerCheatsheetAdd from './photographer/PhotographerCheatsheetAdd';
import PhotographerInsights from './photographer/PhotographerInsights';
import LearningNotes from './photographer/LearningNotes';
import PostView from './photographer/PostView';
import PhotographerPlans from './photographer/PhotographerPlans';
import PhotographerPlanAdd from './photographer/PhotographerPlanAdd';
import PhotographerGallery from './photographer/PhotographerGallery';
import PhotographerGallerySingle from './photographer/PhotographerGallerySingle';
import PhotographerGalleryEdit from './photographer/PhotographerGalleryEdit';
import PhotographerEvent from './photographer/PhotographerEvent';
import PhotographerEventSingle from './photographer/PhotographerEventSingle';
import PostNotice from './photographer/PostNotice';
import PhotographerNoticeSingle from './photographer/NoticeSingle';
import PhotographerNoticeEdit from './photographer/NoticeEdit';
import PhotographerCalendar from './photographer/PhotographerCalendar';
import PhotographerCalendarAdd from './photographer/PhotographerCalendarAdd';
import PhotographerCalendarSingle from './photographer/PhotographerCalendarSingle';
import PhotoLibrary from './photographer/PhotoLibrary';
import NoticeSingle from './club_admin/NoticeSingle';
import NoticeEdit from './club_admin/NoticeEdit';
import NewsSingle from './club_admin/NewsSingle';
import PageSingle from './club_admin/PageSingle';
import PageEdit from './club_admin/PageEdit';
import ClubSignup from './club_admin/ClubSignup';
import ClubGallerySingle from './club_admin/ClubGallerySingle';
import KamranGallerySingle from './club_admin/KamranGallerySingle';
import Seasons from './club_admin/Seasons';
import SingleSeason from './club_admin/SingleSeason';
import SingleMemberEntries from './club_admin/SingleMemberEntries';
import SingleEntryJudging from './club_admin/SingleEntryJudging';
import JudgeDashboard from './Judge/JudgeDashboard';
import JudgeClubCompetitions from './Judge/JudgeClubCompetitions';
import JudgeCompetitionDetail from './Judge/JudgeCompetitionDetail';
import JudgeCompetitionEdit from './Judge/JudgeCompetitionEdit';
import JudgeCompetitionSubmissions from './Judge/JudgeCompetitionSubmissions';
import JudgeImageScoring from './Judge/JudgeImageScoring';
import JudgeProfile from './Judge/JudgeProfile';
import JudgeSettings from './Judge/JudgeSettings';
import ChangePassword from './ChangePassword';
import SettingsRedirect from './SettingsRedirect';
import SpeakerDashboard from './Speaker/SpeakerDashboard';
import SpeakerClubEvents from './Speaker/SpeakerClubEvents';
import SpeakerEventDetail from './Speaker/SpeakerEventDetail';
import SpeakerEventEdit from './Speaker/SpeakerEventEdit';
import SpeakerProfile from './Speaker/SpeakerProfile';
import SpeakerSettings from './Speaker/SpeakerSettings';
import ClubPublicHome from './ClubPublic/ClubPublicHome';
import SuperDashboard from './Super/SuperDashboard';
import SuperClubsList from './Super/SuperClubsList';
import SuperClubEdit from './Super/SuperClubEdit';
import SuperClubMembers from './Super/SuperClubMembers';
import SuperProfilesList from './Super/SuperProfilesList';
import SuperProfileDetail from './Super/SuperProfileDetail';
import SuperProfileEdit from './Super/SuperProfileEdit';
import SuperRoles from './Super/SuperRoles';
import SuperGlobalSettings from './Super/SuperGlobalSettings';
import SecretaryDashboard from './Secretary/SecretaryDashboard';
import SecretaryCompetitionsList from './Secretary/SecretaryCompetitionsList';
import SecretaryCompetitionDetail from './Secretary/SecretaryCompetitionDetail';
import SecretaryCompetitionEdit from './Secretary/SecretaryCompetitionEdit';
import SecretaryProfile from './Secretary/SecretaryProfile';
import SecretarySettings from './Secretary/SecretarySettings';
import SecretarySeasonResults from './Secretary/SecretarySeasonResults';
import SecretaryCompetitionResults from './Secretary/SecretaryCompetitionResults';
import SecretaryImageLightbox from './Secretary/SecretaryImageLightbox';
import AdminWelcome from './Admin/AdminWelcome';
import AdminLogin from './Admin/AdminLogin';
import AdminSignup from './Admin/AdminSignup';
import AdminClubOnboarding from './Admin/AdminClubOnboarding';
import PhotographerSettings from './photographer/PhotographerSettings';
import PhotographerSignup from './photographer/PhotographerSignup';
import PhotographerLogin from './photographer/PhotographerLogin';
import MarketingHome from './marketing/Home';
import MarketingWhoAreYou from './marketing/WhoAreYou';
import MarketingPhotographerTeaser from './marketing/PhotographerTeaser';
import MarketingClubTeaser from './marketing/ClubTeaser';
function App() {
    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomeRoute />} />
                <Route path="/rytonevent" element={<EventPublic />} />
                <Route path="/rytonevent/:id" element={<EventSinglePublic />} />
                <Route path="/rytoncomp" element={<CompetitionPublic />} />
                <Route path="/rytoncomp/:id" element={<CompetitionSinglePublic />} />
                <Route path="/rytongal" element={<GalleryPublic />} />
                <Route path="/rytongal/club" element={<ClubGalleryPublic />} />
                <Route path="/rytongal/club/:id" element={<RytonClubGallerySingle />} />
                <Route path="/rytongal/member" element={<MemberGalleryPublic />} />
                <Route path="/rytongal/member/:id" element={<RytonMemberGallerySingle />} />
                <Route path="/rytonnews" element={<NewsPublic />} />
                <Route path="/rytonnews/:id" element={<NewsSinglePublic />} />
                <Route path="/rytonnotice" element={<NoticePublic />} />
                <Route path="/rytonnotice/:id" element={<NoticeSinglePublic />} />
                <Route path="/rytonmemberslide" element={<RytonMemberSlide />} />
                <Route path="/rytonclub" element={<ClubPublic />} />
                <Route path="/rytoncomp/results" element={<RytonCompetitionResults />} />
                <Route path="/rytoncomp/results/:id" element={<RytonSingleResults />} />
                <Route path="/rytoncomp/result/slide" element={<RytonResultSlide />} />
                <Route path="/rytonclubslide" element={<RytonClubSlide />} />
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
                <Route path="/competitions/seasons" element={<Seasons />} />
                <Route path="/competitions/seasons/:id" element={<SingleSeason />} />
                <Route path="/competitions/seasons/:id/:memberCompId" element={<SingleMemberEntries />} />
                <Route path="/competitions/seasons/:id/:memberCompId/:entryId" element={<SingleEntryJudging />} />
                <Route path="/members" element={<MembersRoute />} />
                <Route path="/members/create" element={<MemberAdd />} />
                <Route path="/members/:id/edit" element={<MemberAdd />} />
                <Route path="/members/:id" element={<MemberSingle />} />
                <Route path="/members/request" element={<MembersRequest />} />
                <Route path="/members/request/:id" element={<MemberSingleRequest />} />
                <Route path="/gallery" element={<GalleryRoute />} />
                <Route path="/gallery/club" element={<ClubGalleryRoute />} />
                <Route path="/gallery/club/:id" element={<ClubGallerySingle />} />
                <Route path="/gallery/member" element={<MemberGalleryRoute />} />
                <Route path="/gallery/member/:id" element={<KamranGallerySingle />} />
                <Route path="/notices" element={<NoticeRoute />} />
                <Route path="/notices/:id" element={<NoticeSingle />} />
                <Route path="/notices/create" element={<NoticeEdit />} />
                <Route path="/notices/:id/edit" element={<NoticeEdit />} />
                <Route path="/news" element={<NewsRoute />} />
                <Route path="/news/:id/edit" element={<NewsEdit />} />
                <Route path="/news/create" element={<NewsEdit />} />
                <Route path="/news/:id" element={<NewsSingle />} />
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
                <Route path="/gear/add" element={<PhotographerGearAdd />} />
                <Route path="/gear/list" element={<PhotographerGearList />} />
                <Route path="/gear/library" element={<PhotographerGearLibrary />} />
                <Route path="/gear/wishlist/add" element={<PhotographerWishlistAdd />} />
                <Route path="/gear/wishlist/:id/edit" element={<PhotographerWishlistAdd />} />
                <Route path="/gear/:id" element={<PhotographerGearSingle />} />
                <Route path="/gear/:id/edit" element={<PhotographerGearAdd />} />
                <Route path="/my-sales" element={<MySales />} />
                <Route path="/my-sales/add" element={<PhotographerSaleAdd />} />
                <Route path="/my-sales/:id" element={<PhotographerSaleSingle />} />
                <Route path="/my-sales/:id/edit" element={<PhotographerSaleAdd />} />
                <Route path="/cheatsheet" element={<PhotographerCheatsheet />} />
                <Route path="/cheatsheet/add" element={<PhotographerCheatsheetAdd />} />
                <Route path="/cheatsheet/:id" element={<PhotographerCheatSheetView />} />
                <Route path="/cheatsheet/:id/edit" element={<PhotographerCheatsheetAdd />} />
                <Route path="/learn" element={<PhotographerLearning />} />
                <Route path="/notebook" element={<LearningNotes />} />
                <Route path="/insights" element={<PhotographerInsights />} />
                <Route path="/post" element={<PostView />} />
                <Route path="/notice" element={<PostNotice />} />
                <Route path="/notice/:id" element={<PhotographerNoticeSingle />} />
                <Route path="/notice/:id/edit" element={<PhotographerNoticeEdit />} />
                <Route path="/notice/add" element={<PhotographerNoticeEdit />} />
                <Route path="/plans" element={<PhotographerPlans />} />
                <Route path="/plans/add" element={<PhotographerPlanAdd />} />
                <Route path="/my-gallery" element={<PhotographerGallery />} />
                <Route path="/my-gallery/:id" element={<PhotographerGallerySingle />} />
                <Route path="/my-gallery/:id/edit" element={<PhotographerGalleryEdit />} />
                <Route path="/my-events" element={<PhotographerEvent />} />
                <Route path="/my-events/:id" element={<PhotographerEventSingle />} />
                <Route path="/my-competitions" element={<PhotographerCompetitions />} />
                <Route path="/my-competitions/:id" element={<PhotographerCompSingle />} />
                <Route path="/my-competitions/:id/entries" element={<PhotographerCompEntries />} />
                <Route path="/calendar" element={<PhotographerCalendar />} />
                <Route path="/calendar/create" element={<PhotographerCalendarAdd />} />
                <Route path="/calendar/:id" element={<PhotographerCalendarSingle />} />
                <Route path="/calendar/:id/edit" element={<PhotographerCalendarAdd />} />
                <Route path="/settings/photo" element={<PhotographerSettings/>} />
                <Route path="/signup/photo" element={<PhotographerSignup/>} />
                <Route path="/photographer/login" element={<PhotographerLogin/>} />
                <Route path="/photo-library" element={<PhotoLibrary />} />
                {/* Welcome */}
                <Route path="/welcome" element={<MarketingHome/>} />
                <Route path="/welcome/choose" element={<MarketingWhoAreYou/>} />
                <Route path="/welcome/photographer" element={<MarketingPhotographerTeaser/>} />
                <Route path="/welcome/club" element={<MarketingClubTeaser/>} />
                {/* Judge */}
                <Route path="/judge" element={<JudgeDashboard />} />
                <Route path="/judge/dashboard" element={<JudgeDashboard />} />
                <Route path="/judge/competitions" element={<JudgeClubCompetitions />} />
                <Route path="/judge/clubs/:clubId/competitions" element={<JudgeClubCompetitions />} />
                <Route path="/judge/competitions/:competitionId" element={<JudgeCompetitionDetail />} />
                <Route path="/judge/competitions/:competitionId/edit" element={<JudgeCompetitionEdit />} />
                <Route path="/judge/competitions/:competitionId/submissions" element={<JudgeCompetitionSubmissions />} />
                <Route path="/judge/competitions/:competitionId/submissions/:entryId" element={<JudgeImageScoring />} />
                <Route path="/judge/profile" element={<JudgeProfile />} />
                <Route path="/judge/settings" element={<JudgeSettings />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/settings" element={<SettingsRedirect />} />
                {/* Speaker */}
                <Route path="/speaker" element={<SpeakerDashboard />} />
                <Route path="/speaker/dashboard" element={<SpeakerDashboard />} />
                <Route path="/speaker/events" element={<SpeakerClubEvents />} />
                <Route path="/speaker/clubs/:clubId/events" element={<SpeakerClubEvents />} />
                <Route path="/speaker/events/create" element={<SpeakerEventEdit />} />
                <Route path="/speaker/events/:eventId" element={<SpeakerEventDetail />} />
                <Route path="/speaker/profile" element={<SpeakerProfile />} />
                <Route path="/speaker/settings" element={<SpeakerSettings />} />
                <Route path="/speaker/events/:eventId/edit" element={<SpeakerEventEdit />} />
                {/* Club Public */}
                <Route path="/club-public" element={<ClubPublicHome />} />
                {/* Super Admin */}
                <Route path="/super" element={<SuperDashboard />} />
                <Route path="/super/dashboard" element={<SuperDashboard />} />
                <Route path="/super/clubs" element={<SuperClubsList />} />
                <Route path="/super/clubs/create" element={<SuperClubEdit />} />
                <Route path="/super/clubs/:clubId/edit" element={<SuperClubEdit />} />
                <Route path="/super/clubs/:clubId/members" element={<SuperClubMembers />} />
                <Route path="/super/profiles" element={<SuperProfilesList />} />
                <Route path="/super/profiles/:profileId" element={<SuperProfileDetail />} />
                <Route path="/super/profiles/:profileId/edit" element={<SuperProfileEdit />} />
                <Route path="/super/roles" element={<SuperRoles />} />
                <Route path="/super/settings" element={<SuperGlobalSettings />} />
                {/* Competition Secretary */}
                <Route path="/secretary" element={<SecretaryDashboard />} />
                <Route path="/secretary/dashboard" element={<SecretaryDashboard />} />
                <Route path="/secretary/competitions" element={<SecretaryCompetitionsList />} />
                <Route path="/secretary/clubs/:clubId/competitions" element={<SecretaryCompetitionsList />} />
                <Route path="/secretary/competitions/:competitionId" element={<SecretaryCompetitionDetail />} />
                <Route path="/secretary/competitions/:competitionId/edit" element={<SecretaryCompetitionEdit />} />
                <Route path="/secretary/competitions/:competitionId/results" element={<SecretarySeasonResults />} />
                <Route path="/secretary/competitions/:competitionId/scores" element={<SecretaryCompetitionResults />} />
                <Route path="/secretary/competitions/:competitionId/results/:entryId" element={<SecretaryImageLightbox />} />
                <Route path="/secretary/profile" element={<SecretaryProfile />} />
                <Route path="/secretary/settings" element={<SecretarySettings />} />
                {/* Admin (auth + club onboarding) */}
                <Route path="/admin" element={<AdminWelcome />} />
                <Route path="/admin/welcome" element={<AdminWelcome />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />
                <Route path="/admin/onboarding" element={<AdminClubOnboarding />} />
            </Routes>
        </>
    )
}
export default App
