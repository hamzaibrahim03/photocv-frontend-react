import React, { useState } from 'react';
function Step5AccountSignup({ formData, updateFormData, onPrevious, onSubmit, submitting }) {
    const { username, email, password } = formData;
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);
    const passwordRules = [
        { label: "8 Chars", valid: password.length >= 8 },
        { label: "A-Z", valid: /[A-Z]/.test(password) },
        { label: "a-z", valid: /[a-z]/.test(password) },
        { label: "0-9", valid: /\d/.test(password) },
        { label: "@#$", valid: /[@#$!%^&*()-+/]/.test(password) },
    ];
    const passwordStrength = passwordRules.filter((rule) => rule.valid).length;
    const strengthLabel = passwordStrength < 2 ? "Weak" : passwordStrength < 4 ? "Medium" : "Strong";
    const strengthClass = passwordStrength < 2 ? "" : passwordStrength < 4 ? "medium" : "strong";
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const showMismatch = confirmTouched && confirmPassword.length > 0 && password !== confirmPassword;
    const handleContinue = () => {
        setConfirmTouched(true);
        if (!username.trim()) {
            setFormError('Please enter a username.');
            return;
        }
        if (!password) {
            setFormError('Please enter a password.');
            return;
        }
        if (!confirmPassword) {
            setFormError('Please confirm your password.');
            return;
        }
        if (password !== confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }
        setFormError('');
        onSubmit?.();
    };
    return (
        <div className="sp-form">
                <div className="sp-field">
                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" className="sp-input" value={username} onChange={(e) => updateFormData({ username: e.target.value })} />
                </div>
                
            <div className="sp-row">
                <div className="sp-field">
                    <label htmlFor="password">Password</label>
                    <div className="sp-password-wrap">
                        <input id="password" type={showPassword ? "text" : "password"} className="sp-input" value={password} onChange={(e) => updateFormData({ password: e.target.value })} placeholder="Password" required />
                        <button type="button" className="sp-toggle-visibility" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>
                            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                        </button>
                    </div>
                    {password && (
                        <div className="sp-meter">
                            <div className="sp-meter-track">
                                <div className={`sp-meter-fill ${strengthClass}`} style={{ width: `${(passwordStrength / passwordRules.length) * 100}%` }}></div>
                            </div>
                            <div className="sp-meter-label">
                                <span>Password strength</span>
                                <span>{strengthLabel}</span>
                            </div>
                            <ul className="sp-rules">
                                {passwordRules.map((rule) => (
                                    <li key={rule.label} className={rule.valid ? "valid" : ""}>{rule.label}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="sp-field">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="sp-password-wrap">
                        <input id="confirm-password" type={showConfirmPassword ? "text" : "password"} className="sp-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={() => setConfirmTouched(true)} placeholder="Confirm Password" required />
                        <button type="button" className="sp-toggle-visibility" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword((visible) => !visible)}>
                            <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                        </button>
                    </div>
                    {confirmPassword && (
                        <div className="sp-meter">
                            <div className="sp-meter-track">
                                <div className={`sp-meter-fill ${passwordsMatch ? "strong" : ""}`} style={{ width: "100%" }}></div>
                            </div>
                            <div className="sp-meter-label">
                                <span>Password match</span>
                                <span>{passwordsMatch ? "Matched" : "Not matched"}</span>
                            </div>
                        </div>
                    )}
                    {showMismatch && <span className="sp-field-error">Passwords do not match.</span>}
                    {formError && !showMismatch && <span className="sp-field-error">{formError}</span>}
                </div>
            </div>
            <div className="sp-actions">
                <button className="btn" id="e-view" type="button" onClick={onPrevious}>Previous</button>
                <button className="btn" id="edit" style={{width: '160px', maxWidth: '160px'}} type="button" disabled={submitting || !username  || !password || !confirmPassword || password !== confirmPassword} onClick={handleContinue} >
                    {submitting && <span className="sp-spinner"></span>}
                    {submitting ? 'Launching...' : 'Launch Club'}
                </button>
            </div>
        </div>
    );
}
export default Step5AccountSignup;
