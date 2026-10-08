import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./assets/css/secretarystyle.css";
import Loader from "../Ryton/extra/LoaderAll";

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
        avatar: j.avatar ?? j.judge_avatar ?? j.profile_image ?? null,
        score: Number(j.score ?? j.judge_score ?? 0),
        maxScore: Number(j.max_score ?? j.out_of ?? 100),
        comment: j.comment ?? j.feedback ?? j.judge_comment ?? "",
    }));
}

function ordinal(n) {
    if (!n) return null;
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

function SecretaryImageLightbox() {
    const navigate = useNavigate();
    const { competitionId, entryId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE}/competition-results/${competitionId}`, { headers: authHeaders() });
                if (!response.ok) throw new Error(`Results API error: ${response.status}`);
                const json = await response.json();
                const list = json?.data?.original?.data;
                setEntries(Array.isArray(list) ? list : []);
            } catch (error) {
                console.error("Secretary lightbox load error:", error);
                setEntries([]);
            } finally {
                setIsLoading(false);
            }
        }
        if (competitionId) load();
    }, [competitionId]);

    const currentIndex = entries.findIndex((e) => String(e.entry_id) === String(entryId));
    const entry = currentIndex >= 0 ? entries[currentIndex] : null;
    const judges = entry ? normalizeJudges(entry) : [];
    const totalScore = judges.reduce((sum, j) => sum + (j.score || 0), 0);
    const totalMax = judges.reduce((sum, j) => sum + (j.maxScore || 0), 0) || 300;
    const positionLabel = ordinal(entry?.position);

    const goToEntry = (targetId) => navigate(`/secretary/competitions/${competitionId}/results/${targetId}`);
    const goPrev = () => { if (currentIndex > 0) goToEntry(entries[currentIndex - 1].entry_id); };
    const goNext = () => { if (currentIndex >= 0 && currentIndex < entries.length - 1) goToEntry(entries[currentIndex + 1].entry_id); };

    if (isLoading) {
        return (
            <div style={{ background: "#000", minHeight: "100vh" }}>
                <Loader show={true} />
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="secretary-lightbox-overlay">
                <div className="secretary-lightbox-topbar">
                    <button type="button" className="secretary-lightbox-back" onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-chevron-left"></i> Back
                    </button>
                </div>
                <div style={{ color: "#fff", textAlign: "center", marginTop: 100 }}>Image not found.</div>
            </div>
        );
    }

    return (
        <div className="secretary-lightbox-overlay">
            <div className="secretary-lightbox-topbar">
                <button type="button" className="secretary-lightbox-back" onClick={() => navigate(`/secretary/competitions/${competitionId}/scores`)}>
                    <i className="fa-solid fa-chevron-left"></i> Back
                </button>
            </div>

            <div className="secretary-lightbox-body">
                <div className="secretary-lightbox-main">
                    <button type="button" className="secretary-lightbox-nav-btn prev" onClick={goPrev} disabled={currentIndex <= 0}>‹</button>
                    <img src={entry.entry_image} alt={entry.entry_image_title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                    <div className="secretary-lightbox-title">{entry.entry_image_title} <span style={{ opacity: 0.7, fontSize: 15 }}>by {entry.member_name}</span></div>
                    <button type="button" className="secretary-lightbox-nav-btn next" onClick={goNext} disabled={currentIndex < 0 || currentIndex >= entries.length - 1}>›</button>

                    {entries.length > 1 && (
                        <div className="secretary-lightbox-thumbs" style={{ width: "100%", justifyContent: "center" }}>
                            {entries.map((thumb) => (
                                <button key={thumb.entry_id} type="button" className={String(thumb.entry_id) === String(entry.entry_id) ? "active" : ""} onClick={() => goToEntry(thumb.entry_id)}>
                                    <img src={thumb.entry_image} alt={thumb.entry_image_title} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="secretary-eval-panel">
                    <div className="head-row">
                        <h3>Judges Evaluation</h3>
                        {positionLabel && <span className="position-badge">🏅 {positionLabel}</span>}
                    </div>
                    <div className="secretary-eval-total">
                        <small>TOTAL SCORE</small>
                        <div className="score">{totalScore}</div>
                        <small style={{ color: "#888" }}>out of {totalMax}</small>
                    </div>
                    {judges.length === 0 ? (
                        <p style={{ color: "#888", fontSize: 14, textAlign: "center", padding: "20px 0" }}>No judge evaluations available for this entry yet.</p>
                    ) : (
                        judges.map((judge) => (
                            <div className="secretary-judge-row" key={judge.id}>
                                <div className="row-top">
                                    <div className="judge-info">
                                        <img className="avatar" src={judge.avatar || "/placeholder.jpg"} alt={judge.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                        <span style={{ fontWeight: 600 }}>{judge.name}</span>
                                    </div>
                                    <span className="score">{judge.score}<span>/{judge.maxScore}</span></span>
                                </div>
                                {judge.comment && <p className="comment">{judge.comment}</p>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default SecretaryImageLightbox;
