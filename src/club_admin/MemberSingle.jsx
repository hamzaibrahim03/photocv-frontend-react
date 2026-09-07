import React, { useEffect, useMemo, useState } from "react";
import Hea from './assets/icons/gallery/heart.svg';
import Com from './assets/icons/gallery/comment.svg';
import { useNavigate, useParams } from "react-router";
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";
import Loader from "../React/extra/LoaderAll";
const API_URL = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";
const PLACEHOLDER_IMAGE = "/assets/images/dashboard/simple.png";
function MemberSingle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [galleryPage, setGalleryPage] = useState(1);
    const galleriesPerPage = 8;
    useEffect(() => {
        loadMember();
    }, [id]);
    const loadMember = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/members/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error("Unable to load member");
            }
            const result = await response.json();
            setMember(result?.data || null);
        } catch (error) {
            console.error("Member API Error:", error);
            setMember(null);
        } finally {
            setIsLoading(false);
        }
    };
    const fullName = useMemo(() => {
        if (!member) return "";
        return `${member.first_name || ""} ${member.last_name || ""}`
            .trim();
    }, [member]);
    const profileImage = member?.profile_image_url || PLACEHOLDER_IMAGE;
    const socialLinks = member?.social_links || [];
    const getSocialLink = (name) => {
        return (
            socialLinks.find(
                (item) =>
                    item?.social_media_name?.toLowerCase() === name.toLowerCase()
            )?.social_link || "#"
        );
    };
    const galleries = useMemo(() => {
        return Array.isArray(member?.galleries) ? member.galleries : [];
    }, [member]);
    const allGalleryPhotos = useMemo(() => {
        return galleries.flatMap((gallery) =>
            (gallery?.photos || []).map((photo) => ({
                ...photo,
                gallery_id: gallery.id,
                gallery_name: gallery.gallery_name,
            }))
        );
    }, [galleries]);
    const photosPerPage = 8;
    const galleryTotalPages = Math.ceil(
        allGalleryPhotos.length / photosPerPage
    );
    const paginatedPhotos = useMemo(() => {
        const start = (galleryPage - 1) * photosPerPage;
        return allGalleryPhotos.slice(
            start,
            start + photosPerPage
        );
    }, [allGalleryPhotos, galleryPage]);
    const recentComments = useMemo(() => {
        const comments = [];
        galleries.forEach((gallery) => {
            (gallery?.photos || []).forEach((photo) => {
                (photo?.comments || []).forEach((comment) => {
                    comments.push({
                        ...comment,
                        photo,
                        gallery,
                    });
                });
            });
        });
        return comments
            .sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            )
            .slice(0, 5);
    }, [galleries]);
    const recentLikes = useMemo(() => {
        return [];
    }, []);
    const competitionMembers = Array.isArray(member?.competition_members)
        ? member.competition_members
        : [];
    const searchMatches = useMemo(() => {
        if (!search.trim()) return true;
        const value = search.toLowerCase();
        return (
            fullName.toLowerCase().includes(value) ||
            (member?.username || "")
                .toLowerCase()
                .includes(value) ||
            (member?.email || "")
                .toLowerCase()
                .includes(value)
        );
    }, [search, fullName, member]);
    const formatDateSince = (date) => {
        if (!date) return "";
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }
        return parsedDate.toLocaleDateString("en-US", {
            year: "numeric",
        });
    };
    const timeAgo = (date) => {
        if (!date) return "";
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }
        const seconds = Math.floor(
            (Date.now() - parsedDate.getTime()) / 1000
        );
        if (seconds < 60) {
            return "Just now";
        }
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes} min ago`;
        }
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    };
    const getGalleryComments = (gallery) => {
        return (gallery?.photos || []).reduce(
            (total, photo) =>
                total + (photo?.comments?.length || 0),
            0
        );
    };
    const getGalleryLikes = (gallery) => {
        return 0;
    };
    const getGalleryImage = (gallery) => {
        return (
            gallery?.photos?.map((photo) => ({
                image:
                    photo?.image_url ||
                    PLACEHOLDER_IMAGE,
            })) || []
        );
    };
    if (!isLoading && !member) {
        return (
            <div style={{ minHeight: "100vh", background: "#eee9e4", display: "flex", alignItems: "center", justifyContent: "center", }}>
                <div className="text-center">
                    <h4>Member not found</h4>
                    <button className="btn mt-3" style={{ background: "#504238", color: "#fff", }} onClick={() => navigate("/members")}>Back</button>
                </div>
            </div>
        );
    }
    const totalInteractions = Number(member?.gallery_total_comments || 0) +
        Number(member?.gallery_total_likes || 0);
    return (
        <>
            <div style={{ backgroundColor: "#eee9e4", minHeight: "100vh", }}>
                <Loader show={isLoading} />
                {!isLoading && member && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Members" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: "1820px", }}>
                                    <div className="dashboard-card d-flex align-items-center justify-content-between" style={{ gap: '15px' }}>
                                        <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                                            <div className="profile-left d-flex flex-column justify-content-center">
                                                <small className="greeting text-muted" style={{ fontSize: '18px' }}>List of members in the club</small>
                                                <h2 className="name m-0 text-dark" style={{ fontSize: '30px', fontWeight: '500' }}>Member</h2>
                                                <small className="role text-danger" style={{ fontSize: '18px' }}>{member?.galleries?.length || 0}{" "}Member Galleries</small>
                                                <div style={{ position: "absolute", opacity: 0, pointerEvents: "none", }}>{searchMatches}</div>
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
                                                <small className="ca-details" style={{ fontSize: '20px' }}>Total Images</small>
                                                <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{member?.gallery_total_photos || 0}</h3>
                                            </div>
                                            <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                                <small className="ca-details" style={{ fontSize: '20px' }}>Interactions</small>
                                                <div className="row mt-4 align-items-center">
                                                    <div className="col-md-5">
                                                        <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{totalInteractions}</h3>
                                                    </div>
                                                    <div className="days col-md-7 text-start">
                                                        <span>Likes & Comments</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: "1820px", }}>
                                    <div className="bg-white rounded shadow-sm" style={{ overflow: "hidden", border: "1px solid #cfc7c1", }}>
                                        <div className="row align-items-center" style={{ padding: "20px 25px", }}>
                                            <div className="col-md-3 text-center">
                                                <img src={profileImage} alt={fullName} className="profile-pic" style={{ width: "192px", height: "192px", borderRadius: "50%", objectFit: "cover", background: "#eee", }} />
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
                                                    {fullName}
                                                </h3>
                                                <small style={{ color: "#cc445e", }}>
                                                    {member?.title || "Photographer"}
                                                </small>
                                            </div>
                                            <div className="col-md-9" style={{ paddingLeft: "20px", }}>
                                                <h5 style={{ color: "#cc445e", fontSize: "15px", marginBottom: "12px", }}>
                                                    {member?.tag_line || "Photographer"}
                                                </h5>
                                                <p style={{ color: "#625b55", lineHeight: 1.55, marginBottom: "15px", }}>
                                                    {member?.bio || member?.about || "No biography available."}
                                                </p>
                                                <div className="row" style={{ color: "#625b55", }}>
                                                    <div className="col-md-12">
                                                        <strong>
                                                            Email:
                                                        </strong>{" "}
                                                        {member?.email || "-"}
                                                    </div>
                                                </div>
                                                <div className="row" style={{ color: "#625b55", }}>
                                                    <div className="col-md-6">
                                                        <strong>
                                                            Phone:
                                                        </strong>{" "}
                                                        {member?.phone || "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between" style={{ background: "#cc445e", color: "#fff", minHeight: "38px", padding: "0 30px", }}>
                                            <div className="d-flex align-items-center" style={{ gap: "25px", }}>
                                                <span>
                                                    {member?.gallery_total_comments || 0}{" "}
                                                    <i className="fas fa-comment"></i>
                                                </span>
                                                <span>
                                                    {member?.gallery_total_photos || 0}{" "}
                                                    <i className="fas fa-image"></i>
                                                </span>
                                                <span>
                                                    {member?.gallery_total_likes || 0}{" "}
                                                    <i className="fas fa-heart"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <span>
                                                    {member?.title || "Photographer"} since {formatDateSince(member?.created_at)}
                                                </span>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button type="button" onClick={() => navigate(`/members/${id}/edit`)} style={{ border: "none", background: "transparent", color: "#fff", }} title="Edit">
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button type="button" onClick={() => navigate("/members")} style={{ border: "none", background: "transparent", color: "#fff", }} title="Back">
                                                    <i className="fas fa-arrow-left"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: "1820px", }}>
                                    <div className="row" style={{ marginTop: "20px", }}>
                                        <div className="col-md-6">
                                            <div className="bg-white rounded shadow-sm" style={{ padding: "18px", height: "310px", overflowY: "auto", }}>
                                                <h5 style={{ color: "#4d4742", marginBottom: "15px", }}>
                                                    Recent Comments
                                                </h5>
                                                {recentComments.length === 0 ? (
                                                    <div className="text-muted text-center" style={{ padding: "60px 10px", }}>
                                                        No comments available
                                                    </div>
                                                ) : (
                                                    recentComments.map((comment) => (
                                                        <div key={comment.id}>
                                                            <div className="row align-items-center">
                                                                <div className="col-md-2">
                                                                    <img src={comment.photo?.thumb_url || PLACEHOLDER_IMAGE} alt="" style={{ width: "55px", height: "40px", objectFit: "cover", borderRadius: "4px", }} />
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <p style={{ fontSize: "12px", marginBottom: "4px", }}>
                                                                        <strong style={{ color: "#cc445e", }}>
                                                                            Member #{comment.interacted_by}
                                                                        </strong>{" "}
                                                                        {comment.comment}
                                                                    </p>
                                                                    <small style={{ color: "#aaa", }}>
                                                                        {comment.comment}
                                                                    </small>
                                                                </div>
                                                                <div className="col-md-3 text-right">
                                                                    <small style={{ color: "#999", }}>
                                                                        {timeAgo(comment.created_at)}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <hr style={{ margin: "10px 0", }} />
                                                        </div>
                                                    )
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="bg-white rounded shadow-sm" style={{ padding: "18px", height: "310px", overflowY: "auto", }}>
                                                <h5 style={{ color: "#4d4742", marginBottom: "15px", }}>
                                                    Recent Likes
                                                </h5>
                                                {recentLikes.length === 0 ? (
                                                    <div className="text-center text-muted" style={{ padding: "80px 10px", }}>
                                                        <i className="fas fa-heart" style={{ fontSize: "28px", marginBottom: "10px", }}></i>
                                                        <div>
                                                            No individual like records available
                                                        </div>
                                                        <small>
                                                            Total likes: {member?.gallery_total_likes}
                                                        </small>
                                                    </div>
                                                ) : (
                                                    <div className="row">
                                                        {recentLikes.map((like) => (
                                                            <div className="col-md-2" key={like.id}>
                                                                <img src={like.image} className="img-fluid" alt="" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: "1820px", }}>
                                    <div className="row" style={{ marginTop: "20px", }}>
                                        <div className="col-md-6">
                                            <div className="bg-white rounded shadow-sm" style={{ padding: "18px", height: "300px", overflowY: "auto", }}>
                                                <h5 style={{ color: "#4d4742", marginBottom: "15px", }}>
                                                    {fullName}'s Competition Entries
                                                </h5>
                                                {competitionMembers.length === 0 ? (
                                                    <div className="text-muted text-center" style={{ padding: "70px 10px", }}>
                                                        No competition entries
                                                    </div>
                                                ) : (
                                                    competitionMembers.map((competitionMember) => {
                                                        const competition = competitionMember?.competition;
                                                        const entries = competitionMember?.entries || [];
                                                        return (
                                                            <div key={competitionMember.id}>
                                                                <div className="row align-items-center">
                                                                    <div className="col-md-6 text-left">
                                                                        {entries.slice(0, 3).map((entry) => (
                                                                            <img key={entry.id} src={entry.entry_image_url || PLACEHOLDER_IMAGE} alt="" style={{ width: "60px", height: "45px", opacity: '1', borderRadius: "7px", objectFit: "cover", marginLeft: "4px", }} />
                                                                        ))}
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <strong style={{ color: "#cc445e", }}>{competition?.name}</strong>
                                                                        <div style={{ color: "#777", fontSize: "12px", }}>{entries.length}{" "} entries</div>
                                                                    </div>
                                                                </div>
                                                                <hr style={{ margin: "12px 0", }} />
                                                            </div>
                                                        );
                                                    }
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="bg-white rounded shadow-sm" style={{ padding: "18px", height: "300px", }}>
                                                <h5 style={{ color: "#4d4742", marginBottom: "15px", }}>{fullName}'s Awards</h5>
                                                <div className="text-center text-muted" style={{ padding: "80px 10px", }}>
                                                    <i className="fas fa-medal" style={{ fontSize: "30px", marginBottom: "10px", }}></i>
                                                    <div>
                                                        No awards data available
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: "1820px", }}>
                                    <div className="bg-white rounded shadow-sm" style={{ marginTop: "20px", padding: "0", overflow: "hidden", }}>
                                        <div style={{ padding: "15px 20px", borderBottom: "1px solid #eee", }}>
                                            <h4 style={{ margin: 0, color: "#4d4742", fontSize: "20px", }}>
                                                {fullName}'s Gallery
                                            </h4>
                                        </div>
                                        {paginatedPhotos.length === 0 ? (
                                            <div className="text-center text-muted" style={{ padding: "100px 20px" }}>
                                                No photos available
                                            </div>
                                        ) : (
                                            <div className="galleriy" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
                                                {paginatedPhotos.map((photo, index) => (
                                                    <div className="galleriy-item" key={photo?.id || index}>
                                                        <img src={photo?.large_url || photo?.medium_url || photo?.image_url || PLACEHOLDER_IMAGE} alt={photo?.title || photo?.gallery_name} onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }} />
                                                        <div className="galleriy-info">
                                                            <div className="galleriy-infos d-flex justify-content-between align-items-center" style={{ padding: "5px 20px", }}>
                                                                <div className="gal-details">
                                                                    <span>
                                                                        {photo?.title || photo?.gallery_name}
                                                                    </span>
                                                                </div>
                                                                <div className="d-flex flex-column">
                                                                    <div className="icons">
                                                                        <span>
                                                                            {photo?.likes_count || photo?.total_likes || 0}
                                                                        </span>
                                                                        <img src={Hea} alt="likes" style={{ width: "14px", height: "14px", }} />
                                                                    </div>
                                                                    <div className="icons">
                                                                        <span>
                                                                            {photo?.comments?.length || 0}
                                                                        </span>
                                                                        <img src={Com} alt="comments" style={{ width: "14px", height: "14px", }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {galleryTotalPages > 1 && (
                                            <div className="d-flex justify-content-end" style={{ padding: "20px", gap: "5px", }}>
                                                <button type="button" className="dt-paging-button" disabled={galleryPage === 1} onClick={() => setGalleryPage((page) => Math.max(1, page - 1))}>‹</button>
                                                {Array.from({ length: galleryTotalPages }, (_, index) => {
                                                    const page = index + 1;
                                                    return (
                                                        <button type="button" key={page} className={`dt-paging-button ${galleryPage === page ? "current" : ""}`} onClick={() => setGalleryPage(page)}>
                                                            {page}
                                                        </button>
                                                    );
                                                }
                                                )}
                                                <button type="button" className="dt-paging-button" disabled={galleryPage === galleryTotalPages} onClick={() => setGalleryPage((page) => Math.min(galleryTotalPages, page + 1))}>›</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: "1820px", paddingBottom: "40px", }}>
                                    <button type="button" onClick={() => navigate("/members")} style={{ marginTop: "30px", background: "#504238", border: "none", color: "#fff", borderRadius: "5px", padding: "10px 25px", }}>
                                        Back
                                    </button>
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default MemberSingle;