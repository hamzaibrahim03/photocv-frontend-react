import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import NavigationRoute from "../club_admin/NavigationRoute";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const RANK_ORDER = {
    "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
    "C": 10, "H": 11, "I": 12,
};

function mapEntry(raw) {
    const thumbSources = [raw.thumb_url, raw.image_medium_url, raw.image_url].filter(Boolean);
    const positionLabel = raw.my_score?.position ?? null;
    return {
        id: raw.id,
        title: raw.title,
        thumb: thumbSources[0],
        thumbSources,
        member_name: raw.member?.name || "",
        score: raw.my_score?.is_scored ? raw.my_score.score : null,
        award_rank: positionLabel ? RANK_ORDER[positionLabel] ?? null : null,
        award_position: positionLabel,
        comment: raw.my_score?.comment ?? "",
        bookmarked: Boolean(raw.my_score?.is_bookmarked),
    };
}

function handleImageFallback(e, sources) {
    const tried = Number(e.currentTarget.dataset.fallbackIndex || 0) + 1;
    const next = sources?.[tried];
    if (next) {
        e.currentTarget.dataset.fallbackIndex = tried;
        e.currentTarget.src = next;
    } else {
        e.currentTarget.src = "/placeholder.jpg";
    }
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
    const [awardedOnly, setAwardedOnly] = useState(false);
    const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 12;

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
        if (awardedOnly) list = list.filter((e) => e.award_position !== null);
        if (bookmarkedOnly) list = list.filter((e) => e.bookmarked);
        const term = search.trim().toLowerCase();
        if (term) {
            list = list.filter(
                (e) => e.title?.toLowerCase().includes(term) || e.member_name?.toLowerCase().includes(term)
            );
        }
        return [...list].sort((a, b) => {
            if (a.award_rank !== null && b.award_rank !== null) return a.award_rank - b.award_rank;
            if (a.award_rank !== null) return -1;
            if (b.award_rank !== null) return 1;
            return 0;
        });
    }, [entries, filter, search, awardedOnly, bookmarkedOnly]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, search, awardedOnly, bookmarkedOnly]);

    const totalPages = Math.max(Math.ceil(filtered.length / rowsPerPage), 1);
    const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    if (isLoading) {
        return <Loader show={true} />;
    }

    if (!competition) {
        return (
            <div style={{ backgroundColor: 'white' }}>
                <NavigationRoute activeClubId={club?.id} />
                <HeaderRoute title="Season Results" />
                <div className="judge-content" style={{ paddingTop: '25px' }}>
                    <p>Competition not found.</p>
                </div>
            </div>
        );
    }

    const handleBookmark = async (entryId) => {
        const current = entries.find((e) => e.id === entryId);
        const next = !current?.bookmarked;
        setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, bookmarked: next } : e)));
        try {
            await postBookmark(entryId, next);
        } catch (error) {
            console.error("Judge bookmark error:", error);
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
                                        <div className="d-flex gap-2 justify-content-end mt-2">
                                            <button type="button" className={`judge-quick-filter-btn${awardedOnly ? " active" : ""}`} title="Awarded only" onClick={() => setAwardedOnly((v) => !v)} >
                                                <i className={awardedOnly ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                                            </button>
                                            <button type="button" className={`judge-quick-filter-btn${bookmarkedOnly ? " active" : ""}`} title="Bookmarked only" onClick={() => setBookmarkedOnly((v) => !v)} >
                                                <i className={bookmarkedOnly ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-section">
                                    <div className="stat-card" style={{ width: '100%' }}>
                                        <small className="ca-details">Images</small>
                                        <h3 className="number">{entries.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="container" style={{ maxWidth: '1820px' }}>
                            <div className="judge-filter-tabs" style={{ marginTop: '24px' }}>
                                <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
                                <button className={filter === "scored" ? "active" : ""} onClick={() => setFilter("scored")}>Scored</button>
                                <button className={filter === "unscored" ? "active" : ""} onClick={() => setFilter("unscored")}>Unscored</button>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="container" style={{ maxWidth: '1820px' }}>
                            <h5 style={{ color: "#4c4036", marginBottom: '18px' }}>Competition Submissions</h5>
                            {filtered.length === 0 ? (
                                <p style={{ color: "#999", textAlign: "center", padding: '40px' }}>No submissions match these filters.</p>
                            ) : (
                                <div className="judge-submission-grid">
                                    {paginated.map((entry) => (
                                        <div className="judge-submission-card" key={entry.id}>
                                            <div className="thumb-wrap" onClick={() => navigate(`/judge/competitions/${competitionId}/submissions/${entry.id}`)}>
                                                <img src={entry.thumb} alt={entry.title} onError={(e) => handleImageFallback(e, entry.thumbSources)} />
                                                {entry.award_position && <span className="judge-position-badge">🏅 {entry.award_position}</span>}
                                                <button type="button" className={`judge-bookmark-btn${entry.bookmarked ? " active" : ""}`} onClick={(e) => { e.stopPropagation(); handleBookmark(entry.id); }} >
                                                    <i className={entry.bookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                                                </button>
                                            </div>
                                            <div className="card-body" style={{ marginLeft: '0' }}>
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
                                                <button type="button" className="score-cta" onClick={() => navigate(`/judge/competitions/${competitionId}/submissions/${entry.id}`)} >
                                                    {entry.score !== null ? "Edit Score" : "Score"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

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

                        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: '24px' }}> <button type="button" className="btn" style={{ background: "#99816b", color: "#fff", border: "none", borderRadius: '8px', padding: "11px 28px" }} onClick={() => navigate(`/judge/competitions/${competitionId}`)} >
                            Back
                        </button>
                        </div>
                    </section>
                    <footer className="site-footer">
                        <div className="footer-content">
                            <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal </p>
                            <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank">cameraclub.website</a></p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default JudgeCompetitionSubmissions;
