import { useState, useEffect } from 'react';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from "../Ryton/extra/LoaderAll.jsx";
import apiClient from '../api/axios';
import Hea from '../club_admin/assets/icons/gallery/heart.svg';
import Com from '../club_admin/assets/icons/gallery/comment.svg';

function greetingMessage() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning!";
    if (hour === 12) return "Good noon!";
    if (hour > 12 && hour < 17) return "Good afternoon!";
    if (hour >= 17 && hour < 21) return "Good evening!";
    return "Good night!";
}


function ProfileDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const getSocialLink = (name) => {
        return (
            (profile?.socialLinks || []).find((item) => item?.social_media_name?.toLowerCase() === name.toLowerCase())?.social_link || "#"
        );
    };

    useEffect(() => {
        async function loadDashboard() {
            setIsLoading(true);
            setLoadError(null);
            try {
                const response = await apiClient.get('/photographer/dashboard');
                const data = response.data?.data || response.data;
                setProfile(data);
            } catch (error) {
                console.error('Error loading photographer dashboard:', error);
                setProfile(null);
                const status = error?.response?.status;
                if (status === 401) {
                    setLoadError("You're not signed in, or your session has expired. Please log in again.");
                } else if (status === 403) {
                    setLoadError("Your account doesn't have access to the photographer dashboard.");
                } else {
                    setLoadError('Could not load your dashboard. Please try again later.');
                }
            } finally {
                setIsLoading(false);
            }
        }
        loadDashboard();
    }, []);

    const totalPages = Math.max(Math.ceil((profile?.galleries?.length || 0) / rowsPerPage), 1);


    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && !profile && (
                    <p className="super-empty-note" style={{ padding: '30px' }}>{loadError}</p>
                )}
                {!isLoading && profile && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Profile" />
                        <div className="content">
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">{greetingMessage()}</small>
                                                    <h2 className="name">{profile.first_name} {profile.last_name}</h2>
                                                    <small className="role">{profile.category}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">My Photos</small>
                                                <h3 className="number">{profile.photoCount ?? 0}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Interactions</small>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{(profile.likesCount ?? 0) + (profile.commentsCount ?? 0)}</h3>
                                                    </div>
                                                    <div className="days col-md-7">
                                                        <span>Likes & Comments</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="bg-white rounded shadow-sm" style={{ overflow: "hidden", border: "1px solid #cfc7c1", }}>
                                        <div className="row align-items-center" style={{ padding: "20px 25px", }}>
                                            <div className="col-md-3 text-center">
                                                <img style={{ width: "192px", height: "192px", borderRadius: "50%", objectFit: "cover", background: "#eee", }} src={profile.avatar} alt={profile.name} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                <div className="social-media-icons d-flex justify-content-center gap-2 mt-n4 position-relative" style={{ top: '-5px' }}>
                                                    <a href={getSocialLink("facebook")} target="_blank" rel="noreferrer" style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#99816b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </a>
                                                    <a href={getSocialLink("instagram")} target="_blank" rel="noreferrer" style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#cc445e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </a>
                                                    <a href={getSocialLink("twitter")} target="_blank" rel="noreferrer" style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#99816b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", }}>
                                                        <i className="fab fa-twitter"></i>
                                                    </a>
                                                </div>
                                                <h3 style={{ fontSize: "18px", marginTop: "10px", marginBottom: "3px", color: "#4c4540", }}>
                                                    {profile.name}
                                                </h3>
                                                <small style={{ color: "#cc445e", }}>
                                                    {profile.category}
                                                </small>
                                            </div>
                                            <div className="col-md-9" style={{ paddingLeft: "20px", }}>
                                                <h5 style={{ color: "#cc445e", fontSize: "15px", marginBottom: "12px", }}>
                                                    {profile.bio}
                                                </h5>
                                                <p style={{ color: "#625b55", lineHeight: '1.55', marginBottom: "15px", }}>
                                                    {profile.about}
                                                </p>
                                                <div className="row" style={{ color: "#625b55", }}>
                                                    <div className="col-md-12">
                                                        <strong>
                                                            Email:
                                                        </strong>{" "}
                                                        {profile.email}
                                                    </div>
                                                </div>
                                                <div className="row" style={{ color: "#625b55", }}>
                                                    <div className="col-md-6">
                                                        <strong>
                                                            Phone:
                                                        </strong>{" "}
                                                        {profile.phone || "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ background: "#cc445e", color: "#fff", padding: "12px 30px", display: "flex", justifyContent: "space-between", fontSize: '13.5px' }}>
                                            <span>{profile.photoCount ?? 0} <i className="fa-regular fa-image"></i>&nbsp;&nbsp;{profile.comments?.length ?? 0} <i className="fa-regular fa-comment"></i></span>
                                            <span>Status: {profile.status ? "Active" : "Inactive"}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="row" style={{ marginTop: "20px", }}>
                                        <div className="col-md-6">
                                            <div className="bg-white rounded shadow-sm" style={{ padding: "18px", height: "304px", overflowY: "auto", }}>
                                                <h5 style={{ color: "#4d4742", marginBottom: "15px", }}>
                                                    Clubs
                                                </h5>
                                                {(profile.clubs || []).length === 0 && <p className="super-empty-note">Not a member of any club yet.</p>}
                                                {(profile.clubs || []).map((c, i) => (
                                                    <div key={`${c.name}-${i}`} style={{ display: "flex", alignItems: "center", gap: '12px', padding: "10px 0", borderBottom: "1px solid #f2eee9" }}>
                                                        <img src={c.image || "/placeholder.jpg"} alt={c.name} style={{ width: '44px', height: '34px', borderRadius: '6px', objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                        <div style={{ flex: '1' }}>
                                                            <div style={{ color: "#4c4036", fontWeight: '500' }}>{c.name}</div>
                                                            <small style={{ color: "#999" }}>Member since {c.since}</small>
                                                        </div>
                                                        <span style={{ color: "#2f9e5c", fontSize: '12px' }}>● Active</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="bg-white rounded shadow-sm" style={{ padding: "18px", height: "304px", overflowY: "auto", }}>
                                                <h5 style={{ color: "#4d4742", marginBottom: "15px", }}>
                                                    Recent Comments
                                                </h5>
                                                {(profile.comments || []).length === 0 && <p className="super-empty-note">No comments on this member's photos yet.</p>}
                                                {(profile.comments || []).map((c, i) => (
                                                    <div key={i}>
                                                        <div className="row align-items-center">
                                                            <div className="col-md-2">
                                                                <img src={c.image || "/placeholder.jpg"} alt="" style={{ width: '60px', height: '45px', borderRadius: '7px', objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                            </div>
                                                            <div className="col-md-7">
                                                                <p style={{ fontSize: "12px", marginBottom: "4px", fontWeight: '700', fontStyle: 'Bold' }}>
                                                                    <strong style={{ fontSize: "12px", marginBottom: "4px", fontWeight: '700', fontStyle: 'Bold', color: "#cc445e", }}>
                                                                        {c.name}
                                                                    </strong>{" "}
                                                                    {c.text}
                                                                </p>
                                                                <small style={{ color: "#aaa", fontSize: '10px', fontWeight: '400' }}>
                                                                    {c.text}
                                                                </small>
                                                            </div>
                                                            <div className="col-md-3 text-right">
                                                                <small style={{ color: "#999", }}>
                                                                    {c.time}
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <hr style={{ margin: "10px 0", }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="row" style={{ marginTop: "20px", }}>
                                        <div className="col-md-6">
                                            <div className="bg-white rounded shadow-sm" style={{ padding: "18px", height: "304px", overflowY: "auto", }}>
                                                <h5 style={{ color: "#4d4742", marginBottom: "15px", }}>
                                                    {profile.name.split(" ")[0]}'s Competition Entries
                                                </h5>
                                                {(profile.entries || []).length === 0 && <p className="super-empty-note">No competition entries yet.</p>}
                                                {(profile.entries || []).map((entry, entryIndex) => (
                                                    <div key={`${entry.name}-${entryIndex}`} style={{ display: "flex", alignItems: "center", gap: '10px', padding: "10px 0", borderBottom: "1px solid #f2eee9", flexWrap: "wrap" }}>
                                                        {entry.images.slice(0, 3).map((img, i) => (
                                                            <div key={i} style={{ position: "relative" }} title={img.award?.standing || ""}>
                                                                <img src={img.image} alt="" style={{ width: '60px', height: '45px', borderRadius: '7px', objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                            </div>
                                                        ))}
                                                        <span style={{ color: "#cc445e", fontWeight: '700', marginLeft: '8px', fontSize: '16px' }}>{entry.name.trim()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="bg-white rounded shadow-sm" style={{ padding: "18px", height: "304px", overflowY: "auto", }}>
                                                <h5 style={{ color: "#4d4742", marginBottom: "15px", }}>
                                                    {profile.name.split(" ")[0]}'s Awards
                                                </h5>
                                                {(profile.awards || []).length === 0 && <p className="super-empty-note">No awards yet.</p>}
                                                <div style={{ display: "flex", flexWrap: 'wrap', gap: '20px' }}>
                                                    {(profile.awards || []).map((award, i) => (
                                                        <div key={i} style={{ position: "relative" }} title={award.standing}>
                                                            <img src={award.image || "/placeholder.jpg"} alt={award.standing || ""} style={{ width: "107px", height: '80px', objectFit: "cover", borderRadius: '7px' }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                            <span style={{ position: 'absolute', bottom: '-14px', left: '50%', transform: 'translateX(-50%)', fontSize: '14px', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px' }}>
                                                                🏅
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="bg-white rounded shadow-sm" style={{ marginTop: "20px", padding: "10px", overflow: "hidden", }}>
                                        <div style={{ padding: "15px 20px", borderBottom: "1px solid #eee", }}>
                                            <h4 style={{ margin: '0', color: "#4d4742", fontSize: "20px", }}>
                                                {profile.name}'s Gallery ({profile.photoCount ?? 0})
                                            </h4>
                                        </div>
                                        {(profile.galleries || []).length === 0 && <p className="super-empty-note">No galleries yet.</p>}
                                        <div className="galleriy" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
                                            {(profile.galleries || []).slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((g, i) => (
                                                <div className="galleriy-item" key={`${g.label}-${i}`} title={g.award?.standing || ""}>
                                                    <img src={g.image || "/placeholder.jpg"} alt={g.label} style={{ width: "370px", height: "277px", objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                    <div className="galleriy-info">
                                                        <div className="galleriy-infos d-flex justify-content-between align-items-center" style={{ padding: "5px 20px", }}>
                                                            <div className="gal-details">
                                                                <span>
                                                                    {g.label}
                                                                </span>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <div className="icons">
                                                                    <span>
                                                                        {g.likesCount || 0}
                                                                    </span>
                                                                    <img src={Hea} alt="likes" style={{ width: "14px", height: "14px", }} />
                                                                </div>
                                                                <div className="icons">
                                                                    <span>
                                                                        {g.commentsCount || 0}
                                                                    </span>
                                                                    <img src={Com} alt="comments" style={{ width: "14px", height: "14px", }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {totalPages > 1 && (
                                            <div className="super-dt-paging">
                                                <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>‹</button>
                                                {Array.from({ length: totalPages }, (_, i) => (
                                                    <button key={i + 1} className={currentPage === i + 1 ? "current" : ""} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                                ))}
                                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>›</button>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="row" style={{ marginTop: '10px' }}>
                                        <div className="col-md-6">
                                            <div className="comments-cards" style={{ height: '400px', overflowY: 'auto', width: '750px', backgroundColor: 'white', margin: '0', padding: '20px 30px' }}>
                                                <h5>My Interests</h5>
                                                <div className="d-flex gap-4">
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                                    <div className="d-flex flex-column">
                                                        <p><label className="role">Colour Competition</label></p>
                                                        <div className='d-flex'>
                                                            <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>Remove&nbsp;</a> | <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>&nbsp;Edit</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="d-flex gap-4">
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                                    <div className="d-flex flex-column">
                                                        <p><label className="role">Print Competition</label></p>
                                                        <div className='d-flex'>
                                                            <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>Remove&nbsp;</a> | <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>&nbsp;Edit</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="d-flex gap-4">
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                                    <div className="d-flex flex-column">
                                                        <p><label className="role">Potrait Competition</label></p>
                                                        <div className='d-flex'>
                                                            <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>Remove&nbsp;</a> | <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>&nbsp;Edit</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="d-flex gap-4">
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                                    <div className="d-flex flex-column">
                                                        <p><label className="role">Colour Competition</label></p>
                                                        <div className='d-flex'>
                                                            <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>Remove&nbsp;</a> | <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>&nbsp;Edit</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="d-flex gap-4">
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                                    <div className="d-flex flex-column">
                                                        <p><label className="role">Print Competition</label></p>
                                                        <div className='d-flex'>
                                                            <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>Remove&nbsp;</a> | <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>&nbsp;Edit</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="d-flex gap-4">
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '20px' }} />
                                                    <div className="d-flex flex-column">
                                                        <p><label className="role">Potrait Competition</label></p>
                                                        <div className='d-flex'>
                                                            <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>Remove&nbsp;</a> | <a href="#" className="text-secondary" style={{ textDecoration: 'none' }}>&nbsp;Edit</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="comments-cards" style={{ height: '400px', overflowY: 'auto', width: '710px', backgroundColor: 'white', margin: '0 0 0 20px', padding: '20px 30px' }}>
                                                <h5>My Brands</h5>
                                                <div className="d-flex gap-5" style={{ marginBottom: '20px' }}>
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                </div>
                                                <div className="d-flex gap-5" style={{ marginBottom: '20px' }}>
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                </div>
                                                <div className="d-flex gap-5" style={{ marginBottom: '20px' }}>
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                </div>
                                                <div className="d-flex gap-5" style={{ marginBottom: '20px' }}>
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                </div>
                                                <div className="d-flex gap-5" style={{ marginBottom: '20px' }}>
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwnV8LkTIy4XG-9tvNJ6fSirzZTW8I5e12L7ylOgrzrg&s=10" style={{ width: '60px', height: '60px', borderRadius: '2px' }} alt="br" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="row" style={{ marginTop: '20px' }}>
                                        <div className="col-md-6">
                                            <div className="card profile-links-card" style={{ padding: '20px 30px' }}>
                                                <h5>My Social Links</h5>
                                                <div className="social-contact-row">
                                                    <div className="social-media-icones social-media-icones--facebook">
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div className="row-body">
                                                        <p className="row-title">Facebook</p>
                                                        <p className="row-sub">www.facebook.com/username</p>
                                                    </div>
                                                    <a href="#" className="btn-edit">Edit</a>
                                                </div>
                                                <div className="social-contact-row">
                                                    <div className="social-media-icones social-media-icones--instagram">
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div className="row-body">
                                                        <p className="row-title">Instagram</p>
                                                        <p className="row-sub">www.instagram.com/username</p>
                                                    </div>
                                                    <a href="#" className="btn-edit">Edit</a>
                                                </div>
                                                <div className="social-contact-row">
                                                    <div className="social-media-icones social-media-icones--twitter">
                                                        <i className="fab fa-twitter"></i>
                                                    </div>
                                                    <div className="row-body">
                                                        <p className="row-title">Twitter</p>
                                                        <p className="row-sub">www.twitter.com/username</p>
                                                    </div>
                                                    <a href="#" className="btn-edit">Edit</a>
                                                </div>
                                                <div className="button-group">
                                                    <button className="btn me-2" id="e-view">Add</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card profile-links-card" style={{ padding: '20px 30px' }}>
                                                <h5>My Contact</h5>
                                                <div className="social-contact-row">
                                                    <div className="contact-icon">
                                                        <i className="fas fa-location-dot"></i>
                                                    </div>
                                                    <div className="row-body">
                                                        <p className="row-sub row-sub--solo">123, Street, Town, City, Country</p>
                                                    </div>
                                                    <a href="#" className="btn-edit">Edit</a>
                                                </div>
                                                <div className="social-contact-row">
                                                    <div className="contact-icon">
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                    <div className="row-body">
                                                        <p className="row-sub row-sub--solo">123 - 456 - 789</p>
                                                    </div>
                                                    <a href="#" className="btn-edit">Edit</a>
                                                </div>
                                                <div className="social-contact-row">
                                                    <div className="contact-icon">
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                    <div className="row-body">
                                                        <p className="row-sub row-sub--solo">username@example.com</p>
                                                    </div>
                                                    <a href="#" className="btn-edit">Edit</a>
                                                </div>
                                                <div className="button-group">
                                                    <button className="btn me-2" id="e-view">Add</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank">cameraclub.website</a></p>
                                </div>
                            </footer>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default ProfileDashboard;
