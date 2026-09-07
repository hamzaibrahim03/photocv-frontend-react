import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavigationRoute from "./NavigationRoute";
import HeaderRoute from "./HeaderRoute";
import Loader from "../React/extra/LoaderAll";
import Ima from "./assets/icons/gallery/image.svg";
import Hea from "./assets/icons/gallery/heart.svg";
import Com from "./assets/icons/gallery/comment.svg";
import Share from "./assets/icons/event_list/share.svg";
import Book from "./assets/icons/event_list/bookmark.svg";
import { API_URL, readApiResponse } from "../api/axios";
function ClubGallerySingle() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [clubGallery, setClubGallery] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [savedLibrary, setSavedLibrary] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("savedLibrary") || "[]"
            );
        } catch {
            return [];
        }
    });
    const toggleBookmark = (item, category) => {
        const itemId = item.id ?? item.gallery_id;
        const alreadySaved = savedLibrary.some(
            (saved) =>
                saved.id === itemId &&
                saved.category === category
        );
        let updatedLibrary;
        if (alreadySaved) {
            updatedLibrary = savedLibrary.filter(
                (saved) =>
                    !(
                        saved.id === itemId &&
                        saved.category === category
                    )
            );
        } else {
            const firstPhoto = item?.photos?.[0] || {};
            const libraryItem = {
                id: itemId,
                category,
                gallery_type: "club",
                title: item?.gallery_name || firstPhoto?.title || "Gallery",
                description: item?.description || firstPhoto?.description || "",
                date: item?.created_at || firstPhoto?.created_at || "",
                image: firstPhoto?.image_url || firstPhoto?.image || firstPhoto?.large_url || firstPhoto?.medium_url || "",
                photos: item?.total_photos ?? item?.photos?.length ?? 0,
                likes: item?.total_likes ?? firstPhoto?.likes_count ?? 0,
                comments: item?.total_comments ?? firstPhoto?.comments_count ?? firstPhoto?.comments?.length ?? 0,
                originalData: item,
                savedAt: new Date().toISOString(),
            };
            updatedLibrary = [
                ...savedLibrary,
                libraryItem,
            ];
        }
        localStorage.setItem(
            "savedLibrary",
            JSON.stringify(updatedLibrary)
        );
        setSavedLibrary(updatedLibrary);
    };
    const isBookmarked = (id, category) => {
        return savedLibrary.some(
            (item) =>
                item.id === id &&
                item.category === category
        );
    };
    const getClubGallery = async () => {
        try {
            const response = await fetch(`${API_URL}/club-gallery/${galleryId}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
            );
            const data = await readApiResponse(response);
            if (!response.ok) {
                throw new Error(data?.message || `API Error ${response.status}`);
            }
            setClubGallery(Array.isArray(data?.data) ? data.data : []);
        } catch (error) {
            console.error("getClubGallery failed:", error);
            setClubGallery([]);
        }
    };
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([
                getClubGallery(),
            ]);
            setIsLoading(false);
        };
        loadData();
    }, []);
    const clubImages = useMemo(() => {
        return clubGallery.reduce(
            (sum, gallery) => sum + Number(gallery?.total_photos ?? gallery?.photos?.length ?? 0),
            0
        );
    }, [clubGallery]);
    const totalImages = clubImages;
    const clubLikes = useMemo(() => {
        return clubGallery.reduce(
            (galleryTotal, gallery) => {
                const photoLikes = gallery?.photos?.reduce(
                    (photoTotal, photo) => photoTotal + Number(photo?.likes_count || 0),
                    0
                ) || 0;
                return (galleryTotal + Number(gallery?.total_likes ?? photoLikes));
            },
            0
        );
    }, [clubGallery]);
    const totalLikes = clubLikes;
    const clubComments = useMemo(() => {
        return clubGallery.reduce(
            (galleryTotal, gallery) => {
                const photoComments = gallery?.photos?.reduce(
                    (photoTotal, photo) => photoTotal + Number(photo?.comments_count ?? photo?.comments?.length ?? 0),
                    0
                ) || 0;
                return (galleryTotal + Number(gallery?.total_comments ?? photoComments));
            },
            0
        );
    }, [clubGallery]);
    const totalComments = clubComments;
    const totalInteractions = totalLikes + totalComments;
    const filteredClubGalleries = useMemo(() => {
        if (!search.trim()) {
            return clubGallery;
        }
        const value = search.toLowerCase();
        return clubGallery.filter(
            (gallery) => {
                const firstPhoto = gallery?.photos?.[0];
                return (
                    (gallery?.gallery_name || "").toLowerCase().includes(value) ||
                    (firstPhoto?.title || "").toLowerCase().includes(value)
                );
            }
        );
    }, [clubGallery, search]);
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);
    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredClubGalleries.length /
            itemsPerPage
        )
    );
    const paginatedGalleries = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredClubGalleries.slice(start, start + itemsPerPage);
    }, [filteredClubGalleries, currentPage]);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleShare = async (gallery) => {
        const galleryId = gallery?.gallery_id ?? gallery?.id;
        const shareUrl = `${window.location.origin}/gallery/club/${galleryId}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: gallery?.gallery_name || "Gallery",
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert("Gallery link copied to clipboard.");
            }
        } catch (error) {
            if (error?.name !== "AbortError") {
                console.error("Share failed:", error);
            }
        }
    };
    return (
        <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Galleries" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: "1820px" }}>
                                <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                                    <div className="profile-card bg-white shadow-sm rounded p-4 d-flex align-items-center justify-content-between" style={{ height: "148px", width: "65.8%" }}>
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting text-muted" style={{ fontSize: "18px" }}>
                                                    Galleries uploaded by club
                                                </small>
                                                <h2 className="name m-0" style={{ fontSize: "30px", fontWeight: "500", color: "#4c4036" }}>
                                                    {clubGallery.length}{" "}Club Galleries
                                                </h2>
                                                <small className="role mt-2 d-block" style={{ fontSize: "18px", color: "#cc445e" }}>
                                                    Average {totalImages} images
                                                </small>
                                            </div>
                                        </div>
                                        <div className="search-bar d-flex">
                                            <input type="search" className="search-input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>
                                    </div>
                                    <div className="card-section d-flex gap-4" style={{ width: "32%" }}>
                                        <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: "#cc445e", width: "219px", height: "148px" }}>
                                            <small style={{ fontSize: "20px" }}>
                                                Images
                                            </small>
                                            <h3 className="mt-4" style={{ fontSize: "48px", fontWeight: "500" }}>
                                                {totalImages}
                                            </h3>
                                        </div>
                                        <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: "#755840", width: "219px", height: "148px" }}>
                                            <small style={{ fontSize: "20px" }}>Interactions</small>
                                            <div className="row mt-4">
                                                <div className="col-md-5">
                                                    <h3 className="m-0" style={{ fontSize: "48px", fontWeight: "500" }}>{totalInteractions}</h3>
                                                </div>
                                                <div className="col-md-7 text-start">
                                                    <span style={{ fontSize: "16px" }}>Likes & Comments</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className="container" style={{ maxWidth: "1810px", margin: "0 auto", padding: "0 15px" }}>
                                <div className="card bg-white rounded p-4 mb-4 border-0">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4>Club Galleries</h4>
                                        <img src={Share} alt="Share" style={{ width: "20px", height: "20px", cursor: "pointer", }} />
                                    </div>
                                    <div className="row g-0 m-0">
                                        {paginatedGalleries.length === 0 ? (
                                            <div className="text-center text-muted py-5">
                                                No galleries found
                                            </div>
                                        ) : (
                                            paginatedGalleries.map((gallery, index) => {
                                                const firstPhoto = gallery?.photos?.[0];
                                                if (!firstPhoto) {
                                                    return null;
                                                }
                                                const galleryId = gallery?.gallery_id ?? gallery?.id;
                                                const image = firstPhoto?.image_url || firstPhoto?.image || firstPhoto?.large_url || firstPhoto?.medium_url || "";
                                                const likes = gallery?.total_likes ?? firstPhoto?.likes_count ?? 0;
                                                const comments = gallery?.total_comments ?? firstPhoto?.comments_count ?? firstPhoto?.comments?.length ?? 0;
                                                return (
                                                    <div key={galleryId} className="col-lg-4 col-md-6 p-0">
                                                        <div className="galleriy">
                                                            <div className="galleriy-item">
                                                                <img src={image} alt={firstPhoto?.title || "Gallery"} onClick={() => navigate(`/gallery/club/${galleryId}`)} style={{ width: "493px", maxHeight: "370px", objectFit: "cover", }} />
                                                                <div className="gallery-actions">
                                                                    <img src={Book} alt="bookmark" className={isBookmarked(galleryId, "Galleries") ? "bookmark-icon active" : "bookmark-icon"} style={{ width: "20px", height: "20px", cursor: "pointer", }} onClick={() => toggleBookmark(gallery, "Galleries")} />
                                                                    <img src={Share} alt="Share" style={{ width: "20px", height: "20px", cursor: "pointer", }} onClick={() => handleShare(gallery)} />
                                                                </div>
                                                                <div className="galleriy-infos" style={{ backgroundColor: index % 2 === 0 ? "#99816b" : "#4c4036", }}>
                                                                    <div className="gal-item">
                                                                        <span>{firstPhoto?.title || gallery?.gallery_name}</span>
                                                                    </div>
                                                                    <div className="profile-icon d-flex justify-content-between">
                                                                        <div className="icons">
                                                                            <span>{gallery?.total_photos ?? gallery?.photos?.length ?? 0}</span>
                                                                            <img src={Ima} alt="images" style={{ width: "14px", height: "14px", }} />
                                                                        </div>
                                                                        <div className="icons">
                                                                            <span>{likes}</span>
                                                                            <img src={Hea} alt="likes" style={{ width: "14px", height: "14px", }} />
                                                                        </div>
                                                                        <div className="icons">
                                                                            <span>{comments}</span>
                                                                            <img src={Com} alt="comments" style={{ width: "14px", height: "14px", }} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="pb-5 mt-4">
                            <div className="container" style={{ maxWidth: "1820px", }}>
                                <div className="d-flex justify-content-end align-items-center">
                                    {totalPages > 1 && (
                                        <div className="dt-paging" >
                                            <nav aria-label="pagination">
                                                <button className="dt-paging-button previous" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
                                                    ‹
                                                </button>
                                                {Array.from({ length: totalPages }, (_, index) => {
                                                    const page = index + 1; return (
                                                        <button key={page} className={`dt-paging-button ${page === currentPage ? "current" : ""}`} onClick={() => goToPage(page)}>
                                                            {page}
                                                        </button>
                                                    );
                                                }
                                                )}
                                                <button className="dt-paging-button next" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
                                                    ›
                                                </button>
                                            </nav>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}
export default ClubGallerySingle;