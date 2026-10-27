import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/speakerstyle.css";
import Calendar from "../Ryton/extra/CalendarRyton";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";
function getSpeaker() {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    return {
        first_name: stored.first_name || "Speaker",
        last_name: stored.last_name || "",
        role: stored.roles?.[0]?.name || "Speaker",
        profile_image: stored.profile_image_url || stored.profile_image || "",
    };
}

function greetingMessage() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning!";
    if (hour === 12) return "Good noon!";
    if (hour > 12 && hour < 17) return "Good afternoon!";
    if (hour >= 17 && hour < 21) return "Good evening!";
    return "Good night!";
}

function SpeakerDashboard() {
    const navigate = useNavigate();
    const speaker = getSpeaker();
    const [isLoading, setIsLoading] = useState(true);
    const [homeData, setHomeData] = useState(null);
    const [rowsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function getClubHome() {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE}/club/public/home`, {
                    headers: { "Content-Type": "application/json" },
                });
                const json = await response.json();
                setHomeData(json?.data || {});
            } catch (error) {
                console.error("Speaker dashboard load error:", error);
            } finally {
                setIsLoading(false);
            }
        }
        getClubHome();
    }, []);

    const club = useMemo(() => {
        if (!homeData) return null;
        const clubInfo = homeData?.clubSettings?.original?.data?.club || homeData?.user?.club || {};
        const settings = homeData?.clubSettings?.original?.data?.settings || {};
        return {
            id: homeData?.user?.id ?? 1,
            name: clubInfo.club_name || "My Club",
            description: clubInfo.about || clubInfo.tag_line || "",
            cover_image: settings.cover_images?.[0]?.image_medium_url || settings.logo_url || "",
        };
    }, [homeData]);

    const upcomingEvents = useMemo(() => {
        return Array.isArray(homeData?.upcomingEvents) ? homeData.upcomingEvents : [];
    }, [homeData]);

    const totalEvents = useMemo(() => {
        return upcomingEvents.length;
    }, [upcomingEvents]);

    const remainingDays = useMemo(() => {
        return homeData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days ?? null;
    }, [homeData]);


    const totalPages = Math.max(Math.ceil((club ? 1 : 0) / rowsPerPage), 1);
    const paginatedClubs = club ? [club] : [];

    const formatEventDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    };
    const formatEventTime = (iso) => {
        const d = new Date(iso);
        return `${d.toLocaleDateString("en-US", { weekday: "short" })}. ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} p.m.`;
    };

    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute activeClubId={club?.id} />
                    <HeaderRoute title="Speaker Dashboard" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card" style={{ width: "100%" }}>
                                    <div className="profile-card" style={{ width: "100%" }}>
                                        <div className="profile-left" style={{ display: "flex", alignItems: "center", gap: '16px' }}>
                                            <img src={speaker.profile_image || "/placeholder.jpg"} alt={speaker.first_name} style={{ width: '64px', height: '64px', borderRadius: "50%", objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                            <div className="profile-info">
                                                <small className="greeting">{greetingMessage()}</small>
                                                <h2 className="name">{speaker.first_name} {speaker.last_name}</h2>
                                                <p className="role">{speaker.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="stat-card">
                                            <small className="ca-details">Events</small>
                                            <h3 className="number">{String(totalEvents).padStart(2, "0")}</h3>
                                        </div>
                                        <div className="event-cards">
                                            <small className="ca-details">Next Event</small>
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <h3 className="number">
                                                        {remainingDays !== null ? String(remainingDays).padStart(2, "0") : "--"}
                                                    </h3>
                                                </div>
                                                <div className="days col-md-7">
                                                    <span>days to go</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="row">
                                    <div className="col-md-8">
                                        <section>
                                            <div className="container" style={{ maxWidth: '1820px' }}>
                                                <div className="mt-4">
                                                    <div className="custom-card mb-3 p-3" style={{ marginTop: '20px' }}>
                                                        {paginatedClubs.map((c) => {
                                                            const count = totalEvents;
                                                            return (
                                                                <div className="d-flex gap-3" style={{ flex: '1' }} key={c.id}>
                                                                    <img src={c.cover_image || "/placeholder.jpg"} alt={c.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                                    <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <h3>{c.name}</h3>
                                                                        </div>
                                                                        <div className="event-count">{count} Events</div>
                                                                        <p>{c.description}</p>
                                                                        <div>
                                                                            <button type="button" className="btn" id="e-view" onClick={() => navigate(`/speaker/clubs/${c.id}/events`)} >
                                                                                View
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {totalPages > 1 && (
                                                        <div className="dt-paging" style={{ marginTop: '20px', display: "flex", justifyContent: "flex-end" }}>
                                                            <nav aria-label="pagination">
                                                                <button className="dt-paging-button previous" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} >
                                                                    ‹
                                                                </button>
                                                                {Array.from({ length: totalPages }, (_, i) => (
                                                                    <button key={i + 1} className={`dt-paging-button ${currentPage === i + 1 ? "current" : ""}`} onClick={() => setCurrentPage(i + 1)} >
                                                                        {i + 1}
                                                                    </button>
                                                                ))}
                                                                <button className="dt-paging-button next" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} >
                                                                    ›
                                                                </button>
                                                            </nav>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="col-md-4">
                                        <section>
                                            <div className="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                <div className="calendar-card d-flex flex-column" style={{ width: '100%' }}>
                                                    <Calendar />
                                                </div>
                                                <div id="news">
                                                    <div className="more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }}>
                                                        <h5 className="head">Upcoming Events</h5>
                                                        {upcomingEvents.length === 0 && (
                                                            <p style={{ color: "#999" }}>No upcoming events.</p>
                                                        )}
                                                        {upcomingEvents.map((ev) => (
                                                            <div key={ev.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f2eee9", cursor: "pointer" }} onClick={() => navigate(`/speaker/events/${ev.id}`)} >
                                                                <div>
                                                                    <div style={{ fontWeight: '600', color: "#4c4036" }}>{ev.name}</div>
                                                                    <small style={{ color: "#99816b" }}>{club?.name}</small>
                                                                </div>
                                                                <div style={{ textAlign: "right", fontSize: '12px', color: "#cc445e" }}>
                                                                    {formatEventDate(ev.event_date)}
                                                                    <br />
                                                                    <span style={{ color: "#99816b" }}>{formatEventTime(ev.event_date)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <button type="button" style={{ marginTop: '14px', width: "100%", background: "#99816b", color: "#fff", border: "none", borderRadius: '7px', padding: '10px', cursor: "pointer" }} onClick={() => navigate("/speaker/events")} >
                                                            View All
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
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
            )
            }
        </>
    );
}

export default SpeakerDashboard;
