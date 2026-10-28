import { NavLink, useNavigate } from "react-router";
import photoLogo from "./assets/images/photo.png";
import eyeLogo from "./assets/images/eye.png";
import eyepLogo from "./assets/images/eyep.png";
import About from "./assets/icons/navigation/about.svg"
import Competition from "./assets/icons/navigation/competition.svg"
import Dashboard from "./assets/icons/navigation/dashboard.svg"
import Event from "./assets/icons/navigation/events.svg"
import Gallery from "./assets/icons/navigation/galleries.svg"
import Settings from "./assets/icons/navigation/settings.svg"
import Member from "./assets/icons/navigation/members.svg"
import Logout from "./assets/icons/navigation/logout.svg"
import Portfolio from "./assets/icons/navigation/portfolio.svg"
import Post from "./assets/icons/navigation/post.svg"
import Notice from "./assets/icons/navigation/notice.svg"
import News from "./assets/icons/navigation/news.svg"
import Page from "./assets/icons/navigation/pages.svg"
import Learn from "./assets/icons/navigation/learn.svg"
import Gear from "./assets/icons/navigation/gear.svg"
import Plan from "./assets/icons/navigation/plans.svg"
import { useEffect, useRef, useState } from "react";
const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

function NavigationRoute({ activeClubId, onClubChange }) {
    const navigate = useNavigate();
    const [clubMenuOpen, setClubMenuOpen] = useState(false);
    const [clubs, setClubs] = useState([]);
    const activeClub = clubs.find((c) => String(c.id) === String(activeClubId)) || clubs[0];
    const menuRef = useRef(null);
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const role = storedUser?.roles?.[0]?.name || "";

    useEffect(() => {
        async function loadClub() {
            try {
                const response = await fetch(`${API_BASE}/club/public/home`, {
                    headers: { "Content-Type": "application/json" },
                });
                const json = await response.json();
                const data = json?.data || {};
                const club = data?.clubSettings?.original?.data?.club || data?.user?.club || {};
                const settings = data?.clubSettings?.original?.data?.settings || {};
                setClubs([
                    {
                        id: data?.user?.id ?? 1,
                        name: club.club_name || "My Club",
                        cover_image: settings.cover_images?.[0]?.image_medium_url || settings.logo_url || "",
                    },
                ]);
            } catch (error) {
                console.error("Nav club load error:", error);
            }
        }
        loadClub();
    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setClubMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const clubSwitcher = (prefix) => (
        <div className={`${prefix}-club-select`} ref={menuRef} onClick={() => setClubMenuOpen((v) => !v)}>
            <span className={`${prefix}-club-select-left`}>
                {activeClub ? activeClub.name : "All Club"}
            </span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: "12px" }}></i>
            {clubMenuOpen && (
                <div className={`${prefix}-club-dropdown`} onClick={(e) => e.stopPropagation()}>
                    <button className={!activeClubId ? "active" : ""} onClick={() => { onClubChange?.(null); setClubMenuOpen(false); }} >
                        All Club
                    </button>
                    {clubs.map((club) => (
                        <button key={club.id} className={String(activeClubId) === String(club.id) ? "active" : ""} onClick={() => { onClubChange?.(club.id); setClubMenuOpen(false); }} >
                            {club.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );


    const roleSettingsRoutes = {
        club_admin: "/club",
        member: "/settings/photo",
        photographer: "/settings/photo",
        judge: "/judge/settings",
        secretary: "/secretary/settings",
        speaker: "/speaker/settings",
        super_admin: "/super/settings",
    };

    const settingsPath =
        roleSettingsRoutes[role.trim().toLowerCase()] || "/settings";


    return (
        <div className="sidebar" style={{ height: '950px', overflowY: 'auto' }}>
            <img src={photoLogo} style={{ marginLeft: "25px" }} alt="Logo" id="side-logo" />
            <div className="divider3"></div>
            {/* CLUB ADMIN */}
            {role === "club_admin" && (
                <>
                    <a href="#" id="eye-logo">
                        <img src={eyeLogo} alt="Eye" />
                        <h1>My Club</h1>
                    </a>
                    <NavLink to="/dashboard" className="nav-link" href="/dashboard">
                        <img src={Dashboard} style={{ width: '20px', height: '20px' }} /> Dashboard
                    </NavLink>
                    <NavLink to="/event" className="nav-link" href="/event">
                        <img src={Event} style={{ width: '20px', height: '20px' }} /> Events
                    </NavLink>
                    <NavLink to="/competitions" className="nav-link" href="/competitions">
                        <img src={Competition} style={{ width: '20px', height: '20px' }} /> Competitions
                    </NavLink>
                    <NavLink to="/members" className="nav-link" href="/members">
                        <img src={Member} style={{ width: '20px', height: '20px' }} /> Members
                    </NavLink>
                    <NavLink to="/gallery" className="nav-link" href="/gallery">
                        <img src={Gallery} style={{ width: '20px', height: '20px' }} /> Galleries
                    </NavLink>
                    <NavLink to="/notices" className="nav-link" href="/notices">
                        <img src={Notice} style={{ width: '20px', height: '20px' }} /> Notices
                    </NavLink>
                    <NavLink to="/news" className="nav-link" href="/news">
                        <img src={News} style={{ width: '20px', height: '20px' }} /> News
                    </NavLink>
                    <NavLink to="/pages" className="nav-link" href="/pages">
                        <img src={Page} style={{ width: '20px', height: '20px' }} /> Pages
                    </NavLink>
                    <NavLink to="/club" className="nav-link" href="/club">
                        <img src={Settings} style={{ width: '20px', height: '20px' }} /> Admin
                    </NavLink>


                </>
            )}
            {/* MEMBER */}
            {role === "member" && (
                <>
                    <a href="#" id="eye-logo">
                        <img src={eyepLogo} alt="Profile" />
                        <h1>My Profile</h1>
                    </a>
                    <NavLink to="/about" className="nav-link" href="/about">
                        <img src={About} style={{ width: '20px', height: '20px' }} /> About Me
                    </NavLink>
                    <NavLink to="/portfolio" className="nav-link" href="/portfolio">
                        <img src={Portfolio} style={{ width: '20px', height: '20px' }} /> Portfolio
                    </NavLink>
                    <NavLink to="/gear" className="nav-link" href="/gear">
                        <img src={Gear} style={{ width: '20px', height: '20px' }} /> Gear
                    </NavLink>
                    <NavLink to="/learn" className="nav-link" href="/learn">
                        <img src={Learn} style={{ width: '20px', height: '20px' }} /> Learning
                    </NavLink>
                    <NavLink to="/cheatsheet" className="nav-link" href="/cheatsheet">
                        <img src={Learn} style={{ width: '20px', height: '20px' }} /> Cheatsheet
                    </NavLink>
                    <NavLink to="/post" className="nav-link" href="/post">
                        <img src={Post} style={{ width: '20px', height: '20px' }} /> Posts
                    </NavLink>
                    <NavLink to="/notice" className="nav-link" href="/notice">
                        <img src={Notice} style={{ width: '20px', height: '20px' }} /> Notices
                    </NavLink>
                    <NavLink to="/plans" className="nav-link" href="/plans">
                        <img src={Plan} style={{ width: '20px', height: '20px' }} /> Plans
                    </NavLink>
                    <NavLink to="/my-gallery" className="nav-link" href="/my-gallery">
                        <img src={Gallery} style={{ width: '20px', height: '20px' }} /> Gallery
                    </NavLink>
                    <NavLink to="/calendar" className="nav-link" href="/calendar">
                        <img src={Event} style={{ width: '20px', height: '20px' }} /> Calendar
                    </NavLink>
                    <NavLink to="/my-events" className="nav-link" href="/my-events">
                        <img src={Event} style={{ width: '20px', height: '20px' }} /> Events
                    </NavLink>
                    <NavLink to="/my-competitions" className="nav-link" href="/my-competitions">
                        <img src={Competition} style={{ width: '20px', height: '20px' }} /> Competitions
                    </NavLink>
                    <NavLink to="/notebook" className="nav-link" href="/notebook">
                        <img src={Competition} style={{ width: '20px', height: '20px' }} /> Notebook
                    </NavLink>
                    <NavLink to="/photo-library" className="nav-link" href="/photo-library">
                        <i className="fas fa-bookmark" style={{ width: '20px', textAlign: 'center' }}></i> Library
                    </NavLink>
                </>
            )}
            {/* SECRETARY - this block was previously only reachable when
                role === "member" (a copy/paste of the section above), so a
                Secretary-only account got an empty sidebar. */}
            {role === "Secretary" && (
                <>
                    <NavLink to="/secretary/dashboard" className={({ isActive }) => `secretary-nav-link${isActive ? " active" : ""}`}>
                        <span className="secretary-nav-icon"><i className="fa-solid fa-gauge"></i></span>
                        Dashboard
                    </NavLink>
                    <NavLink to="/secretary/competitions" className={({ isActive }) => `secretary-nav-link${isActive ? " active" : ""}`}>
                        <span className="secretary-nav-icon"><i className="fa-solid fa-star"></i></span>
                        Competitions
                    </NavLink>
                    <div className="secretary-divider"></div>
                    <div className="secretary-section-label">
                        <i className="fa-solid fa-user"></i> My Profile
                    </div>
                    <NavLink to="/secretary/profile" className={({ isActive }) => `secretary-nav-link${isActive ? " active" : ""}`}>
                        <span className="secretary-nav-icon"><i className="fa-solid fa-crosshairs"></i></span>
                        My Profile
                    </NavLink>
                    <NavLink to="/secretary/calendar" className={({ isActive }) => `secretary-nav-link${isActive ? " active" : ""}`}>
                        <span className="secretary-nav-icon"><i className="fa-regular fa-circle-user"></i></span>
                        Calendar
                    </NavLink>
                    <NavLink to="/secretary/notebook" className={({ isActive }) => `secretary-nav-link${isActive ? " active" : ""}`}>
                        <span className="secretary-nav-icon"><i className="fa-regular fa-note-sticky"></i></span>
                        Notebook
                    </NavLink>
                    <NavLink to="/secretary/gallery" className={({ isActive }) => `secretary-nav-link${isActive ? " active" : ""}`}>
                        <span className="secretary-nav-icon"><i className="fa-regular fa-image"></i></span>
                        Gallery
                    </NavLink>
                    <NavLink to="/secretary/settings" className={({ isActive }) => `secretary-nav-link${isActive ? " active" : ""}`}>
                        <span className="secretary-nav-icon"><i className="fa-solid fa-gear"></i></span>
                        Settings
                    </NavLink>
                </>
            )}
            {/* JUDGE */}
            {role === "judge" && (
                <>
                    {clubSwitcher("judge")}
                    <NavLink to="/judge/dashboard" className={({ isActive }) => `judge-nav-link${isActive ? " active" : ""}`}>
                        <span className="judge-nav-icon"><i className="fa-solid fa-gauge"></i></span>
                        Dashboard
                    </NavLink>
                    <NavLink to="/judge/competitions" className={({ isActive }) => `judge-nav-link${isActive ? " active" : ""}`}>
                        <span className="judge-nav-icon"><i className="fa-solid fa-star"></i></span>
                        Competitions
                    </NavLink>
                    <div className="judge-divider"></div>
                    <div className="judge-section-label">
                        <i className="fa-solid fa-user"></i> My Profile
                    </div>
                    <NavLink to="/judge/profile" className={({ isActive }) => `judge-nav-link${isActive ? " active" : ""}`}>
                        <span className="judge-nav-icon"><i className="fa-solid fa-crosshairs"></i></span>
                        My Profile
                    </NavLink>
                    <NavLink to="/judge/calendar" className={({ isActive }) => `judge-nav-link${isActive ? " active" : ""}`}>
                        <span className="judge-nav-icon"><i className="fa-regular fa-circle-user"></i></span>
                        Calendar
                    </NavLink>
                    <NavLink to="/judge/notebook" className={({ isActive }) => `judge-nav-link${isActive ? " active" : ""}`}>
                        <span className="judge-nav-icon"><i className="fa-regular fa-note-sticky"></i></span>
                        Notebook
                    </NavLink>
                    <NavLink to="/judge/gallery" className={({ isActive }) => `judge-nav-link${isActive ? " active" : ""}`}>
                        <span className="judge-nav-icon"><i className="fa-regular fa-image"></i></span>
                        Gallery
                    </NavLink>
                    <NavLink to="/judge/settings" className={({ isActive }) => `judge-nav-link${isActive ? " active" : ""}`}>
                        <span className="judge-nav-icon"><i className="fa-solid fa-gear"></i></span>
                        Settings
                    </NavLink>


                </>
            )}

            {role === "super_admin" && (
                <>
                    {clubSwitcher("super")}
                    <NavLink to="/super/dashboard" className={({ isActive }) => `super-nav-link${isActive ? " active" : ""}`}>
                        <i className="fa-regular fa-pen-to-square"></i> Dashboard
                    </NavLink>
                    <NavLink to="/super/clubs" className={({ isActive }) => `super-nav-link${isActive ? " active" : ""}`}>
                        <i className="fa-regular fa-image"></i> Clubs
                    </NavLink>
                    <NavLink to="/super/profiles" className={({ isActive }) => `super-nav-link${isActive ? " active" : ""}`}>
                        <i className="fa-regular fa-circle-user"></i> Profiles
                    </NavLink>
                    <NavLink to="/super/roles" className={({ isActive }) => `super-nav-link${isActive ? " active" : ""}`}>
                        <i className="fa-regular fa-circle-user"></i> Roles
                    </NavLink>
                    <NavLink to="/super/settings" className={({ isActive }) => `super-nav-link${isActive ? " active" : ""}`}>
                        <i className="fa-solid fa-globe"></i> Global Settings
                    </NavLink>
                </>
            )}

            {role === "speaker" && (
                <>
                    {clubSwitcher("speaker")}
                    <NavLink to="/speaker/dashboard" className={({ isActive }) => `speaker-nav-link${isActive ? " active" : ""}`}>
                        <span className="speaker-nav-icon"><i className="fa-solid fa-gauge"></i></span>
                        Dashboard
                    </NavLink>
                    <NavLink to="/speaker/events" className={({ isActive }) => `speaker-nav-link${isActive ? " active" : ""}`}>
                        <span className="speaker-nav-icon"><i className="fa-regular fa-calendar-check"></i></span>
                        Events
                    </NavLink>
                    <div className="speaker-divider"></div>
                    <div className="speaker-section-label">
                        <i className="fa-solid fa-user"></i> My Profile
                    </div>
                    <NavLink to="/speaker/profile" className={({ isActive }) => `speaker-nav-link${isActive ? " active" : ""}`}>
                        <span className="speaker-nav-icon"><i className="fa-solid fa-crosshairs"></i></span>
                        My Profile
                    </NavLink>
                    <NavLink to="/speaker/calendar" className={({ isActive }) => `speaker-nav-link${isActive ? " active" : ""}`}>
                        <span className="speaker-nav-icon"><i className="fa-regular fa-circle-user"></i></span>
                        Calendar
                    </NavLink>
                    <NavLink to="/speaker/notebook" className={({ isActive }) => `speaker-nav-link${isActive ? " active" : ""}`}>
                        <span className="speaker-nav-icon"><i className="fa-regular fa-note-sticky"></i></span>
                        Notebook
                    </NavLink>
                    <NavLink to="/speaker/gallery" className={({ isActive }) => `speaker-nav-link${isActive ? " active" : ""}`}>
                        <span className="speaker-nav-icon"><i className="fa-regular fa-image"></i></span>
                        Gallery
                    </NavLink>
                    <NavLink to="/speaker/settings" className={({ isActive }) => `speaker-nav-link${isActive ? " active" : ""}`}>
                        <span className="speaker-nav-icon"><i className="fa-solid fa-gear"></i></span>
                        Settings
                    </NavLink>
                </>
            )}
            <div className="side-divider1"></div>
            <div className="nav-end">

                <NavLink to={settingsPath} className="nav-link">
                    <img src={Settings} style={{ width: "20px", height: "20px" }} alt="" /> Settings
                </NavLink>

                <NavLink to="/logout" className="nav-link" href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    <img src={Logout} style={{ width: '20px', height: '20px' }} /> Logout
                </NavLink>
            </div>
        </div>
    );
}
export default NavigationRoute;
