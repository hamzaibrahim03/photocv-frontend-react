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
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const showMismatch = confirmTouched && confirmPassword.length > 0 && password !== confirmPassword;
    const handleContinue = () => {
        setConfirmTouched(true);
        if (!username.trim()) {
            setFormError('Please enter a username.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setFormError('Please enter a valid email address.');
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
        <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" className="form-control" value={username} onChange={(e) => updateFormData({ username: e.target.value })} style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
            <label htmlFor="email">Email</label>
            <input id="email" type="email" className="form-control" value={email} onChange={(e) => updateFormData({ email: e.target.value })} style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="password">Password</label>
                    <div className='inputBox mb-3' style={{ width: '400px' }}>
                        <input id="password" type={showPassword ? "text" : "password"} className="form-control" value={password} onChange={(e) => updateFormData({ password: e.target.value })} placeholder="Password" required style={{ width: '400px', borderRadius: '5px', height: '50px' }} />
                        <button type="button" id="togglePassword" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} >
                            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="strength-box" style={{ width: '390px' }}>
                        <div className="strength-header">
                            <span>Password Strength</span>
                            <span id="strengthText">{strengthLabel}</span>
                        </div>
                        <div className={`progress ${passwordStrength === passwordRules.length ? "strong" : ""}`} aria-label="Password strength">
                            <div id="progressBar" style={{ width: `${passwordStrength * 20}%` }}></div>
                        </div>
                    </div>
                    <ul className="rules" style={{ width: '390px' }}>
                        {passwordRules.map((rule) => (
                            <li key={rule.label} className={rule.valid ? "valid" : "invalid"}>
                                {rule.label}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-6">
                    <label htmlFor="confirm-password">
                        Confirm Password
                    </label>
                    <div className='inputBox mb-3' style={{ width: '400px' }}>
                        <input id="confirm-password" type={showConfirmPassword ? "text" : "password"} className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={() => setConfirmTouched(true)} placeholder="Confirm Password" required style={{ width: '400px', borderRadius: '5px', height: '50px' }} />
                        <button type="button" id="togglePassword" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword((visible) => !visible)} >
                            <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="strength-box" style={{ width: '390px' }}>
                        <div className="strength-header">
                            <span>Password Match</span>
                            <span>{passwordsMatch ? "Matched" : confirmPassword ? "Not matched" : ""}</span>
                        </div>
                        <div className={`progress ${passwordsMatch ? "strong" : ""}`} aria-label="Password match status">
                            <div style={{ width: passwordsMatch ? "100%" : confirmPassword ? "100%" : "0%", backgroundColor: passwordsMatch ? undefined : confirmPassword ? "#dc3545" : undefined }}></div>
                        </div>
                    </div>
                    {showMismatch && (
                        <small className="text-danger d-block mt-2">
                            Passwords do not match.
                        </small>
                    )}
                    {formError && !showMismatch && (
                        <small className="text-danger d-block mt-2">
                            {formError}
                        </small>
                    )}
                </div>
            </div>
            <div className="button-group" style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', alignItems: 'center' }}>
                <button className="btn" id="e-view" type="button" onClick={onPrevious}>Previous</button>
                <button className="btn" id="e-edit" type="button" style={{ width: '190px', maxWidth: '170px' }} disabled={
                    submitting ||
                    !username ||
                    !email ||
                    !password ||
                    !confirmPassword ||
                    password !== confirmPassword
                }
                    onClick={handleContinue}>{submitting ? 'Launching...' : 'Launch Club'}</button>
            </div>
        </div>
    );
}
export default Step5AccountSignup;
