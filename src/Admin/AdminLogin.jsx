import { useState } from "react";
import { useNavigate } from "react-router";
import apiClient from "../api/axios";
import photoLogo from "../club_admin/assets/images/photo.png";
import "./assets/css/adminastyle.css";

function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError("Please enter both username and password.");
            return;
        }
        if (!agreed) {
            setError("Please agree to the Terms & Conditions.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const response = await apiClient.post("/login", { email: username, password });
            const { user, token } = response.data.data;
            const role = user.roles[0].name;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            const roleRoutes = {
                club_admin: "/dashboard",
                member: "/about",
                judge: "/judge/dashboard",
                speaker: "/speaker/dashboard",
                secretary: "/secretary/dashboard",
                super_admin: "/super/dashboard",
            };
            navigate(roleRoutes[role] || "/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section>
                <div className="container" style={{ maxWidth: '1820px' }}>
                    <div className="ad-page">
                        <button type="button" className="ad-back" onClick={() => navigate(-1)}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div className="ad-shell">
                            <div className="ad-logo-row">
                                <img src={photoLogo} alt="photo.cv" />
                            </div>
                            <h2 className="ad-title">Login</h2>

                            <form onSubmit={handleLogin}>
                                <div className="ad-field">
                                    <label>Username</label>
                                    <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="ad-field">
                                    <label>Password</label>
                                    <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="ad-checkbox-row">
                                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: '3px' }} />
                                    <span>
                                        I've read and agrees to the <a href="#" onClick={(e) => e.preventDefault()}>Terms</a> &amp; <a href="#" onClick={(e) => e.preventDefault()}>Conditions</a>
                                    </span>
                                </div>
                                {error && <div className="ad-error">{error}</div>}

                                <button type="submit" className="ad-btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                            </form>

                            <div className="ad-switch-link">
                                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/signup"); }}>Signup</a>
                            </div>
                            <div style={{ textAlign: "center", color: "#999", marginBottom: '18px' }}>or</div>
                            <div className="ad-social-row">
                                <button type="button" title="Google"><i className="fa-brands fa-google"></i></button>
                                <button type="button" title="Facebook"><i className="fa-brands fa-facebook-f"></i></button>
                                <button type="button" title="Apple"><i className="fa-brands fa-apple"></i></button>
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

export default AdminLogin;
