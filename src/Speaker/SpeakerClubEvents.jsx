import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/speakerstyle.css";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function SpeakerClubEvents() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;
    const [isLoading, setIsLoading] = useState(true);
    const [homeData, setHomeData] = useState(null);
    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
        async function getClubHome() {
            try {
                const response = await fetch(`${API_BASE}/club/public/home`, {
                    headers: { "Content-Type": "application/json" },
                });
                const json = await response.json();
                return json?.data || {};
            } catch (error) {
                console.error("Speaker club load error:", error);
                return {};
            }
        }
        async function getEvents() {
            try {
                const response = await fetch(`${API_BASE}/events`, {
                    headers: authHeaders(),
                });
                if (!response.ok) throw new Error(`Events API error: ${response.status}`);
                const json = await response.json();
                const list = json?.data?.original?.data;
                return Array.isArray(list) ? list : [];
            } catch (error) {
                console.error("Speaker events load error:", error);
                return [];
            }
        }
        async function load() {
            setIsLoading(true);
            const [home, events] = await Promise.all([getClubHome(), getEvents()]);
            setHomeData(home);
            setAllEvents(events);
            setIsLoading(false);
        }
        load();
    }, []);

    const club = useMemo(() => {
        if (!homeData) return null;
        const clubInfo = homeData?.clubSettings?.original?.data?.club || homeData?.user?.club || {};
        const settings = homeData?.clubSettings?.original?.data?.settings || {};
        return {
            id: homeData?.user?.id ?? 1,
            name: clubInfo.club_name || "My Club",
            cover_image: settings.cover_images?.[0]?.image_medium_url || settings.logo_url || "",
        };
    }, [homeData]);

    const upcomingFromPublic = useMemo(() => {
        return Array.isArray(homeData?.upcomingEvents) ? homeData.upcomingEvents : [];
    }, [homeData]);

    const upcoming = useMemo(() => {
        if (allEvents.length > 0) {
            return allEvents.filter((e) => e.status !== "completed");
        }
        return upcomingFromPublic;
    }, [allEvents, upcomingFromPublic]);

    const completed = useMemo(() => {
        return allEvents.filter((e) => e.status === "completed");
    }, [allEvents]);

    const filteredUpcoming = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return upcoming;
        return upcoming.filter((e) => e.name?.toLowerCase().includes(term));
    }, [upcoming, search]);

    const filteredCompleted = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return completed;
        return completed.filter((e) => e.name?.toLowerCase().includes(term));
    }, [completed, search]);

    const totalPages = Math.max(Math.ceil(filteredCompleted.length / rowsPerPage), 1);
    const paginatedCompleted = filteredCompleted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const formatDate = (date) => {
        if (!date) return "N/A";
        const d = new Date(date);
        if (Number.isNaN(d.getTime())) return "N/A";
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    };

    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute activeClubId={club?.id} onClubChange={() => navigate("/speaker/events")} />
                    <HeaderRoute title="Events" />
                    <div className="content" style={{ background: '#ebe6e1' }}>
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card" id="cl">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting">List of events in the club</small>
                                                <h2 className="name">All Events</h2>
                                                <p className="speaker-breadcrumb">
                                                    {club?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="search-bar d-flex">
                                            <input type="search" className="search-input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="stat-card">
                                            <small className="ca-details">Events</small>
                                            <h3 className="number">{String(upcoming.length + completed.length).padStart(2, "0")}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="card" style={{ border: 'none', boxShadow: '0px 10px 20px 0px #99816B26', padding: '20px', marginBottom: '20px' }}>
                                    <div style={{ boxShadow: '0px 10px 20px 0px #99816B26', height: '59px', borderTopLeftRadius: '10px', marginBottom: '10px', borderTopRightRadius: '10px', background: '#FFFFFF', padding: '10px' }}>
                                        <h5 className="head">Upcoming Events</h5>
                                    </div>
                                    {filteredUpcoming.length === 0 && <p style={{ color: "#999" }}>No upcoming events found.</p>}
                                    <div className="speaker-event-grid" style={{ gap: '30px' }}>
                                        {filteredUpcoming.map((ev) => (
                                            <div className="speaker-event-card" key={ev.id} style={{ width: '318px', height: '468px', opacity: '1', borderRadius: '9.36px', background: '#FFFFFF', border: '0.94px solid #99816B' }}>
                                                <div className="event-cover">
                                                    <img src={ev.featured_medium_url || ev.featured_image_url || club?.cover_image || "/placeholder.jpg"} alt={ev.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} style={{ height: '177px' }} />
                                                </div>
                                                <div className="event-body">
                                                    <h4 style={{ fontSize: '20px', margin: '30px 0' }}>{ev.name}</h4>
                                                    <div className="event-meta-row"><span>Date</span><strong>{formatDate(ev.event_date)}</strong></div>
                                                    {ev.duration && <div className="event-meta-row"><span>Duration</span><strong>{ev.duration}</strong></div>}
                                                    {ev.types?.[0]?.name && <div className="event-meta-row"><span>Event Type</span><strong>{ev.types[0].name}</strong></div>}
                                                    {ev.tags?.[0]?.name && <div className="event-meta-row"><span>Event Tag</span><strong>{ev.tags[0].name}</strong></div>}
                                                    <div className="speaker-event-actions" style={{ marginBottom: '10px' }}>
                                                        <button className="btn" id="e-view" onClick={() => navigate(`/speaker/events/${ev.id}`)}>View</button>
                                                        <button className="btn" id="edit" onClick={() => navigate(`/speaker/events/${ev.id}/edit`)}>Edit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="card" style={{ border: 'none', boxShadow: '0px 10px 20px 0px #99816B26', padding: '20px', marginBottom: '20px' }}>
                                    <div style={{ boxShadow: '0px 10px 20px 0px #99816B26', height: '59px', borderTopLeftRadius: '10px', marginBottom: '10px', borderTopRightRadius: '10px', background: '#FFFFFF', padding: '10px' }}>
                                        <h5 className="head">Completed Events</h5>
                                    </div>
                                    {paginatedCompleted.length === 0 && <p style={{ color: "#999" }}>No completed events found.</p>}
                                    <div className="speaker-event-grid">
                                        {paginatedCompleted.map((ev) => (
                                            <div className="speaker-event-card" key={ev.id} style={{ width: '318px', height: '468px', opacity: '1', borderRadius: '9.36px', background: '#FFFFFF', border: '0.94px solid #99816B' }}>
                                                <div className="event-cover">
                                                    <img src={ev.featured_medium_url || ev.featured_image_url || club?.cover_image || "/placeholder.jpg"} alt={ev.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} style={{ height: '177px' }} />
                                                </div>
                                                <div className="event-body">
                                                    <h4 style={{ fontSize: '20px', margin: '30px 0' }}>{ev.name}</h4>
                                                    <div className="event-meta-row"><span>Date</span><strong>{formatDate(ev.event_date)}</strong></div>
                                                    {ev.duration && <div className="event-meta-row"><span>Duration</span><strong>{ev.duration}</strong></div>}
                                                    {ev.types?.[0]?.name && <div className="event-meta-row"><span>Event Type</span><strong>{ev.types[0].name}</strong></div>}
                                                    <div className="speaker-event-actions" style={{ marginBottom: '10px' }}>
                                                        <button type="button" className="btn" style={{ marginTop: '10px', width: "100%", background: "#99816b", color: "#fff", border: "none", borderRadius: '7px', padding: '10px', cursor: "pointer" }} onClick={() => navigate(`/speaker/events/${ev.id}`)} >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="dt-paging" style={{ marginTop: '18px', display: "flex", justifyContent: "flex-end" }}>
                                            <nav aria-label="pagination">
                                                <button className="dt-paging-button previous" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>‹</button>
                                                {Array.from({ length: totalPages }, (_, i) => (
                                                    <button key={i + 1} className={`dt-paging-button ${currentPage === i + 1 ? "current" : ""}`} onClick={() => setCurrentPage(i + 1)}>
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                <button className="dt-paging-button next" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>›</button>
                                            </nav>
                                        </div>
                                    )}
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
        </>
    );
}

export default SpeakerClubEvents;
