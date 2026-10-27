import React from 'react';
import { useNavigate } from 'react-router';
import photoLogo from '../club_admin/assets/images/photo.png';
import clubLogo from '../club_admin/assets/images/club.png';

function WhoAreYou() {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', background: '#e2e2e2', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ fontWeight: '300', fontSize: '42px', color: '#333', textAlign: 'center', margin: '0', lineHeight: '1.3px' }}>
                Who are you?<br />A photographer or a club?
            </h1>
            <div style={{ display: 'flex', gap: '28px', marginTop: '56px', width: '100%', maxWidth: '1240px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div onClick={() => navigate('/welcome/photographer')} style={{ background: '#fff', flex: '1 1 460px', maxWidth: '560px', minHeight: '440px', padding: '48px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                    <img src={photoLogo} alt="photo.cv" style={{ height: '56px', width: 'auto' }} />
                    <p style={{ color: '#666', fontSize: '16px', marginTop: '180px' }}>An easy way for you to build your profile online as a photographer</p>
                    <span style={{ alignSelf: 'flex-start', border: '1px solid #bbb', borderRadius: '20px', padding: '10px 22px', fontSize: '11px', letterSpacing: '0.1em', color: '#999', marginTop: '18px' }}>COMING SOON</span>
                </div>
                <div onClick={() => navigate('/welcome/club')} style={{ background: '#fff', flex: '1 1 460px', maxWidth: '560', minHeight: '440', padding: '48px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                    <img src={clubLogo} alt="cameraclub.website" style={{ height: '56px', width: 'auto' }} />
                    <p style={{ color: '#666', fontSize: '16px', marginTop: '180px' }}>An easy way for you to build a website for your camera club</p>
                    <span style={{ alignSelf: 'flex-start', border: '1px solid #bbb', borderRadius: '20px', padding: '10px 22px', fontSize: '11px', letterSpacing: '0.1em', color: '#999', marginTop: '18px' }}>COMING SOON</span>
                </div>
            </div>
        </div>
    );
}
export default WhoAreYou;
