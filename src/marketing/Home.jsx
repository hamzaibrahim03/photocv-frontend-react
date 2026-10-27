import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import apiClient from '../api/axios';
import photoLogo from '../club_admin/assets/images/photo.png';
import clubLogo from '../club_admin/assets/images/club.png';
import photographerBg from '../club_admin/assets/images/dashboard/c1.jpg';
import clubBg from '../club_admin/assets/images/topics/night.jpg';

const PHOTOGRAPHER_FEATURES = [
    { icon: 'fa-palette', title: 'Create your Photography profile', text: 'Build a stunning portfolio that showcases your best work and unique style', bg: '#fdf1e5' },
    { icon: 'fa-images', title: 'Showcase your Work & Style', text: 'Display your photography across multiple categories and collections', bg: '#fdf1e5' },
    { icon: 'fa-user-plus', title: 'Join Clubs & Events', text: 'Participate in photography clubs and attend exclusive community events', bg: '#fdeaf0' },
    { icon: 'fa-award', title: 'Connect with other creators', text: 'Network with fellow photographers and collaborate on creative projects', bg: '#fdeaf0' },
];

const CLUB_FEATURES = [
    { icon: 'fa-user-plus', title: 'Create a Club Page', text: "Set up your club's online presence with a customized page", bg: '#fdeaf0' },
    { icon: 'fa-calendar-days', title: 'Post Photography Competitions', text: 'Host exciting competitions and challenges to engage your members', bg: '#fdeaf0' },
    { icon: 'fa-people-group', title: 'Manage Members & Activities', text: 'Efficiently organize your club members and track all activities', bg: '#fdeaf0' },
    { icon: 'fa-chart-line', title: 'Grow your Club Community', text: "Attract new members and expand your club's community", bg: '#fdeaf0' },
];


function FeatureCard({ icon, title, text, bg }) {
    return (
        <div style={{ background: "#FFFFFFCC", borderRadius: '18px', padding: "24px", boxShadow: "0px 1.27px 3.82px 0px #0000001A", minHeight: '252px', width: "100%", minWidth: '0', boxSizing: "border-box", textAlign: 'center', }} >
            <div style={{ width: '71px', height: '71px', flexShrink: '0', borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: '16px', Left: '20px' }} >
                <i className={`fa-solid ${icon}`} style={{ color: "#cc445e", fontSize: '20px' }} />
            </div>
            <div style={{ fontWeight: '600', fontSize: '20px', color: "#333", marginBottom: '8px', overflowWrap: "break-word", }} >
                {title}
            </div>
            <div style={{ fontSize: '16px', color: "#888", lineHeight: '1.5', fontWeight: '400', overflowWrap: "break-word", }} >
                {text}
            </div>
        </div>
    );
}

function FooterRow({ icon, children, last }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: last ? 0 : 24 }}>
            <div style={{ width: '44px', height: '44px', flexShrink: '0', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={icon} style={{ color: '#4c4036', fontSize: '16px' }}></i>
            </div>
            <div style={{ fontSize: '15px', lineHeight: '1.4' }}>{children}</div>
        </div>
    );
}

