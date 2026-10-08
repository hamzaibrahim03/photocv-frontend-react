import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/judgestyle.css";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";
// Local draft cache only: a convenience so an in-progress edit survives a
// refresh before it's saved. The database (via the API calls below) is the
// source of truth for what's actually persisted and shown across sessions/devices.
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

function saveDraftOverlay(entryId, { score, award_position, comment }) {
    try {
        const overlay = loadOverlay();
        overlay[entryId] = {
            score: score === null || score === undefined ? null : Number(score),
            award_position: award_position ?? null,
            comment: comment ?? "",
        };
        localStorage.setItem(OVERLAY_KEY, JSON.stringify(overlay));
    } catch {
        // Best-effort only; the real save already went to the API.
    }
}

// JudgePanelRepository::entryCard() shape -> the flat fields this screen uses.
const POSITION_TO_KEY = { 1: "1st", 2: "2nd", 3: "3rd" };
const KEY_TO_POSITION = { "1st": 1, "2nd": 2, "3rd": 3 };

function mapEntry(raw) {
    return {
        id: raw.id,
        title: raw.title,
        image: raw.image_url,
        thumb: raw.thumb_url || raw.image_medium_url || raw.image_url,
        member_name: raw.member?.name || "",
        score: raw.my_score?.is_scored ? raw.my_score.score : null,
        award_position: raw.my_score?.position ? POSITION_TO_KEY[raw.my_score.position] ?? null : null,
        comment: raw.my_score?.comment ?? "",
        bookmarked: Boolean(raw.my_score?.is_bookmarked),
    };
}

function getJudge() {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    return {
        first_name: stored.first_name || "Judge",
        last_name: stored.last_name || "",
    };
}

const AWARD_POSITIONS = [
    { key: "1st", label: "1st Place", icon: "🏆" },
    { key: "2nd", label: "2nd Place", icon: "🥈" },
    { key: "3rd", label: "3rd Place", icon: "🎖️" },
];

function JudgeImageScoring() {
    const navigate = useNavigate();
    const { competitionId, entryId } = useParams();
    const judge = getJudge();

    const [panelOpen, setPanelOpen] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [competition, setCompetition] = useState(null);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            try {
                // per_page is set high so prev/next navigation and progress counts
                // cover the whole competition, not just one page of results.
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
        if (competitionId) load();
    }, [competitionId]);

    const currentIndex = entries.findIndex((e) => String(e.id) === String(entryId));
    const entry = currentIndex >= 0 ? entries[currentIndex] : null;

    const [scoreValue, setScoreValue] = useState(0);
    const [awardPosition, setAwardPosition] = useState(null);
    const [comment, setComment] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (entry) {
            setScoreValue(entry.score ?? 0);
            setAwardPosition(entry.award_position ?? null);
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
                <div style={{ color: "#fff", textAlign: "center", marginTop: 100 }}>Image not found.</div>
            </div>
        );
    }

    const scoredCount = entries.filter((e) => e.score !== null && e.score !== undefined).length;

    const awardCounts = AWARD_POSITIONS.reduce((acc, pos) => {
        acc[pos.key] = entries.filter((e) => e.award_position === pos.key && String(e.id) !== String(entry.id)).length;
        return acc;
    }, {});

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
            const payload = {
                score: scoreValue,
                comment,
                position: awardPosition ? KEY_TO_POSITION[awardPosition] : null,
            };
            const response = await fetch(`${API_BASE}/judge/entry/${entry.id}/score`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(`Save score API error: ${response.status}`);
            }
            setEntries((prev) =>
                prev.map((e) => (e.id === entry.id ? { ...e, score: scoreValue, award_position: awardPosition, comment } : e))
            );
            saveDraftOverlay(entry.id, { score: scoreValue, award_position: awardPosition, comment });
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
        <div className="judge-lightbox-overlay">
            <div className="judge-lightbox-topbar">
                <button
                    type="button"
                    className="judge-lightbox-back"
                    onClick={() => navigate(`/judge/competitions/${competitionId}/submissions`)}
                >
                    <i className="fa-solid fa-chevron-left"></i> Back
                </button>
                <div style={{ display: "flex", gap: 16 }}>
                    <button type="button" className="judge-lightbox-back" onClick={requestFullscreen} title="Fullscreen">
                        <i className="fa-solid fa-expand"></i>
                    </button>
                    {panelOpen ? (
                        <button type="button" className="judge-lightbox-back" onClick={() => setPanelOpen(false)} title="Close scoring panel">
                            <i className="fa-solid fa-xmark" style={{ fontSize: 22 }}></i>
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="judge-lightbox-back"
                            onClick={() => setPanelOpen(true)}
                            style={{ background: "#cc445e", padding: "8px 18px", borderRadius: 8, fontSize: 14 }}
                        >
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
                    <img src={entry.image} alt={entry.title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                    <div className="judge-lightbox-title">{entry.title}</div>
                    <button
                        type="button"
                        className="judge-lightbox-nav-btn next"
                        onClick={goNext}
                        disabled={currentIndex < 0 || currentIndex >= entries.length - 1}
                    >
                        ›
                    </button>

                    {entries.length > 1 && (
                        <div className="judge-lightbox-thumbs" style={{ width: "100%", justifyContent: "center" }}>
                            {entries.map((thumb) => (
                                <button
                                    key={thumb.id}
                                    type="button"
                                    className={String(thumb.id) === String(entry.id) ? "active" : ""}
                                    onClick={() => goToEntry(thumb.id)}
                                >
                                    <img src={thumb.thumb} alt={thumb.title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                </button>
                            ))}
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
                            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Score (out of 100)</h3>
                            <div className="judge-score-slider-row">
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={scoreValue}
                                    onChange={(e) => setScoreValue(Number(e.target.value))}
                                />
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={scoreValue}
                                    onChange={(e) => setScoreValue(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                                />
                            </div>
                            <div className="judge-score-scale">
                                <span>0</span>
                                <span>{scoreValue}</span>
                                <span>100</span>
                            </div>
                        </div>

                        <div className="judge-score-panel-box">
                            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Award Position</h3>
                            {AWARD_POSITIONS.map((pos) => (
                                <button
                                    key={pos.key}
                                    type="button"
                                    className={`judge-award-btn${awardPosition === pos.key ? " selected" : ""}`}
                                    onClick={() => setAwardPosition((prev) => (prev === pos.key ? null : pos.key))}
                                >
                                    <span>{pos.icon}</span>
                                    {pos.label}
                                    <span className="awarded-count">
                                        ({awardCounts[pos.key] + (awardPosition === pos.key ? 1 : 0)} Awarded)
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="judge-score-panel-box">
                            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Comment</h3>
                            <textarea
                                placeholder="Enter Comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        <div className="judge-score-save-row">
                            <button type="button" className="save-btn" onClick={handleSave} disabled={saving}>
                                <i className="fa-regular fa-floppy-disk"></i>
                                {saving ? "Saving..." : saved ? "Saved!" : "Save Score"}
                            </button>
                            <button
                                type="button"
                                className={`bookmark-toggle${entry.bookmarked ? " active" : ""}`}
                                onClick={handleBookmarkToggle}
                                title="Bookmark"
                            >
                                <i className={entry.bookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default JudgeImageScoring;
