import { useEffect, useState } from "react";
import Hea from '../club_admin/assets/icons/gallery/heart.svg';
import Com from '../club_admin/assets/icons/gallery/comment.svg';
import { useNavigate, useParams } from "react-router";
import NavigationRoute from "../club_admin/NavigationRoute";
import "./assets/css/superstyle.css";
import HeaderRoute from "../club_admin/HeaderRoute";
import Loader from "../Ryton/extra/LoaderAll";
import apiClient from "../api/axios";

function SuperProfileDetail() {
    const navigate = useNavigate();
    const { profileId } = useParams();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const getSocialLink = (name) => {
        return (
            (profile?.socialLinks || []).find((item) => item?.social_media_name?.toLowerCase() === name.toLowerCase())?.social_link || "#"
        );
    };
    useEffect(() => {
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId]);

    async function loadProfile() {
        setIsLoading(true);
        try {
            const response = await apiClient.get(`/super/profiles/${profileId}`);
            const data = response.data?.data || response.data;
            setProfile(data);
        } catch (error) {
            console.error("Error loading profile:", error);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && !profile && (
                    <p className="super-empty-note" style={{ padding: 30 }}>Profile not found.</p>
                )}
                {!isLoading && profile && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Profiles" />
                        <div className="content">

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card" style={{ width: "152%" }}>
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <h2 className="name">Member Profile</h2>
                                                </div>
                                            </div>
                                            <div className="search-bar d-flex justify-content-space-between">
                                                <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                <i className="fas fa-search"></i>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Images</small>
                                                <h3 className="number">{profile.photoCount ?? 0}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Galleries</small>
                                                <h3 className="number">{profile.galleryCount ?? 0}</h3>
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
                                                <p style={{ color: "#625b55", lineHeight: 1.55, marginBottom: "15px", }}>
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
                                        <div style={{ background: "#cc445e", color: "#fff", padding: "12px 30px", display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
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
                                                    <div key={`${c.name}-${i}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f2eee9" }}>
                                                        <img src={c.image || "/placeholder.jpg"} alt={c.name} style={{ width: '44px', height: '34px', borderRadius: '6px', objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ color: "#4c4036", fontWeight: 500 }}>{c.name}</div>
                                                            <small style={{ color: "#999" }}>Member since {c.since}</small>
                                                        </div>
                                                        <span style={{ color: "#2f9e5c", fontSize: 12 }}>● Active</span>
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
                                                    <div key={`${entry.name}-${entryIndex}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f2eee9", flexWrap: "wrap" }}>
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
                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                                                    {(profile.awards || []).map((award, i) => (
                                                        <div key={i} style={{ position: "relative" }} title={award.standing}>
                                                            <img src={award.image || "/placeholder.jpg"} alt={award.standing || ""} style={{ width: "107px", height: '80px', objectFit: "cover", borderRadius: '7px' }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                                                            <span style={{ position: "relative", bottom: 4, right: 4, fontSize: 16 }}>🏅</span>
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
                                    <div className="bg-white rounded shadow-sm" style={{ marginTop: "20px", padding: "0", overflow: "hidden", }}>
                                        <div style={{ padding: "15px 20px", borderBottom: "1px solid #eee", }}>
                                            <h4 style={{ margin: 0, color: "#4d4742", fontSize: "20px", }}>
                                                {profile.name}'s Gallery ({profile.photoCount ?? 0})
                                            </h4>
                                        </div>
                                        {(profile.galleries || []).length === 0 && <p className="super-empty-note">No galleries yet.</p>}
                                        <div className="galleriy" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
                                            {(profile.galleries || []).map((g, i) => (
                                                <div className="galleriy-item" key={`${g.label}-${i}`} title={g.award?.standing || ""}>
                                                    <img src={g.image || "/placeholder.jpg"} alt={g.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
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
                                    </div>

                                    <button type="button" className="btn" id="e-view" style={{ marginTop: 20 }} onClick={() => navigate(-1)}>Back</button>
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default SuperProfileDetail;
