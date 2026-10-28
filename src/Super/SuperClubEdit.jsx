import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import apiClient from "../api/axios";

const STATUS_OPTIONS = ["active", "inactive"];
const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

function SuperClubEdit() {
    const navigate = useNavigate();
    const { clubId } = useParams();
    const isEditMode = Boolean(clubId);
    const [clubs, setClubs] = useState([]);
    const [form, setForm] = useState({ name: "", tagline: "", established: "", status: "" });
    const [logoPreview, setLogoPreview] = useState("");
    const [thumbPreview, setThumbPreview] = useState("");
    const [logoFile, setLogoFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchClubsSummary();
        if (isEditMode) {
            fetchClub();
        } else {
            setIsLoading(false);
        }
    }, [clubId]);

    const fetchClubsSummary = async () => {
        try {
            const response = await apiClient.get("/super/clubs");
            const data = response.data?.data || response.data;
            setClubs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading clubs summary:", error);
        }
    };

    const fetchClub = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get(`/super/clubs/${clubId}`);
            const existing = response.data?.data || response.data;
            if (existing) {
                setForm({
                    name: existing.name || "",
                    tagline: existing.tagline || "",
                    established: existing.established || "",
                    status: existing.status || "",
                });
                setLogoPreview(existing.logo || "");
                setThumbPreview(existing.cover || "");
            }
        } catch (error) {
            console.error("Error loading club:", error);
            alert(error?.response?.data?.message || "Unable to load club.");
            navigate("/super/clubs");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFile = (e, setPreview, setFile) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            alert("Club name is required.");
            return;
        }
        const hasFile = Boolean(logoFile || coverFile);
        try {
            setIsSaving(true);
            if (hasFile) {
                const payload = new FormData();
                payload.append("club_name", form.name);
                payload.append("tag_line", form.tagline);
                payload.append("established_year", form.established);
                if (logoFile) payload.append("logo", logoFile);
                if (coverFile) payload.append("cover", coverFile);
                if (isEditMode) {
                    await apiClient.post(`/super/clubs/${clubId}`, payload, {
                        headers: { "Content-Type": "multipart/form-data" },
                        params: { _method: "PUT" },
                    });
                } else {
                    await apiClient.post("/super/clubs", payload, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                }
            } else {
                const jsonPayload = {
                    club_name: form.name,
                    tag_line: form.tagline,
                    established_year: form.established,
                };
                if (isEditMode) {
                    await apiClient.put(`/super/clubs/${clubId}`, jsonPayload);
                } else {
                    await apiClient.post("/super/clubs", jsonPayload);
                }
            }
            navigate("/super/clubs");
        } catch (error) {
            console.error("Error saving club:", error);
            alert(error?.response?.data?.message || "Unable to save club.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Clubs" />
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
                                                            <>
                                                                <i className="fa-regular fa-circle-user" style={{ fontSize: '54px', color: "#e5ded7" }}></i>
                                                                <h2 className="name">{storedUser.first_name || "Admin"} {storedUser.last_name || ""}</h2>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="search-bar d-flex justify-content-space-between">
                                                <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                <i className="fas fa-search"></i>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Total Clubs</small>
                                                <h3 className="number">{clubs.length}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Total Members</small>
                                                <h3 className="number">{clubs.reduce((s, c) => s + (c.membersCount || 0), 0)}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <form className="super-panel" onSubmit={handleSave}>
                                        <h3>{isEditMode ? "Edit Club" : "Add Club"}</h3>
                                        <div className="super-form-row">
                                            <div className="super-form-group">
                                                <label>Club Name</label>
                                                <input type="text" name="name" placeholder="Text here..." value={form.name} onChange={handleChange} />
                                            </div>
                                            <div className="super-form-group">
                                                <label>Club Tagline</label>
                                                <input type="text" name="tagline" placeholder="Text here..." value={form.tagline} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="super-form-row">
                                            <div className="super-form-group">
                                                <label>Established Year</label>
                                                <select name="established" value={form.established} onChange={handleChange}>
                                                    <option value="">- Select -</option>
                                                    {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                                                </select>
                                            </div>
                                            <div className="super-form-group">
                                                <label>Status</label>
                                                <select name="status" value={form.status} onChange={handleChange}>
                                                    <option value="">- Select -</option>
                                                    {STATUS_OPTIONS.map((s) => <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="super-form-row">
                                            <div className="super-form-group">
                                                <label>Logo</label>
                                                <label className="super-upload-box">
                                                    {logoPreview ? <img className="preview" src={logoPreview} alt="logo" /> : (
                                                        <>
                                                            <i className="fa-regular fa-image" style={{ fontSize: '24px' }}></i>
                                                            <span>Upload Logo</span>
                                                        </>
                                                    )}
                                                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e, setLogoPreview, setLogoFile)} />
                                                </label>
                                            </div>
                                            <div className="super-form-group">
                                                <label>Thumbnail</label>
                                                <label className="super-upload-box">
                                                    {thumbPreview ? <img className="preview" src={thumbPreview} alt="thumbnail" /> : (
                                                        <>
                                                            <i className="fa-regular fa-image" style={{ fontSize: '24px' }}></i>
                                                            <span>Upload Thumbnail</span>
                                                        </>
                                                    )}
                                                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e, setThumbPreview, setCoverFile)} />
                                                </label>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: '12px', marginTop: '10px' }}>
                                            <button type="submit" className="btn" id="e-view" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
                                            <button type="button" className="btn" id="edit" onClick={() => navigate("/super/clubs")} disabled={isSaving}>Cancel</button>
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

export default SuperClubEdit;
