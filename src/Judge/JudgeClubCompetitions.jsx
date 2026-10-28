import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import NavigationRoute from "../club_admin/NavigationRoute";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function medalIcon(position) {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return "🏅";
}

function JudgeClubCompetitions() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;

    const [isLoading, setIsLoading] = useState(true);
    const [homeData, setHomeData] = useState(null);
    const [upcoming, setUpcoming] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [totalCompetitions, setTotalCompetitions] = useState(0);
    useEffect(() => {
        async function getClubHome() {
            try {
                const response = await fetch(`${API_BASE}/club/public/home`, {
                    headers: { "Content-Type": "application/json" },
                });
                const json = await response.json();
                setHomeData(json?.data || {});
            } catch (error) {
                console.error("Judge competitions load error:", error);
            }
        }
        async function getCompetitions() {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE}/judge/competitions?per_page=100`, {
                    headers: authHeaders(),
                });
                const json = await response.json();
                const data = json?.data || {};
                setUpcoming(Array.isArray(data.upcoming) ? data.upcoming : []);
                setCompleted(Array.isArray(data.completed?.data) ? data.completed.data : []);
                setTotalCompetitions(data.total_competitions || 0);
            } catch (error) {
                console.error("Judge competitions load error:", error);
                setUpcoming([]);
                setCompleted([]);
            } finally {
                setIsLoading(false);
            }
        }
        getClubHome();
        getCompetitions();
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

    const filteredUpcoming = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return upcoming;
        return upcoming.filter((c) => c.name?.toLowerCase().includes(term));
    }, [upcoming, search]);

    const filteredCompleted = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return completed;
        return completed.filter((c) => c.name?.toLowerCase().includes(term));
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
                    <NavigationRoute activeClubId={club?.id} onClubChange={() => navigate("/judge/competitions")} />
                    <HeaderRoute title="Competitions" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card" id="cl">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <img className="img-fluid" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" alt="Profile Picture" />
                                            <div className="profile-info">
                                                <span className="greeting">
                                                    List of competitions in the club
                                                </span>
                                                <h2 className="name">
                                                    All Competitions
                                                </h2>
                                                <p className="role">
                                                    {club?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="search-bar d-flex" style={{ alignItems: "center", gap: '10px' }}>
                                            <input type="search" className="search-input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="stat-card" style={{ width: "100%" }}>
                                            <small className="ca-details">Competitions</small>
                                            <h3 className="number">{String(totalCompetitions).padStart(2, "0")}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="card" style={{ border: 'none', boxShadow: '0px 10px 20px 0px #99816B26', padding: '20px', marginBottom: '20px' }}>
                                    <div style={{ boxShadow: '0px 10px 20px 0px #99816B26', height: '59px', borderTopLeftRadius: '10px', marginBottom: '10px', borderTopRightRadius: '10px', background: '#FFFFFF', padding: '10px' }}>
                                        <h5 className="head">Upcoming Competitions</h5>
                                    </div>
                                    {filteredUpcoming.length === 0 && <p style={{ color: "#999" }}>No upcoming competitions found.</p>}
                                    <div className="judge-comp-grid">
                                        {filteredUpcoming.map((comp) => {
                                            const scored = comp.progress?.scored || 0;
                                            const total = comp.progress?.total || 0;
                                            const pct = total > 0 ? Math.round((scored / total) * 100) : 0;
                                            return (
                                                <div className="judge-comp-card" key={comp.id} style={{ width: '318px', height: '407.8168029785156px', borderRadius: '9.34px', opacity: '1', background: '#FFFFFF', border: '0.6px solid #99816B' }}>
                                                    <div className="comp-cover">
                                                        <img src={comp.featured_image_url || club?.cover_image || "/placeholder.jpg"} alt={comp.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} style={{ width: '317px', height: '177px', marginBottom: '20px' }} />
                                                    </div>
                                                    <div className="comp-body">
                                                        <h4 className="head">{comp.name}</h4>
                                                        <div className="comp-date">{formatDate(comp.start_date)}</div>
                                                        <div className="score-label">
                                                            <span>{scored}/{total} images scored</span>
                                                        </div>
                                                        <div className="judge-score-progress">
                                                            <span style={{ width: `${pct}%` }}></span>
                                                        </div>
                                                        <div className="judge-comp-actions">
                                                            <button className="btn-outline" onClick={() => navigate(`/judge/competitions/${comp.id}`)}>View Details</button>
                                                            <button className="btn-solid" onClick={() => navigate(`/judge/competitions/${comp.id}/submissions`)}>View Submissions</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="card" style={{ border: 'none', boxShadow: '0px 10px 20px 0px #99816B26', padding: '20px', marginBottom: '20px' }}>
                                    <div style={{ boxShadow: '0px 10px 20px 0px #99816B26', height: '59px', borderTopLeftRadius: '10px', marginBottom: '10px', borderTopRightRadius: '10px', background: '#FFFFFF', padding: '10px' }}>
                                        <h5 className="head">Completed Competitions</h5>
                                    </div>
                                    {paginatedCompleted.length === 0 && <p style={{ color: "#999" }}>No completed competitions found.</p>}
                                    <div className="judge-completed-grid">
                                        {paginatedCompleted.map((comp) => {
                                            const winners = (comp.awarded_entries || []).slice(0, 2);
                                            const featured = comp.featured_entry;
                                            return (
                                                <div className="judge-completed-card" key={comp.id} style={{ width: '327.10565185546875px', height: '419.4942932128906px', borderRadius: '9.6px', opacity: '1', background: '#FFFFFF', border: '0.5px solid #99816B' }}>
                                                    <div className="cover-wrap">
                                                        <img src={featured?.image_url || comp.featured_image_url || club?.cover_image || "/placeholder.jpg"} alt={comp.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} style={{ width: '326px', height: '181px' }} />
                                                        {featured && (
                                                            <div className="cover-caption">
                                                                <strong>{featured.title}</strong>
                                                                {featured.member_name && <span>by {featured.member_name}</span>}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h4 className="head" style={{ marginBottom: '50px' }}>{comp.name}</h4>
                                                    {winners.length === 0 && (
                                                        <p style={{ color: "#999", fontSize: '13px', margin: "8px 0 0" }}>No results recorded yet.</p>
                                                    )}
                                                    {winners.map((w) => (
                                                        <div className="judge-winner-row" key={w.id}>
                                                            <img src={w.thumb_url} alt={w.title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                            <div className="winner-info">
                                                                <span>{w.title}</span>
                                                                {w.member_name && <small>by {w.member_name}</small>}
                                                            </div>
                                                            <span className="medal">{medalIcon(w.position)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
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

export default JudgeClubCompetitions;
