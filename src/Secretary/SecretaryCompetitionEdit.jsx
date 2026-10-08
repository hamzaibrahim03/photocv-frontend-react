import { useEffect, useState } from "react";
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

const STATUS_OPTIONS = ["postponed", "scheduled", "cancelled", "completed", "draft"];

const initialForm = {
    name: "",
    competition_type_id: "",
    description: "",
    judging_type_id: "",
    status: "",
    judging_panel: "",
    voting_method_id: "",
    judging_start_date: "",
    judging_end_date: "",
    result_announcement_date: "",
    top_places: "",
    high_commendation_number: "",
    commendation_number: "",
    prizes: "",
    comments_and_critique: false,
    auto_generate_certificates: false,
    visible_judges_feedback: false,
};

function formatDateTimeForInput(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function SecretaryCompetitionEdit() {
    const navigate = useNavigate();
    const { competitionId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [club, setClub] = useState(null);
    const [competition, setCompetition] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [judgeInput, setJudgeInput] = useState("");

    const judgeNames = form.judging_panel ? form.judging_panel.split(",").map((n) => n.trim()).filter(Boolean) : [];

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
        async function getCompetitionData() {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE}/competitions/${competitionId}`, { headers: authHeaders() });
                if (!response.ok) throw new Error(`Competition API error: ${response.status}`);
                const json = await response.json();
                const existing = json?.data || null;
                setCompetition(existing);
                if (existing) {
                    setForm({
                        name: existing.name || "",
                        competition_type_id: existing.competition_type_id ?? "",
                        description: existing.description || "",
                        judging_type_id: existing.judging_type_id ?? "",
                        status: existing.status || "",
                        judging_panel: existing.judging_panel || "",
                        voting_method_id: existing.voting_method_id ?? "",
                        judging_start_date: formatDateTimeForInput(existing.judging_start_date),
                        judging_end_date: formatDateTimeForInput(existing.judging_end_date),
                        result_announcement_date: formatDateTimeForInput(existing.result_announcement_date),
                        top_places: existing.top_places ?? "",
                        high_commendation_number: existing.high_commendation_number ?? "",
                        commendation_number: existing.commendation_number ?? "",
                        prizes: existing.prizes || "",
                        comments_and_critique: Boolean(existing.comments_and_critique),
                        auto_generate_certificates: Boolean(existing.auto_generate_certificates),
                        visible_judges_feedback: Boolean(existing.visible_judges_feedback),
                    });
                }
            } catch (error) {
                console.error("Secretary competition edit load error:", error);
                setCompetition(null);
            } finally {
                setIsLoading(false);
            }
        }
        if (competitionId) {
            getClub();
            getCompetitionData();
        }
    }, [competitionId]);

    if (isLoading) return <Loader show={true} />;

    if (!competition) {
        return (
            <div style={{ backgroundColor: "#f7f5f2", minHeight: "100vh" }}>
                <NavigationRoute activeClubId={club?.id} />
                <HeaderRoute title="Competition" />
                <div className="secretary-content" style={{ paddingTop: 25 }}>
                    <p>Competition not found.</p>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const addJudge = () => {
        const value = judgeInput.trim();
        if (!value) return;
        const names = [...judgeNames, value];
        setForm((prev) => ({ ...prev, judging_panel: names.join(", ") }));
        setJudgeInput("");
    };

    const removeJudge = (name) => {
        const names = judgeNames.filter((n) => n !== name);
        setForm((prev) => ({ ...prev, judging_panel: names.join(", ") }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                ...competition,
                ...form,
                competition_type_id: form.competition_type_id ? Number(form.competition_type_id) : null,
                judging_type_id: form.judging_type_id ? Number(form.judging_type_id) : null,
                voting_method_id: form.voting_method_id ? Number(form.voting_method_id) : null,
                top_places: form.top_places ? Number(form.top_places) : null,
                high_commendation_number: form.high_commendation_number ? Number(form.high_commendation_number) : null,
                commendation_number: form.commendation_number ? Number(form.commendation_number) : null,
            };
            const response = await fetch(`${API_BASE}/competitions/${competitionId}`, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error(`Save error: ${response.status}`);
            const json = await response.json();
            setCompetition(json?.data || payload);
            navigate(`/secretary/competitions/${competitionId}`);
        } catch (error) {
            console.error("Secretary competition save error:", error);
            alert("Unable to save competition.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <NavigationRoute activeClubId={club?.id} />
            <HeaderRoute title="2024-2025 Season" />
            <div className="secretary-content" style={{ paddingTop: 25 }}>
                <div className="dashboard-card" style={{ width: "100%" }}>
                    <div className="profile-card" style={{ width: "70%" }}>
                        <div className="profile-left">
                            <div className="profile-info">
                                <small className="greeting">{competition.start_date ? new Date(competition.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", weekday: "long" }) : ""}</small>
                                <h2 className="name">{form.name || competition.name}</h2>
                                <p className="secretary-breadcrumb">{club?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 0 10px rgba(0,0,0,0.08)", padding: 30, marginTop: 22 }}>
                    <h5 style={{ color: "#4c4036", marginBottom: 22 }}>Basic Information</h5>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label text-muted">Competition Name</label>
                            <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label text-muted">Competition Type</label>
                            <input type="number" name="competition_type_id" className="form-control" value={form.competition_type_id} onChange={handleChange} />
                        </div>
                    </div>

                    <label className="form-label text-muted">Competition Description</label>
                    <textarea name="description" className="form-control mb-4" style={{ height: 120, resize: "none" }} value={form.description} onChange={handleChange} />

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label text-muted">Judging Type</label>
                            <input type="number" name="judging_type_id" className="form-control" value={form.judging_type_id} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label text-muted">Assign Judge</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Judge name..."
                                    value={judgeInput}
                                    onChange={(e) => setJudgeInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addJudge(); } }}
                                />
                                <button type="button" className="btn" style={{ background: "#4c4036", color: "#fff", border: "none", borderRadius: 8, padding: "0 18px" }} onClick={addJudge}>Add</button>
                            </div>
                            <div className="secretary-judge-pill-row">
                                {judgeNames.map((name) => (
                                    <div className="secretary-judge-pill" key={name}>
                                        {name}
                                        <button type="button" onClick={() => removeJudge(name)}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <label className="form-label text-muted mb-3 d-block">Status</label>
                    <div className="row mb-4">
                        {STATUS_OPTIONS.map((status) => (
                            <div className="col" key={status}>
                                <div className="premium-radio">
                                    <input type="radio" id={`status-${status}`} name="status" value={status} checked={form.status === status} onChange={handleChange} />
                                    <label htmlFor={`status-${status}`}>
                                        <div className="premium-radio-circle"></div>
                                        <div className="premium-radio-content">
                                            <div className="premium-radio-title" style={{ textTransform: "capitalize" }}>{status}</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h5 style={{ color: "#4c4036", margin: "30px 0 22px" }}>Judging &amp; Scoring</h5>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label text-muted">Judging Panel</label>
                            <textarea name="judging_panel" className="form-control" style={{ height: 90, resize: "none" }} value={form.judging_panel} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label text-muted">Voting Method</label>
                            <input type="number" name="voting_method_id" className="form-control" value={form.voting_method_id} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label text-muted">Judging Start Date &amp; Time</label>
                            <input type="datetime-local" name="judging_start_date" className="form-control" value={form.judging_start_date} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label text-muted">Judging End Date &amp; Time</label>
                            <input type="datetime-local" name="judging_end_date" className="form-control" value={form.judging_end_date} onChange={handleChange} />
                        </div>
                    </div>

                    <h5 style={{ color: "#4c4036", margin: "30px 0 22px" }}>Results &amp; Awards</h5>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label text-muted">Announcement Date</label>
                            <input type="datetime-local" name="result_announcement_date" className="form-control" value={form.result_announcement_date} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label text-muted">Awards - Top Places Available</label>
                            <input type="number" name="top_places" className="form-control" value={form.top_places} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label text-muted">Award - Number of High Commendations</label>
                            <input type="number" name="high_commendation_number" className="form-control" value={form.high_commendation_number} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label text-muted">Awards - Number of Commendations</label>
                            <input type="number" name="commendation_number" className="form-control" value={form.commendation_number} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <label className="form-label text-muted">Prizes (if any)</label>
                            <textarea name="prizes" className="form-control" style={{ height: 80, resize: "none" }} value={form.prizes} onChange={handleChange} />
                        </div>
                    </div>

                    <h5 style={{ color: "#4c4036", margin: "30px 0 22px" }}>Additional Features</h5>
                    <div className="d-flex flex-column gap-2 mb-4">
                        <label className="d-flex align-items-center gap-2">
                            <input type="checkbox" name="comments_and_critique" checked={form.comments_and_critique} onChange={handleChange} />
                            Comments &amp; Critique Section (For constructive feedback)
                        </label>
                        <label className="d-flex align-items-center gap-2">
                            <input type="checkbox" name="auto_generate_certificates" checked={form.auto_generate_certificates} onChange={handleChange} />
                            Auto-Generated Certificates (For winners &amp; participants)
                        </label>
                        <label className="d-flex align-items-center gap-2">
                            <input type="checkbox" name="visible_judges_feedback" checked={form.visible_judges_feedback} onChange={handleChange} />
                            Allow feedback from the judges to be visible to the participants
                        </label>
                    </div>

                    <div className="button-group d-flex gap-2" style={{ marginTop: 30 }}>
                        <button type="button" className="btn text-white px-4" style={{ backgroundColor: "#99816b" }} onClick={() => navigate(-1)}>Back</button>
                        <button type="submit" className="btn text-white px-4" style={{ backgroundColor: "#4c4036" }} disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SecretaryCompetitionEdit;
