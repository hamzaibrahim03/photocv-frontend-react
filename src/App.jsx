// import { createElement, useState, useEffect, useRef, useTransition, useActionState, useId } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
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
import CompetitionsRoute from './club_admin/CompetitionsRoute';
import NoticeRoute from './club_admin/NoticeRoute';
// import CommentsDrawClub from './React/CommentsDrawClub';
// import CommentsDrawMember from './React/CommentsDrawMember';
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
                <Route path="/dashboard" element={<DashboardRoute />} />
                <Route path="/event" element={<EventRoute />} />
                <Route path="/competitions" element={<CompetitionsRoute />} />
                <Route path="/notices" element={<NoticeRoute />} />
            </Routes>
        </>
    )
}

export default App