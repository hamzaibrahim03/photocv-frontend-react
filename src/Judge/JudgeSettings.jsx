import { useState } from "react";
import { useNavigate } from "react-router";
import HeaderRoute from "../club_admin/HeaderRoute";
import "./assets/css/judgestyle.css";
import NavigationRoute from "../club_admin/NavigationRoute";

const API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function JudgeSettings() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters.");
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`${API_BASE}/judge/password`, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                }),
            });
            const json = await response.json();
            if (!response.ok) {
                throw new Error(json?.message || "Unable to update password.");
            }
            setSuccess("Password updated successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error("Judge password update error:", err);
            setError(err.message || "Unable to update password.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <NavigationRoute />
            <HeaderRoute title="Settings" />
            <div className="content">
                <section>
                    <div className="container" style={{ maxWidth: '1820px' }}>
                        <div className="dashboard-card" id="cl">
                            <div className="profile-card">
                                <div className="profile-left">
                                    <div className="profile-info">
                                        <span className="greeting">Account</span>
                                        <h2 className="name">Settings</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container" style={{ maxWidth: '1820px' }}>
                        <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: '12px', boxShadow: "0 0 10px rgba(0,0,0,0.08)", padding: '30px', marginTop: '22px', maxWidth: '560px' }}>
                            <h5 className="head" style={{ color: "#4c4036", marginBottom: '8px' }}>Change Password</h5>
                            <p className="text-muted" style={{ fontSize: '13px', marginBottom: '22px' }}>Enter your current password and choose a new one.</p>

                            {error && <div className="alert alert-danger" style={{ fontSize: '13px' }}>{error}</div>}
                            {success && <div className="alert alert-success" style={{ fontSize: '13px' }}>{success}</div>}

                            <label className="form-label text-muted">Current Password</label>
                            <input type="password" className="form-control mb-3" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />

                            <label className="form-label text-muted">New Password</label>
                            <input type="password" className="form-control mb-3" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} required />

                            <label className="form-label text-muted">Confirm New Password</label>
                            <input type="password" className="form-control mb-4" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} required />

                            <div className="button-group d-flex gap-2">
                                <button type="button" className="btn" id="e-view" onClick={() => navigate(-1)} >
                                    Back
                                </button>
                                <button type="submit" className="btn" id="edit" disabled={isSaving} >
                                    {isSaving ? "Saving..." : "Update Password"}
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
    );
}

export default JudgeSettings;
