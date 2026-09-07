import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import Loader from '../React/extra/LoaderAll';
import Ima from './assets/icons/gallery/image.svg';
import Hea from './assets/icons/gallery/heart.svg';
import Com from './assets/icons/gallery/comment.svg';
import Share from "./assets/icons/event_list/share.svg"
import Book from "./assets/icons/event_list/bookmark.svg"
import { API_URL, readApiResponse } from '../api/axios';
function GalleryRoute() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [memberGallery, setMemberGallery] = useState([]);
    const [clubGallery, setClubGallery] = useState([]);
    const [memberCount] = useState(0);
    const [eventDay] = useState(0);
    const [search, setSearch] = useState("");
    const [bookmarkOpenId, setBookmarkOpenId] = useState(null);
    const [shareOpenId, setShareOpenId] = useState(null);
    const popupRef = useRef(null);
    const [savedLibrary, setSavedLibrary] = useState(() => {
        return JSON.parse(
            localStorage.getItem("savedLibrary") || "[]"
        );
    });
    useEffect(() => {
        function handleClickOutside(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setBookmarkOpenId(null);
                setShareOpenId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const toggleBookmark = (item, category) => {
        const existingLibrary = JSON.parse(
            localStorage.getItem("savedLibrary") || "[]"
        );
        const itemId = item.id ?? item.gallery_id;
        const alreadySaved = existingLibrary.some(
            saved =>
                saved.id === itemId &&
                saved.category === category
        );
        let updatedLibrary;
        if (alreadySaved) {
            updatedLibrary = existingLibrary.filter(
                saved =>
                    !(
                        saved.id === itemId &&
                        saved.category === category
                    )
            );
        } else {
            const isMemberGallery = item.gallery_type === "member" ||
                Array.isArray(item.galleries);
            const isClubGallery = item.gallery_type === "club" ||
                Array.isArray(item.photos);
            const memberGallery = isMemberGallery
                ? item.galleries?.[0] || {}
                : {};
            const memberPhoto = memberGallery.photos?.[0] || {};
            const clubPhoto = isClubGallery
                ? item.photos?.[0] || {}
                : {};
            const title = isMemberGallery
                ? memberGallery.gallery_name ||
                memberPhoto.title ||
                "Gallery"
                : clubPhoto.title ||
                item.gallery_name ||
                "Gallery";
            const image = isMemberGallery
                ? memberPhoto.image_url ||
                memberPhoto.image ||
                ""
                : clubPhoto.image ||
                clubPhoto.image_url ||
                "";
            const totalPhotos = isMemberGallery
                ? item.gallery_total_photos ??
                memberGallery.gallery_total_photos ??
                memberGallery.photos?.length ??
                0
                : item.total_photos ??
                item.gallery_total_photos ??
                item.photos?.length ??
                0;
            const totalLikes = isMemberGallery
                ? item.gallery_total_likes ??
                memberGallery.gallery_total_likes ??
                0
                : item.gallery_total_likes ??
                clubPhoto.likes_count ??
                0;
            const totalComments = isMemberGallery
                ? item.gallery_total_comments ??
                memberGallery.gallery_total_comments ??
                0
                : item.gallery_total_comments ??
                clubPhoto.comments_count ??
                0;
            const libraryItem = {
                id: itemId,
                category: category,
                gallery_type:
                    isMemberGallery
                        ? "member"
                        : "club",
                title: title,
                description:
                    item.description || "",
                date:
                    item.created_at || "",
                image: image,
                profileImage:
                    item.profile_image_url || "",
                photos: totalPhotos,
                likes: totalLikes,
                comments: totalComments,
                originalData: item,
                savedAt: new Date().toISOString()
            };
            updatedLibrary = [
                ...existingLibrary,
                libraryItem
            ];
        }
        localStorage.setItem(
            "savedLibrary",
            JSON.stringify(updatedLibrary)
        );
        setSavedLibrary(updatedLibrary);
        setBookmarkOpenId(null);
        if (!alreadySaved) {
            navigate("/library");
        }
    };
    const isBookmarked = (id, category) => {
        return savedLibrary.some(
            item =>
                item.id === id &&
                item.category === category
        );
    };
    async function getMemberGallery() {
        try {
            const url = `${API_URL}/members-galleries`;
            const response = await fetch(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log("Status:", response.status);
            const data = await readApiResponse(response);
            if (!response.ok) {
                throw new Error(data?.message || `API Error ${response.status}`);
            }
            console.log("Member Gallery Data:", data);
            setMemberGallery(data.data || []);
        } catch (error) {
            console.error("getMemberGallery failed:", error);
        }
    }
    console.log(memberGallery)
    async function getClubGallery() {
        try {
            const url = `${API_URL}/club-gallery`;
            const response = await fetch(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log("Status:", response.status);
            const data = await readApiResponse(response);
            if (!response.ok) {
                throw new Error(data?.message || `API Error ${response.status}`);
            }
            console.log("Club Gallery Data:", data);
            setClubGallery(data.data || []);
        } catch (error) {
            console.error("getClubGallery failed:", error);
        }
    }
    console.log(clubGallery)
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    useEffect(() => {
        getMemberGallery();
        getClubGallery();
    }, []);
    const memberImages = memberGallery.reduce(
        (sum, member) => sum + (member.gallery_total_photos || 0),
        0
    );
    const clubImages = clubGallery.reduce(
        (sum, gallery) => sum + (gallery.total_photos || 0),
        0
    );
    const totalImages = memberImages + clubImages;
    const memberLikes = memberGallery.reduce(
        (sum, member) => sum + (member.gallery_total_likes || 0),
        0
    );
    const clubLikes = clubGallery.reduce(
        (sum, gallery) => sum + (gallery.total_photos || 0),
        0
    );
    const totalLikes = memberLikes + clubLikes;
    const memberComments = memberGallery.reduce(
        (sum, member) => sum + (member.gallery_total_comments || 0),
        0
    );
    const clubComments = clubGallery.reduce(
        (sum, gallery) => sum + (gallery.total_photos || 0),
        0
    );
    const totalComments = memberComments + clubComments;
    const totalInter = totalComments + totalLikes;
    console.log(totalImages)
    return (
        <div style={{ backgroundColor: 'white' }}>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Galleries" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                                    <div className="profile-card bg-white shadow-sm rounded p-4 d-flex align-items-center justify-content-between" style={{ height: '148px', width: '65.8%' }}>
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting text-muted" style={{ fontSize: '18px' }}>Features Members & Club Galleries</small>
                                                <h2 className="name m-0" style={{ fontSize: '30px', fontWeight: '500', color: '#4c4036' }}>{clubGallery.length} Club Galleries</h2>
                                                <small className="role mt-2 d-block" style={{ fontSize: '18px', color: '#cc445e' }}>{memberGallery.length} Member Galleries</small>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <div className="search-bar d-flex justify-content-space-between">
                                                <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                <i className="fas fa-search"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                        <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                            <small className="ca-details" style={{ fontSize: '20px' }}>Images</small>
                                            <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{totalImages}</h3>
                                        </div>
                                        <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                            <small className="ca-details" style={{ fontSize: '20px' }}>Interactions</small>
                                            <div className="row mt-4">
                                                <div className="col-md-5">
                                                    <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{totalInter}</h3>
                                                </div>
                                                <div className="days col-md-7 text-start">
                                                    <span style={{ fontSize: '16px' }}>Likes & Comments</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                                <div className="card bg-white rounded p-4 mb-4 border-0">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4>Member Galleries</h4>
                                        <button className="btn me-2" id="e-view" onClick={() => navigate('/gallery/member')}>View All</button>
                                    </div>
                                    <div className="row">
                                        {memberGallery.slice(0, 8).map((gallery, index) => (
                                            gallery.galleries?.length > 0 && gallery.galleries[0]?.photos?.length > 0 && (
                                                <div key={gallery.id} className="col-3 p-0">
                                                    <div className="galleriy">
                                                        <div className="galleriy-item">
                                                            <img src={gallery.galleries[0].photos[0].image_url} alt="Gallery" style={{ maxHeight: '370px', objectFit: 'cover' }} />
                                                            <div className="gallery-actions">
                                                                <div className="library-bookmark">
                                                                    <img src={Book} alt="bookmark" style={{ width: '20px', height: '20px', cursor: 'pointer' }} className={isBookmarked(gallery.id, "Galleries") ? "bookmark-icon active" : "bookmark-icon"} onClick={() => toggleBookmark(gallery, "Galleries")} />
                                                                </div>
                                                                <div style={{ position: "relative", display: "inline-block" }}>
                                                                    {bookmarkOpenId === gallery.id && (
                                                                        <div style={{ position: "absolute", bottom: "30px", right: "0", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 100, minWidth: "170px" }}>
                                                                            <p style={{ margin: "0 0 8px", fontWeight: "bold", fontSize: "13px", color: "#333" }}>
                                                                                Save to Library
                                                                            </p>
                                                                            {["Events", "Competitions", "Notices", "Galleries", "News"].map((cat) => (
                                                                                <div key={cat} style={{ padding: "7px 10px", cursor: "pointer", borderRadius: "4px", fontSize: "13px", color: "#555" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f0eb"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }} onClick={() => { saveToLibrary({ ...gallery, gallery_type: "member" }, "Galleries"); }}>
                                                                                    📁 {cat}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <img src={Share} alt="Share" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                                            </div>
                                                            <div className="galleriy-infos" style={{ backgroundColor: index % 2 === 0 ? '#99816b' : '#4c4036' }}>
                                                                <div className="gal-item">
                                                                    {gallery.profile_image_url ? (
                                                                        <img className="img-fluid event-img" style={{ width: '40px', height: '40px' }} src={gallery.profile_image_url} alt="Profile" />
                                                                    ) : (
                                                                        <div className="event-img fallback-box d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}></div>
                                                                    )}
                                                                    <div className="gal-details">
                                                                        <span>{gallery.galleries[0].gallery_name}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="profile-icon d-flex justify-content-between mt-2">
                                                                    <div className="icons">
                                                                        <span>{gallery.gallery_total_photos}</span>
                                                                        <img src={Ima} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                                    </div>
                                                                    <div className="icons">
                                                                        <span>{gallery.gallery_total_likes}</span>
                                                                        <img src={Hea} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                                    </div>
                                                                    <div className="icons">
                                                                        <span>{gallery.gallery_total_comments}</span>
                                                                        <img src={Com} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                                <div className="card bg-white rounded p-4 mb-4 border-0">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4>Club Galleries</h4>
                                        <button className="btn me-2" id="e-view" onClick={() => navigate('/gallery/club')}>View All</button>
                                    </div>
                                    <div className="row g-0 m-0">
                                        {clubGallery.slice(0, 8).map((cgallery, index) => (
                                            cgallery.photos?.length > 0 && (
                                                <div key={cgallery.gallery_id} className="col-3 p-0">
                                                    <div className="galleriy">
                                                        <div className="galleriy-item">
                                                            <img src={cgallery.photos[0].image} alt="Gallery" style={{ maxHeight: '370px', objectFit: 'cover' }} />
                                                            <div className="gallery-actions">
                                                                <div className="library-bookmark">
                                                                    <img src={Book} alt="bookmark" style={{ width: '20px', height: '20px', cursor: 'pointer' }} className={isBookmarked(cgallery.gallery_id || cgallery.id, "Galleries") ? "bookmark-icon active" : "bookmark-icon"} onClick={() => { toggleBookmark({ ...cgallery, gallery_type: "club" }, "Galleries"); }} />
                                                                </div>
                                                                <div style={{ position: "relative", display: "inline-block" }}>
                                                                    {bookmarkOpenId === (cgallery.gallery_id ?? cgallery.id) && (
                                                                        <div style={{ position: "absolute", bottom: "30px", right: "0", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 100, minWidth: "170px" }}>
                                                                            <p style={{ margin: "0 0 8px", fontWeight: "bold", fontSize: "13px", color: "#333" }}>
                                                                                Save to Library
                                                                            </p>
                                                                            {["Events", "Competitions", "Notices", "Galleries", "News"].map((cat) => (
                                                                                <div key={cat} style={{ padding: "7px 10px", cursor: "pointer", borderRadius: "4px", fontSize: "13px", color: "#555" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f0eb"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }} onClick={() => { saveToLibrary({ ...cgallery, gallery_type: "club" }, "Galleries"); }}>
                                                                                    📁 {cat}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <img src={Share} alt="Share" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                                            </div>
                                                            <div className="galleriy-infos" style={{ backgroundColor: index % 2 === 0 ? '#99816b' : '#4c4036' }}>
                                                                <div className="gal-item">
                                                                    <span>{cgallery.photos[0].title}</span>
                                                                </div>
                                                                <div className="profile-icon d-flex justify-content-between">
                                                                    <div className="icons">
                                                                        <span>{cgallery.total_photos}</span>
                                                                        <img src={Ima} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                                    </div>
                                                                    <div className="icons">
                                                                        <span>{cgallery.photos[0].likes_count}</span>
                                                                        <img src={Hea} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                                    </div>
                                                                    <div className="icons">
                                                                        <span>{cgallery.photos[0].comments_count}</span>
                                                                        <img src={Com} alt="icon" style={{ width: '14px', height: '14px' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
};
export default GalleryRoute;
