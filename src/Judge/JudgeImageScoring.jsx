import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Loader from "../Ryton/extra/LoaderAll";
const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";
const OVERLAY_KEY = "judgeScoreOverlay_v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function loadOverlay() {
    try {
        const raw = localStorage.getItem(OVERLAY_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveDraftOverlay(entryId, { score, comment }) {
    try {
        const overlay = loadOverlay();
        overlay[entryId] = {
            score: score === null || score === undefined ? null : Number(score),
            comment: comment ?? "",
        };
        localStorage.setItem(OVERLAY_KEY, JSON.stringify(overlay));
    } catch {
    }
}

function mapEntry(raw) {
    const imageSources = [raw.image_url, raw.image_medium_url, raw.thumb_url].filter(Boolean);
    const thumbSources = [raw.thumb_url, raw.image_medium_url, raw.image_url].filter(Boolean);
    return {
        id: raw.id,
        title: raw.title,
        image: imageSources[0],
        imageSources,
        thumb: thumbSources[0],
        thumbSources,
        member_name: raw.member?.name || "",
        score: raw.my_score?.is_scored ? raw.my_score.score : null,
        award_position: raw.my_score?.position ?? null,
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

function getJudge() {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    return {
        first_name: stored.first_name || "Judge",
        last_name: stored.last_name || "",
    };
}

const ORDINALS = {
    1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th",
    6: "6th", 7: "7th", 8: "8th", 9: "9th",
};

const RANK_ICONS = { 1: "👑", 2: "🏆", 3: "🥉" };

const AWARD_POSITIONS = [
    ...Array.from({ length: 9 }, (_, i) => {
        const n = i + 1;
        return { key: String(n), label: `${ORDINALS[n]} Place`, icon: RANK_ICONS[n] || "🏅" };
    }),
    { key: "C", label: "Commended", icon: "🎖️" },
    { key: "H", label: "Highly Commended", icon: "🥈" },
    { key: "I", label: "Intermediate", icon: "⭐" },
];

function JudgeImageScoring() {
    const navigate = useNavigate();
    const { competitionId, entryId } = useParams();
    const judge = getJudge();

    const [panelOpen, setPanelOpen] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [competition, setCompetition] = useState(null);
    const [entries, setEntries] = useState([]);

    const loadSubmissions = useCallback(async ({ showLoader = true } = {}) => {
        if (showLoader) setIsLoading(true);
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
            if (showLoader) setIsLoading(false);
        }
    }, [competitionId]);

    useEffect(() => {
        if (competitionId) loadSubmissions();
    }, [competitionId, loadSubmissions]);

    const currentIndex = entries.findIndex((e) => String(e.id) === String(entryId));
    const entry = currentIndex >= 0 ? entries[currentIndex] : null;

    const activeThumbRef = useRef(null);
    useEffect(() => {
        activeThumbRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }, [entry?.id]);

    const [scoreValue, setScoreValue] = useState(0);
    const [comment, setComment] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (entry) {
            setScoreValue(entry.score ?? 0);
            setComment(entry.comment ?? "");
            setSaved(false);
        }
    }, [entry?.id]);

    if (isLoading) {
        return <Loader show={true} />;
    }

    if (!competition || !entry) {
        return (
            <div className="judge-lightbox-overlay">
                <div className="judge-lightbox-topbar">
                    <button type="button" className="judge-lightbox-back" onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-chevron-left"></i> Back
                    </button>
                </div>
                <div style={{ color: "#fff", textAlign: "center", marginTop: '100px' }}>Image not found.</div>
            </div>
        );
    }

    const scoredCount = entries.filter((e) => e.score !== null && e.score !== undefined).length;

    const awardCounts = AWARD_POSITIONS.reduce((acc, pos) => {
        acc[pos.key] = entries.filter((e) => e.award_position === pos.key).length;
        return acc;
    }, {});

    const currentAward = AWARD_POSITIONS.find((pos) => pos.key === entry.award_position) || null;

    const goToEntry = (targetId) => {
        navigate(`/judge/competitions/${competitionId}/submissions/${targetId}`);
    };

    const goPrev = () => {
        if (currentIndex > 0) goToEntry(entries[currentIndex - 1].id);
    };

    const goNext = () => {
        if (currentIndex >= 0 && currentIndex < entries.length - 1) goToEntry(entries[currentIndex + 1].id);
    };

    const handleSave = async () => {
        if (!scoreValue || scoreValue < 1) {
            alert("Please set a score of at least 1 before saving.");
            return;
        }
        setSaving(true);
        try {
            const payload = { score: scoreValue, comment };
            const response = await fetch(`${API_BASE}/judge/entry/${entry.id}/score`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(`Save score API error: ${response.status}`);
            }
            await loadSubmissions({ showLoader: false });
            saveDraftOverlay(entry.id, { score: scoreValue, comment });
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
        } catch (error) {
            console.error("Judge save score error:", error);
            alert("Unable to save score.");
        } finally {
            setSaving(false);
        }
    };

    const handleBookmarkToggle = async () => {
        const next = !entry.bookmarked;
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, bookmarked: next } : e)));
        try {
            const response = await fetch(`${API_BASE}/judge/entry/${entry.id}/bookmark`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ is_bookmarked: next }),
            });
            if (!response.ok) {
                throw new Error(`Bookmark API error: ${response.status}`);
            }
        } catch (error) {
            console.error("Judge bookmark error:", error);
            setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, bookmarked: !next } : e)));
        }
    };

    const requestFullscreen = () => {
        const el = document.querySelector(".judge-lightbox-overlay");
        if (el?.requestFullscreen) el.requestFullscreen();
    };

    return (
        <>
            <div className="judge-lightbox-overlay">
                <div className="judge-lightbox-topbar">
                    <button type="button" className="judge-lightbox-back" onClick={() => navigate(`/judge/competitions/${competitionId}/submissions`)} >
                        <i className="fa-solid fa-chevron-left"></i> Back
                    </button>
                    <div style={{ display: "flex", gap: '16px' }}>
                        <button type="button" className="judge-lightbox-back" onClick={requestFullscreen} title="Fullscreen">
                            <i className="fa-solid fa-expand"></i>
                        </button>
                        {panelOpen ? (
                            <button type="button" className="judge-lightbox-back" onClick={() => setPanelOpen(false)} title="Close scoring panel">
                                <i className="fa-solid fa-xmark" style={{ fontSize: '22px' }}></i>
                            </button>
                        ) : (
                            <button type="button" className="judge-lightbox-back" onClick={() => setPanelOpen(true)} style={{ background: "#cc445e", padding: "8px 18px", borderRadius: '8px', fontSize: '14px' }} >
                                <i className="fa-solid fa-star"></i> Score this image
                            </button>
                        )}
                    </div>
                </div>

                <div className="judge-lightbox-body">
                    <div className="judge-lightbox-main">
                        <button type="button" className="judge-lightbox-nav-btn prev" onClick={goPrev} disabled={currentIndex <= 0}>
                            ‹
                        </button>
                        <img key={entry.id} src={entry.image} alt={entry.title} onError={(e) => handleImageFallback(e, entry.imageSources)} />
                        <div className="judge-lightbox-title">{entry.title}</div>
                        <button type="button" className="judge-lightbox-nav-btn next" onClick={goNext} disabled={currentIndex < 0 || currentIndex >= entries.length - 1} >
                            ›
                        </button>

                        {entries.length > 1 && (
                            <div className="judge-lightbox-thumbs" style={{ width: "100%", justifyContent: "center" }}>
                                {entries.map((thumb) => {
                                    const isActive = String(thumb.id) === String(entry.id);
                                    return (
                                        <button key={thumb.id} type="button" className={isActive ? "active" : ""} ref={isActive ? activeThumbRef : null} onClick={() => goToEntry(thumb.id)} >
                                            <img src={thumb.thumb} alt={thumb.title} onError={(e) => handleImageFallback(e, thumb.thumbSources)} />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {panelOpen && (
                        <div className="judge-score-panel">
                            <div className="judge-score-panel-box">
                                <h3>{judge.first_name} {judge.last_name}</h3>
                                <div className="progress-text">Progress: {scoredCount}/{entries.length} images scored</div>
                            </div>

                            <div className="judge-score-panel-box">
                                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Score (out of 100)</h3>
                                <div className="judge-score-slider-row">
                                    <input type="range" min={0} max={100} value={scoreValue} onChange={(e) => setScoreValue(Number(e.target.value))} />
                                </div>
                                <div className="judge-score-scale">
                                    <span>0</span>
                                    <span>{scoreValue}</span>
                                    <span>100</span>
                                </div>
                                <div className="judge-score-slider-row">
                                    <input type="number" min={0} max={100} value={scoreValue} onChange={(e) => setScoreValue(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} style={{ width: '400px' }} />
                                </div>
                            </div>

                            <div className="judge-score-panel-box">
                                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Award Position</h3>
                                <div className="progress-text" style={{ marginBottom: '12px' }}>
                                    Ranked automatically by score - highest scores win 1st, down through 9th, then C / H / I.
                                </div>
                                <div className="judge-award-grid">
                                    {AWARD_POSITIONS.map((pos) => (
                                        <div key={pos.key} className={`judge-award-btn${currentAward?.key === pos.key ? " selected" : ""}`}>
                                            <span className="judge-award-icon">{pos.icon}</span>
                                            <span className="judge-award-label">{pos.label}</span>
                                            <span className="awarded-count">({awardCounts[pos.key]} Awarded)</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="judge-score-panel-box">
                                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Comment</h3>
                                <textarea placeholder="Enter Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                            </div>

                            <div className="judge-score-save-row">
                                <button type="button" className="save-btn" onClick={handleSave} disabled={saving}>
                                    <i className="fa-regular fa-floppy-disk"></i>
                                    {saving ? "Saving..." : saved ? "Saved!" : "Save Score"}
                                </button>
                                <button type="button" className={`bookmark-toggle${entry.bookmarked ? " active" : ""}`} onClick={handleBookmarkToggle} title="Bookmark" >
                                    <i className={entry.bookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <footer className="judge-lightbox-footer">
                    <p>Copyright &copy; 2025 – rytonlocal </p>
                    <p>Powered by <a href="https://cameraclub.website" target="_blank" rel="noreferrer">cameraclub.website</a></p>
                </footer>
            </div>
        </>
    );
}

export default JudgeImageScoring;
