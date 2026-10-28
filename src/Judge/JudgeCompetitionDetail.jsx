import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import NavigationRoute from "../club_admin/NavigationRoute";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function Field({ label, value }) {
    return (
        <div className="judge-detail-field">
            <label>{label}</label>
            <div className="value">{value || "N/A"}</div>
        </div>
    );
}

function formatDateTime(value) {
    if (!value) return "N/A";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return (
        d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) +
        " " +
        d.toLocaleDateString("en-US", { weekday: "short" }) +
        ". " +
        d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    );
}

function JudgeCompetitionDetail() {
    const navigate = useNavigate();
    const { competitionId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [club, setClub] = useState(null);
    const [competition, setCompetition] = useState(null);
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
                setCompetition(json?.data || null);
            } catch (error) {
                console.error("Judge competition detail load error:", error);
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
            <>
                <div style={{ backgroundColor: 'white' }}>
                    <Loader show={isLoading} />
                    {!isLoading && (
                        <>
                            <NavigationRoute activeClubId={club?.id} />
                            <HeaderRoute title="Competition" />
                            <div className="judge-content" style={{ paddingTop: '25px' }}>
                                <p>Competition not found.</p>
                                <button className="btn" onClick={() => navigate("/judge/competitions")}>Back</button>
                            </div>
                        </>
                    )}
                </div>
            </>
        );
    }

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
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
                                                    <h2 className="name">{competition.name}</h2>
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
                                    <div className="card" style={{ padding: '40px 80px' }}>
                                        <div className="judge-detail-section-title">Basic Information</div>
                                        <div className="judge-detail-grid">
                                            <Field label="Competition Name" value={competition.name} />
                                            <Field label="Competition Type" value={competition.competition_type?.name} />
                                        </div>
                                        <div className="judge-detail-field" style={{ marginTop: '26px' }}>
                                            <label>Competition Description</label>
                                            <div className="value" dangerouslySetInnerHTML={{ __html: competition.description || "N/A" }}></div>
                                        </div>
                                        <div className="judge-detail-grid" style={{ marginTop: '26px' }}>
                                            <Field label="Judging Type" value={competition.judging_type?.name} />
                                            <Field label="Status" value={competition.status ? competition.status.charAt(0).toUpperCase() + competition.status.slice(1) : ""} />
                                        </div>

                                        <div className="judge-detail-section-title">Submission Rules</div>
                                        <div className="judge-detail-grid">
                                            <Field label="Max Number of Entries per Participant" value={competition.max_entries_print ?? competition.max_entries_digital} />
                                            <Field label="Allowed Image Formats" value={competition.allowed_image_formats} />
                                        </div>
                                        <div className="judge-detail-grid" style={{ marginTop: '26px' }}>
                                            <Field label="Max File Size" value={competition.max_file_size ? `${competition.max_file_size} MB/Image` : "N/A"} />
                                        </div>

                                        <div className="judge-detail-section-title">Categories &amp; Themes</div>
                                        <div className="judge-detail-grid">
                                            <Field label="Theme (if applicable)" value={competition.competition_theme?.name} />
                                            <Field label="Competition Categories" value={competition.competition_category?.name} />
                                        </div>
                                        <div className="judge-detail-grid" style={{ marginTop: '26px' }}>
                                            <Field label="Print vs. Digital Submission" value={competition.print_vs_digital} />
                                            <Field label="Colour vs. Monochrome" value={competition.color_vs_mono} />
                                        </div>

                                        <div className="judge-detail-section-title">Judging &amp; Scoring</div>
                                        <div className="judge-detail-grid">
                                            <Field label="Judging Panel" value={competition.judges?.length ? competition.judges.map((j) => j.name).join(", ") : null} />
                                            <Field label="Voting Method" value={competition.voting_method?.name} />
                                        </div>
                                        <div className="judge-detail-grid" style={{ marginTop: '26px' }}>
                                            <Field label="Judging Start Date & Time" value={formatDateTime(competition.judging_start_date)} />
                                            <Field label="Judging End Date & Time" value={formatDateTime(competition.judging_end_date)} />
                                        </div>

                                        <div className="judge-detail-section-title">Results &amp; Awards</div>
                                        <div className="judge-detail-grid">
                                            <Field label="Announcement Date" value={formatDateTime(competition.result_announcement_date)} />
                                            <Field label="Awards - Top Places Available" value={competition.top_places ? `Top ${competition.top_places}` : "N/A"} />
                                        </div>
                                        <div className="judge-detail-grid" style={{ marginTop: '26px' }}>
                                            <Field label="Award - Number of High Commendations Available" value={competition.high_commendation_number} />
                                            <Field label="Awards - Number of Commendations Available" value={competition.commendation_number} />
                                        </div>
                                        <div className="judge-detail-grid" style={{ marginTop: '26px' }}>
                                            <Field label="Prizes (if any)" value={competition.prizes} />
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: '34px' }}>
                                            <button type="button" className="btn" id="e-view" onClick={() => navigate(-1)} >
                                                Back
                                            </button>
                                            <div style={{ display: "flex", gap: '12px' }}>
                                                <button type="button" className="btn" id="edit" onClick={() => navigate(`/judge/competitions/${competition.id}/edit`)} >
                                                    Edit
                                                </button>
                                                <button type="button" className="btn" id="e-view" style={{ background: "#cc445e", color: "#fff", border: "none", width: '250px', maxWidth: '250px' }} onClick={() => navigate(`/judge/competitions/${competition.id}/submissions`)} >
                                                    View Submissions
                                                </button>
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
            </div>
        </>
    );
}

export default JudgeCompetitionDetail;
