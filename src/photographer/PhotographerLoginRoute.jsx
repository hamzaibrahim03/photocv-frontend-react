import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import apiClient from "../api/axios";
import logo from "./assets/images/photo.png";
import banner from "./assets/images/topics/night.jpg";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

function LoginRoute() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(() => localStorage.getItem(REMEMBERED_EMAIL_KEY) || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(() => !!localStorage.getItem(REMEMBERED_EMAIL_KEY));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        const usernameEl = usernameRef.current;
        const passwordEl = passwordRef.current;
        const syncUsername = (e) => setUsername(e.target.value);
        const syncPassword = (e) => setPassword(e.target.value);
        usernameEl?.addEventListener("input", syncUsername);
        usernameEl?.addEventListener("change", syncUsername);
        passwordEl?.addEventListener("input", syncPassword);
        passwordEl?.addEventListener("change", syncPassword);
        return () => {
            usernameEl?.removeEventListener("input", syncUsername);
            usernameEl?.removeEventListener("change", syncUsername);
            passwordEl?.removeEventListener("input", syncPassword);
            passwordEl?.removeEventListener("change", syncPassword);
        };
    }, []);

    const passwordRules = [
        { label: "8 Chars", valid: password.length >= 8 },
        { label: "A-Z", valid: /[A-Z]/.test(password) },
        { label: "a-z", valid: /[a-z]/.test(password) },
        { label: "0-9", valid: /\d/.test(password) },
        { label: "@#$", valid: /[@#$!%^&*()-+/]/.test(password) },
    ];
    const passwordStrength = passwordRules.filter((rule) => rule.valid).length;
    const strengthLabel = passwordStrength < 2 ? "Weak" : passwordStrength < 4 ? "Medium" : "Strong";
    const strengthClass = passwordStrength < 2 ? "weak" : passwordStrength < 4 ? "medium" : "strong";

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
                                    <label htmlFor="lp-username">Email</label>
                                    <div className="lp-input-wrap">
                                        <input id="lp-username" ref={usernameRef} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="you@example.com" autoComplete="username" required />
                                    </div>
                                </div>

                                <div className="lp-field">
                                    <label htmlFor="lp-password">Password</label>
                                    <div className="lp-input-wrap">
                                        <input id="lp-password" ref={passwordRef} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
                                        <button type="button" className="lp-toggle-visibility" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} >
                                            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                                        </button>
                                    </div>

                                    {password && (
                                        <div className="lp-strength">
                                            <div className="lp-strength-track">
                                                <div className={`lp-strength-fill ${strengthClass}`} style={{ width: `${(passwordStrength / passwordRules.length) * 100}%` }} ></div>
                                            </div>
                                            <div className="lp-strength-label">
                                                <span>Password strength</span>
                                                <span>{strengthLabel}</span>
                                            </div>
                                            <ul className="lp-rules">
                                                {passwordRules.map((rule) => (
                                                    <li key={rule.label} className={rule.valid ? "valid" : ""}>{rule.label}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
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

export default LoginRoute;
