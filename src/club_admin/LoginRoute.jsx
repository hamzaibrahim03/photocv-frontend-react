import { useState } from "react";
import { useNavigate } from "react-router";
import apiClient from "../api/axios";
import "./assets/css/adminstyle.css";
import logo from "./assets/images/club.png";
import sample from "./assets/images/sample.png";
function LoginRoute() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const passwordRules = [
        { label: "8 Chars", valid: password.length >= 8 },
        { label: "A-Z", valid: /[A-Z]/.test(password) },
        { label: "a-z", valid: /[a-z]/.test(password) },
        { label: "0-9", valid: /\d/.test(password) },
        { label: "@#$", valid: /[@#$!%^&*()-+/]/.test(password) },
    ];
    const passwordStrength = passwordRules.filter((rule) => rule.valid).length;
    const strengthLabel = passwordStrength < 2 ? "Weak" : passwordStrength < 4 ? "Medium" : "Strong";
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
            console.log(role);
            console.log(user);
            console.log(token);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            if (role === "club_admin") {
                navigate("/dashboard");
            } else if (role === "member") {
                navigate("/about");
            } else if (role === "Internal Comp Secretary") {
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="acontainer">
            <div className="login-container" style={{ overflow: 'auto' }}>
                <div className="logo-box">
                    <img src={logo} alt="Camera Club Logo" />
                </div>
                <h3>Login</h3>
                <form onSubmit={login}>
                    <div className="inputBox mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="inputBox mb-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <button
                            type="button"
                            id="togglePassword"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((visible) => !visible)}
                        >
                            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="strength-box">
                        <div className="strength-header">
                            <span>Password Strength</span>
                            <span id="strengthText">{strengthLabel}</span>
                        </div>
                        <div className={`progress ${passwordStrength === passwordRules.length ? "strong" : ""}`} aria-label="Password strength">
                            <div id="progressBar" style={{ width: `${passwordStrength * 20}%` }}></div>
                        </div>
                    </div>
                    <ul className="rules">
                        {passwordRules.map((rule) => (
                            <li key={rule.label} className={rule.valid ? "valid" : "invalid"}>
                                {rule.label}
                            </li>
                        ))}
                    </ul>
                    <div className="remember-forgot">
                        <div className="remember-left">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="/change-password">Forgot Password</a>
                    </div>
                    <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                {error && <p className="error">{error}</p>}
                <footer className="asite-footer">Copyright &copy; 2024 photo.cv</footer>
            </div>
            <div className="image-container" style={{ backgroundImage: `url(${sample})`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
        </div>
    );
}
export default LoginRoute;
