import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Loader from "../Ryton/extra/LoaderAll";
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";

const API_BASE =
    "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function normalizeJudges(entry) {
    const raw = entry?.judges ||
        entry?.judge_scores ||
        entry?.judges_evaluation ||
        entry?.evaluations || [];

    if (!Array.isArray(raw)) {
        return [];
    }

    return raw.map((judge, index) => ({
        id: judge.id ?? judge.judge_id ?? index,
        name: judge.name ?? judge.judge_name ?? `Judge ${index + 1}`,
        avatar: judge.avatar ?? judge.judge_avatar ?? judge.profile_image ?? null,
        score: Number(judge.score ?? judge.judge_score ?? 0),
        maxScore: Number(judge.max_score ?? judge.out_of ?? 100),
        comment: judge.comment ?? judge.feedback ?? judge.judge_comment ?? "",
    }));
}

function ordinal(number) {
    if (!number) {
        return null;
    }

    const suffixes = ["th", "st", "nd", "rd"];
    const value = number % 100;

    return `${number}${suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]}`;
}

function SingleEntryJudging() {
    const { id, memberCompId, entryId, } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [memberEntries, setMemberEntries] = useState([]);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const thumbContainer = useRef(null);
    const thumbRefs = useRef([]);

    useEffect(() => {
        let isMounted = true;
        const loadEntries = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${API_BASE}/competition-results/${id}`,
                    {
                        headers: authHeaders(),
                    }
                );
                if (!response.ok) {
                    throw new Error(
                        `Competition API error: ${response.status}`
                    );
                }
                const json = await response.json();
                const data = json?.data?.original?.data;
                const forMember = Array.isArray(data)
                    ? data.filter(
                        (item) =>
                            String(item.member_comp_id) ===
                            String(memberCompId)
                    )
                    : [];
                if (isMounted) {
                    setMemberEntries(forMember);
                }
            } catch (error) {
                console.error(
                    "Single Entry Judging Error:",
                    error
                );
                if (isMounted) {
                    setMemberEntries([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        if (id && memberCompId) {
            loadEntries();
        } else {
            setMemberEntries([]);
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [id, memberCompId]);

    const currentIndex = useMemo(() => {
        return memberEntries.findIndex(
            (item) =>
                String(item.entry_id) ===
                String(entryId)
        );
    }, [memberEntries, entryId]);

    const entry = currentIndex >= 0 ? memberEntries[currentIndex] : null;

    const judges = useMemo(() => normalizeJudges(entry), [entry]);

    const totalScore = judges.reduce(
        (sum, judge) =>
            sum + (Number(judge.score) || 0),
        0
    );

    const totalMax = judges.reduce((sum, judge) => sum + (Number(judge.maxScore) || 0), 0) || 300;

    const positionLabel = ordinal(entry?.position);

    const goToEntry = (targetEntryId) => {
        if (!targetEntryId) {
            return;
        }
        navigate(`/competitions/seasons/${id}/${memberCompId}/${targetEntryId}`);
    };

    const goPrev = () => {
        if (
            currentIndex > 0 &&
            memberEntries[currentIndex - 1]
        ) {
            goToEntry(memberEntries[currentIndex - 1].entry_id);
        }
    };

    const goNext = () => {
        if (
            currentIndex >= 0 &&
            currentIndex <
            memberEntries.length - 1 &&
            memberEntries[currentIndex + 1]
        ) {
            goToEntry(memberEntries[currentIndex + 1].entry_id);
        }
    };

    useEffect(() => {
        if (currentIndex < 0) {
            return;
        }
        const activeThumb = thumbRefs.current[currentIndex];
        const container = thumbContainer.current;
        if (!activeThumb || !container) {
            return;
        }
        const offset = activeThumb.offsetLeft - container.clientWidth / 2 + activeThumb.clientWidth / 2;
        container.scrollTo({
            left: Math.max(0, offset),
            behavior: "smooth",
        });
    }, [currentIndex]);

    useEffect(() => {
        if (!isLightboxOpen) {
            return;
        }
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsLightboxOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isLightboxOpen]);

    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Entry Judging" />
                    <div className="content">
                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                <button type="button" onClick={() => navigate(`/competitions/seasons/${id}/${memberCompId}`)} style={{ display: "flex", alignItems: "center", gap: "10px", background: "transparent", border: "none", color: "#fff", fontSize: "17px", fontWeight: "600", cursor: "pointer", padding: '0', marginBottom: "30px", }} >
                                    <span style={{ fontSize: "20px", }} >
                                        ‹
                                    </span>
                                    Back
                                </button>
                            </div>
                        </section>

                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                {!entry ? (
                                    <div style={{ textAlign: "center", padding: "80px 20px", color: "#ccc", }} >
                                        <h3>
                                            Entry not found
                                        </h3>
                                        <p style={{ color: "#888", }} >
                                            This entry may have been removed or the link is incorrect.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 420px", gap: "40px", alignItems: "start", }} >
                                            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", }} >
                                                <button type="button" onClick={goPrev} disabled={currentIndex <= 0} aria-label="Previous entry" style={{ position: "absolute", left: "-10px", zIndex: '2', background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", width: "44px", height: "44px", borderRadius: "50%", fontSize: "22px", cursor: currentIndex <= 0 ? "default" : "pointer", opacity: currentIndex <= 0 ? 0.3 : 1, }} >
                                                    ‹
                                                </button>
                                                <div onClick={() => setIsLightboxOpen(true)} style={{ width: "100%", maxWidth: "850px", background: "#111", borderRadius: "10px", overflow: "hidden", position: "relative", cursor: "zoom-in", }} >
                                                    <img src={entry.entry_image} alt={entry.entry_image_title || "Competition entry"} style={{ width: "100%", display: "block", maxHeight: "780px", objectFit: "contain", background: "#000", }} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/placeholder.jpg"; }} />
                                                </div>
                                                <button type="button" onClick={goNext} disabled={currentIndex < 0 || currentIndex >= memberEntries.length - 1} aria-label="Next entry" style={{ position: "absolute", right: "-10px", zIndex: '2', background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", width: "44px", height: "44px", borderRadius: "50%", fontSize: "22px", cursor: currentIndex >= memberEntries.length - 1 ? "default" : "pointer", opacity: currentIndex >= memberEntries.length - 1 ? 0.3 : 1, }} >
                                                    ›
                                                </button>
                                            </div>
                                            <div style={{ background: "#1a1a1a", borderRadius: "14px", padding: "26px", }} >
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", gap: "10px", }} >
                                                    <h3 style={{ margin: '0', fontSize: "19px", }} >
                                                        Judges Evaluation
                                                    </h3>

                                                    {positionLabel && (
                                                        <span style={{ background: "#e6a817", color: "#1a1a1a", fontWeight: "700", fontSize: "13px", padding: "5px 12px", borderRadius: "20px", whiteSpace: "nowrap", }} >
                                                            🏅{" "} {positionLabel}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ background: "#242424", borderRadius: "10px", padding: "18px", textAlign: "center", marginBottom: "20px", }} >
                                                    <small style={{ color: "#999", letterSpacing: "1px", fontSize: "12px", }} >
                                                        TOTAL SCORE
                                                    </small>

                                                    <div style={{ fontSize: "38px", fontWeight: "700", color: "#e14d6a", lineHeight: "1.3", }} >
                                                        {totalScore}
                                                    </div>
                                                    <small style={{ color: "#888", }} >
                                                        out of{" "} {totalMax}
                                                    </small>
                                                </div>
                                                {judges.length ===
                                                    0 ? (
                                                    <p style={{ color: "#888", fontSize: "14px", textAlign: "center", padding: "20px 0", }} >
                                                        No judge evaluations available for this entry yet.
                                                    </p>
                                                ) : (
                                                    judges.map((judge) => (
                                                        <div key={judge.id} style={{ background: "#242424", borderRadius: "10px", padding: "16px", marginBottom: "14px", }} >
                                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", }} >
                                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: '0', }} >
                                                                    <img src={judge.avatar || "/placeholder.jpg"} alt={judge.name} style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", flexShrink: '0', }} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/placeholder.jpg"; }} />
                                                                    <span style={{ fontWeight: "600", fontSize: "15px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", }} >
                                                                        {judge.name}
                                                                    </span>
                                                                </div>
                                                                <span style={{ color: "#e14d6a", fontWeight: "700", fontSize: "18px", whiteSpace: "nowrap", }} >
                                                                    {judge.score}
                                                                    <span style={{ color: "#888", fontWeight: "400", fontSize: "13px", }} >
                                                                        / {judge.maxScore}
                                                                    </span>
                                                                </span>
                                                            </div>

                                                            {judge.comment && (
                                                                <p style={{ margin: "10px 0 0", color: "#bbb", fontSize: "13.5px", lineHeight: "1.5", }} >
                                                                    {judge.comment}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "24px", }} >
                                            <img src={entry.member_profile_image || "/placeholder.jpg"} alt={entry.member_name || "Member"} style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", flexShrink: '0', }} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/placeholder.jpg"; }} />
                                            <div style={{ minWidth: '0', }} >
                                                <h2 style={{ margin: '0', fontSize: "22px", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", }} >
                                                    {entry.entry_image_title ||
                                                        "Untitled"}
                                                </h2>
                                                <p style={{ margin: "4px 0 0", color: "#999", }} >
                                                    by{" "} {entry.member_name || "Unknown member"}
                                                </p>
                                            </div>
                                        </div>

                                        {memberEntries.length > 1 && (
                                            <div className="thumbs-wrapper" >
                                                <div className="thumbnails" ref={thumbContainer} >
                                                    {memberEntries.map((thumb, index) => {
                                                        const isActive = String(thumb.entry_id) === String(entryId);
                                                        return (
                                                            <div key={thumb.entry_id} className={`thumb ${index === currentIndex ? "active" : ""}`} onClick={() => goToEntry(thumb.entry_id)} ref={(element) => { thumbRefs.current[index] = element; }} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); goToEntry(thumb.entry_id); } }} style={{ flex: "0 0 auto", width: "140px", height: "100px", borderRadius: "8px", overflow: "hidden", border: isActive ? "2px solid #e14d6a" : "2px solid transparent", opacity: isActive ? 1 : 0.6, padding: '0', cursor: "pointer", background: "#111", transition: "all 0.2s ease", }} >
                                                                <img src={thumb.entry_image || "/placeholder.jpg"} alt={thumb.entry_image_title || `Thumbnail ${index + 1}`} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/placeholder.jpg"; }} className={`rounded cursor-pointer ${index === currentIndex ? "border border-3 border-light" : ""}`} />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </section>
                        <footer className="site-footer">
                            <div className="footer-content">
                                <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal</p>
                            </div>
                        </footer>
                    </div>
                </>
            )}
            {isLightboxOpen && entry && (
                <div onClick={() => setIsLightboxOpen(false)} style={{ position: "fixed", inset: '0', background: "rgba(0,0,0,0.92)", zIndex: '1000', display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", }} >
                    <button type="button" onClick={() => setIsLightboxOpen(false)} aria-label="Close" style={{ position: "absolute", top: "24px", right: "30px", background: "transparent", border: "none", color: "#fff", fontSize: "34px", lineHeight: '1px', cursor: "pointer", zIndex: '2px', }} >
                        ×
                    </button>
                    <img src={entry.entry_image} alt={entry.entry_image_title || "Competition entry"} onClick={(event) => event.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", }} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/placeholder.jpg"; }} />
                </div>
            )}
        </>
    );
}

export default SingleEntryJudging;