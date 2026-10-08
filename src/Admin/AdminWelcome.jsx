import { useNavigate } from "react-router";
import "./assets/css/adminstyle.css";

function AdminWelcome() {
    const navigate = useNavigate();

    return (
        <div className="ad-welcome">
            <div className="ad-welcome-logo">
                <span className="ring"></span>
                <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>
                        <span style={{ color: "#cc445e" }}>camera</span>
                        <span style={{ color: "#99816b" }}>club</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#999" }}>.website</div>
                </div>
            </div>
            <h1>Create your club website in minutes... Honestly!</h1>
            <p>No tech headaches, no long forms. Just a name, choose a look and you're live.</p>

            <div className="ad-shell">
                <button type="button" className="ad-btn" onClick={() => navigate("/admin/login")}>Login</button>
                <button type="button" className="ad-btn secondary" onClick={() => navigate("/admin/onboarding")}>Get Started</button>
            </div>
        </div>
    );
}

export default AdminWelcome;
