import { useEffect, useState } from "react";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import apiClient from "../api/axios";

const DEFAULT_SETTINGS = {
    showRecentProfiles: true,
    showTopProfiles: true,
    showFeaturedProfiles: true,
    showRecentClubs: true,
    showTopClubs: true,
    showFeaturedClubs: true,
    showContactSection: false,
    showSocialLinks: true,
    allowClubSignup: true,
    allowPhotographerSignup: true,
    requireApproval: false,
    customSignupEnabled: true,
    customSignupMessage: "",
    cookieConsentEnabled: true,
    cookieMessage: "",
    privacyPolicy: "",
    termsConditions: "",
};

const FIELD_MAP = {
    showRecentProfiles: "show_recent_profiles",
    showTopProfiles: "show_top_profiles",
    showFeaturedProfiles: "show_featured_profiles",
    showRecentClubs: "show_recent_clubs",
    showTopClubs: "show_top_clubs",
    showFeaturedClubs: "show_featured_clubs",
    showContactSection: "show_contact_section",
    showSocialLinks: "show_social_links",
    allowClubSignup: "allow_club_signup",
    allowPhotographerSignup: "allow_photographer_signup",
    requireApproval: "require_approval",
    customSignupEnabled: "custom_signup_enabled",
    customSignupMessage: "custom_signup_message",
    cookieConsentEnabled: "cookie_consent_enabled",
    cookieMessage: "cookie_message",
    privacyPolicy: "privacy_policy",
    termsConditions: "terms_conditions",
};

function apiToSettings(data) {
    const out = { ...DEFAULT_SETTINGS };
    Object.entries(FIELD_MAP).forEach(([camelKey, snakeKey]) => {
        if (data?.[snakeKey] !== undefined && data[snakeKey] !== null) out[camelKey] = data[snakeKey];
    });
    return out;
}

function settingsToApi(settings) {
    const out = {};
    Object.entries(FIELD_MAP).forEach(([camelKey, snakeKey]) => {
        out[snakeKey] = settings[camelKey];
    });
    return out;
}

function Toggle({ on, onClick }) {
    return (
        <button type="button" className={`super-toggle${on ? " on" : ""}`} onClick={onClick}>
            <span></span>
        </button>
    );
}

