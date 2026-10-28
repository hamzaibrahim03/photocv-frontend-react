import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import apiClient from "../api/axios";

function SuperProfileEdit() {
    const navigate = useNavigate();
    const { profileId } = useParams();
    const [form, setForm] = useState({
        first_name: "", last_name: "", email: "", phone: "", address: "", bio: "", about: "", status: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [profileId]);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get(`/super/profiles/${profileId}`);
            const p = response.data?.data || response.data;
            const [firstName, ...rest] = (p?.name || "").split(" ");
            setForm({
                first_name: firstName || "",
                last_name: rest.join(" ") || "",
                email: p?.email || "",
                phone: p?.phone || "",
                address: p?.address || "",
                bio: p?.bio || "",
                about: p?.about || "",
                status: p?.status ?? true,
            });
        } catch (error) {
            console.error("Error loading profile:", error);
            alert(error?.response?.data?.message || "Unable to load profile.");
            navigate("/super/profiles");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.first_name.trim()) {
            alert("First name is required.");
            return;
        }
        try {
            setIsSaving(true);
            await apiClient.put(`/super/profiles/${profileId}`, {
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                phone: form.phone,
                address: form.address,
                bio: form.bio,
                about: form.about,
                status: form.status === true || form.status === "true",
            });
            navigate(`/super/profiles/${profileId}`);
        } catch (error) {
            console.error("Error saving profile:", error);
            alert(error?.response?.data?.message || "Unable to save profile.");
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
                        <HeaderRoute title="Profiles" />
                        <div className="content">

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>

                                    <form className="super-panel" onSubmit={handleSave}>
                                        <h3>Edit Profile</h3>
                                        <div className="super-form-row">
                                            <div className="super-form-group">
                                                <label>First Name</label>
                                                <input type="text" name="first_name" placeholder="Text here..." value={form.first_name} onChange={handleChange} />
                                            </div>
                                            <div className="super-form-group">
                                                <label>Last Name</label>
                                                <input type="text" name="last_name" placeholder="Text here..." value={form.last_name} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="super-form-row">
                                            <div className="super-form-group">
                                                <label>Email</label>
                                                <input type="email" name="email" placeholder="Text here..." value={form.email} onChange={handleChange} />
                                            </div>
                                            <div className="super-form-group">
                                                <label>Phone</label>
                                                <input type="text" name="phone" placeholder="Text here..." value={form.phone} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="super-form-row">
                                            <div className="super-form-group">
                                                <label>Address</label>
                                                <input type="text" name="address" placeholder="Text here..." value={form.address} onChange={handleChange} />
                                            </div>
                                            <div className="super-form-group">
                                                <label>Status</label>
                                                <select name="status" value={String(form.status)} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value === "true" }))}>
                                                    <option value="true">Active</option>
                                                    <option value="false">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="super-form-row">
                                            <div className="super-form-group" style={{ flex: '1' }}>
                                                <label>Bio</label>
                                                <textarea name="bio" rows={3} placeholder="Text here..." value={form.bio} onChange={handleChange}></textarea>
                                            </div>
                                        </div>
                                        <div className="super-form-row">
                                            <div className="super-form-group" style={{ flex: '1' }}>
                                                <label>About</label>
                                                <textarea name="about" rows={3} placeholder="Text here..." value={form.about} onChange={handleChange}></textarea>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: '12px', marginTop: '10px' }}>
                                            <button type="submit" className="btn" id="e-view" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
                                            <button type="button" className="btn" id="edit" onClick={() => navigate(`/super/profiles/${profileId}`)} disabled={isSaving}>Cancel</button>
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

export default SuperProfileEdit;
