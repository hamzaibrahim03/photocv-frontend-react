import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/secretarystyle.css";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function normalizeJudges(entry) {
    const raw = entry?.judges || entry?.judge_scores || entry?.judges_evaluation || entry?.evaluations || [];
    if (!Array.isArray(raw)) return [];
    return raw.map((j, index) => ({
        id: j.id ?? j.judge_id ?? index,
        name: j.name ?? j.judge_name ?? `Judge ${index + 1}`,
        score: Number(j.score ?? j.judge_score ?? 0),
        maxScore: Number(j.max_score ?? j.out_of ?? 100),
    }));
}

function ordinal(n) {
    if (!n) return null;
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

function SecretaryCompetitionResults() {
    const navigate = useNavigate();
    const { competitionId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [club] = useState(null);
    const [competition, setCompetition] = useState(null);
    const [entries, setEntries] = useState([]);
    const [published, setPublished] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishError, setPublishError] = useState("");

    useEffect(() => {
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
            const [comp, entryList] = await Promise.all([getCompetition(), getEntries()]);
            setCompetition(comp);
            setEntries(entryList);
            setIsLoading(false);
        }
        if (competitionId) load();
    }, [competitionId]);

    const rows = useMemo(() => {
        return entries
            .map((entry) => {
                const judges = normalizeJudges(entry);
                const total = judges.reduce((sum, j) => sum + (j.score || 0), 0);
                const maxTotal = judges.reduce((sum, j) => sum + (j.maxScore || 0), 0) || judges.length * 100;
                return { entry, judges, total, maxTotal };
            })
            .sort((a, b) => b.total - a.total);
    }, [entries]);

    const handlePublish = async () => {
        setIsPublishing(true);
        setPublishError("");
        try {
            const payload = {
                entries: rows.map(({ entry, total }, index) => ({
                    entry_id: entry.entry_id,
                    position: entry.position ?? index + 1,
                    total_score: total,
                })),
                is_published: true,
            };
            const response = await fetch(`${API_BASE}/competition-results/${competitionId}/publish`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify(payload),
            });
            const json = await response.json().catch(() => null);
            if (!response.ok || json?.success === false) {
                throw new Error(json?.message || `Publish failed: ${response.status}`);
            }
            setPublished(true);
            setTimeout(() => setPublished(false), 2000);
        } catch (error) {
            console.error("Secretary publish results error:", error);
            const message = error.message || "Failed to publish results. Please try again.";
            setPublishError(message);
            alert(message);
        } finally {
            setIsPublishing(false);
        }
    };

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
                                        <p className="secretary-breadcrumb">Average {entries.length} images</p>
                                    </div>
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
                    <div className="container">
                        <div style={{ background: "#fff", borderRadius: '12px', boxShadow: "0 0 10px rgba(0,0,0,0.08)", padding: '26px', marginTop: '22px' }}>
                            <h5 style={{ color: "#4c4036", marginBottom: '18px' }}>Competition Results</h5>
                            {rows.length === 0 ? (
                                <p className="secretary-empty-note">No results recorded yet.</p>
                            ) : (
                                <table className="secretary-results-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Title</th>
                                            {[1, 2, 3, 4, 5].map((n) => <th key={n}>Judge {n}</th>)}
                                            <th>Total</th>
                                            <th>Position</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map(({ entry, judges, total, maxTotal }, index) => (
                                            <tr key={entry.entry_id} style={{ cursor: "pointer" }} onClick={() => navigate(`/secretary/competitions/${competitionId}/results/${entry.entry_id}`)}>
                                                <td><img className="row-thumb" src={entry.entry_image} alt={entry.entry_image_title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} /></td>
                                                <td>{entry.entry_image_title}</td>
                                                {[0, 1, 2, 3, 4].map((i) => (
                                                    <td key={i}>{judges[i] ? `${judges[i].score}/${judges[i].maxScore}` : "---"}</td>
                                                ))}
                                                <td>{total}/{maxTotal}</td>
                                                <td>{ordinal(entry.position) || `${index + 1}${index === 0 ? "st" : index === 1 ? "nd" : index === 2 ? "rd" : "th"}`}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: '24px' }}>
                            <button type="button" className="btn" style={{ background: "#99816b", color: "#fff", border: "none", borderRadius: '8px', padding: "11px 28px" }} onClick={() => navigate(-1)}>Back</button>
                            {publishError ? <span style={{ color: "#c0392b" }}>{publishError}</span> : null}
                            <button type="button" className="btn" disabled={isPublishing} style={{ background: "#4c4036", color: "#fff", border: "none", borderRadius: '8px', padding: "11px 28px", opacity: isPublishing ? 0.7 : 1 }} onClick={handlePublish}>
                                {isPublishing ? "Publishing..." : published ? "Published!" : "Publish Results"}
                            </button>
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
    );
}

export default SecretaryCompetitionResults;
