import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/judgestyle.css";
import NavigationRoute from "../club_admin/NavigationRoute";
import Calendar from "../Ryton/extra/CalendarRyton.jsx"

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function JudgeDashboard() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const hour = new Date().getHours();
    const greetingMessage = () => {
        if (hour >= 5 && hour < 12) return "Good morning!";
        if (hour === 12) return "Good noon!";
        if (hour > 12 && hour < 17) return "Good afternoon!";
        if (hour >= 17 && hour < 21) return "Good evening!";
        return "Good night!";
    };
    useEffect(() => {
        async function getDashboard() {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE}/judge/dashboard?page=${currentPage}&per_page=4`, {
                    headers: authHeaders(),
                });
                const json = await response.json();
                const data = json?.data || {};
                setDashboardData(data);
                setClubs(Array.isArray(data.clubs?.data) ? data.clubs.data : []);
                setTotalPages(data.clubs?.last_page || 1);
            } catch (error) {
                console.error("Judge dashboard load error:", error);
                setDashboardData(null);
                setClubs([]);
            } finally {
                setIsLoading(false);
            }
        }
        getDashboard();
    }, [currentPage]);

    const judge = {
        first_name: dashboardData?.judge?.first_name || "Judge",
        last_name: dashboardData?.judge?.last_name || "",
        role: dashboardData?.judge?.role_label || "Judge",
        profile_image: dashboardData?.judge?.profile_image_url || "",
    };

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

    const upcomingCompetitions = dashboardData?.upcoming_competitions || [];
    const totalCompetitions = dashboardData?.stats?.competitions_count ?? 0;
    const remainingDays = dashboardData?.stats?.next_competition_days ?? null;

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
                                                    {clubs.map((c) => (
                                                        <div key={c.id} className="custom-card mb-3">
                                                            <div className="d-flex gap-3" style={{ flex: '1' }}>
                                                                <img src={c.image_url || c.logo_url || "/placeholder.jpg"} alt={c.club_name} />
                                                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                                                    <div>
                                                                        <div className="d-flex justify-content-between align-items-start">
                                                                            <h3>{c.club_name}</h3>
                                                                        </div>
                                                                        <p className="role">
                                                                            {c.competitions_count} Competitions
                                                                        </p>
                                                                        <p className="text-secondary" dangerouslySetInnerHTML={{ __html: c.about || 'No description provided.' }}>
                                                                        </p>
                                                                        <div className="d-flex justify-content-between align-items-center mt-3 w-100">
                                                                            <div className="button-group d-flex align-items-center">
                                                                                <button className="btn" id="e-view" onClick={() => navigate(`/judge/clubs/${c.id}/competitions`)}>View</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

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
                                                        <h5 className="head">Upcoming Competitions</h5>
                                                        {upcomingCompetitions.length === 0 && (
                                                            <p style={{ color: "#999" }}>No upcoming competitions.</p>
                                                        )}
                                                        {upcomingCompetitions.map((ev) => (
                                                            <div className="event-list" key={ev.id}>
                                                                <div className="event-item" style={{ marginBottom: '10px' }}>
                                                                    {ev.featured_image_url ? (
                                                                        <img className="img-fluid event-img" src={ev.featured_image_url} alt="Comp" />
                                                                    ) : (
                                                                        <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                        </div>
                                                                    )}
                                                                    <div className="event-details">
                                                                        <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <span id="ename">{ev.name}</span>
                                                                            <small style={{ color: "#99816b" }}>{ev.club?.club_name}</small>
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

export default JudgeDashboard;
