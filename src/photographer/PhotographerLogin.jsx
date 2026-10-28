import { useState } from "react";
import { useNavigate } from "react-router";
import apiClient from "../api/axios";
import logo from "../club_admin/assets/images/photo.png";
import banner from "../club_admin/assets/images/topics/night.jpg";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

function PhotographerLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(() => localStorage.getItem(REMEMBERED_EMAIL_KEY) || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(() => !!localStorage.getItem(REMEMBERED_EMAIL_KEY));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError("Please enter both email and password.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const response = await apiClient.post("/login", { email: username, password: password });
            const { user, token } = response.data.data;
            const role = user.roles[0].name;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            if (remember) {
                localStorage.setItem(REMEMBERED_EMAIL_KEY, username);
            } else {
                localStorage.removeItem(REMEMBERED_EMAIL_KEY);
            }
            const roleRoutes = {
                club_admin: "/dashboard",
                member: "/about",
                judge: "/judge/dashboard",
                speaker: "/speaker/dashboard",
                secretary: "/secretary/dashboard",
                Secretary: "/secretary/dashboard",
                super_admin: "/super/dashboard",
            };
            navigate(roleRoutes[role] || "/about");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lp-page">
            <div className="lp-banner">
                <img src={banner} alt="" />
            </div>
            <div className="lp-content">
                <div className="lp-split">
                    <div className="lp-form-pane">
                        <div className="lp-card">
                            <div className="lp-logo">
                                <img src={logo} alt="photo.cv" />
                            </div>
                            <h3 className="lp-title">Login</h3>
                            <p className="lp-subtitle">Log in to access your photographer dashboard.</p>

                            <form onSubmit={login} noValidate>
                                <div className="lp-field">
                                    <label htmlFor="pl-username">Email</label>
                                    <div className="lp-input-wrap">
                                        <input id="pl-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="you@example.com" autoComplete="username" required />
                                    </div>
                                </div>

                                <div className="lp-field">
                                    <label htmlFor="pl-password">Password</label>
                                    <div className="lp-input-wrap">
                                        <input id="pl-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
                                        <button type="button" className="lp-toggle-visibility" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)}>
                                            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="lp-row">
                                    <label className="lp-remember" htmlFor="pl-remember">
                                        <input id="pl-remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                                        Remember me
                                    </label>
                                    <a className="lp-forgot" href="/change-password">Forgot Password</a>
                                </div>

                                <button type="submit" className="lp-submit" disabled={loading}>
                                    {loading && <span className="lp-spinner"></span>}
                                    {loading ? "Logging in..." : "Login"}
                                </button>

                                {error && <p className="lp-error">{error}</p>}
                            </form>
                        </div>
                    </div>

                    <div className="lp-divider">
                        <span className="lp-divider-line"></span>
                        <span className="lp-divider-label">OR</span>
                        <span className="lp-divider-line"></span>
                    </div>

                    <div className="lp-promo-pane">
                        <h2 className="lp-promo-title">Launch your photography website in minutes!</h2>
                        <p className="lp-promo-text">No tech headaches, no long forms. Just pick a name, choose a look and you're live. Perfect for photographers who want to showcase their work without the hassle.</p>
                        <h3 className="lp-promo-sub">So how long have you got?</h3>
                        <div className="lp-promo-buttons">
                            <button type="button" className="lp-promo-btn" onClick={() => navigate('/signup/photo')}>2 minutes</button>
                            <button type="button" className="lp-promo-btn secondary" onClick={() => navigate('/signup/photo')}>5 minutes</button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="lp-footer">Copyright &copy; 2024 photo.cv</footer>
        </div>
    );
}

export default PhotographerLogin;
