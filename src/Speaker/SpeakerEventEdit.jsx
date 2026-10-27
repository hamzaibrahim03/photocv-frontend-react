import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/speakerstyle.css";
import apiClient from "../api/axios";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

function SpeakerEventEdit() {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const isEditMode = Boolean(eventId);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [club, setClub] = useState(null);

    const [name, setName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [description, setDescription] = useState("");
    const [eventTypes, setEventTypes] = useState([]);
    const [selectedEventTypes, setSelectedEventTypes] = useState([]);
    const [availableKeywords, setAvailableKeywords] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [duration, setDuration] = useState("");
    const [speaker, setSpeaker] = useState("");
    const [speakerClub, setSpeakerClub] = useState("");
    const [speakerQualification, setSpeakerQualification] = useState("");
    const [status, setStatus] = useState("scheduled");
    const [requiredGear, setRequiredGear] = useState("");
    const [url, setUrl] = useState("");
    const [rsvpDetail, setRsvpDetail] = useState("");
    const [featuredThumbUrl, setFeaturedThumbUrl] = useState("");
    const [images, setImages] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [dropboxEnabled, setDropboxEnabled] = useState(false);
    const [keywordInput, setKeywordInput] = useState("");
    const [showKeywordDropdown, setShowKeywordDropdown] = useState(false);
    const [search, setSearch] = useState("");
    const [allEvents, setAllEvents] = useState([]);

    const upcoming = useMemo(() => allEvents.filter((e) => e.status !== "completed"), [allEvents]);
    const completed = useMemo(() => allEvents.filter((e) => e.status === "completed"), [allEvents]);

    const keywordOptions = useMemo(() => {
        const query = keywordInput.toLowerCase().trim();
        return [...new Set(availableKeywords)].filter(
            (tag) => tag.toLowerCase().includes(query) && !selectedTags.includes(tag)
        );
    }, [availableKeywords, keywordInput, selectedTags]);

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
        async function getEventTypes() {
            try {
                const response = await apiClient.get("/catalogs");
                const data = response.data?.data || response.data || [];
                setEventTypes(data.filter((item) => item.catalog_type === "event_type"));
            } catch (error) {
                console.error("Failed to fetch event types:", error.response?.data || error.message);
            }
        }
        async function getEventTags() {
            try {
                const response = await apiClient.get("/events");
                const result = response.data?.data?.original?.data;
                const events = Array.isArray(result) ? result : [];
                setAllEvents(events);
                const keywordSet = new Set();
                events.forEach((event) => {
                    if (typeof event?.tags_keywords === "string" && event.tags_keywords.trim()) {
                        event.tags_keywords.split(",").map((v) => v.trim()).filter(Boolean).forEach((k) => keywordSet.add(k));
                    }
                });
                setAvailableKeywords(Array.from(keywordSet));
            } catch (error) {
                console.error("Failed to fetch event tags:", error.response?.data || error.message);
            }
        }
        async function getEventData() {
            if (!isEditMode) return;
            try {
                const response = await apiClient.get(`/events/${eventId}`);
                const event = response.data?.data || {};
                setName(event.name || "");
                setEventDate(event.event_date ? event.event_date.substring(0, 10) : "");
                setDescription(event.description || "");
                const typeIds = Array.isArray(event.types) ? event.types.map((t) => Number(t.id)).filter(Number.isFinite) : [];
                setSelectedEventTypes(typeIds);
                setDuration(event.duration || "");
                setSpeaker(event.speaker || "");
                setSpeakerClub(event.speaker_club || "");
                setSpeakerQualification(event.speaker_qualification || "");
                setStatus(event.status || "scheduled");
                setRequiredGear(event.required_gear || "");
                setUrl(event.url || "");
                setRsvpDetail(event.rsvp_detail || "");
                setFeaturedThumbUrl(event.featured_thumb_url || event.featured_image_url || "");
                setDropboxEnabled(Boolean(event.enable_dropbox_upload));
                const tags = typeof event.tags_keywords === "string"
                    ? event.tags_keywords.split(",").map((v) => v.trim()).filter(Boolean)
                    : [];
                setSelectedTags(tags);
            } catch (error) {
                console.error("Failed to fetch event:", error.response?.data || error.message);
            }
        }
        async function load() {
            setIsLoading(true);
            await Promise.all([getClub(), getEventTypes(), getEventTags(), getEventData()]);
            setIsLoading(false);
        }
        load();
    }, [eventId, isEditMode]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".speaker-tag-dropdown")) setShowKeywordDropdown(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const addTag = (tag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
            setKeywordInput("");
            setShowKeywordDropdown(false);
        }
    };

    const removeTag = (index) => {
        setSelectedTags((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleEventType = (typeId) => {
        setSelectedEventTypes((prev) => (prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]));
    };

    const toggleKeyword = (keyword) => {
        setSelectedTags((prev) => (prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const valid = files.filter((f) => ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(f.type));
        if (images.length + valid.length > 4) {
            alert("You can upload a maximum of 4 images.");
            e.target.value = "";
            return;
        }
        setImages((prev) => [...prev, ...valid.map((file) => ({ file, caption: "", preview: URL.createObjectURL(file) }))]);
        e.target.value = "";
    };

    const removeImage = (index) => {
        setImages((prev) => {
            const removed = prev[index];
            if (removed?.preview) URL.revokeObjectURL(removed.preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleAttachmentUpload = (e) => {
        const files = Array.from(e.target.files);
        if (attachments.length + files.length > 4) {
            alert("You can upload a maximum of 4 attachments.");
            e.target.value = "";
            return;
        }
        setAttachments((prev) => [...prev, ...files]);
        e.target.value = "";
    };

    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Event name is required.");
            return;
        }
        if (!eventDate) {
            alert("Please select a valid event date.");
            return;
        }
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("event_date", eventDate);
            formData.append("description", description);
            formData.append("duration", duration);
            formData.append("status", status);
            formData.append("speaker", speaker);
            formData.append("speaker_club", speakerClub);
            formData.append("speaker_qualification", speakerQualification);
            formData.append("required_gear", requiredGear);
            formData.append("url", url);
            formData.append("rsvp_detail", rsvpDetail);
            selectedEventTypes.forEach((typeId) => formData.append("event_types[]", String(typeId)));
            formData.append("tags_keywords", selectedTags.join(", "));
            if (featuredThumbUrl) formData.append("featured_thumb_url", featuredThumbUrl);
            images.forEach((image, index) => {
                if (image?.file instanceof File) {
                    formData.append(`images[${index}]`, image.file);
                    formData.append(`captions[${index}]`, image.caption || "");
                }
            });
            attachments.forEach((file, index) => {
                if (file instanceof File) formData.append(`attachments[${index}]`, file);
            });
            if (isEditMode) {
                formData.append("_method", "PUT");
                await apiClient.post(`/events/${eventId}`, formData);
            } else {
                await apiClient.post("/events", formData);
            }
            navigate(isEditMode ? `/speaker/events/${eventId}` : "/speaker/events");
        } catch (error) {
            console.error("Event save error:", error.response?.data || error.message);
            const errors = error.response?.data?.errors;
            if (errors) {
                const messages = Object.entries(errors)
                    .flatMap(([field, msgs]) => (Array.isArray(msgs) ? msgs.map((m) => `${field}: ${m}`) : [`${field}: ${msgs}`]))
                    .join("\n");
                alert(messages);
            } else {
                alert(error.response?.data?.message || "Unable to save event.");
            }
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
                    <HeaderRoute title={isEditMode ? "Edit Event" : "Add Event"} />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card" id="cl">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting">List of events in the club</small>
                                                <h2 className="name">All Events</h2>
                                                <p className="speaker-breadcrumb">
                                                    {club?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="search-bar d-flex">
                                            <input type="search" className="search-input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="stat-card">
                                            <small className="ca-details">Events</small>
                                            <h3 className="number">{String(upcoming.length + completed.length).padStart(2, "0")}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="row">
                                    <div className="col-md-8">
                                        <form onSubmit={handleSave} style={{ background: "#fff", borderRadius: '12px', boxShadow: "0 0 10px rgba(0,0,0,0.08)", padding: '30px', marginTop: '22px' }}>
                                            <div className="row mb-3">
                                                <div className="col-md-4">
                                                    <img src={featuredThumbUrl || "/placeholder.jpg"} alt="Event" className="img-fluid rounded" onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                </div>
                                                <div className="col-md-8">
                                                    <label className="form-label">Event Name</label>
                                                    <input type="text" className="form-control mb-3" value={name} onChange={(e) => setName(e.target.value)} />
                                                    <label className="form-label">Event Date</label>
                                                    <input type="date" className="form-control" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="row p-3 rounded mb-4" style={{ backgroundColor: "#99816b33" }}>
                                                <h5>Event Description</h5>
                                                <textarea className="form-control bg-transparent border-0" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label">Event Type</label>
                                                <div className="speaker-checkbox-grid">
                                                    {eventTypes.map((type) => {
                                                        const typeId = Number(type.id);
                                                        const checked = selectedEventTypes.includes(typeId);
                                                        return (
                                                            <label key={type.id} className={`speaker-checkbox-option${checked ? " checked" : ""}`}>
                                                                <input type="checkbox" checked={checked} onChange={() => toggleEventType(typeId)} />
                                                                {type.icon_url && <img src={type.icon_url} alt="" style={{ width: '18px', height: '18px' }} />}
                                                                {type.name}
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label">Event Tags</label>
                                                <div className="speaker-checkbox-grid">
                                                    {availableKeywords.length === 0 && <p style={{ color: "#999", gridColumn: "1 / -1" }}>No tags yet - add keywords below.</p>}
                                                    {availableKeywords.map((keyword, index) => {
                                                        const checked = selectedTags.includes(keyword);
                                                        return (
                                                            <label key={`${keyword}-${index}`} className={`speaker-checkbox-option${checked ? " checked" : ""}`}>
                                                                <input type="checkbox" checked={checked} onChange={() => toggleKeyword(keyword)} />
                                                                {keyword}
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Event Duration</label>
                                                    <input type="text" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Event Speaker</label>
                                                    <input type="text" className="form-control" value={speaker} onChange={(e) => setSpeaker(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Event Speaker Club</label>
                                                    <input type="text" className="form-control" value={speakerClub} onChange={(e) => setSpeakerClub(e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Event Speaker Qualifications</label>
                                                    <input type="text" className="form-control" value={speakerQualification} onChange={(e) => setSpeakerQualification(e.target.value)} />
                                                </div>
                                            </div>

                                            <label className="form-label mb-3 d-block">Event Status</label>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <div className="row">
                                                        {["scheduled", "draft", "tbc"].map((st) => (
                                                            <div className="col-md-4 mb-2" key={st}>
                                                                <div className="premium-radio">
                                                                    <input type="radio" id={`status-${st}`} name="status" value={st} checked={status === st} onChange={(e) => setStatus(e.target.value)} />
                                                                    <label htmlFor={`status-${st}`}>
                                                                        <div className="premium-radio-circle"></div>
                                                                        <div className="premium-radio-content">
                                                                            <div className="premium-radio-title" style={{ textTransform: "capitalize" }}>{st}</div>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="row">
                                                        {["completed", "cancelled"].map((st) => (
                                                            <div className="col-md-6 mb-2" key={st}>
                                                                <div className="premium-radio">
                                                                    <input type="radio" id={`status-${st}`} name="status" value={st} checked={status === st} onChange={(e) => setStatus(e.target.value)} />
                                                                    <label htmlFor={`status-${st}`}>
                                                                        <div className="premium-radio-circle"></div>
                                                                        <div className="premium-radio-content">
                                                                            <div className="premium-radio-title" style={{ textTransform: "capitalize" }}>{st}</div>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Gear Required</label>
                                                <input type="text" className="form-control" value={requiredGear} onChange={(e) => setRequiredGear(e.target.value)} />
                                            </div>

                                            <div className="mb-3 position-relative speaker-tag-dropdown">
                                                <label className="form-label">Tags / Keywords</label>
                                                <div className="d-flex flex-wrap border rounded p-2 form-control align-items-center gap-2" onClick={() => setShowKeywordDropdown(true)}>
                                                    {selectedTags.map((tag, index) => (
                                                        <div key={index} className="badge bg-secondary d-flex align-items-center" style={{ gap: '5px' }}>
                                                            {tag}
                                                            <button type="button" className="btn-close btn-close-white ms-2" style={{ fontSize: "0.4rem" }} onClick={(e) => { e.stopPropagation(); removeTag(index); }}></button>
                                                        </div>
                                                    ))}
                                                    <input type="text" className="border-0 shadow-none flex-grow-1" style={{ minWidth: '100px', outline: "none" }} placeholder="Add keyword..." value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onFocus={() => setShowKeywordDropdown(true)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const value = keywordInput.trim(); if (value && !selectedTags.includes(value)) { setSelectedTags((prev) => [...prev, value]); setKeywordInput(""); } } }} />
                                                </div>
                                                {showKeywordDropdown && (
                                                    <ul className="dropdown-menu show w-100 position-absolute" style={{ top: "100%", zIndex: '1000' }}>
                                                        {keywordOptions.length === 0 ? (
                                                            <li className="dropdown-item text-muted">No results found</li>
                                                        ) : (
                                                            keywordOptions.map((tag, index) => (
                                                                <li key={index} className="dropdown-item" style={{ cursor: "pointer" }} onClick={() => addTag(tag)}>{tag}</li>
                                                            ))
                                                        )}
                                                    </ul>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Link to related page</label>
                                                <input type="url" className="form-control" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">RSVP Details</label>
                                                <textarea className="form-control" rows="3" value={rsvpDetail} onChange={(e) => setRsvpDetail(e.target.value)}></textarea>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Images (max 4)</label>
                                                <input type="file" className="form-control" accept=".jpg,.jpeg,.png,.gif" multiple onChange={handleImageChange} />
                                            </div>
                                            {images.length > 0 && (
                                                <div className="d-flex flex-wrap gap-3 mb-4">
                                                    {images.map((img, index) => (
                                                        <div key={index} className="position-relative border p-1 rounded" style={{ width: '150px' }}>
                                                            <button type="button" className="btn-close position-absolute top-0 end-0 m-1 bg-white" onClick={() => removeImage(index)} />
                                                            <img src={img.preview} className="img-fluid w-100" style={{ height: '100px', objectFit: "cover" }} alt="upload" />
                                                            <textarea className="form-control form-control-sm mt-1" rows="2" placeholder="Caption..." value={img.caption} onChange={(e) => setImages((prev) => prev.map((item, i) => (i === index ? { ...item, caption: e.target.value } : item)))} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mb-3">
                                                <label className="form-label">Documents to download</label>
                                                <input type="file" className="form-control" accept=".pdf,.doc,.docx,.txt,.zip,.ppt,.pptx" multiple onChange={handleAttachmentUpload} disabled={attachments.length >= 4} />
                                            </div>
                                            {attachments.length > 0 && (
                                                <div className="d-flex flex-wrap gap-3 mb-4">
                                                    {attachments.map((file, index) => (
                                                        <div key={index} className="d-flex align-items-center border rounded p-2 bg-light">
                                                            <span className="me-2 fs-4">📄</span>
                                                            <span className="text-truncate" style={{ maxWidth: '100px', fontSize: '12px' }}>{file.name}</span>
                                                            <button type="button" className="btn-close ms-2" style={{ fontSize: "0.5rem" }} onClick={() => removeAttachment(index)}></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mb-4 form-check">
                                                <input type="checkbox" className="form-check-input" id="dropbox" checked={dropboxEnabled} onChange={(e) => setDropboxEnabled(e.target.checked)} />
                                                <label className="form-check-label" htmlFor="dropbox">Enable Dropbox uploads</label>
                                            </div>

                                            <div className="button-group d-flex gap-2">
                                                <button type="button" className="btn" id="e-view" onClick={() => navigate(-1)} >
                                                    Back
                                                </button>
                                                <button type="submit" className="btn" id="edit" disabled={isSaving} >
                                                    {isSaving ? "Saving..." : "Save"}
                                                </button>
                                            </div>
                                        </form>
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
        </>
    );
}

export default SpeakerEventEdit;
