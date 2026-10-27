import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/secretarystyle.css";
import Calendar from "../Ryton/extra/CalendarRyton";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

function getSecretary() {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    return {
        first_name: stored.first_name || "Secretary",
        last_name: stored.last_name || "",
        role: stored.roles?.[0]?.name || "Competition Secretary",
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

function SecretaryDashboard() {
    const navigate = useNavigate();
    const secretary = getSecretary();
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
                console.error("Secretary dashboard load error:", error);
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

    const upcomingCompetitions = useMemo(() => {
        return Array.isArray(homeData?.upcomingCompetitions) ? homeData.upcomingCompetitions : [];
    }, [homeData]);

    const totalCompetitions = useMemo(() => {
        return homeData?.clubSettings?.original?.data?.total_competitions ?? upcomingCompetitions.length;
    }, [homeData, upcomingCompetitions]);

    const remainingDays = useMemo(() => {
        return homeData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days ?? null;
    }, [homeData]);

    const recentSubmissions = useMemo(() => {
        const results = homeData?.latestResults?.original?.data || [];
        return results
            .flatMap((comp) => (comp.competition_members || []).flatMap((m) => (m.entries || []).map((e) => ({ ...e, competitionName: comp.name }))))
            .slice(0, 4);
    }, [homeData]);


    const totalPages = Math.max(Math.ceil((club ? 1 : 0) / rowsPerPage), 1);
    const paginatedClubs = club ? [club] : [];

    const formatEventDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
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
                    <HeaderRoute title="Competition Secretary Dashboard" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <img src={secretary.profile_image || "/placeholder.jpg"} alt={secretary.first_name} style={{ width: '64px', height: '64px', borderRadius: "50%", objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                            <div className="profile-info">
                                                <small className="greeting">{greetingMessage()}</small>
                                                <h2 className="name">{secretary.first_name} {secretary.last_name}</h2>
                                                <p className="role">{secretary.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="stat-card">
                                            <small className="ca-details">Competitions</small>
                                            <h3 className="number">{String(totalCompetitions).padStart(2, "0")}</h3>
                                        </div>
                                        <div className="event-cards">
                                            <small className="ca-details">Next Competition</small>
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <h3 className="number">{remainingDays !== null ? String(remainingDays).padStart(2, "0") : "--"}</h3>
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
                                        <div className="secretary-club-grid" style={{ marginTop: '20px' }}>
                                            {paginatedClubs.map((c) => (
                                                <div className="secretary-club-card" key={c.id}>
                                                    <img src={c.cover_image || "/placeholder.jpg"} alt={c.name} className="club-cover" onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                    <div className="secretary-club-card-body">
                                                        <h3>{c.name}</h3>
                                                        <div className="comp-count">{totalCompetitions} Competitions</div>
                                                        <p>{c.description}</p>
                                                        <div>
                                                            <button type="button" className="btn" id="e-view" onClick={() => navigate(`/secretary/clubs/${c.id}/competitions`)} >
                                                                View
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {totalPages > 1 && (
                                            <div className="dt-paging" style={{ marginTop: '20px', display: "flex", justifyContent: "flex-end" }}>
                                                <nav aria-label="pagination">
                                                    <button className="dt-paging-button previous" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>‹</button>
                                                    {Array.from({ length: totalPages }, (_, i) => (
                                                        <button key={i + 1} className={`dt-paging-button ${currentPage === i + 1 ? "current" : ""}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                                    ))}
                                                    <button className="dt-paging-button next" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>›</button>
                                                </nav>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-4">


                                        <div style={{ background: "#fff", borderRadius: '12px', boxShadow: "0 0 10px rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: '20px' }}>
                                            <Calendar />
                                        </div>

                                        <div style={{ background: "#fff", borderRadius: '12px', boxShadow: "0 0 10px rgba(0,0,0,0.08)", padding: '20px', marginBottom: '20px' }}>
                                            <h5 style={{ color: "#4c4036", marginBottom: '14px' }}>Recent Submissions</h5>
                                            {recentSubmissions.length === 0 && <p style={{ color: "#999" }}>No recent submissions.</p>}
                                            {recentSubmissions.map((entry) => (
                                                <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: '10px', padding: "8px 0", borderBottom: "1px solid #f2eee9" }}>
                                                    <img src={entry.entry_image_url || "/placeholder.jpg"} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: "#4c4036", fontSize: '13px' }}>{entry.entry_image_title}</div>
                                                        <small style={{ color: "#99816b" }}>{entry.competitionName}</small>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ background: "#fff", borderRadius: '12px', boxShadow: "0 0 10px rgba(0,0,0,0.08)", padding: '20px' }}>
                                            <h5 style={{ color: "#4c4036", marginBottom: '14px' }}>Upcoming Competitions</h5>
                                            {upcomingCompetitions.length === 0 && <p style={{ color: "#999" }}>No upcoming competitions.</p>}
                                            {upcomingCompetitions.map((ev) => (
                                                <div key={ev.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f2eee9", cursor: "pointer" }} onClick={() => navigate(`/secretary/competitions/${ev.id}`)} >
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: "#4c4036" }}>{ev.name}</div>
                                                        <small style={{ color: "#99816b" }}>{club?.name}</small>
                                                    </div>
                                                    <div style={{ textAlign: "right", fontSize: '12px', color: "#cc445e" }}>
                                                        {formatEventDate(ev.start_date)}
                                                        <br />
                                                        <span style={{ color: "#99816b" }}>{formatEventTime(ev.start_date)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            <button type="button" className="btn" id="e-view" onClick={() => navigate("/secretary/competitions")} >
                                                View All
                                            </button>
                                        </div>
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

export default SecretaryDashboard;
