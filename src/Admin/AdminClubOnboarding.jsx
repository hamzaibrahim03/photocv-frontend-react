import { useState } from "react";
import { useNavigate } from "react-router";
import apiClient from "../api/axios";
const STEP_TITLES = ["Let's Start!", "Let's Design!", "Let's manage membership!", "Let's manage club website!", "You're almost there!"];
const STEP_SUBTITLES = [
    "We just need a few basic details of the club",
    "Each club has its own design preference, let us know yours",
    "Let us know how do you want your members to interact",
    "How do you want your club website to shape you",
    "Let's lock in your username and password to launch your club",
];

const THEME_OPTIONS = [
    { key: "default", label: "Default", colors: ["#1a1a1a", "#7fa483", "#fff", "#dd9757"] },
    { key: "greenish", label: "Greenish", colors: ["#1a1a1a", "#4c7a5a", "#fff", "#dd9757"] },
    { key: "blueish", label: "Blueish", colors: ["#1a1a1a", "#3a6ea5", "#fff", "#dd9757"] },
    { key: "greys", label: "Greys", colors: ["#1a1a1a", "#888", "#fff", "#ccc"] },
    { key: "opt5", label: "5", colors: ["#1a1a1a", "#7fa483", "#fff", "#dd9757"] },
    { key: "opt6", label: "6", colors: ["#1a1a1a", "#7fa483", "#fff", "#dd9757"] },
    { key: "opt7", label: "7", colors: ["#1a1a1a", "#7fa483", "#fff", "#dd9757"] },
    { key: "custom", label: "Custom", colors: ["#4c4036", "#7fa483", "#fff", "#cc445e"] },
];

const FONT_OPTIONS = [
    { key: "montserrat", label: "MONTSERRAT", sub: "Charter" },
    { key: "crimson", label: "crimson", sub: "OXYGEN" },
    { key: "custom", label: "Custom", sub: null },
];

const GALLERY_PREVIEW = [
    { label: "Moss Sporophytes", image: "/placeholder.jpg" },
    { label: "Odd Tranquility", image: "/placeholder.jpg" },
    { label: "Backlit Poppy", image: "/placeholder.jpg" },
    { label: "Orange & Rocker", image: "/placeholder.jpg" },
    { label: "Daddy's Boy", image: "/placeholder.jpg" },
    { label: "Music Love Dance", image: "/placeholder.jpg" },
];