function ProfileCard({ member }) {
    const handleShare = async (e) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/welcome`;
        const shareData = { title: member.name, text: `Check out ${member.name} on photo.cv`, url: shareUrl };
        try {
            if (navigator.share) await navigator.share(shareData);
            else { await navigator.clipboard.writeText(shareUrl); alert('Link copied to clipboard!'); }
        } catch (error) {
            if (error.name !== 'AbortError') console.error('Share failed:', error);
        }
    };

    return (
        <div className="bg-white text-center shadow-sm" style={{ padding: '20px 14px', width: '266px', height: '268px', borderRadius: '8px', border: '0.78px solid #99816B' }}>
            {member.avatar ? (
                <img src={member.avatar} className="rounded-circle d-block mx-auto object-fit-cover" style={{ width: '150px', height: '150px' }} alt="Profile" onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
            ) : (
                <div className="rounded-circle d-flex mx-auto justify-content-center align-items-center bg-light" style={{ width: '80px', height: '80px' }}>
                    <i className="fa-regular fa-user text-secondary" style={{ fontSize: '28px' }}></i>
                </div>
            )}
            <div className="d-flex justify-content-center gap-2" style={{ marginTop: '-20px' }}>
                <a href="#" onClick={(e) => e.preventDefault()} className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#99816b', color: 'white', width: '27px', height: '27px', fontSize: '10px' }}><i className="fab fa-facebook-f"></i></a>
                <a href="#" onClick={(e) => e.preventDefault()} className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: '#cc445e', color: 'white', width: '27px', height: '27px', fontSize: '10px' }}><i className="fab fa-instagram"></i></a>
                <button type="button" onClick={handleShare} className="d-flex align-items-center justify-content-center rounded-circle border-0" style={{ backgroundColor: '#99816b', color: 'white', width: '27px', height: '27px', fontSize: '10px' }} title="Share"><i className="fa-solid fa-share-nodes"></i></button>
            </div>
            <h6 style={{ margin: '10px 0 0', fontSize: '19px', fontWeight: '500' }}>{member.name || 'Username'}</h6>
            <small style={{ color: '#cc445e', fontSize: '11px', fontWeight: '400' }}>{member.role}</small>
        </div>
    );
}

function ClubCard({ club, navigate }) {
    return (
        <div className="bg-white shadow-sm rounded " style={{ cursor: 'pointer', width: '261px', height: '262px', borderRadius: '8px', border: '0.78px solid #99816B' }} onClick={() => navigate('/login')}>
            <div >
                <img src={club.cover || '/placeholder.jpg'} alt={club.name} style={{ width: '100%', height: '145px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
            </div>
            <div style={{ padding: '12px' }}>
                <h6 style={{ fontSize: '15px', fontWeight: '500' }}>{club.name}</h6>
                <p style={{ fontSize: '10px', fontWeight: '400', color: '#999', margin: '4px 0 8px' }}>{club.tagline || 'A photography club'}</p>
                <div className="d-flex justify-content-between" style={{ fontSize: '10px', color: '#aaa' }}>
                    <span style={{ fontSize: '10px', fontWeight: '400' }}><i className="fa-regular fa-user me-1"></i>{club.membersCount} members</span>
                    {club.established && <span style={{ fontSize: '10px', fontWeight: '400' }}><i className="fa-regular fa-calendar me-1"></i>Est.{club.established}</span>}
                </div>
            </div>
        </div>
    );
}

function Home() {
    const navigate = useNavigate();
    const goPhotographer = () => navigate('/photographer/login');
    const goClub = () => navigate('/login');

    const [members, setMembers] = useState([]);
    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        apiClient.get('/public/directory/members', { params: { limit: '12px' } })
            .then((res) => setMembers(Array.isArray(res.data?.data) ? res.data.data : []))
            .catch((error) => console.error('Error loading directory members:', error));
        apiClient.get('/public/directory/clubs', { params: { limit: '12px' } })
            .then((res) => setClubs(Array.isArray(res.data?.data) ? res.data.data : []))
            .catch((error) => console.error('Error loading directory clubs:', error));
    }, []);

    const recentMembers = members.slice(0, 3);
    const topMembers = useMemo(() => [...members].sort((a, b) => b.photoCount - a.photoCount).slice(0, 3), [members]);
    const featuredMembers = useMemo(() => [...members].sort(() => Math.random() - 0.5).slice(0, 3), [members]);

    const recentClubs = clubs.slice(0, 3);
    const topClubs = useMemo(() => [...clubs].sort((a, b) => b.membersCount - a.membersCount).slice(0, 3), [clubs]);
    const featuredClubs = useMemo(() => [...clubs].sort(() => Math.random() - 0.5).slice(0, 3), [clubs]);

    const memberSections = [
        { label: 'Top Profiles', items: topMembers },
        { label: 'Recent Profiles', items: recentMembers },
        { label: 'Featured Profiles', items: featuredMembers },
    ];
    const clubSections = [
        { label: 'Top Clubs', items: topClubs },
        { label: 'Recent Clubs', items: recentClubs },
        { label: 'Featured Clubs', items: featuredClubs },
    ];

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', background: '#fff' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid #eee' }}>
                <button type="button" style={{ background: 'none', border: 'none', color: '#666', fontSize: '14px' }}><i className="fa-solid fa-bars me-2"></i>Menu</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={photoLogo} alt="photo.cv" style={{ height: '48px', width: '174px' }} />
                    <img src={clubLogo} alt="cameraclub.website" style={{ height: '48px', width: '207px' }} />
                </div>
                <a href="#contact" style={{ color: '#333', fontSize: '14px', textDecoration: 'underline' }}>Contact Us</a>
            </header>

            <section style={{ display: 'flex', minHeight: '693px' }}>
                <div style={{ flex: '1', position: 'relative', minHeight: '693px' }}>
                    <img src={photographerBg} alt="" style={{ position: 'absolute', inset: '0', width: '100%', height: '693px', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: '0', background: 'rgba(20,15,12,0.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
                        <h2 style={{ color: '#fff', fontWeight: '300', fontSize: '54px', margin: '0' }}>For Photographers</h2>
                        <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '523px', fontSize: '20px', margin: '10px 0 20px', fontWeight: '300' }}>An easy way for you to build your profile online as a photographer</p>
                        <button type="button" onClick={goPhotographer} style={{ background: '#cc445e', color: '#fff', border: 'none', borderRadius: '59px', padding: '11px 40px', fontSize: '20px', fontWeight: '400', width: '287px', height: '54px' }}>Join as Photographer</button>
                    </div>
                </div>
                <div style={{ flex: '1', position: 'relative', minHeight: '693px' }}>
                    <img src={clubBg} alt="" style={{ position: 'absolute', inset: '0', width: '100%', height: '693px', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(204,68,94,0.55), rgba(90,20,40,0.6))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
                        <h2 style={{ color: '#fff', fontWeight: '300', fontSize: '54px', margin: '0' }}>For Clubs</h2>
                        <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '523px', fontSize: '20px', margin: '10px 0 20px', fontWeight: '300' }}>An easy way for you to build a website for your camera club</p>
                        <button type="button" onClick={goClub} style={{ background: '#fff', color: '#333', border: 'none', borderRadius: '59px', padding: '11px 44px', fontSize: '20px', fontWeight: '400', width: '257px', height: '54px' }}>Create Club</button>
                    </div>
                </div>
            </section>

            <section style={{ display: 'flex', gap: '48px', padding: '48px 60px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 420px' }}>
                    <h4 style={{ textAlign: 'center', fontWeight: '400', fontSize: '26px', color: '#333' }}>Built For Your Success</h4>
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '20px', fontWeight: '400', marginBottom: '20px' }}>Tools designed to help you showcase your work and connect with opportunities</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        {PHOTOGRAPHER_FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
                    </div>
                </div>
                <div style={{ flex: '1 1 420px' }}>
                    <h4 style={{ textAlign: 'center', fontWeight: '400', fontSize: '26px', color: '#333' }}>Everything Your Club Needs</h4>
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '20px', fontWeight: '400', marginBottom: '20px' }}>Powerful tools to help you grow and manage your photography community</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        {CLUB_FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
                    </div>
                </div>
            </section>

            <section style={{ display: 'flex', gap: '48px', padding: '0 60px 48px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 420px' }}>
                    {memberSections.map(({ label, items }) => (
                        <div key={label} style={{ marginBottom: '28px' }}>
                            <h5 style={{ textAlign: 'center', color: '#333' }}>{label}</h5>
                            <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginBottom: '16px' }}>Discover talented photographers from around the world</p>
                            {items.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                                    {items.map((member) => <ProfileCard key={member.id} member={member} />)}
                                </div>
                            ) : (
                                <div style={{ border: '1px dashed #ddd', borderRadius: '10px', padding: '28px 16px', textAlign: 'center', color: '#aaa', fontSize: '13px' }}>
                                    No profiles yet &mdash; be the first!
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div style={{ flex: '1 1 420px' }}>
                    {clubSections.map(({ label, items }) => (
                        <div key={label} style={{ marginBottom: '28px' }}>
                            <h5 style={{ textAlign: 'center', color: '#333' }}>{label}</h5>
                            <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginBottom: '16px' }}>Join vibrant communities of like-minded creatives</p>
                            {items.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                                    {items.map((club) => <ClubCard key={club.id} club={club} navigate={navigate} />)}
                                </div>
                            ) : (
                                <div style={{ border: '1px dashed #ddd', borderRadius: '10px', padding: '28px 16px', textAlign: 'center', color: '#aaa', fontSize: '13px' }}>
                                    No clubs yet &mdash; be the first!
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ background: 'linear-gradient(135deg, #4c4036, #cc445e)', padding: '100px 390px', textAlign: 'center', height: '527px' }}>
                <h2 style={{ color: '#fff', fontWeight: '500', margin: '0 auto', fontSize: '58px', width: '100%', maxWidth: '713px', textAlign: 'center', }} > Ready to Join the Creative Community? </h2>
                <p style={{ color: '#fff', fontWeight: '400', margin: '0 auto', fontSize: '24px', width: '1092px', maxWidth: '1092px', textAlign: 'center', margin: '12px auto 24px' }}>Whether you're a photographer looking to showcase your work or a club wanting to build a community, we've got you covered</p>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button type="button" onClick={goPhotographer} style={{ background: '#fff', color: '#333', border: 'none', borderRadius: '40px', padding: '12px 26px', fontSize: '18px', fontWeight: '500', height: '54px', width: '244px' }}>Join as Photographer</button>
                    <button type="button" onClick={goClub} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '40px', padding: '12px 26px', fontSize: '18px', fontWeight: '500', height: '54px', width: '180px' }}>Create a Club</button>
                </div>
            </section>

            <footer id="contact" style={{ display: 'flex', flexWrap: 'wrap', height: '750px' }}>
                <div style={{ flex: '1 1 400px', minHeight: '280px', position: 'relative' }}>
                    <img src={clubBg} alt="" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: '1 1 400px', background: '#99816b', color: '#fff', padding: '100px 50px' }}>
                    <h5 style={{ fontSize: '30px', fontWeight: '400', marginBottom: '32px' }}>Contact Us</h5>
                    <FooterRow icon="fa-solid fa-location-dot"><span>123 Street, Town, City, Country</span></FooterRow>
                    <FooterRow icon="fa-solid fa-phone"><span>+44 123-456-789</span></FooterRow>
                    <FooterRow icon="fa-solid fa-envelope" last><span>hello@photo.cv</span></FooterRow>

                    <h5 style={{ fontSize: '30px', fontWeight: '400', margin: '48px 0 32px' }}>Follow Us</h5>
                    <FooterRow icon="fa-brands fa-facebook-f">
                        <div style={{ fontWeight: '600 ' }}>Facebook</div>
                        <div style={{ opacity: '0.85' }}>www.facebook.com/photo.cv</div>
                    </FooterRow>
                    <FooterRow icon="fa-brands fa-instagram">
                        <div style={{ fontWeight: '600 ' }}>Instagram</div>
                        <div style={{ opacity: '0.85' }}>www.instagram.com/photo.cv</div>
                    </FooterRow>
                    <FooterRow icon="fa-brands fa-flickr" last>
                        <div style={{ fontWeight: '600 ' }}>Flickr</div>
                        <div style={{ opacity: '0.85' }}>www.flickr.com/photo.cv</div>
                    </FooterRow>
                </div>
            </footer>
        </div>
    );
}
export default Home;
