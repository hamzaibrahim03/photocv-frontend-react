import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import apiClient from "./api/axios";
import "./club_admin/assets/css/loginstyle.css";
import logo from "./club_admin/assets/images/club.png";

function ChangePassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [step, setStep] = useState(token ? 3 : 1);
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [linkSent, setLinkSent] = useState(false);
    const [devResetUrl, setDevResetUrl] = useState("");

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setError("");
        setStep(2);
    };

    const handleSendLink = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await apiClient.post("/forgot-password", { email });
            setDevResetUrl(response.data?.data?.dev_reset_url || "");
            setLinkSent(true);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to send reset link.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            await apiClient.post("/reset-password", {
                token,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to reset password. The link may have expired.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setError("");
        if (step === 1 || step === 3) {
            if (step === 3 && !token) {
                setLinkSent(false);
                setStep(2);
                return;
            }
            navigate("/login");
            return;
        }
        if (step === 2) {
            setLinkSent(false);
            setStep(1);
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
                                {step !== 4 && (
                                    <button type="button" className="cp-back-btn" onClick={handleBack} aria-label="Back">
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </button>
                                )}

                                {step === 1 && (
                                    <>
                                        <div className="cp-icon-circle"><i className="fa-solid fa-lock"></i></div>
                                        <h3 className="lp-title">Forgot Password</h3>
                                        <p className="lp-subtitle">Provide your account's email for which you want to reset your password.</p>

                                        {error && <p style={{ color: '#cc445e', fontSize: '13px', marginBottom: '14px' }}>{error}</p>}

                                        <form onSubmit={handleEmailSubmit} noValidate>
                                            <div className="lp-field">
                                                <label htmlFor="forgot-email">Email</label>
                                                <div className="lp-input-wrap">
                                                    <input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="username" required />
                                                </div>
                                            </div>
                                            <button type="submit" className="lp-submit">Next</button>
                                        </form>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <div className="cp-icon-circle"><i className="fa-solid fa-list-check"></i></div>
                                        <h3 className="lp-title">Make Selection</h3>
                                        <p className="lp-subtitle">Select which contact detail we should use to reset your password.</p>

                                        {error && <p style={{ color: '#cc445e', fontSize: '13px', marginBottom: '14px' }}>{error}</p>}

                                        {linkSent ? (
                                            <>
                                                <p style={{ color: '#2e7d32', fontSize: '13.5px', textAlign: 'center', margin: '10px 0 0' }}>
                                                    A reset link has been sent to <strong>{email}</strong>. Open it to continue.
                                                </p>
                                                {devResetUrl && (
                                                    <div style={{ marginTop: '18px', padding: '12px', background: '#faf7f3', border: '1px dashed #e3d9cd', borderRadius: '10px' }}>
                                                        <p style={{ fontSize: '11px', color: '#99816b', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Dev only - no mail server configured</p>
                                                        <a href={devResetUrl} style={{ fontSize: '13px', color: '#cc445e', wordBreak: 'break-all' }}>{devResetUrl}</a>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <button type="button" className="cp-option-card" disabled title="SMS delivery isn't set up yet">
                                                    <span className="cp-option-icon"><i className="fa-solid fa-comment-sms"></i></span>
                                                    <span>
                                                        <span className="cp-option-label" style={{ display: 'block' }}>via SMS</span>
                                                        <span className="cp-option-value">Not available yet</span>
                                                    </span>
                                                    <span className="cp-option-badge">Coming soon</span>
                                                </button>
                                                <button type="button" className="cp-option-card" onClick={handleSendLink} disabled={loading}>
                                                    <span className="cp-option-icon"><i className="fa-solid fa-envelope"></i></span>
                                                    <span>
                                                        <span className="cp-option-label" style={{ display: 'block' }}>via Email</span>
                                                        <span className="cp-option-value">{email}</span>
                                                    </span>
                                                    {loading && <span className="lp-spinner" style={{ marginLeft: 'auto' }}></span>}
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}

                                {step === 3 && (
                                    <>
                                        <div className="cp-icon-circle"><i className="fa-solid fa-shield-halved"></i></div>
                                        <h3 className="lp-title">New Credentials</h3>
                                        <p className="lp-subtitle">Your identity has been verified! Set your new password.</p>

                                        {error && <p style={{ color: '#cc445e', fontSize: '13px', marginBottom: '14px' }}>{error}</p>}

                                        <form onSubmit={handleResetSubmit} noValidate>
                                            <div className="lp-field">
                                                <label htmlFor="new-password">New Password</label>
                                                <div className="lp-input-wrap">
                                                    <input id="new-password" type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" minLength={8} required />
                                                    <button type="button" className="lp-toggle-visibility" aria-label={showNewPassword ? "Hide password" : "Show password"} onClick={() => setShowNewPassword((v) => !v)} >
                                                        <i className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="lp-field">
                                                <label htmlFor="confirm-password">Confirm Password</label>
                                                <div className="lp-input-wrap">
                                                    <input id="confirm-password" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" minLength={8} required />
                                                    <button type="button" className="lp-toggle-visibility" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword((v) => !v)} >
                                                        <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <button type="submit" className="lp-submit" disabled={loading}>
                                                {loading && <span className="lp-spinner"></span>}
                                                {loading ? "Updating..." : "Update"}
                                            </button>
                                        </form>
                                    </>
                                )}

                                {step === 4 && (
                                    <>
                                        <div className="cp-icon-circle success"><i className="fa-solid fa-check"></i></div>
                                        <h3 className="lp-title">Password Updated</h3>
                                        <p className="lp-subtitle">Your password has been updated!</p>
                                        <button type="button" className="lp-submit" onClick={() => navigate("/login")}>Login</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