const initialForm = {
    clubName: "",
    clubTagline: "",
    domainType: "subdomain",
    subdomain: "",
    customDomain: "",
    theme: "custom",
    font: "custom",
    logoPreview: "",
    logoFile: null,
    coverPreview: "",
    coverFile: null,
    registrationAccess: "open",
    directoryVisibility: "visible",
    commentsEnabled: true,
    likesEnabled: true,
    websiteSections: ["open"],
    galleryComments: "all",
    reminders: "all",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

function RadioRow({ checked, label, description, onClick }) {
    return (
        <div className={`ad-radio-row${checked ? " checked" : ""}`} onClick={onClick}>
            <div className="dot"></div>
            <div className="label-text">
                <div>{label}</div>
                {description && <small style={{ color: "#999" }}>{description}</small>}
            </div>
        </div>
    );
}

function PreviewCard({ form }) {
    const theme = THEME_OPTIONS.find((t) => t.key === form.theme) || THEME_OPTIONS[0];
    const accent = theme.colors[3];
    const bg = form.coverPreview || "/placeholder.jpg";

    return (
        <div className="ad-preview-card" style={{ backgroundImage: `url(${bg})` }}>
            <div className="ad-preview-inner">
                <div className="club-name">{form.clubName || "Club Name"}</div>
                <div className="club-tagline">{form.clubTagline || "Club Tagline"}</div>
                <button type="button" className="ad-preview-join-btn" style={{ background: accent }}>Join Our Club</button>
                <div className="ad-preview-tag">
                    An NYCE Club based in {form.clubName ? form.clubName : "Apps"}, North East England
                </div>
                <div className="ad-preview-social">
                    <span><i className="fa-brands fa-facebook-f"></i></span>
                    <span><i className="fa-brands fa-instagram"></i></span>
                    <span><i className="fa-brands fa-flickr"></i></span>
                </div>
            </div>
        </div>
    );
}

function AdminClubOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(initialForm);
    const [launched, setLaunched] = useState(false);
    const [launching, setLaunching] = useState(false);
    const [launchError, setLaunchError] = useState("");

    const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleFile = (key, fileKey, e) => {
        const file = e.target.files?.[0];
        if (file) {
            update(key, URL.createObjectURL(file));
            update(fileKey, file);
        }
    };

    const toggleSection = (key) => {
        setForm((prev) => ({
            ...prev,
            websiteSections: prev.websiteSections.includes(key)
                ? prev.websiteSections.filter((s) => s !== key)
                : [...prev.websiteSections, key],
        }));
    };

    const goNext = () => setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
    const goPrev = () => setStep((s) => Math.max(s - 1, 0));

    const handleLaunch = async () => {
        if (!form.username || !form.email || !form.password) {
            setLaunchError("Please fill in username, email and password.");
            return;
        }
        if (form.password !== form.confirmPassword) return;
        setLaunchError("");
        setLaunching(true);
        try {
            const payload = new FormData();
            payload.append("username", form.username);
            payload.append("email", form.email);
            payload.append("password", form.password);
            payload.append("role", "club_admin");
            payload.append("club[club_name]", form.clubName);
            payload.append("club[tag_line]", form.clubTagline);
            payload.append("club[domain_type]", form.domainType);
            payload.append("club[domain_name]", form.domainType === "custom" ? form.customDomain : form.subdomain);
            payload.append("club[registration]", form.registrationAccess === "invite" ? "invite" : form.registrationAccess === "manual" ? "manual_approval" : "open");
            payload.append("club[directory_visibility]", form.directoryVisibility);
            payload.append("club[comments]", form.commentsEnabled ? "enabled" : "disabled");
            payload.append("club[likes]", form.likesEnabled ? "enabled" : "disabled");
            const section = form.websiteSections.find((s) => s !== "open") || "events";
            payload.append("club[website_sections]", section.charAt(0).toUpperCase() + section.slice(1));
            payload.append("club[comment_preference]", form.galleryComments.charAt(0).toUpperCase() + form.galleryComments.slice(1));
            payload.append("club[reminders]", form.reminders);
            if (form.logoFile instanceof File) payload.append("club[logo]", form.logoFile);
            if (form.coverFile instanceof File) payload.append("club[banner]", form.coverFile);

            await apiClient.post("/sign-up", payload, { headers: { "Content-Type": "multipart/form-data" } });
            setLaunched(true);
        } catch (err) {
            const status = err?.response?.status;
            const message = err?.response?.data?.message;
            setLaunchError(status === 409 ? (message || "Username or email already in use.") : (message || "Something went wrong while launching your club. Please try again."));
        } finally {
            setLaunching(false);
        }
    };

    if (launched) {
        return (
            <div className="ad-page" style={{ justifyContent: "center", textAlign: "center" }}>
                <div className="ad-shell">
                    <i className="fa-solid fa-circle-check" style={{ fontSize: '56px', color: "#7fa483", marginBottom: '20px' }}></i>
                    <h2 className="ad-title">{form.clubName || "Your club"} is ready!</h2>
                    <p style={{ color: "#666", marginBottom: '30px' }}>
                        Your club account has been created. Log in to get started.
                    </p>
                    <button type="button" className="ad-btn" onClick={() => navigate("/admin/login")}>Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <section>
                <div className="container" style={{ maxWidth: '1820px' }}>
                    <div className="ad-page">
                        <div className="ad-shell">
                            <div className="ad-onboard-nav">
                                {form.clubName ? (
                                    <div style={{ fontWeight: '800', fontSize: '16px', color: "#cc445e", textTransform: "uppercase", letterSpacing: '1' }}>
                                        {form.clubName}
                                        <div style={{ fontSize: '8px', color: "#99816b", letterSpacing: '0.5px', textTransform: "none" }}>Camera Club</div>
                                    </div>
                                ) : (
                                    <strong style={{ fontSize: '18px', color: "#4c4036" }}>LOGO</strong>
                                )}
                                <button type="button" className="menu-btn"><i className="fa-solid fa-bars"></i></button>
                            </div>

                            {step === 3 ? (
                                <>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '10px' }}>
                                        <strong style={{ color: "#4c4036" }}>Club Galleries</strong>
                                        <small style={{ color: "#cc445e" }}>View All</small>
                                    </div>
                                    <div className="ad-gallery-preview">
                                        {GALLERY_PREVIEW.map((g) => (
                                            <div className="tile" key={g.label}>
                                                <img src={g.image} alt={g.label} />
                                                <span>{g.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <PreviewCard form={form} />
                            )}

                            <h2 className="ad-step-title">{STEP_TITLES[step]}</h2>
                            <p className="ad-step-subtitle">{STEP_SUBTITLES[step]}</p>

                            {step === 0 && (
                                <>
                                    <div className="ad-field">
                                        <label>Club Name</label>
                                        <input type="text" placeholder="e.g. joe.photo.cv" value={form.clubName} onChange={(e) => update("clubName", e.target.value)} />
                                    </div>
                                    <div className="ad-field">
                                        <label>Club Tagline</label>
                                        <input type="text" placeholder="Enter name" value={form.clubTagline} onChange={(e) => update("clubTagline", e.target.value)} />
                                    </div>
                                    <div className="ad-section-label">Domain Type and Name Options</div>
                                    <div className="ad-option-grid">
                                        <button type="button" className={`ad-option-btn${form.domainType === "subdomain" ? " active" : ""}`} onClick={() => update("domainType", "subdomain")}>Subdomain</button>
                                        <button type="button" className={`ad-option-btn${form.domainType === "custom" ? " active" : ""}`} onClick={() => update("domainType", "custom")}>Custom Domain</button>
                                    </div>
                                    {form.domainType === "subdomain" ? (
                                        <div className="ad-field">
                                            <label>Subdomain</label>
                                            <div style={{ display: "flex" }}>
                                                <input type="text" placeholder="yourclubname" value={form.subdomain} onChange={(e) => update("subdomain", e.target.value)} style={{ borderRadius: "6px 0 0 6px" }} />
                                                <span style={{ display: "flex", alignItems: "center", padding: "0 12px", border: "1px solid #99816b", borderLeft: "none", borderRadius: "0 6px 6px 0", background: "#f5f0eb", fontSize: '13px', color: "#99816b" }}>.cameraclub.website</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="ad-field">
                                            <label>Custom Domain</label>
                                            <input type="text" placeholder="example.com" value={form.customDomain} onChange={(e) => update("customDomain", e.target.value)} />
                                        </div>
                                    )}
                                </>
                            )}

                            {step === 1 && (
                                <>
                                    <div className="ad-section-label">Themes &amp; Colors</div>
                                    {THEME_OPTIONS.map((t) => (
                                        <div key={t.key} className={`ad-radio-row${form.theme === t.key ? " checked" : ""}`} onClick={() => update("theme", t.key)}>
                                            <div className="dot"></div>
                                            <div className="label-text">{t.label}</div>
                                            <div className="ad-color-swatch-row">
                                                {t.colors.map((c, i) => <span key={i} style={{ background: c }}></span>)}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="ad-section-label">Typography &amp; Fonts</div>
                                    {FONT_OPTIONS.map((f) => (
                                        <button key={f.key} type="button" className={`ad-option-btn ad-option-grid single`} style={{ display: "block", width: "100%", marginBottom: '10px', border: form.font === f.key ? "1px solid #cc445e" : "1px solid #e5ded7", padding: '16px' }} onClick={() => update("font", f.key)} >
                                            {f.sub ? (
                                                <div style={{ textAlign: "left" }}>
                                                    <div style={{ fontSize: '18px', fontWeight: '700', color: "#4c4036" }}>{f.label}</div>
                                                    <div style={{ fontSize: '13px', color: "#777" }}>{f.sub}</div>
                                                </div>
                                            ) : (
                                                <strong style={{ color: form.font === f.key ? "#cc445e" : "#4c4036" }}>{f.label}</strong>
                                            )}
                                        </button>
                                    ))}
                                    <div className="ad-section-label">Logo</div>
                                    <label className="ad-upload-box">
                                        {form.logoPreview ? <img className="preview" src={form.logoPreview} alt="logo" /> : <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '24px' }}></i>}
                                        <div>Drag image to upload or</div>
                                        <button type="button">Browse Image</button>
                                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile("logoPreview", "logoFile", e)} />
                                        <div style={{ fontSize: '11px', marginTop: '8px' }}>.png, .jpg, .jpeg</div>
                                    </label>
                                    <div className="ad-section-label">Club Banner &amp; Cover Image</div>
                                    <label className="ad-upload-box">
                                        {form.coverPreview ? <img className="preview" src={form.coverPreview} alt="cover" /> : <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '24px' }}></i>}
                                        <div>Drag image to upload or</div>
                                        <button type="button">Browse Image</button>
                                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile("coverPreview", "coverFile", e)} />
                                        <div style={{ fontSize: '11px', marginTop: '8px' }}>.png, .jpg, .jpeg</div>
                                    </label>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="ad-section-label">Registration &amp; Access Control</div>
                                    <RadioRow checked={form.registrationAccess === "open"} label="Open" onClick={() => update("registrationAccess", "open")} />
                                    <RadioRow checked={form.registrationAccess === "invite"} label="Invite Only" onClick={() => update("registrationAccess", "invite")} />
                                    <RadioRow checked={form.registrationAccess === "manual"} label="Manual" onClick={() => update("registrationAccess", "manual")} />

                                    <div className="ad-section-label">Members Directory Public Visibility</div>
                                    <div className="ad-option-grid">
                                        <button type="button" className={`ad-option-btn${form.directoryVisibility === "visible" ? " active" : ""}`} onClick={() => update("directoryVisibility", "visible")}>Visible</button>
                                        <button type="button" className={`ad-option-btn${form.directoryVisibility === "club_only" ? " active" : ""}`} onClick={() => update("directoryVisibility", "club_only")}>Club Only</button>
                                    </div>

                                    <div className="ad-section-label">Comments</div>
                                    <div className="ad-option-grid">
                                        <button type="button" className={`ad-option-btn${form.commentsEnabled ? " active" : ""}`} onClick={() => update("commentsEnabled", true)}>Enable</button>
                                        <button type="button" className={`ad-option-btn${!form.commentsEnabled ? " active" : ""}`} onClick={() => update("commentsEnabled", false)}>Disable</button>
                                    </div>

                                    <div className="ad-section-label">Likes</div>
                                    <div className="ad-option-grid">
                                        <button type="button" className={`ad-option-btn${form.likesEnabled ? " active" : ""}`} onClick={() => update("likesEnabled", true)}>Enable</button>
                                        <button type="button" className={`ad-option-btn${!form.likesEnabled ? " active" : ""}`} onClick={() => update("likesEnabled", false)}>Disable</button>
                                    </div>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <div className="ad-section-label">Website Sections</div>
                                    <div className="ad-option-grid">
                                        {["open", "events", "galleries", "competitions"].map((key) => (
                                            <button key={key} type="button" className={`ad-option-btn${form.websiteSections.includes(key) ? " active" : ""}`} style={{ textTransform: "capitalize" }} onClick={() => toggleSection(key)} >
                                                {key}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="ad-section-label">Comments</div>
                                    <div className="ad-option-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                                        {["all", "fewer", "fewest"].map((key) => (
                                            <button key={key} type="button" className={`ad-option-btn${form.galleryComments === key ? " active" : ""}`} style={{ textTransform: "capitalize" }} onClick={() => update("galleryComments", key)}>{key}</button>
                                        ))}
                                    </div>

                                    <div className="ad-section-label">Reminders</div>
                                    <div className="ad-option-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                                        {["all", "some", "none"].map((key) => (
                                            <button key={key} type="button" className={`ad-option-btn${form.reminders === key ? " active" : ""}`} style={{ textTransform: "capitalize" }} onClick={() => update("reminders", key)}>{key}</button>
                                        ))}
                                    </div>
                                </>
                            )}

                            {step === 4 && (
                                <>
                                    <div className="ad-field">
                                        <label>Username</label>
                                        <input type="text" placeholder={form.clubName ? form.clubName.toLowerCase().replace(/\s+/g, "") : "username"} value={form.username} onChange={(e) => update("username", e.target.value)} />
                                    </div>
                                    <div className="ad-field">
                                        <label>Email</label>
                                        <input type="email" placeholder="Enter email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                                    </div>
                                    <div className="ad-field">
                                        <label>Password</label>
                                        <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />
                                    </div>
                                    <div className="ad-field">
                                        <label>Confirm Password</label>
                                        <input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />
                                        {form.confirmPassword && form.password !== form.confirmPassword && (
                                            <small style={{ color: "#cc445e" }}>Passwords do not match.</small>
                                        )}
                                    </div>
                                    {launchError && <div className="ad-error">{launchError}</div>}
                                </>
                            )}

                            <div className="ad-progress-row">
                                {STEP_TITLES.map((_, i) => <span key={i} className={i <= step ? "done" : ""}></span>)}
                            </div>

                            <div className="ad-onboard-footer">
                                <button type="button" className="back-btn" onClick={() => (step === 0 ? navigate(-1) : goPrev())}>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                <div className="right-group">
                                    {step < STEP_TITLES.length - 1 && <button type="button" className="skip-btn" onClick={goNext}>Skip</button>}
                                    {step < STEP_TITLES.length - 1 ? (
                                        <button type="button" className="continue-btn" onClick={goNext}>Continue</button>
                                    ) : (
                                        <button type="button" className="continue-btn" disabled={launching || !form.password || form.password !== form.confirmPassword} onClick={handleLaunch}>{launching ? "Launching..." : "Launch Club"}</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="site-footer">
                <div className="footer-content">
                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal</p>
                </div>
            </footer>
        </>
    );
}

export default AdminClubOnboarding;
