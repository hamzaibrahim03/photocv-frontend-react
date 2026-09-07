import React, { useState } from 'react';
function ClubLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const handleLogin = (e) => {
        e.preventDefault();
        console.log({
            email,
            password,
            remember
        });
    };
    return (
        <div className="login-container d-flex flex-column bg-white shadow-sm rounded mx-auto overflow-hidden align-items-center" style={{ minHeight: '100vh', maxWidth: '1500px', width: '100%' }}>
            <img src="/assets/images/club.png" alt="Logo" className="top-logo mb-4" />
            <div className="login-box d-flex w-100 overflow-hidden" style={{ maxWidth: '1500px' }}>
                <div className="left-box d-flex flex-column justify-content-center p-5" style={{ flex: 1 }}>
                    <h2 className="text-center mb-3" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '48px', color: '#4C4036' }}>Login</h2>
                    <p className="text-secondary text-center mb-4">Log in to access your club dashboard.</p>
                    <form onSubmit={handleLogin} className="mx-auto" style={{ width: '600px', maxWidth: '100%' }}>
                        <div className="inputBox mb-4 position-relative">
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                placeholder="Username/Email"
                                required
                                style={{ width: '100%', height: '50px', padding: '10px 14px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px' }}
                            />
                        </div>
                        <div className="inputBox mb-3 position-relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                placeholder="Password"
                                required
                                style={{ width: '100%', height: '50px', padding: '10px 14px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px' }}
                            />
                        </div>
                        <div className="remember-forgot d-flex justify-content-between align-items-center mb-4" style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
                            <div className="remember-left d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
                                <input type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                                <label htmlFor="remember" style={{ cursor: 'pointer', margin: 0 }}>Remember me</label>
                            </div>
                            <a href="change_password.html" style={{ color: '#cc445e', textDecoration: 'none' }}>Forgot Password</a>
                        </div>
                        <button type="submit" className="btn text-white w-100 head border-0" style={{ backgroundColor: '#3d302b', height: '60px', fontSize: '1.5rem', borderRadius: '5px' }} onMouseOver={(e) => e.target.style.backgroundColor = '#2b1e19'} onMouseOut={(e) => e.target.style.backgroundColor = '#3d302b'}>
                            Login
                        </button>
                    </form>
                </div>
                <div className="or-divider d-flex align-items-center justify-content-center text-muted" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    <span className="fw-medium px-2" style={{ fontSize: '13px' }}>OR</span>
                </div>
                <div className="right-box d-flex flex-column justify-content-center align-items-center p-5" style={{ flex: 1 }}>
                    <h3 className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '48px', textAlign: 'center' }}>Create your club website in minutes... Honestly!</h3>
                    <p className="text-center mb-5" style={{ width: '500px', maxWidth: '100%' }}>
                        No tech headaches, no long forms. Just pick a name, choose a look,
                        and you're live. Perfect for clubs that want to make an impact
                        without the hassle.
                    </p>
                    <a href="/signup">
                        <button className="start-btn border-0 text-white" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '18px', width: '500px', maxWidth: '100%', height: '60px', borderRadius: '7px', backgroundColor: '#CC445E' }}>
                            Let's Get Started
                        </button>
                    </a>
                </div>
            </div>
            <footer className="w-100 text-center py-4 text-muted" style={{ fontSize: '12px' }}>
                <p className="mb-0">Powered by PhotoCV</p>
            </footer>
        </div>
    );
};
export default ClubLogin;
