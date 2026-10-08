import { useState } from "react";
import { useNavigate } from "react-router";
import photoLogo from "../club_admin/assets/images/photo.png";
import apiClient from "../api/axios";
import "./assets/css/adminstyle.css";

function AdminSignup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        if (!agreed) {
            setError("Please agree to the Terms & Conditions.");
            return;
        }
        setError("");
        setNotice("");
        setSubmitting(true);
        try {
            await apiClient.post("/sign-up", { username, email, password, role: "member" });
            navigate("/admin/login");
        } catch (err) {
            const status = err?.response?.status;
            const message = err?.response?.data?.message;
            if (status === 409) {
                setError(message || "Username or email already in use.");
            } else {
                setError(message || "Something went wrong. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="ad-page">
            <button type="button" className="ad-back" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="ad-shell">
                <div className="ad-logo-row">
                    <img src={photoLogo} alt="photo.cv" />
                </div>
                <h2 className="ad-title">Signup</h2>

                <form onSubmit={handleSignup}>
                    <div className="ad-field">
                        <label>Username</label>
                        <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="ad-field">
                        <label>Email</label>
                        <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="ad-field">
                        <label>Password</label>
                        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="ad-checkbox-row">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
                        <span>
                            I've read and agrees to the <a href="#" onClick={(e) => e.preventDefault()}>Terms</a> &amp; <a href="#" onClick={(e) => e.preventDefault()}>Conditions</a>
                        </span>
                    </div>
                    {error && <div className="ad-error">{error}</div>}
                    {notice && <div style={{ background: "#fdf1f3", color: "#cc445e", borderRadius: 8, padding: "12px 14px", fontSize: 13, marginBottom: 20 }}>{notice}</div>}

                    <button type="submit" className="ad-btn" disabled={submitting}>{submitting ? "Signing up..." : "Signup"}</button>
                </form>

                <div className="ad-switch-link">
                    Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/login"); }}>Login</a>
                </div>
                <div style={{ textAlign: "center", color: "#999", marginBottom: 18 }}>or</div>
                <div className="ad-social-row">
                    <button type="button" title="Google"><i className="fa-brands fa-google"></i></button>
                    <button type="button" title="Facebook"><i className="fa-brands fa-facebook-f"></i></button>
                    <button type="button" title="Apple"><i className="fa-brands fa-apple"></i></button>
                </div>
            </div>
        </div>
    );
}

export default AdminSignup;
