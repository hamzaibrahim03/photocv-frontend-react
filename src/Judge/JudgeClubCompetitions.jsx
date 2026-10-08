import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/judgestyle.css";
import NavigationRoute from "../club_admin/NavigationRoute";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

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
                console.error("Judge competitions load error:", error);
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
            cover_image: settings.cover_images?.[0]?.image_medium_url || settings.logo_url || "",
        };
    }, [homeData]);

    const upcoming = useMemo(() => {
        return Array.isArray(homeData?.upcomingCompetitions) ? homeData.upcomingCompetitions : [];
    }, [homeData]);

    const completed = useMemo(() => {
        const list = homeData?.latestResults?.original?.data;
        return (Array.isArray(list) ? list : []).map((comp) => {
            const winners = (comp.competition_members || [])
                .flatMap((member) => member.entries || [])
                .filter((entry) => entry.position)
                .sort((a, b) => a.position - b.position);
            return { ...comp, winners };
        });
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
                                    <div className="profile-card" style={{ width: '170%' }}>
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
                                        <div className="search-bar d-flex" style={{ alignItems: "center", gap: 10 }}>
                                            <input type="search" className="search-input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="stat-card">
                                            <small className="ca-details">Competitions</small>
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
                                        <h5 className="head">Upcoming Competitions</h5>
                                    </div>
                                    {filteredUpcoming.length === 0 && <p style={{ color: "#999" }}>No upcoming competitions found.</p>}
                                    <div className="judge-comp-grid">
                                        {filteredUpcoming.map((comp) => (
                                            <div className="judge-comp-card" key={comp.id} style={{ width: '318px', height: '407.8168029785156px', borderRadius: '9.34px', opacity: '1', background: '#FFFFFF', border: '0.6px solid #99816B' }}>
                                                <div className="comp-cover">
                                                    <img src={comp.featured_medium_url || comp.featured_image_url || club?.cover_image || "/placeholder.jpg"} alt={comp.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} style={{ width: '317px', height: '177px', marginBottom: '20px' }} />
                                                </div>
                                                <div className="comp-body">
                                                    <h4 className="head">{comp.name}</h4>
                                                    <div className="comp-date">{formatDate(comp.start_date)}</div>
                                                    <div className="judge-comp-actions">
                                                        <button className="btn-outline" onClick={() => navigate(`/judge/competitions/${comp.id}`)}>View Details</button>
                                                        <button className="btn-solid" onClick={() => navigate(`/judge/competitions/${comp.id}/submissions`)}>View Submissions</button>
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
                                        <h5 className="head">Completed Competitions</h5>
                                    </div>
                                    {paginatedCompleted.length === 0 && <p style={{ color: "#999" }}>No completed competitions found.</p>}
                                    <div className="judge-completed-grid">
                                        {paginatedCompleted.map((comp) => {
                                            const winners = comp.winners.slice(0, 2);
                                            return (
                                                <div className="judge-completed-card" key={comp.id} style={{ width: '327.10565185546875px', height: '419.4942932128906px', borderRadius: '9.6px', opacity: '1', background: '#FFFFFF', border: '0.5px solid #99816B' }}>
                                                    <div className="cover-wrap">
                                                        <img src={comp.featured_medium_url || comp.featured_image_url || club?.cover_image || "/placeholder.jpg"} alt={comp.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} style={{ width: '326px', height: '181px' }} />
                                                        {winners[0] && (
                                                            <div className="cover-caption">
                                                                <strong>{winners[0].entry_image_title}</strong>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h4 className="head" style={{ marginBottom: '50px' }}>{comp.name}</h4>
                                                    {winners.length === 0 && (
                                                        <p style={{ color: "#999", fontSize: 13, margin: "8px 0 0" }}>No results recorded yet.</p>
                                                    )}
                                                    {winners.map((w) => (
                                                        <div className="judge-winner-row" key={w.id}>
                                                            <img src={w.entry_image_url} alt={w.entry_image_title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                            <div className="winner-info">
                                                                <span>{w.entry_image_title}</span>
                                                            </div>
                                                            <span className="medal">{medalIcon(w.position)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="dt-paging" style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
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
                    </div>
                </>
            )}
        </>
    );
}

export default JudgeClubCompetitions;
