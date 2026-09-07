import React, { useState } from 'react';
function Step5AccountSignup({ onPrevious }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const handleContinue = () => {
        if (!password) {
            setPasswordError('Please enter a password.');
            return;
        }
        if (!confirmPassword) {
            setPasswordError('Please confirm your password.');
            return;
        }
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }
        console.log('Password matched');
    };
    return (
        <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" className="form-control" style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" className="form-control" value={password} onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                    }}
                        style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="confirm-password">
                        Confirm Password
                    </label>
                    <input id="confirm-password" type="password" className="form-control" value={confirmPassword} onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError('');
                    }}
                        style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }}
                    />
                    {passwordError && (
                        <small className="text-danger">
                            {passwordError}
                        </small>
                    )}
                </div>
            </div>
            <div className="button-group" style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', alignItems: 'center' }}>
                <button className="btn" id="e-view" type="button" onClick={onPrevious}>Previous</button>
                <button className="btn" id="e-edit" type="button" style={{ width: '190px', maxWidth: '170px' }} disabled={
                    !password ||
                    !confirmPassword ||
                    password !== confirmPassword
                }
                    onClick={handleContinue}>Launch Club</button>
            </div>
        </div>
    );
}
export default Step5AccountSignup;