function SuperGlobalSettings() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [clubCount, setClubCount] = useState(0);
    const [totalMembers, setTotalMembers] = useState(0);
    const [openSection, setOpenSection] = useState("public");
    const [saving, setSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchSettings(), fetchClubStats()]).finally(() => setIsLoading(false));
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await apiClient.get("/super/platform-settings");
            const data = response.data?.data || response.data;
            setSettings(apiToSettings(data));
        } catch (error) {
            console.error("Error loading platform settings:", error);
        }
    };

    const fetchClubStats = async () => {
        try {
            const response = await apiClient.get("/super/clubs");
            const data = response.data?.data || response.data;
            const clubs = Array.isArray(data) ? data : [];
            setClubCount(clubs.length);
            setTotalMembers(clubs.reduce((sum, c) => sum + (c.membersCount || 0), 0));
        } catch (error) {
            console.error("Error loading club stats:", error);
        }
    };

    const update = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await apiClient.put("/super/platform-settings", settingsToApi(settings));
            const data = response.data?.data || response.data;
            setSettings(apiToSettings(data));
            alert("Settings saved.");
        } catch (error) {
            console.error("Error saving platform settings:", error);
            alert(error?.response?.data?.message || "Unable to save settings.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        fetchSettings();
    };

    const toggle = (key) => setOpenSection((prev) => (prev === key ? null : key));

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Global Settings" />
                        <div className="content">

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    {(() => {
                                                        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                                                        return (
                                                            <div className="d-flex gap-4">
                                                                <i className="fa-regular fa-circle-user" style={{ fontSize: '54px', color: "#e5ded7" }}></i>
                                                                <h2>{storedUser.first_name || "Admin"} {storedUser.last_name || ""}</h2>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Total Clubs</small>
                                                <h3 className="number">{clubCount}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small>Total Members</small>
                                                <h3 className="number">{totalMembers}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <form onSubmit={handleSave}>
                                        <div className="super-accordion-item">
                                            <div className="super-accordion-head" onClick={() => toggle("public")}>
                                                Public Elements Settings
                                                <i className={`fa-solid fa-chevron-${openSection === "public" ? "up" : "down"}`}></i>
                                            </div>
                                            {openSection === "public" && (
                                                <div className="super-accordion-body">
                                                    {[
                                                        ["showRecentProfiles", "Show Recent Profiles", "Controls visibility of “Recent Photographer Profiles” section on homepage"],
                                                        ["showTopProfiles", "Show Top Profiles", "Controls visibility of “Top Profiles” section on homepage"],
                                                        ["showFeaturedProfiles", "Show Featured Profiles", "Controls visibility of “Featured Profiles” section on homepage"],
                                                        ["showRecentClubs", "Show Recent Clubs", "Controls visibility of “Recent Clubs” section on homepage"],
                                                        ["showTopClubs", "Show Top Clubs", "Controls visibility of “Top Clubs” section on homepage"],
                                                        ["showFeaturedClubs", "Show Featured Clubs", "Enables/disables display of featured clubs section"],
                                                        ["showContactSection", "Show Contact Section", "Determines if platform-wide contact links are visible in footer/header"],
                                                        ["showSocialLinks", "Show Social Links", "Determines if platform-wide social links are visible in footer/header"],
                                                    ].map(([key, label, desc]) => (
                                                        <div className="super-setting-row" key={key}>
                                                            <div>
                                                                <div className="label">{label}</div>
                                                                <div className="desc">{desc}</div>
                                                            </div>
                                                            <Toggle on={settings[key]} onClick={() => update(key, !settings[key])} />
                                                        </div>
                                                    ))}
                                                    <div style={{ display: "flex", gap: '12px', marginTop: '24px' }}>
                                                        <button type="submit" className="btn" id="edit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                                                        <button type="button" className="btn" id="e-view" onClick={handleCancel}>Cancel</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="super-accordion-item">
                                            <div className="super-accordion-head" onClick={() => toggle("signup")}>
                                                Club Signup Settings
                                                <i className={`fa-solid fa-chevron-${openSection === "signup" ? "up" : "down"}`}></i>
                                            </div>
                                            {openSection === "signup" && (
                                                <div className="super-accordion-body">
                                                    <div className="super-setting-row">
                                                        <div>
                                                            <div className="label">Allow Club Signup</div>
                                                            <div className="desc">If off, registration form for clubs is disabled</div>
                                                        </div>
                                                        <Toggle on={settings.allowClubSignup} onClick={() => update("allowClubSignup", !settings.allowClubSignup)} />
                                                    </div>
                                                    <div className="super-setting-row">
                                                        <div>
                                                            <div className="label">Allow Photographer Signup</div>
                                                            <div className="desc">Enables/disables new photographer registration</div>
                                                        </div>
                                                        <Toggle on={settings.allowPhotographerSignup} onClick={() => update("allowPhotographerSignup", !settings.allowPhotographerSignup)} />
                                                    </div>
                                                    <div className="super-setting-row">
                                                        <div>
                                                            <div className="label">Require Approval Before Activation</div>
                                                            <div className="desc">When enabled, new signups must be approved by Super Admin before going live</div>
                                                        </div>
                                                        <Toggle on={settings.requireApproval} onClick={() => update("requireApproval", !settings.requireApproval)} />
                                                    </div>
                                                    <div className="super-setting-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                            <div>
                                                                <div className="label">Custom Signup Message</div>
                                                                <div className="desc">Message displayed to users when signup is disabled</div>
                                                            </div>
                                                            <Toggle on={settings.customSignupEnabled} onClick={() => update("customSignupEnabled", !settings.customSignupEnabled)} />
                                                        </div>
                                                        <textarea rows={3} placeholder="Text here..." value={settings.customSignupMessage} onChange={(e) => update("customSignupMessage", e.target.value)} style={{ marginTop: '14px', width: "100%", border: "1px solid #e5ded7", borderRadius: '8px', padding: '12px', fontFamily: "inherit" }} ></textarea>
                                                    </div>
                                                    <div style={{ display: "flex", gap: '12px', marginTop: '24px' }}>
                                                        <button type="submit" className="btn" id="edit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                                                        <button type="button" className="btn" id="e-view" onClick={handleCancel}>Cancel</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="super-accordion-item">
                                            <div className="super-accordion-head" onClick={() => toggle("cookie")}>
                                                Cookie Consent Settings
                                                <i className={`fa-solid fa-chevron-${openSection === "cookie" ? "up" : "down"}`}></i>
                                            </div>
                                            {openSection === "cookie" && (
                                                <div className="super-accordion-body">
                                                    <div className="super-setting-row">
                                                        <div>
                                                            <div className="label">Enable Cookie Consent</div>
                                                            <div className="desc">Turns the cookie banner on or off</div>
                                                        </div>
                                                        <Toggle on={settings.cookieConsentEnabled} onClick={() => update("cookieConsentEnabled", !settings.cookieConsentEnabled)} />
                                                    </div>
                                                    <div style={{ marginTop: '20px' }}>
                                                        <label style={{ display: "block", color: "#4c4036", fontWeight: '500', marginBottom: '4px'}}>Cookie Message Text</label>
                                                        <small style={{ color: "#999" }}>Customizable consent message shown to users</small>
                                                        <textarea rows={5} placeholder="Text here..." value={settings.cookieMessage} onChange={(e) => update("cookieMessage", e.target.value)} style={{ marginTop: '10px', width: "100%", border: "1px solid #e5ded7", borderRadius: '8px', padding: '12px', fontFamily: "inherit" }} ></textarea>
                                                    </div>
                                                    <div style={{ display: "flex", gap: '12px', marginTop: '24px' }}>
                                                        <button type="submit" className="btn" id="edit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                                                        <button type="button" className="btn" id="e-view" onClick={handleCancel}>Cancel</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="super-accordion-item">
                                            <div className="super-accordion-head" onClick={() => toggle("privacy")}>
                                                Privacy Policy &amp; Terms Settings
                                                <i className={`fa-solid fa-chevron-${openSection === "privacy" ? "up" : "down"}`}></i>
                                            </div>
                                            {openSection === "privacy" && (
                                                <div className="super-accordion-body">
                                                    <label style={{ display: "block", color: "#4c4036", fontWeight: '500', margin: "18px 0 8px" }}>Privacy Policy Content</label>
                                                    <textarea rows={7} placeholder="Text here..." value={settings.privacyPolicy} onChange={(e) => update("privacyPolicy", e.target.value)} style={{ width: "100%", border: "1px solid #e5ded7", borderRadius: '8px', padding: '12px', fontFamily: "inherit" }} ></textarea>
                                                    <label style={{ display: "block", color: "#4c4036", fontWeight: '500', margin: "20px 0 8px" }}>Terms &amp; Conditions</label>
                                                    <textarea rows={7} placeholder="Text here..." value={settings.termsConditions} onChange={(e) => update("termsConditions", e.target.value)} style={{ width: "100%", border: "1px solid #e5ded7", borderRadius: '8px', padding: '12px', fontFamily: "inherit" }} ></textarea>
                                                    <div style={{ display: "flex", gap: '12px', marginTop: '24px' }}>
                                                        <button type="submit" className="btn" id="edit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                                                        <button type="button" className="btn" id="e-view" onClick={handleCancel}>Cancel</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </form>
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

export default SuperGlobalSettings;
