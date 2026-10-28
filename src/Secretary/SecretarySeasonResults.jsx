import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function medalIcon(position) {
    const map = { 1: "🥇", 2: "🥈", 3: "🥉" };
    return map[position] || "🏅";
}

function formatDate(date) {
    if (!date) return "N/A";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function SecretarySeasonResults() {
    const navigate = useNavigate();
    const { competitionId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [club, setClub] = useState(null);
    const [competition, setCompetition] = useState(null);
    const [entries, setEntries] = useState([]);
    const [search, setSearch] = useState("");
    const [activeMember, setActiveMember] = useState(null);
    const [showGalleries, setShowGalleries] = useState(false);
    const [galleryPage, setGalleryPage] = useState(1);
    const galleriesPerPage = 9;

    useEffect(() => {
        async function getClub() {
            try {
                const response = await fetch(`${API_BASE}/club/public/home`, { headers: { "Content-Type": "application/json" } });
                const json = await response.json();
                const data = json?.data || {};
                const clubInfo = data?.clubSettings?.original?.data?.club || data?.user?.club || {};
                setClub({ id: data?.user?.id ?? 1, name: clubInfo.club_name || "My Club" });
            } catch (error) {
                console.error("Secretary club load error:", error);
            }
        }
        async function getCompetition() {
            try {
                const response = await fetch(`${API_BASE}/competitions/${competitionId}`, { headers: authHeaders() });
                if (!response.ok) throw new Error(`Competition API error: ${response.status}`);
                const json = await response.json();
                return json?.data || null;
            } catch (error) {
                console.error("Secretary competition load error:", error);
                return null;
            }
        }
        async function getEntries() {
            try {
                const response = await fetch(`${API_BASE}/competition-results/${competitionId}`, { headers: authHeaders() });
                if (!response.ok) throw new Error(`Results API error: ${response.status}`);
                const json = await response.json();
                const list = json?.data?.original?.data;
                return Array.isArray(list) ? list : [];
            } catch (error) {
                console.error("Secretary results load error:", error);
                return [];
            }
        }
        async function load() {
            setIsLoading(true);
            getClub();
            const [comp, entryList] = await Promise.all([getCompetition(), getEntries()]);
            setCompetition(comp);
            setEntries(entryList);
            setIsLoading(false);
        }
        if (competitionId) load();
    }, [competitionId]);

    const filteredEntries = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return entries;
        return entries.filter((e) => e.member_name?.toLowerCase().includes(term) || e.entry_image_title?.toLowerCase().includes(term));
    }, [entries, search]);

    const groupedResults = useMemo(() => {
        const groups = {};
        filteredEntries.forEach((entry) => {
            const compId = entry.member_comp_id;
            if (!groups[compId]) {
                groups[compId] = {
                    member_comp_id: compId,
                    member_name: entry.member_name,
                    member_title: entry.member_title,
                    member_profile_image: entry.member_profile_image,
                    entries: [],
                };
            }
            groups[compId].entries.push(entry);
        });
        return Object.values(groups);
    }, [filteredEntries]);

    if (isLoading) return <Loader show={true} />;

    return (
        <>
            <NavigationRoute activeClubId={club?.id} />
            <HeaderRoute title="Season Results" />
            <div className="content">
                <section>
                    <div className="container" style={{ maxWidth: '1820px' }}>
                        <div className="dashboard-card">
                            <div className="profile-card">
                                <div className="profile-left">
                                    <div className="profile-info">
                                        <small className="greeting">Galleries uploaded by Club Members</small>
                                        <h2 className="name">{competition?.name || "Season Results"}</h2>
                                        <p className="secretary-breadcrumb">{club?.name}</p>
                                    </div>
                                </div>
                                <div className="search-bar d-flex" style={{ alignItems: "center", gap: '10px' }}>
                                    <input type="search" className="search-input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                    <i className="fas fa-search"></i>
                                </div>
                            </div>
                            <div className="card-section">
                                <div className="stat-card">
                                    <small className="ca-details">Images</small>
                                    <h3 className="number">{entries.length}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container" style={{ maxWidth: '1820px' }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0" }}>
                            <button type="button" className="btn" style={{ background: showGalleries ? "#99816b" : "#4c4036", color: "#fff", border: "none", borderRadius: '8px', padding: "11px 24px" }} onClick={() => setShowGalleries((v) => !v)} >
                                {showGalleries ? "View Submissions by Member" : "View Member Galleries"}
                            </button>
                            <button type="button" className="btn" style={{ background: "#4c4036", color: "#fff", border: "none", borderRadius: '8px', padding: "11px 30px" }} onClick={() => navigate(`/secretary/competitions/${competitionId}/scores`)} >
                                Open for Judging
                            </button>
                        </div>

                        {showGalleries ? (
                            <>
                                <div style={{ background: "#fff", borderRadius: '12px', boxShadow: "0 0 10px rgba(0,0,0,0.08)", padding: '26px' }}>
                                    <h5 style={{ color: "#4c4036", marginBottom: '18px' }}>Member Galleries</h5>
                                    {filteredEntries.length === 0 ? (
                                        <p className="secretary-empty-note">No submissions found.</p>
                                    ) : (
                                        <div className="secretary-gallery-grid">
                                            {filteredEntries.slice((galleryPage - 1) * galleriesPerPage, galleryPage * galleriesPerPage).map((entry) => (
                                                <div className="secretary-gallery-tile" key={entry.entry_id} style={{ background: "#4c4036" }}>
                                                    <img src={entry.entry_image} alt={entry.entry_image_title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                    <div className="info-bar">
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <img className="avatar" src={entry.member_profile_image || "/placeholder.jpg"} alt={entry.member_name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                            <span>{entry.member_name}</span>
                                                        </div>
                                                        {entry.position && <span style={{ fontSize: '18px' }}>{medalIcon(entry.position)}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {Math.ceil(filteredEntries.length / galleriesPerPage) > 1 && (
                                    <div className="dt-paging" style={{ marginTop: '18px', display: "flex", justifyContent: "flex-end" }}>
                                        <nav aria-label="pagination">
                                            {Array.from({ length: Math.ceil(filteredEntries.length / galleriesPerPage) }, (_, i) => (
                                                <button key={i + 1} className={`dt-paging-button ${galleryPage === i + 1 ? "current" : ""}`} onClick={() => setGalleryPage(i + 1)}>{i + 1}</button>
                                            ))}
                                        </nav>
                                    </div>
                                )}
                            </>
                        ) : groupedResults.length === 0 ? (
                            <p className="secretary-empty-note">No submissions found.</p>
                        ) : (
                            <div className="secretary-entry-grid">
                                {groupedResults.map((group) => {
                                    const visibleEntries = group.entries.slice(0, 3);
                                    return (
                                        <div className="secretary-entry-card" key={group.member_comp_id}>
                                            <div className="head-row">
                                                <img className="avatar" src={group.member_profile_image || "/placeholder.jpg"} alt={group.member_name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                <div style={{ flex: '1' }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <h4 style={{ margin: '0px' }}>{group.member_name}</h4>
                                                        <span className="entries-badge">{group.entries.length} {group.entries.length === 1 ? "Entry" : "Entries"}</span>
                                                    </div>
                                                    <small style={{ color: "#99816b" }}>{group.member_title}</small>
                                                </div>
                                            </div>
                                            <div className="thumb-row">
                                                {visibleEntries.map((entry) => (
                                                    <img key={entry.entry_id} src={entry.entry_image} alt={entry.entry_image_title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                ))}
                                            </div>
                                            <button type="button" className="view-all" onClick={() => setActiveMember(group)}>View All Entries</button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: '24px' }}>
                            <button type="button" className="btn" style={{ background: "#99816b", color: "#fff", border: "none", borderRadius: '8px', padding: "11px 28px" }} onClick={() => navigate(`/secretary/competitions/${competitionId}`)}>Back</button>
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

            {activeMember && (
                <div className="secretary-modal-overlay" onClick={() => setActiveMember(null)}>
                    <div className="secretary-modal" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="close-btn" onClick={() => setActiveMember(null)}>×</button>
                        <h2>Entry Details</h2>
                        <p className="secretary-modal-sub">View all submissions for {activeMember.member_name}</p>

                        <label className="field-label">Competition</label>
                        <div className="field-value">{competition?.name}</div>

                        <label className="field-label">Total Entries</label>
                        <div className="field-value">{activeMember.entries.length} Entries</div>

                        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "20px 0" }} />

                        <h5 style={{ color: "#4c4036", marginBottom: '16px' }}>All Submissions</h5>
                        {activeMember.entries.map((entry, index) => (
                            <div className="secretary-submission-row" key={entry.entry_id}>
                                <div className="rank">{index + 1}</div>
                                <div className="meta">
                                    <strong>{entry.entry_image_title}</strong>
                                    <span className="date"><i className="fa-regular fa-calendar"></i> {formatDate(entry.submitted_at || entry.created_at)}</span>
                                </div>
                                <img className="thumb" src={entry.entry_image} alt={entry.entry_image_title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default SecretarySeasonResults;
