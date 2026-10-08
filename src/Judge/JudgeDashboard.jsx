import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/judgestyle.css";
import NavigationRoute from "../club_admin/NavigationRoute";
import Calendar from "../Ryton/extra/CalendarRyton.jsx"

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";


function getJudge() {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    return {
        first_name: stored.first_name || "Judge",
        last_name: stored.last_name || "",
        role: stored.roles?.[0]?.name || "Judge",
        profile_image: stored.profile_image_url || stored.profile_image || "",
    };
}

function JudgeDashboard() {
    const navigate = useNavigate();
    const judge = getJudge();
    const [isLoading, setIsLoading] = useState(true);
    const [homeData, setHomeData] = useState(null);
    const [rowsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    const hour = new Date().getHours();
    const greetingMessage = () => {
        if (hour >= 5 && hour < 12) return "Good morning!";
        if (hour === 12) return "Good noon!";
        if (hour > 12 && hour < 17) return "Good afternoon!";
        if (hour >= 17 && hour < 21) return "Good evening!";
        return "Good night!";
    };
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
                console.error("Judge dashboard load error:", error);
            } finally {
                setIsLoading(false);
            }
        }
        getClubHome();
    }, []);
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    const formatTime = (datetimeStr) => {
        const date = new Date(datetimeStr);
        return date.toLocaleTimeString("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

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
                    <NavigationRoute />
                    <HeaderRoute title="Judging Dashboard" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card" id="cl">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <img className="img-fluid" src={judge.profile_image || "/placeholder.jpg"} alt={judge.first_name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                            <div className="profile-info">
                                                <span className="greeting">
                                                    {greetingMessage()}
                                                </span>
                                                <h2 className="name">
                                                    {judge.first_name} {judge.last_name}
                                                </h2>
                                                <p className="role">
                                                    {judge.role}
                                                </p>
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
                                        <section>
                                            <div className="container" style={{ maxWidth: '1820px' }}>
                                                <div className="mt-4">
                                                    {paginatedClubs.map((c) => {
                                                        const count = totalCompetitions;
                                                        return (
                                                            <div className="judge-club-card" key={c.id}>
                                                                <img src={c.cover_image || "/placeholder.jpg"} alt={c.name} className="club-cover" onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                                <div className="judge-club-card-body">
                                                                    <h3>{c.name}</h3>
                                                                    <div className="comp-count">{count} Competitions</div>
                                                                    <p>{c.description}</p>
                                                                    <div>
                                                                        <button type="button" className="btn" id="e-view" onClick={() => navigate(`/judge/clubs/${c.id}/competitions`)} >
                                                                            View
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {totalPages > 1 && (
                                                        <div className="dt-paging" style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
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
                                                        <h5 className="head">Upcoming Competitions</h5>
                                                        {upcomingCompetitions.length === 0 && (
                                                            <p style={{ color: "#999" }}>No upcoming competitions.</p>
                                                        )}
                                                        {upcomingCompetitions.map((ev) => (
                                                            <div className="event-list">
                                                                <div className="event-item" style={{ marginBottom: '10px' }}>
                                                                    {ev.featured_thumb_url ? (
                                                                        <img className="img-fluid event-img" src={ev.featured_thumb_url} alt="Comp" />
                                                                    ) : (
                                                                        <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                        </div>
                                                                    )}
                                                                    <div className="event-details">
                                                                        <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <span id="ename">{ev.name}</span>
                                                                            <small style={{ color: "#99816b" }}>{club?.name}</small>
                                                                        </div>
                                                                        <div className="event-time" id="edate">
                                                                            <small className="event-date galtext">{formatDate(ev.start_date)}</small><br />
                                                                            <small className="event-time-details galtext">{formatTime(ev.start_date)}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="button-group">
                                                            <button type="button" className="btn" id="e-view" onClick={() => navigate("/judge/competitions")} >
                                                                View All
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div >
                                </div >
                            </div>
                        </section>
                    </div>
                </>
            )
            }
        </>
    );
}

export default JudgeDashboard;
