import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/judgestyle.css";
import NavigationRoute from "../club_admin/NavigationRoute";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const STATUS_OPTIONS = ["postponed", "scheduled", "cancelled", "completed", "draft"];

function JudgeCompetitionEdit() {
    const navigate = useNavigate();
    const { competitionId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [club, setClub] = useState(null);
    const [competition, setCompetition] = useState(null);
    const [form, setForm] = useState({ name: "", competition_type_id: "", description: "", status: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [search, setSearch] = useState("");

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
        async function getCompetitionData() {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE}/judge/competitions/${competitionId}`, {
                    headers: authHeaders(),
                });
                if (!response.ok) {
                    throw new Error(`Competition API error: ${response.status}`);
                }
                const json = await response.json();
                const existing = json?.data || null;
                setCompetition(existing);
                if (existing) {
                    setForm({
                        name: existing.name || "",
                        competition_type_id: existing.competition_type_id ?? "",
                        description: existing.description || "",
                        status: existing.status || "",
                    });
                }
            } catch (error) {
                console.error("Judge competition edit load error:", error);
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

    if (isLoading) {
        return <Loader show={true} />;
    }

    if (!competition) {
        return (
            <div style={{ backgroundColor: 'white' }}>
                <NavigationRoute activeClubId={club?.id} />
                <HeaderRoute title="Competition" />
                <div className="judge-content" style={{ paddingTop: 25 }}>
                    <p>Competition not found.</p>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // The judge endpoint only accepts these four "Basic Information" fields
            // (see JudgeCompetitionUpdateRequest) — anything else is ignored/validated out.
            const payload = {
                name: form.name,
                competition_type_id: form.competition_type_id ? Number(form.competition_type_id) : null,
                description: form.description,
                status: form.status,
            };
            const response = await fetch(`${API_BASE}/judge/competitions/${competitionId}`, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(`Competition save error: ${response.status}`);
            }
            const json = await response.json();
            setCompetition(json?.data || payload);
            navigate(`/judge/competitions/${competitionId}`);
        } catch (error) {
            console.error("Judge competition save error:", error);
            alert("Unable to save competition.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute activeClubId={club?.id} />
                    <HeaderRoute title="2024-2025 Season" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card" id="cl">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting">{competition.start_date ? new Date(competition.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", weekday: "long" }) : ""}</small>
                                                <h2 className="name">{form.name || competition.name}</h2>
                                                <p className="role">{club?.name}</p>
                                            </div>
                                        </div>
                                        <div className="search-bar d-flex justify-content-space-between">
                                            <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>

                                <form onSubmit={handleSave} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 0 10px rgba(0,0,0,0.08)", padding: 30, marginTop: 22 }}>
                                    <h5 className="head" style={{ color: "#4c4036", marginBottom: 22 }}>Basic Information</h5>
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label text-muted">Competition Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted">Competition Type</label>
                                            <input
                                                type="number"
                                                name="competition_type_id"
                                                className="form-control"
                                                value={form.competition_type_id}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <label className="form-label text-muted">Competition Description</label>
                                    <textarea
                                        name="description"
                                        className="form-control mb-4"
                                        style={{ height: 160, resize: "none" }}
                                        placeholder="Text here..."
                                        value={form.description}
                                        onChange={handleChange}
                                    />

                                    <label className="form-label text-muted mb-3 d-block">Status</label>
                                    <div className="row mb-4">
                                        {STATUS_OPTIONS.map((status) => (
                                            <div className="col" key={status}>
                                                <div className="premium-radio">
                                                    <input
                                                        type="radio"
                                                        id={`status-${status}`}
                                                        name="status"
                                                        value={status}
                                                        checked={form.status === status}
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor={`status-${status}`}>
                                                        <div className="premium-radio-circle"></div>
                                                        <div className="premium-radio-content">
                                                            <div className="premium-radio-title" style={{ textTransform: "capitalize" }}>
                                                                {status}
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="button-group d-flex gap-2" style={{ marginTop: 30 }}>
                                        <button
                                            type="button"
                                            className="btn text-white px-4"
                                            style={{ backgroundColor: "#99816b" }}
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn text-white px-4"
                                            style={{ backgroundColor: "#4c4036" }}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </div>
                </>
            )}
        </>
    );
}

export default JudgeCompetitionEdit;
