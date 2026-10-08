import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/judgestyle.css";
import NavigationRoute from "../club_admin/NavigationRoute";
import Flo from "../club_admin/assets/icons/quick_comp/flower.svg";
import Ima from "../club_admin/assets/icons/quick_comp/image.svg";
import Fax from "../club_admin/assets/icons/quick_comp/fax.svg";
import Pri from "../club_admin/assets/icons/quick_comp/print.svg";
import Pai from "../club_admin/assets/icons/quick_comp/paint.svg";
import Prof from "../club_admin/assets/icons/quick_comp/profile.svg";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// JudgePanelRepository::entryCard() stores the judge's own vote as a numeric
// `position` (1/2/3); the UI works with the "1st"/"2nd"/"3rd" award keys.
const POSITION_TO_KEY = { 1: "1st", 2: "2nd", 3: "3rd" };

// Map the JudgePanelController::submissions() entryCard shape into the flat
// fields this screen's markup expects.
function mapEntry(raw) {
    return {
        id: raw.id,
        title: raw.title,
        image: raw.image_url,
        thumb: raw.thumb_url || raw.image_medium_url || raw.image_url,
        member_name: raw.member?.name || "",
        position: raw.final_position,
        score: raw.my_score?.is_scored ? raw.my_score.score : null,
        award_position: raw.my_score?.position ? POSITION_TO_KEY[raw.my_score.position] ?? null : null,
        comment: raw.my_score?.comment ?? "",
        bookmarked: Boolean(raw.my_score?.is_bookmarked),
    };
}

async function postBookmark(entryId, isBookmarked) {
    const response = await fetch(`${API_BASE}/judge/entry/${entryId}/bookmark`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ is_bookmarked: isBookmarked }),
    });
    if (!response.ok) {
        throw new Error(`Bookmark API error: ${response.status}`);
    }
    return response.json();
}

