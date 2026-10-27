import { useState } from "react";
import { useNavigate } from "react-router";
import apiClient from "../api/axios";
import "./assets/css/loginstyle.css";
import logo from "./assets/images/club.png";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

function LoginRoute() {
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
            setError("Please enter both username and password.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const response = await apiClient.post("/login", {
                email: username,
                password: password,
            });
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
            navigate(roleRoutes[role] || "/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lp-page">
            <div className="lp-content" style={{ flex: '1' }}>
                <div className="lp-split" style={{ flexDirection: 'column', maxWidth: '1000px', alignItems: 'center' }}>
                    <div className="lp-logo" style={{ marginBottom: '36px' }}>
                        <img src={logo} alt="cameraclub.website" style={{ height: '72px' }} />
                    </div>
                    <div className="lp-split" style={{ width: '100%' }}>
                        <div className="lp-form-pane">
                            <div className="lp-card">
                                <h3 className="lp-title">Login</h3>
                                <p className="lp-subtitle">Log in to access your club dashboard.</p>

                                <form onSubmit={login} noValidate>
                                    <div className="lp-field">
                                        <label htmlFor="lp-username">Email</label>
                                        <div className="lp-input-wrap">
                                            <input id="lp-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="you@example.com" autoComplete="username" required />
                                        </div>
                                    </div>

                                    <div className="lp-field">
                                        <label htmlFor="lp-password">Password</label>
                                        <div className="lp-input-wrap">
                                            <input id="lp-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
                                            <button type="button" className="lp-toggle-visibility" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} >
                                                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="lp-row">
                                        <label className="lp-remember" htmlFor="lp-remember">
                                            <input id="lp-remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
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
                            <h2 className="lp-promo-title">Create your club website in minutes... Honestly!</h2>
                            <p className="lp-promo-text">No tech headaches, no long forms. Just pick a name, choose a look, and you're live. Perfect for clubs that want to make an impact without the hassle.</p>
                            <div className="lp-promo-buttons">
                                <button type="button" className="lp-promo-btn" style={{ width: '100%' }} onClick={() => navigate('/signup')}>Let's Get Started</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="lp-footer">Copyright &copy; 2024 photo.cv</footer>
        </div>
    );
}
export default LoginRoute;
