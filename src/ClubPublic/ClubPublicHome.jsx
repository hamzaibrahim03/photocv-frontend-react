import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import Loader from "../Ryton/extra/LoaderAll";
import photoLogo from "../club_admin/assets/images/photo.png";
import "./assets/css/clubpublicstyle.css";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

function buildCalendarMatrix(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
}

function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function formatTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.toLocaleDateString("en-US", { weekday: "short" })}. ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} p.m.`;
}

function ClubPublicHome() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [homeData, setHomeData] = useState(null);

    const today = useMemo(() => new Date(), []);
    const [calendarYear, setCalendarYear] = useState(today.getFullYear());
    const [calendarMonth, setCalendarMonth] = useState(today.getMonth());

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE}/club/public/home`, {
                    headers: { "Content-Type": "application/json" },
                });
                const json = await response.json();
                setHomeData(json?.data || {});
            } catch (error) {
                console.error("Club public home load error:", error);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    const club = homeData?.clubSettings?.original?.data?.club || homeData?.user?.club || {};
    const settings = homeData?.clubSettings?.original?.data?.settings || {};
    const clubGalleries = homeData?.clubGalleries?.original?.data || [];
    const upcomingEvents = Array.isArray(homeData?.upcomingEvents) ? homeData.upcomingEvents : [];
    const upcomingCompetitions = Array.isArray(homeData?.upcomingCompetitions) ? homeData.upcomingCompetitions : [];
    const memberGalleries = (homeData?.memberGalleries || []).flatMap((member) =>
        (member.galleries || [])
            .filter((g) => (g.photos || []).length > 0)
            .map((g) => ({ ...g, member }))
    );
    const latestMembers = homeData?.latestMembers?.members || [];
    const clubNews = Array.isArray(homeData?.clubNews) ? homeData.clubNews : [];
    const latestResults = homeData?.latestResults?.original?.data || [];
    const resultPhotos = latestResults
        .flatMap((comp) => (comp.competition_members || []).flatMap((m) => m.entries || []))
        .filter((entry) => entry.entry_image_url)
        .slice(0, 8);

    const recentComments = useMemo(() => {
        return (homeData?.latestInteractions || [])
            .flatMap((item) =>
                (item.comments || []).map((c) => ({
                    ...c,
                    photoTitle: item.title,
                    photoThumb: item.images?.thumb_url,
                }))
            )
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 3);
    }, [homeData]);

    const recentLikedPhotos = useMemo(() => {
        return (homeData?.latestInteractions || [])
            .filter((item) => (item.likes || []).length > 0)
            .slice(0, 6);
    }, [homeData]);

    const calendarCells = useMemo(() => buildCalendarMatrix(calendarYear, calendarMonth), [calendarYear, calendarMonth]);
    const calendarMonthData = useMemo(() => {
        const key = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}`;
        return homeData?.calendar?.[key] || { events: [], competitions: [] };
    }, [homeData, calendarYear, calendarMonth]);

    const markedDays = useMemo(() => {
        const map = {};
        (calendarMonthData.events || []).forEach((ev) => { map[new Date(ev.date).getDate()] = true; });
        (calendarMonthData.competitions || []).forEach((ev) => { map[new Date(ev.date).getDate()] = true; });
        return map;
    }, [calendarMonthData]);

    const changeMonth = (delta) => {
        let year = calendarYear;
        let month = calendarMonth + delta;
        if (month < 0) { month = 11; year -= 1; }
        if (month > 11) { month = 0; year += 1; }
        setCalendarYear(year);
        setCalendarMonth(month);
    };

    const heroImage = settings.cover_images?.[0]?.image_large_url || settings.header_img_url || "";

    return (
        <div className="cp-page">
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <nav className="cp-nav">
                        <img src={photoLogo} alt="photo.cv" className="cp-logo" />
                        <ul className="cp-nav-links">
                            <li><Link to="/club-public" style={{ color: "#cc445e", fontWeight: 700 }}>Home</Link></li>
                            <li><Link to="/rytonevent">Events</Link></li>
                            <li><Link to="/rytoncomp">Competitions</Link></li>
                            <li><Link to="/rytongal">Galleries</Link></li>
                            <li><Link to="/rytonnews">News</Link></li>
                            <li><Link to="/rytonclub">Club</Link></li>
                        </ul>
                        <div className="cp-nav-right">
                            <i className="fa-regular fa-bell"></i>
                            <button type="button" className="cp-btn cp-btn-outline" onClick={() => navigate("/login")}>Login</button>
                        </div>
                    </nav>

                    <section className="cp-hero" style={heroImage ? { backgroundImage: `url(${heroImage})` } : { background: "#4c4036" }}>
                        <div className="cp-hero-content">
                            <h1>{club.club_name || "Camera Club"}</h1>
                            <p className="cp-tagline">{club.about || club.tag_line}</p>
                            <div className="cp-hero-card">
                                <div>
                                    <strong>{club.club_name}</strong>
                                    <div style={{ fontSize: 12.5, opacity: 0.85 }}>{club.tag_line}</div>
                                </div>
                                <div className="cp-social-row">
                                    {settings.fb_link_option ? <a href={settings.fb_link} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a> : null}
                                    {settings.insta_link_option ? <a href={settings.insta_link} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a> : null}
                                    {settings.flickr_link_option ? <a href={settings.flickr_link} target="_blank" rel="noopener noreferrer"><i className="fab fa-flickr"></i></a> : null}
                                </div>
                            </div>
                            <div>
                                <button type="button" className="cp-btn" onClick={() => navigate("/signup")}>Join our club</button>
                            </div>
                        </div>
                    </section>

                    <section className="cp-section">
                        <h2 className="cp-section-title">What makes {club.club_name} different?</h2>
                        <div className="cp-about-grid" style={{ marginTop: 30 }}>
                            <img
                                src={clubGalleries[0]?.photos?.[0]?.medium_url || "/placeholder.jpg"}
                                alt={club.club_name}
                                onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
                            />
                            <p>{club.about || "No description available yet."}</p>
                        </div>
                        <div style={{ marginTop: 26, background: "#cc445e", color: "#fff", borderRadius: 10, padding: "16px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                            <div className="cp-social-row">
                                {settings.fb_link_option ? <a href={settings.fb_link} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a> : null}
                                {settings.insta_link_option ? <a href={settings.insta_link} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a> : null}
                                {settings.flickr_link_option ? <a href={settings.flickr_link} target="_blank" rel="noopener noreferrer"><i className="fab fa-flickr"></i></a> : null}
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <strong>{club.club_name}</strong>
                                <div style={{ fontSize: 12.5, opacity: 0.9 }}>{club.tag_line}</div>
                            </div>
                        </div>
                    </section>

                    <section className="cp-section" style={{ background: "#faf8f6" }}>
                        <div className="cp-section-header-row">
                            <div>
                                <h2 className="cp-section-title" style={{ textAlign: "left", marginBottom: 4 }}>Club Galleries</h2>
                                <p className="cp-section-subtitle" style={{ textAlign: "left", margin: 0 }}>A preview of galleries made up of photographs from club members</p>
                            </div>
                            <Link to="/rytongal/club" className="cp-btn cp-btn-outline">View All Club Galleries</Link>
                        </div>
                        {clubGalleries.length === 0 ? (
                            <p className="cp-empty-note">No club galleries yet.</p>
                        ) : (
                            <div className="cp-gallery-grid">
                                {clubGalleries.slice(0, 10).map((g) => (
                                    <div className="cp-gallery-tile" key={g.gallery_id}>
                                        <img
                                            src={g.photos?.[0]?.thumb_url || "/placeholder.jpg"}
                                            alt={g.gallery_name}
                                            onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
                                        />
                                        <span>{g.gallery_name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="cp-section">
                        <h2 className="cp-section-title">Events &amp; Competitions</h2>
                        <p className="cp-section-subtitle">Upcoming events and competitions on the club calendar</p>
                        <div className="cp-events-columns">
                            <div className="cp-panel">
                                <h4>Upcoming Events</h4>
                                {upcomingEvents.length === 0 && <p className="cp-empty-note">No upcoming events.</p>}
                                {upcomingEvents.slice(0, 5).map((ev) => (
                                    <div className="cp-list-row" key={ev.id}>
                                        <span className="cp-list-name">{ev.name}</span>
                                        <div className="cp-list-date">
                                            {formatDate(ev.event_date)}
                                            <small>{formatTime(ev.event_date)}</small>
                                        </div>
                                    </div>
                                ))}
                                <Link to="/rytonevent" className="cp-btn cp-btn-outline" style={{ marginTop: 14, display: "block", textAlign: "center" }}>View All</Link>
                            </div>

                            <div className="cp-panel">
                                <div className="cp-calendar-head">
                                    <button type="button" onClick={() => changeMonth(-1)} style={{ border: "none", background: "none", cursor: "pointer" }}>‹</button>
                                    <strong>{MONTH_NAMES[calendarMonth]} {calendarYear}</strong>
                                    <button type="button" onClick={() => changeMonth(1)} style={{ border: "none", background: "none", cursor: "pointer" }}>›</button>
                                </div>
                                <div className="cp-calendar-grid">
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                        <div key={i} className="cp-day-label">{d}</div>
                                    ))}
                                    {calendarCells.map((day, i) => {
                                        const isToday = day === today.getDate() && calendarMonth === today.getMonth() && calendarYear === today.getFullYear();
                                        const marked = day && markedDays[day];
                                        return (
                                            <div key={i}>
                                                {day && (
                                                    <div className={`cp-calendar-cell${isToday ? " today" : marked ? " marked" : ""}`}>{day}</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="cp-panel">
                                <h4>Upcoming Competitions</h4>
                                {upcomingCompetitions.length === 0 && <p className="cp-empty-note">No upcoming competitions.</p>}
                                {upcomingCompetitions.slice(0, 5).map((comp) => (
                                    <div className="cp-list-row" key={comp.id}>
                                        <span className="cp-list-name">{comp.name}</span>
                                        <div className="cp-list-date">
                                            {formatDate(comp.start_date)}
                                            <small>{formatTime(comp.start_date)}</small>
                                        </div>
                                    </div>
                                ))}
                                <Link to="/rytoncomp" className="cp-btn cp-btn-outline" style={{ marginTop: 14, display: "block", textAlign: "center" }}>View All</Link>
                            </div>
                        </div>
                    </section>

                    <section className="cp-section" style={{ background: "#faf8f6" }}>
                        <div className="cp-section-header-row">
                            <div>
                                <h2 className="cp-section-title" style={{ textAlign: "left", marginBottom: 4 }}>Member Galleries</h2>
                                <p className="cp-section-subtitle" style={{ textAlign: "left", margin: 0 }}>A preview of galleries uploaded by our amazing photographers</p>
                            </div>
                            <Link to="/rytongal/member" className="cp-btn cp-btn-outline">View All Member Galleries</Link>
                        </div>
                        <div className="cp-members-columns">
                            <div>
                                {memberGalleries.length === 0 ? (
                                    <p className="cp-empty-note">No member galleries yet.</p>
                                ) : (
                                    <div className="cp-gallery-grid">
                                        {memberGalleries.slice(0, 5).map((g) => (
                                            <div className="cp-gallery-tile" key={g.id}>
                                                <img
                                                    src={g.photos?.[0]?.thumb_url || "/placeholder.jpg"}
                                                    alt={g.gallery_name}
                                                    onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
                                                />
                                                <span>{g.gallery_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="cp-panel">
                                <h4>Latest Members</h4>
                                {latestMembers.length === 0 && <p className="cp-empty-note">No members yet.</p>}
                                {latestMembers.slice(0, 6).map((m) => (
                                    <div className="cp-member-row" key={m.id}>
                                        <img src={m.profile_image_url || "/placeholder.jpg"} alt={m.first_name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                        <span>{m.first_name} {m.last_name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="cp-section">
                        <h2 className="cp-section-title">Latest Interactions</h2>
                        <p className="cp-section-subtitle">A preview of comments and reactions on photos across the club website</p>
                        <div className="cp-interactions-columns">
                            <div className="cp-panel">
                                <h4>Recent Comments</h4>
                                {recentComments.length === 0 ? (
                                    <p className="cp-empty-note">No comments yet.</p>
                                ) : (
                                    recentComments.map((c) => (
                                        <div className="cp-comment-row" key={c.id}>
                                            <img src={c.photoThumb || "/placeholder.jpg"} alt={c.photoTitle} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                            <div>
                                                <p className="cp-comment-title">{c.photoTitle}</p>
                                                <p className="cp-comment-text">{c.comment}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="cp-panel">
                                <h4>Recent Likes</h4>
                                {recentLikedPhotos.length === 0 ? (
                                    <p className="cp-empty-note">No likes yet.</p>
                                ) : (
                                    <div className="cp-likes-grid">
                                        {recentLikedPhotos.map((item) => (
                                            <img key={item.id} src={item.images?.thumb_url || "/placeholder.jpg"} alt={item.title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="cp-section" style={{ background: "#faf8f6" }}>
                        <h2 className="cp-section-title">Latest Updates</h2>
                        <p className="cp-section-subtitle">Latest results from club competitions, and news posted on the website</p>
                        <div className="cp-updates-columns">
                            <div className="cp-panel">
                                <h4>Latest News</h4>
                                {clubNews.length === 0 && <p className="cp-empty-note">No news yet.</p>}
                                {clubNews.slice(0, 4).map((n) => (
                                    <div className="cp-news-row" key={n.id}>
                                        <p className="cp-news-title">{n.title}</p>
                                        <small>{formatDate(n.created_at || n.publish_date)}</small>
                                    </div>
                                ))}
                                <Link to="/rytonnews" className="cp-btn cp-btn-outline" style={{ marginTop: 14, display: "block", textAlign: "center" }}>View All</Link>
                            </div>
                            <div>
                                {resultPhotos.length === 0 ? (
                                    <p className="cp-empty-note">No competition results published yet.</p>
                                ) : (
                                    <div className="cp-photo-grid">
                                        {resultPhotos.map((entry) => (
                                            <img key={entry.id} src={entry.entry_image_url} alt={entry.entry_image_title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="cp-cta">
                        <div>
                            <h3>Ready to join {club.club_name}?</h3>
                            <p>Join the club and let's create something amazing together.</p>
                            <button type="button" className="cp-btn" style={{ marginTop: 14 }} onClick={() => navigate("/signup")}>Join Club</button>
                        </div>
                        {(memberGalleries[0]?.photos?.[0]?.medium_url || clubGalleries[1]?.photos?.[0]?.medium_url) && (
                            <img src={memberGalleries[0]?.photos?.[0]?.medium_url || clubGalleries[1]?.photos?.[0]?.medium_url} alt="" style={{ width: 220, height: 140, objectFit: "cover", borderRadius: 10 }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        )}
                    </div>

                    <footer className="cp-footer">
                        <div className="cp-footer-grid">
                            <div>
                                <img src={photoLogo} alt="photo.cv" style={{ height: 26, marginBottom: 14 }} />
                                <h5>About {club.club_name}</h5>
                                <p>{club.about}</p>
                            </div>
                            <div>
                                <h5>Contact</h5>
                                <p>
                                    {club.address}<br />
                                    {club.phone}<br />
                                    {club.email}
                                </p>
                                <h5>Social Links</h5>
                                <p>
                                    {settings.fb_link_option && <>Facebook: {settings.fb_link}<br /></>}
                                    {settings.insta_link_option && <>Instagram: {settings.insta_link}<br /></>}
                                    {settings.flickr_link_option && <>Flickr: {settings.flickr_link}</>}
                                </p>
                            </div>
                        </div>
                        {resultPhotos[0]?.entry_image_url && (
                            <img src={resultPhotos[0].entry_image_url} alt="" style={{ display: "block", width: "100%", maxWidth: 1400, margin: "26px auto 0", height: 160, objectFit: "cover", borderRadius: 10 }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        )}
                        <div className="cp-footer-bottom">
                            Copyright &copy; {new Date().getFullYear()} photo.cv
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
}

export default ClubPublicHome;