function JudgeCompetitionSubmissions() {
    const navigate = useNavigate();
    const { competitionId } = useParams();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [isLoading, setIsLoading] = useState(true);
    const [club, setClub] = useState(null);
    const [competition, setCompetition] = useState(null);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        async function getClub() {
            try {
                const response = await fetch(`${API_BASE}/club/public/home`, {
                    headers: { "Content-Type": "application/json" },
                });
                const json = await response.json();
                const data = json?.data || {};
                const clubInfo = data?.clubSettings?.original?.data?.club || data?.user?.club || {};
                setClub({ id: data?.user?.id ?? 1, name: clubInfo.club_name || "My Club" });
            } catch (error) {
                console.error("Judge club load error:", error);
            }
        }
        async function load() {
            setIsLoading(true);
            try {
                // per_page is set high so the grid/filter/navigation behave as if every
                // submission were loaded at once, matching the previous (unpaginated) UX.
                const response = await fetch(`${API_BASE}/judge/competitions/${competitionId}/submissions?per_page=500`, {
                    headers: authHeaders(),
                });
                if (!response.ok) throw new Error(`Submissions API error: ${response.status}`);
                const json = await response.json();
                const payload = json?.data || {};
                const list = payload?.submissions?.data;
                setCompetition(payload?.competition || null);
                setEntries((Array.isArray(list) ? list : []).map(mapEntry));
            } catch (error) {
                console.error("Judge submissions load error:", error);
                setCompetition(null);
                setEntries([]);
            } finally {
                setIsLoading(false);
            }
        }
        if (competitionId) {
            getClub();
            load();
        }
    }, [competitionId]);

    const filtered = useMemo(() => {
        let list = entries;
        if (filter === "scored") list = list.filter((e) => e.score !== null);
        if (filter === "unscored") list = list.filter((e) => e.score === null);
        const term = search.trim().toLowerCase();
        if (term) {
            list = list.filter(
                (e) => e.title?.toLowerCase().includes(term) || e.member_name?.toLowerCase().includes(term)
            );
        }
        return list;
    }, [entries, filter, search]);

    if (isLoading) {
        return <Loader show={true} />;
    }

    if (!competition) {
        return (
            <div style={{ backgroundColor: 'white' }}>
                <NavigationRoute activeClubId={club?.id} />
                <HeaderRoute title="Season Results" />
                <div className="judge-content" style={{ paddingTop: 25 }}>
                    <p>Competition not found.</p>
                </div>
            </div>
        );
    }

    const handleBookmark = async (entryId) => {
        const current = entries.find((e) => e.id === entryId);
        const next = !current?.bookmarked;
        // Optimistic UI update, then persist to the real endpoint.
        setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, bookmarked: next } : e)));
        try {
            await postBookmark(entryId, next);
        } catch (error) {
            console.error("Judge bookmark error:", error);
            // Roll back on failure.
            setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, bookmarked: !next } : e)));
        }
    };

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <NavigationRoute activeClubId={club?.id} />
                <HeaderRoute title="Season Results" />
                <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">Galleries uploaded by Club Members</small>
                                                    <h2 className="name">{competition.name}</h2>
                                                    <p className="role"> {club?.name}</p>
                                                </div>
                                            </div>
                                            <div className="search-bar d-flex justify-content-space-between">
                                                <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                <i className="fas fa-search"></i>
                                            </div>
                                            <div className="e-quick-filter text-end">
                                                <strong>Quick Filter</strong>
                                                <small className="d-block">(Click icons to filter)</small>
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <img src={Pri} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Fax} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Pai} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                </div>
                                                <div className="d-flex gap-2 justify-content-end mt-2">
                                                    <img src={Flo} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Prof} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Ima} alt="icon" style={{ width: '20px', height: '20px' }} />
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
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="judge-filter-tabs" style={{ marginTop: 24 }}>
                                        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
                                        <button className={filter === "scored" ? "active" : ""} onClick={() => setFilter("scored")}>Scored</button>
                                        <button className={filter === "unscored" ? "active" : ""} onClick={() => setFilter("unscored")}>Unscored</button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <h5 style={{ color: "#4c4036", marginBottom: 18 }}>Competition Submissions</h5>
                                    {filtered.length === 0 ? (
                                        <p style={{ color: "#999", textAlign: "center", padding: 40 }}>No submissions match these filters.</p>
                                    ) : (
                                        <div className="judge-submission-grid">
                                            {filtered.map((entry) => (
                                                <div className="judge-submission-card" key={entry.id}>
                                                    <div className="thumb-wrap" onClick={() => navigate(`/judge/competitions/${competitionId}/submissions/${entry.id}`)}>
                                                        <img src={entry.thumb} alt={entry.title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                        {entry.position && <span className="judge-position-badge">🏅 {entry.position}</span>}
                                                        <button
                                                            type="button"
                                                            className={`judge-bookmark-btn${entry.bookmarked ? " active" : ""}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleBookmark(entry.id);
                                                            }}
                                                        >
                                                            <i className={entry.bookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                                                        </button>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="card-title-row">
                                                            <h5>{entry.title}</h5>
                                                            <span className={`judge-status-pill ${entry.score !== null ? "scored" : "unscored"}`}>
                                                                {entry.score !== null ? "Scored" : "Unscored"}
                                                            </span>
                                                        </div>
                                                        <div className="score-label">
                                                            <span>Score (out of 100)</span>
                                                            <span>{entry.score ?? "--"}</span>
                                                        </div>
                                                        <div className="judge-score-progress">
                                                            <span style={{ width: `${entry.score ?? 0}%` }}></span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="score-cta"
                                                            onClick={() => navigate(`/judge/competitions/${competitionId}/submissions/${entry.id}`)}
                                                        >
                                                            {entry.score !== null ? "Edit Score" : "Score"}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 24 }}> <button type="button" className="btn" style={{ background: "#99816b", color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px" }} onClick={() => navigate(`/judge/competitions/${competitionId}`)} >
                                    Back
                                </button>
                                </div>
                            </section>
                        </div>
            </div>
        </>
    );
}

export default JudgeCompetitionSubmissions;
