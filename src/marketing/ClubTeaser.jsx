import React from 'react';
import { useNavigate } from 'react-router';
import clubLogo from '../club_admin/assets/images/club.png';
import banner from '../club_admin/assets/images/dashboard/c1.jpg';

function ClubTeaser() {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', position: 'relative' }}>
                <button type="button" onClick={() => navigate('/welcome/choose')} style={{ position: 'absolute', top: '32px', left: '32px', border: 'none', background: 'transparent', color: '#999', cursor: 'pointer', fontSize: '14px' }}>
                    <i className="fa-solid fa-arrow-left me-2"></i>Back
                </button>
                <img src={clubLogo} alt="cameraclub.website" style={{ height: '64px', width: 'auto' }} />
                <p style={{ color: '#666', fontSize: '17px', marginTop: '36px', maxWidth: '440px' }}>An easy way for you to build a website for your camera club</p>
                <span style={{ alignSelf: 'flex-start', border: '1px solid #bbb', borderRadius: '20px', padding: '10px 22px', fontSize: '11px', letterSpacing: '0.1em', color: '#999', marginTop: '24px' }}>COMING SOON</span>
            </div>
            <div style={{ flex: '1 1 50%', position: 'relative', minHeight: '400px' }}>
                <img src={banner} alt="" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
        </div>
    );
}
export default ClubTeaser;
