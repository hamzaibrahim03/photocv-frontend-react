import { NavLink, useNavigate } from "react-router";
import "./assets/css/navbarstyle.css";
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
function NavigationRoute() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const role = storedUser?.roles?.[0]?.name || "";
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };
    return (
        <div className="sidebar">
            {/* Top Logo */}
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
                    <NavLink to="/post" className="nav-link" href="/post">
                        <img src={Post} style={{ width: '20px', height: '20px' }} /> Posts
                    </NavLink>
                    <NavLink to="/plans" className="nav-link" href="/plans">
                        <img src={Plan} style={{ width: '20px', height: '20px' }} /> Plans
                    </NavLink>
                </>
            )}
            <div className="side-divider1"></div>
            <div className="nav-end">
                <NavLink to="/settings" className="nav-link" href="/settings">
                    <img src={Settings} style={{ width: '20px', height: '20px' }} /> Settings
                </NavLink>
                <NavLink to="/logout" className="nav-link" href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    <img src={Logout} style={{ width: '20px', height: '20px' }} /> Logout
                </NavLink>
            </div>
        </div>
    );
}
export default NavigationRoute;
