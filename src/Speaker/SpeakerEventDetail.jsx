import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function Field({ label, value }) {
    return (
        <div className="speaker-detail-field">
            <label>{label}</label>
            <div className="value">{value || "N/A"}</div>
        </div>
    );
}

function SpeakerEventDetail() {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [club, setClub] = useState(null);
    const [event, setEvent] = useState(null);

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
                console.error("Speaker club load error:", error);
            }
        }
        async function getEventData() {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE}/events/${eventId}`, {
                    headers: authHeaders(),
                });
                if (!response.ok) throw new Error(`Event API error: ${response.status}`);
                const json = await response.json();
                setEvent(json?.data || null);
            } catch (error) {
                console.error("Speaker event detail load error:", error);
                setEvent(null);
            } finally {
                setIsLoading(false);
            }
        }
        if (eventId) {
            getClub();
            getEventData();
        }
    }, [eventId]);

    if (isLoading) {
        return <Loader show={true} />;
    }

    if (!event) {
        return (
            <div style={{ backgroundColor: "#f7f5f2", minHeight: "100vh" }}>
                <NavigationRoute activeClubId={club?.id} />
                <HeaderRoute title="Event" />
                <div className="speaker-content" style={{ paddingTop: '25px' }}>
                    <p>Event not found.</p>
                    <button className="btn" onClick={() => navigate("/speaker/events")}>Back</button>
                </div>
            </div>
        );
    }

    const eventTypes = event.types || [];
    const eventTags = event.tags || [];
    const keywords = event.tags_keywords
        ? event.tags_keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [];
    const images = event.images || [];

    return (
        <>
            <NavigationRoute activeClubId={club?.id} />
            <HeaderRoute title="Events" />
            <div className="content">
                <section>
                    <div className="container" style={{ maxWidth: '1820px' }}>
                        <div className="dashboard-card">
                            <div className="profile-card">
                                <div className="profile-left">
                                    <div className="profile-info">
                                        <small className="greeting">{event.event_date ? new Date(event.event_date).toLocaleDateString("en-US", { month: "long", day: "numeric", weekday: "long" }) : ""}</small>
                                        <h2 className="name">{event.name}</h2>
                                        <p className="speaker-breadcrumb">
                                            {club?.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="search-bar d-flex" style={{ alignItems: "center", gap: '10px' }}>
                                    <input type="search" className="search-input" placeholder="Search" readOnly />
                                    <i className="fas fa-search"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container" style={{ maxWidth: '1820px' }}>
                        <div style={{ background: "#fff", borderRadius: '12px', boxShadow: "0 0 10px rgba(0,0,0,0.08)", padding: '30px', marginTop: '22px' }}>
                            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: '24px', marginBottom: '26px' }}>
                                <img src={event.featured_image_url || "/placeholder.jpg"} alt={event.name} style={{ width: "100%", height: '190px', objectFit: "cover", borderRadius: '10px' }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                <div>
                                    <h2 style={{ margin: "0 0 6px", color: "#4c4036" }}>{event.name}</h2>
                                    <p style={{ color: "#cc445e", margin: "0 0 10px" }}>
                                        {event.event_date ? new Date(event.event_date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : ""}
                                    </p>
                                    <div className="value" dangerouslySetInnerHTML={{ __html: event.description || "N/A" }}></div>
                                </div>
                            </div>

                            <div className="speaker-detail-grid">
                                <Field label="Event Type" value={eventTypes.map((t) => t.name).join(", ")} />
                                <Field label="Event Tags" value={eventTags.map((t) => t.name).join(", ")} />
                                <Field label="Event Duration" value={event.duration} />
                                <Field label="Event Speaker" value={event.speaker} />
                                <Field label="Event Speaker Club" value={event.speaker_club} />
                                <Field label="Event Speaker Qualifications" value={event.speaker_qualification} />
                                <Field label="Event Status" value={event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : ""} />
                                <Field label="Gear Required" value={event.required_gear} />
                            </div>

                            <div className="speaker-detail-field" style={{ marginTop: '26px' }}>
                                <label>Tags / Keywords</label>
                                <div>
                                    {keywords.length > 0
                                        ? keywords.map((k, i) => <span className="speaker-tag-pill" key={i}>{k}</span>)
                                        : <div className="value">N/A</div>}
                                </div>
                            </div>

                            <div className="speaker-detail-grid" style={{ marginTop: '26px' }}>
                                <Field label="Link to related page" value={event.url ? <a href={event.url} target="_blank" rel="noopener noreferrer">{event.url}</a> : null} />
                                <Field label="RSVP Details" value={event.rsvp_detail} />
                            </div>

                            <div className="speaker-detail-field" style={{ marginTop: '26px' }}>
                                <label style={{ display: "flex", alignItems: "center", gap: '8px' }}>
                                    <input type="checkbox" checked={Boolean(event.enable_dropbox_upload)} readOnly />
                                    Dropbox upload
                                </label>
                            </div>

                            {images.length > 0 && (
                                <>
                                    <div className="speaker-detail-section-title">Event Gallery</div>
                                    <div className="speaker-gallery-grid">
                                        {images.map((img, i) => (
                                            <img key={img.id ?? i} src={img.medium_url || img.image_url} alt={`${event.name} ${i + 1}`} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                        ))}
                                    </div>
                                </>
                            )}

                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <button type="button" className="btn" id="e-view" onClick={() => navigate(-1)} >
                                    Back
                                </button>
                                <button type="button" className="btn" id="edit" onClick={() => navigate(`/speaker/events/${event.id}/edit`)} >
                                    Edit
                                </button>
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
    );
}

export default SpeakerEventDetail;
