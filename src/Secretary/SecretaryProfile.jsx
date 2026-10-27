import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import "./assets/css/secretarystyle.css";
import NavigationRoute from "../club_admin/NavigationRoute";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const EMPTY_FORM = {
    first_name: "", last_name: "", title: "", about: "", bio: "",
    phone: "", address: "", city: "", postcode: "", county: "", country: "",
};

function SecretaryProfile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        async function loadProfile() {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE}/account/profile`, {
                    headers: authHeaders(),
                });
                if (!response.ok) throw new Error(`Profile API error: ${response.status}`);
                const json = await response.json();
                const data = json?.data || {};
                setEmail(data.email || "");
                setProfileImage(data.profile_image_url || "");
                setForm({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    title: data.title || "",
                    about: data.about || "",
                    bio: data.bio || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    city: data.city || "",
                    postcode: data.postcode || "",
                    county: data.county || "",
                    country: data.country || "",
                });
            } catch (error) {
                console.error("Secretary profile load error:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setSaved(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await fetch(`${API_BASE}/account/profile`, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify(form),
            });
            if (!response.ok) throw new Error(`Profile save error: ${response.status}`);
            setSaved(true);
        } catch (error) {
            console.error("Secretary profile save error:", error);
            alert("Unable to save profile.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="My Profile" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card" id="cl">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <img className="img-fluid" src={profileImage || "/placeholder.jpg"} alt={form.first_name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                            <div className="profile-info">
                                                <span className="greeting">Manage your profile</span>
                                                <h2 className="name">{form.first_name} {form.last_name}</h2>
                                                <p className="role">{email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <form onSubmit={handleSave} style={{ background: "#fff", borderRadius: '12px', boxShadow: "0 0 10px rgba(0,0,0,0.08)", padding: '30px', marginTop: '22px' }}>
                                    <h5 className="head" style={{ color: "#4c4036", marginBottom: '22px' }}>Basic Information</h5>
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label text-muted">First Name</label>
                                            <input type="text" name="first_name" className="form-control" value={form.first_name} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted">Last Name</label>
                                            <input type="text" name="last_name" className="form-control" value={form.last_name} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label text-muted">Title</label>
                                            <input type="text" name="title" className="form-control" placeholder="e.g. Competition Secretary" value={form.title} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted">Email</label>
                                            <input type="email" className="form-control" value={email} disabled title="Contact support to change your email." />
                                        </div>
                                    </div>

                                    <label className="form-label text-muted">About</label>
                                    <textarea name="about" className="form-control mb-4" style={{ height: '100px', resize: "none" }} placeholder="A short summary about you..." value={form.about} onChange={handleChange} />

                                    <label className="form-label text-muted">Bio</label>
                                    <textarea name="bio" className="form-control mb-4" style={{ height: '140px', resize: "none" }} placeholder="Your background..." value={form.bio} onChange={handleChange} />

                                    <h5 className="head" style={{ color: "#4c4036", margin: '30px 0 22px' }}>Contact Information</h5>
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label text-muted">Phone</label>
                                            <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted">Address</label>
                                            <input type="text" name="address" className="form-control" value={form.address} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-md-3">
                                            <label className="form-label text-muted">City</label>
                                            <input type="text" name="city" className="form-control" value={form.city} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label text-muted">Postcode</label>
                                            <input type="text" name="postcode" className="form-control" value={form.postcode} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label text-muted">County</label>
                                            <input type="text" name="county" className="form-control" value={form.county} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label text-muted">Country</label>
                                            <input type="text" name="country" className="form-control" value={form.country} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="button-group d-flex gap-2 align-items-center" style={{ marginTop: '30px' }}>
                                        <button type="button" className="btn" id="e-view" onClick={() => navigate(-1)} >
                                            Back
                                        </button>
                                        <button type="submit" className="btn" id="edit" disabled={isSaving} >
                                            {isSaving ? "Saving..." : saved ? "Saved!" : "Save"}
                                        </button>
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
        </>
    );
}

export default SecretaryProfile;
