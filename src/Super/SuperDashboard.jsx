import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import "./assets/css/superstyle.css";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import Calendar from "../Ryton/extra/CalendarRyton";
import apiClient from "../api/axios";
import Image from "../club_admin/assets/icons/dashboard/profile_image.svg";
import Comment from "../club_admin/assets/icons/dashboard/comment.svg";
import Point from "../club_admin/assets/icons/dashboard/point.svg";

const columns = 5;

const hexToRgba = (hex, alpha) => {
    let r = 0,
        g = 0,
        b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r},${g},${b},${alpha})`;
}
const getPositionClass = (index, total) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const lastIndex = total - 1;
    if (index === 0) return "top-left";
    if (row === 0 && col === columns - 1) return "top-right";
    if (row === Math.floor(lastIndex / columns) && col === 0) return "bottom-left";
    if (index === lastIndex) return "bottom-right";
    return "";
}

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function BarChart({ title, data, color, total, totalLabel }) {
    const max = Math.max(...data, 1);
    return (
        <div className="super-panel" style={{ flex: '1', height: '400px', display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '24px' }}>
                <h3 className="head">{title}</h3>
                <button type="button" className="btn" id="e-view">View All</button>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: '16px', flex: '1', paddingBottom: '12px', borderBottom: "1px solid #f0ece7" }}>
                {data.map((v, i) => (
                    <div key={i} style={{ flex: '1', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: v > 0 ? color : "#c9c0b6", marginBottom: '8px' }}>{v}</span>
                        <div style={{ width: "60%", maxWidth: '32px', height: `${Math.max((v / max) * 100, 3)}%`, background: v > 0 ? `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)` : "#eee5dd", borderRadius: '8px', boxShadow: v > 0 ? `0 6px 14px -6px ${color}88` : "none", transition: "height 0.3s ease", }} ></div>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: '16px', marginTop: '10px' }}>
                {WEEK_DAYS.map((d, i) => (
                    <span key={i} style={{ flex: '1', textAlign: "center", fontSize: '12px', fontWeight: '600', color: "#99816b" }}>{d}</span>
                ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: '18px', fontSize: '13px', color: "#4c4036" }}>
                <span style={{ color: "#999" }}>{totalLabel}</span>
                <strong style={{ fontSize: '15px', color }}>{total}</strong>
            </div>
        </div>
    );
}

function SuperDashboard() {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({ photographersCount: 0, imagesCount: 0, commentsCount: 0, likesCount: 0, latestGalleries: [], recentPhotos: [] });
    const [calendarStats, setCalendarStats] = useState({ eventsByDay: [0, 0, 0, 0, 0, 0, 0], competitionsByDay: [0, 0, 0, 0, 0, 0, 0], totalEvents: 0, totalCompetitions: 0 });

    const fetchClubs = async () => {
        try {
            const response = await apiClient.get("/super/clubs");
            const data = response.data?.data || response.data;
            setClubs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading clubs for dashboard:", error);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const response = await apiClient.get("/super/dashboard-stats");
            const data = response.data?.data || response.data;
            setDashboardStats({
                photographersCount: data?.photographersCount ?? 0,
                imagesCount: data?.imagesCount ?? 0,
                commentsCount: data?.commentsCount ?? 0,
                likesCount: data?.likesCount ?? 0,
                latestGalleries: Array.isArray(data?.latestGalleries) ? data.latestGalleries : [],
                recentPhotos: Array.isArray(data?.recentPhotos) ? data.recentPhotos : [],
            });
        } catch (error) {
            console.error("Error loading dashboard stats:", error);
        }
    };

    const fetchDashboardCalendar = async () => {
        try {
            const response = await apiClient.get("/super/dashboard-calendar");
            const data = response.data?.data || response.data;
            setCalendarStats({
                eventsByDay: Array.isArray(data?.eventsByDay) ? data.eventsByDay : [0, 0, 0, 0, 0, 0, 0],
                competitionsByDay: Array.isArray(data?.competitionsByDay) ? data.competitionsByDay : [0, 0, 0, 0, 0, 0, 0],
                totalEvents: data?.totalEvents ?? 0,
                totalCompetitions: data?.totalCompetitions ?? 0,
            });
        } catch (error) {
            console.error("Error loading dashboard calendar stats:", error);
        }
    };

    const { eventsByDay, competitionsByDay, totalEvents: totalEventsThisWeek, totalCompetitions: totalCompetitionsThisWeek } = calendarStats;

    const totalMembers = clubs.reduce((sum, c) => sum + (c.membersCount || 0), 0);
    const hour = new Date().getHours();
    const greetingMessage = () => {
        if (hour >= 5 && hour < 12) return "Good morning!";
        if (hour === 12) return "Good noon!";
        if (hour > 12 && hour < 17) return "Good afternoon!";
        if (hour >= 17 && hour < 21) return "Good evening!";
        return "Good night!";
    };
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        Promise.all([fetchClubs(), fetchDashboardStats(), fetchDashboardCalendar()]).finally(() => {
            setIsLoading(false);
        });
    }, []);
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute />
                        <div className="content" style={{ background: '#ebe6e1' }}>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card" style={{ width: '168%' }}>
                                            <div className="profile-left">
                                                {storedUser.profile_image_url || storedUser.profile_image ? (
                                                    <img className="avatar" src={storedUser.profile_image_url || storedUser.profile_image} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                                                ) : (
                                                    <i className="fa-regular fa-circle-user" style={{ fontSize: '54px', color: "#e5ded7" }}></i>
                                                )}
                                                <div className="profile-info">
                                                    <span className="greeting">
                                                        {greetingMessage()}
                                                    </span>
                                                    <h2 className="name">
                                                        {storedUser.first_name || "Admin"} {storedUser.last_name || ""}
                                                    </h2>
                                                    <p className="role">
                                                        {storedUser.role}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="profile-icons">
                                                <div className="icon">
                                                    <span style={{ color: 'black' }}>{dashboardStats.imagesCount}</span>
                                                    <img src={Image} alt="image-icon" />
                                                </div>
                                                <div className="icon">
                                                    <span style={{ color: 'black' }}>{dashboardStats.commentsCount}</span>
                                                    <img src={Comment} alt="comment-icon" />
                                                </div>
                                                <div className="icon">
                                                    <span style={{ color: 'black' }}>{dashboardStats.likesCount}</span>
                                                    <img src={Point} alt="point-icon" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="row" style={{ gap: '30px', marginBottom: '30px', marginLeft: '5px', marginTop: '20px' }}>
                                        <div className="col-md-2" style={{ width: '23%', height: '204px', borderRadius: '14px', padding: '32.26px 42.04px', gap: '16.62px', background: '#CC445E', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <small style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '28px', color: '#FFFFFF' }}>Clubs</small>
                                            <span style={{ fontFamily: 'Inter', fontWeight: '500', fontStyle: 'Regular', fontSize: '66px', color: '#FFFFFF' }}>{clubs.length}</span>
                                        </div>

                                        <div className="col-md-2" style={{ width: '23%', height: '204px', borderRadius: '14px', padding: '32.26px 42.04px', gap: '16.62px', background: '#4C4036', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <small style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '28px', color: '#FFFFFF' }}>Members</small>
                                            <span style={{ fontFamily: 'Inter', fontWeight: '500', fontStyle: 'Regular', fontSize: '66px', color: '#FFFFFF' }}>{totalMembers}</span>
                                        </div>
                                        <div className="col-md-2" style={{ width: '23%', height: '204px', borderRadius: '14px', padding: '32.26px 42.04px', gap: '16.62px', background: '#CC445E', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <small style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '28px', color: '#FFFFFF' }}>Photographers</small>
                                            <span style={{ fontFamily: 'Inter', fontWeight: '500', fontStyle: 'Regular', fontSize: '66px', color: '#FFFFFF' }}>{dashboardStats.photographersCount}</span>
                                        </div>
                                        <div className="col-md-2" style={{ width: '23%', height: '204px', borderRadius: '14px', padding: '32.26px 42.04px', gap: '16.62px', background: '#4C4036', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <small style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '28px', color: '#FFFFFF' }}>Images</small>
                                            <span style={{ fontFamily: 'Inter', fontWeight: '500', fontStyle: 'Regular', fontSize: '66px', color: '#FFFFFF' }}>{dashboardStats.imagesCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="card" style={{ border: 'none', height: '400px' }}>
                                                <BarChart title="Events" data={eventsByDay} color="#cc445e" total={`${totalEventsThisWeek} events`} totalLabel="Total events this week" />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <BarChart title="Competitions" data={competitionsByDay} color="#4c4036" total={`${totalCompetitionsThisWeek} competitions`} totalLabel="Total competitions this week" />
                                        </div>
                                        <div className="col-md-4">
                                            <Calendar />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="upcoming-section">
                                        <div className="latest-card d-flex flex-column">
                                            <h3 className="head">Latest Clubs</h3>
                                            <div className="row">
                                                {clubs.slice(0, 6).map((c) => (
                                                    <>
                                                        <div className="col-6" key={c.id} onClick={() => navigate(`/super/clubs/${c.id}/members`)}>
                                                            <div className="event-items text-center">
                                                                {c.cover ? (
                                                                    <img className="img-fluid event-img" src={c.cover} alt="Profile" />
                                                                ) : (
                                                                    <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                    </div>
                                                                )}
                                                                <div className="memtext" id="memname">
                                                                    <span>{c.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))}
                                                <div className="button-group">
                                                    <button type="button" className="btn" id="e-view" onClick={() => navigate("/super/clubs")}>View All</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card" style={{ borderRadius: '14px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.04)', marginBottom: '24px' }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", padding: '30px 30px 5px 30px' }}>
                                                <h3 style={{ margin: '0' }} className="head">Latest Club Galleries</h3>
                                                <button type="button" className="btn" id="e-view">View All</button>
                                            </div>
                                            <div className="pics">
                                                {dashboardStats.latestGalleries.map((g, index) => (
                                                    <div key={g.id} className={`pics-items ${getPositionClass(index, dashboardStats.latestGalleries.length)}`}>
                                                        <img src={g.image || "/placeholder.jpg"} alt={g.label} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                        <div className={`pics-infos ${getPositionClass(index, dashboardStats.latestGalleries.length)}`} style={{ backgroundColor: hexToRgba('#7FA483', 0.7) }}>
                                                            {g.club}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="super-panel">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '8px' }}>
                                            <h3 className="head" style={{ margin: '0' }}>Recent Photos</h3>
                                            <span style={{ fontSize: '13px', color: "#4c4036" }}>
                                                <strong>{dashboardStats.imagesCount}</strong> total images
                                            </span>
                                        </div>
                                        <div className="row">
                                            {dashboardStats.recentPhotos.map((g, index) => (
                                                <div key={g.id} className="col-3 p-0">
                                                    <div className="galleriy">
                                                        <div className="galleriy-item">
                                                            <img src={g.image || "/placeholder.jpg"} alt={g.label} style={{ maxHeight: '370px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                            <div className="galleriy-infos" style={{ backgroundColor: index % 2 === 0 ? '#99816b' : '#4c4036', height: '60px', borderRadius: '0px' }}>
                                                                <div className="gal-item d-flex justify-content-between align-items-center w-100">
                                                                    <div className="gal-details">
                                                                        <span>{g.label}</span>
                                                                    </div>
                                                                    <span className="d-flex gap-2 text-white small">
                                                                        <span><i className="fas fa-heart me-1"></i>{g.likes_count || 0}</span>
                                                                        <span><i className="fas fa-comment me-1"></i>{g.comments_count || 0}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank">cameraclub.website</a></p>
                                </div>
                            </footer>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default SuperDashboard;
