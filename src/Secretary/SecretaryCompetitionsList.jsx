import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function actionFor(comp) {
    if (comp.status === "scheduled" || comp.status === "draft" || comp.status === "postponed") {
        return { label: "Edit", path: (id) => `/secretary/competitions/${id}/edit` };
    }
    if (comp.status === "completed") {
        return { label: "View Results", path: (id) => `/secretary/competitions/${id}/scores` };
    }
    return { label: "View Submissions", path: (id) => `/secretary/competitions/${id}/results` };
}

function SecretaryCompetitionsList() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [club, setClub] = useState(null);
    const [competitions, setCompetitions] = useState([]);
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [search, setSearch] = useState("");
    const [exportOpen, setExportOpen] = useState(false);
    const [exportFilter, setExportFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    useEffect(() => {
        async function getClub() {
            try {
                const response = await fetch(`${API_BASE}/club/public/home`, { headers: { "Content-Type": "application/json" } });
                const json = await response.json();
                const data = json?.data || {};
                const clubInfo = data?.clubSettings?.original?.data?.club || data?.user?.club || {};
                setClub({ id: data?.user?.id ?? 1, name: clubInfo.club_name || "My Club" });
                setRecentSubmissions(
                    (data?.latestResults?.original?.data || [])
                        .flatMap((comp) => (comp.competition_members || []).flatMap((m) => m.entries || []))
                        .slice(0, 4)
                );
            } catch (error) {
                console.error("Secretary club load error:", error);
            }
        }
        async function getCompetitions() {
            try {
                const response = await fetch(`${API_BASE}/competitions`, { headers: authHeaders() });
                if (!response.ok) throw new Error(`Competitions API error: ${response.status}`);
                const json = await response.json();
                const list = json?.data?.competitions?.original?.data;
                setCompetitions(Array.isArray(list) ? list : []);
            } catch (error) {
                console.error("Secretary competitions load error:", error);
                setCompetitions([]);
            }
        }
        async function load() {
            setIsLoading(true);
            await Promise.all([getClub(), getCompetitions()]);
            setIsLoading(false);
        }
        load();
    }, []);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return competitions;
        return competitions.filter((c) => c.name?.toLowerCase().includes(term));
    }, [competitions, search]);

    const totalPages = Math.max(Math.ceil(filtered.length / rowsPerPage), 1);
    const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const getExportCompetitions = () => {
        if (exportFilter === "upcoming") {
            const now = new Date();
            return competitions.filter((c) => c.start_date && new Date(c.start_date) >= now);
        }
        if (exportFilter === "completed") {
            return competitions.filter((c) => c.status === "completed");
        }
        return competitions;
    };

    const handleExport = () => {
        const toExport = getExportCompetitions();
        if (toExport.length === 0) {
            alert("No competitions to export.");
            return;
        }
        const headers = ["Competition Name", "Competition Date", "Status", "Description"];
        const rows = toExport.map((c) => [
            c.name || "",
            c.start_date ? new Date(c.start_date).toLocaleString() : "",
            c.status || "",
            c.description ? c.description.replace(/<[^>]*>/g, "") : "",
        ]);
        const csvContent = [headers, ...rows]
            .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `competitions-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setExportOpen(false);
    };

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
                    <NavigationRoute activeClubId={club?.id} onClubChange={() => navigate("/secretary/competitions")} />
                    <HeaderRoute title="Competition" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: "1820px" }}>
                                <div className="dashboard-card">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting">List of competitions in the club</small>
                                                <h2 className="name">All Competitions</h2>
                                                <p className="role">{club?.name}</p>
                                            </div>
                                        </div>
                                        <div className="search-bar d-flex" style={{ alignItems: "center", gap: '10px' }}>
                                            <input type="search" className="search-input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="stat-card" style={{ width: '100%' }}>
                                            <small className="ca-details">Competitions</small>
                                            <h3 className="number">{String(competitions.length).padStart(2, "0")}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: "1820px" }}>
                                <div className="row" style={{ marginTop: '22px' }}>
                                    <div className="col-md-8">
                                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: '16px', position: "relative" }} className="secretary-export-dropdown">
                                            <button type="button" className="btn" style={{ background: "#4c4036", color: "#fff", border: "none", borderRadius: '8px', padding: "10px 20px" }} onClick={() => setExportOpen((v) => !v)}>
                                                Export Competitions <i className="fa-solid fa-chevron-down" style={{ marginLeft: '8px' }}></i>
                                            </button>
                                            {exportOpen && (
                                                <div className="secretary-export-menu">
                                                    <div style={{ display: "flex", gap: '10px', marginBottom: '18px' }}>
                                                        {["all", "upcoming", "completed"].map((f) => (
                                                            <button key={f} type="button" className="btn" style={{ textTransform: "capitalize", background: exportFilter === f ? "#4c4036" : "#fff", color: exportFilter === f ? "#fff" : "#4c4036", border: "1px solid #99816b", borderRadius: '7px', padding: "7px 16px" }} onClick={() => setExportFilter(f)} >
                                                                {f}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "flex-end", gap: '10px' }}>
                                                        <button type="button" className="btn" style={{ background: "#99816b", color: "#fff", border: "none", borderRadius: '7px', padding: "9px 18px" }} onClick={() => setExportOpen(false)}>Cancel</button>
                                                        <button type="button" className="btn" style={{ background: "#cc445e", color: "#fff", border: "none", borderRadius: '7px', padding: "9px 18px" }} onClick={handleExport}>Export Now</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {paginated.length === 0 ? (
                                            <p className="secretary-empty-note">No competitions found.</p>
                                        ) : (
                                            <div className="secretary-comp-grid">
                                                {paginated.map((comp) => {
                                                    const action = actionFor(comp);
                                                    return (
                                                        <div className="secretary-comp-card" key={comp.id}>
                                                            <img className="comp-cover" src={comp.featured_medium_url || comp.featured_image_url || "/placeholder.jpg"} alt={comp.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                            <div style={{ flex: '1', display: "flex", flexDirection: "column" }}>
                                                                <h4>{comp.name}</h4>
                                                                <div className="comp-date">{formatDate(comp.start_date)}</div>
                                                                <p style={{ color: "#777", fontSize: '13px', margin: "0 0 10px", display: "-webkit-box", WebkitLineClamp: '2', WebkitBoxOrient: "vertical", overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: comp.description || "" }}></p>
                                                                <div className="comp-actions">
                                                                    <button className="btn-outline" onClick={() => navigate(`/secretary/competitions/${comp.id}`)}>View</button>
                                                                    <button className="btn-solid" onClick={() => navigate(action.path(comp.id))}>{action.label}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

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
                                        <div style={{ background: "#fff", borderRadius: '12px', boxShadow: "0 0 10px rgba(0,0,0,0.08)", padding: '20px' }}>
                                            <h5 style={{ color: "#4c4036", marginBottom: '14px' }}>Recent Submissions</h5>
                                            {recentSubmissions.length === 0 && <p style={{ color: "#999" }}>No recent submissions.</p>}
                                            {recentSubmissions.map((entry) => (
                                                <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: '10px', padding: "8px 0", borderBottom: "1px solid #f2eee9" }}>
                                                    <img src={entry.entry_image_url || "/placeholder.jpg"} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                    <div style={{ fontWeight: '600', color: "#4c4036", fontSize: '14x' }}>{entry.entry_image_title}</div>
                                                </div>
                                            ))}
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
            )}
        </>
    );
}

export default SecretaryCompetitionsList;
