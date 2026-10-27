import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";
import Loader from "../Ryton/extra/LoaderAll";
import { readApiResponse } from "../api/axios";
import Share from "./assets/icons/event_list/share.svg";
import Info from "./assets/icons/event_list/information-circle.svg";
import CommentsDrawMember from "./CommentsDrawMember";
import "./assets/css/adminstyle.css"
function ClubGallerySingle() {
    const { id } = useParams();
    const [clubGallery, setClubGallery] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showInfo, setShowInfo] = useState(false);
    const thumbContainer = useRef(null);
    const thumbRefs = useRef([]);

    useEffect(() => {
        const getClubGallery = async () => {
            if (!id) {
                console.error("Club Gallery ID is missing from the route.");
                setClubGallery(null);
                setCurrentIndex(0);
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const response = await fetch(`http://rytonlocal-staging.cameraclub.website:8000/api/v1/club-gallery/${id}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token") || ""
                                }`,
                        },
                    }
                );
                const data = await readApiResponse(response);
                console.log("CLUB GALLERY API RESPONSE:", data);
                if (!response.ok) {
                    throw new Error(data?.message || `API Error ${response.status}`);
                }
                const galleryData = data?.data || null;
                console.log("GALLERY DATA:", galleryData);
                console.log("PHOTOS:", galleryData?.photos || []);
                setClubGallery(galleryData);
                setCurrentIndex(0);
            } catch (error) {
                console.error("getClubGallery failed:", error);
                setClubGallery(null);
                setCurrentIndex(0);
            } finally {
                setIsLoading(false);
            }
        };
        getClubGallery();
    }, [id]);
    const galleryName = useMemo(() => {
        return clubGallery?.gallery_name || "Gallery";
    }, [clubGallery]);
    const imageList = useMemo(() => {
        if (!Array.isArray(clubGallery?.photos)) {
            return [];
        }
        return clubGallery.photos.map((photo) => ({
            ...photo,
            galleryId: clubGallery?.gallery_id,
            galleryName: clubGallery?.gallery_name || "Gallery",
        }));
    }, [clubGallery]);
    const filteredImages = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) {
            return imageList;
        }
        return imageList.filter((image) => {
            return [
                image?.title,
                image?.description,
                image?.galleryName,
                image?.uploaded_by,
                image?.uploaded_by_first_name,
                image?.uploaded_by_last_name,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(keyword)
                );
        });
    }, [imageList, search]);
    useEffect(() => {
        setCurrentIndex(0);
    }, [search]);
    useEffect(() => {
        if (
            filteredImages.length > 0 &&
            currentIndex >= filteredImages.length
        ) {
            setCurrentIndex(0);
        }
    }, [filteredImages.length, currentIndex]);
    const currentImage = filteredImages[currentIndex];
    const changeImage = (step) => {
        if (!filteredImages.length) {
            return;
        }
        setCurrentIndex((previousIndex) => {
            return (
                (previousIndex + step + filteredImages.length) %
                filteredImages.length
            );
        });
    };
    const getImageUrl = (photo) => {
        if (!photo) {
            return "";
        }
        return (photo?.large_url ||
            photo?.medium_url ||
            photo?.image ||
            photo?.original_url ||
            photo?.thumb_url ||
            ""
        );
    };
    const totalLikes = useMemo(() => {
        return Number(clubGallery?.total_likes || 0);
    }, [clubGallery]);
    const totalComments = useMemo(() => {
        return Number(clubGallery?.total_comments || 0);
    }, [clubGallery]);
    const handleShare = async () => {
        try {
            const shareUrl = window.location.href;
            const galleryName = currentImage?.galleryName ||
                memberGallery?.[0]?.gallery_name ||
                `${memberName}'s Gallery`;
            if (navigator.share) {
                await navigator.share({
                    title: galleryName,
                    text: `Check out ${galleryName}`,
                    url: shareUrl,
                });
                return;
            }
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
                alert("Gallery link copied to clipboard.");
                return;
            }
            const textarea = document.createElement("textarea");
            textarea.value = shareUrl;
            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            alert("Gallery link copied to clipboard.");
        } catch (error) {
            if (error?.name === "AbortError") {
                return;
            }
            console.error("Share failed:", error);
        }
    };
    const handleInfo = () => {
        if (!currentImage) {
            return;
        }
        setShowInfo(true);
    };
    const handleCloseInfo = () => {
        setShowInfo(false);
    };
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isLightboxOpen) {
                return;
            }
            if (event.key === "Escape") {
                setIsLightboxOpen(false);
            }
            if (event.key === "ArrowLeft") {
                changeImage(-1);
            }
            if (event.key === "ArrowRight") {
                changeImage(1);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isLightboxOpen, filteredImages.length]);

    useEffect(() => {
        const activeThumb = thumbRefs.current[currentIndex];
        const container = thumbContainer.current;
        if (activeThumb && container) {
            const offset = activeThumb.offsetLeft -
                container.clientWidth / 2 +
                activeThumb.clientWidth / 2;
            container.scrollTo({
                left: offset,
                behavior: "smooth",
            });
        }
    }, [currentIndex]);
    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title={`${galleryName} Gallery`} />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: "1820px" }}>
                                <div className="dashboard-card">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting">
                                                    Galleries uploaded by Club Member
                                                </small>
                                                <h2 className="name">
                                                    {galleryName}
                                                </h2>
                                                <small className="role">
                                                    Image{" "} {filteredImages.length ? currentIndex + 1 : 0}{" "} of {filteredImages.length}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="search-bar d-flex align-items-center justify-content-between">
                                            <input type="search" className="search-input" placeholder="Search" value={search} onChange={(event) => setSearch(event.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="stat-card">
                                            <small className="ca-details">
                                                Likes
                                            </small>
                                            <h3 className="number">
                                                {totalLikes}
                                            </h3>
                                        </div>
                                        <div className="event-cards">
                                            <small className="ca-details">
                                                Comments
                                            </small>
                                            <h3 className="number" >
                                                {totalComments}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="card" style={{ position: "relative", }} >
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mt-3 ms-2">
                                            {galleryName}
                                        </h5>
                                        <div className="gallery-actions d-flex align-items-center gap-3" style={{ marginRight: "15px", }} >
                                            <button type="button" className="border-0 bg-transparent p-0" onClick={handleShare} disabled={!currentImage} title="Share gallery" style={{ cursor: currentImage ? "pointer" : "not-allowed", }} >
                                                <img src={Share} alt="Share" style={{ width: "20px", height: "20px", }} />
                                            </button>
                                            <button type="button" className="border-0 bg-transparent p-0" onClick={handleInfo} disabled={!currentImage} title="View details" style={{ cursor: currentImage ? "pointer" : "not-allowed", }} >
                                                <img src={Info} alt="Information" style={{ width: "20px", height: "20px", }} />
                                            </button>
                                        </div>
                                    </div>
                                    {currentImage ? (
                                        <>
                                            <div className="d-flex align-items-center justify-content-center position-relative mt-3">
                                                <button type="button" className="btn prev" style={{ zIndex: '10', width: "30px", padding: "0 20px 30px 0", height: "60px", opacity: "1", fontSize: "35px", marginRight: "10px", color: "#CC445E", }} onClick={() => changeImage(-1)} aria-label="Previous image" >
                                                    &#10094;
                                                </button>
                                                <img id="display-img" className="card-img-top" src={getImageUrl(currentImage)} alt={currentImage?.title || "Gallery image"} onClick={() => setIsLightboxOpen(true)} onError={(event) => { console.error("Image failed:", getImageUrl(currentImage)); event.currentTarget.style.display = "none"; }} style={{ height: "1200px", maxHeight: "1200px", width: "90%", maxWidth: "90%", objectFit: "contain", cursor: "pointer", borderRadius: "0", }} />
                                                <button type="button" className="btn prev" style={{ zIndex: '10', width: "30px", padding: "0 20px 30px 0", height: "60px", opacity: "1", fontSize: "35px", marginLeft: "10px", color: "#CC445E", }} onClick={() => changeImage(1)} aria-label="Next image" >
                                                    &#10095;
                                                </button>
                                            </div>
                                            <p id="img-description" className="card-text mt-3 ms-5" style={{ color: "black", }} >
                                                {currentImage?.title || ""}
                                            </p>
                                            <small className="text-muted ms-5">
                                                {currentImage?.galleryName || ""}
                                            </small>
                                            {currentImage?.uploaded_by && (
                                                <small className="text-muted ms-5 d-block mt-1" >
                                                    Uploaded by:{" "}
                                                    {currentImage?.uploaded_by_first_name || ""}{" "} {currentImage?.uploaded_by_last_name || ""}
                                                </small>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-5">
                                            <p className="text-muted mb-0">
                                                {search ? "No images found for your search." : "No gallery images found."}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {showInfo && currentImage && (
                                    <CommentsDrawMember key={currentImage?.photo_id} photo={currentImage} onClose={handleCloseInfo} />
                                )}
                                {isLightboxOpen && currentImage && (
                                    <div className="lightbox position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ zIndex: '1050', background: "rgba(0,0,0,0.9)", }} >
                                        <button type="button" className="close position-absolute top-0 end-0 text-white p-4 border-0 bg-transparent" style={{ fontSize: "40px", cursor: "pointer", zIndex: '1060', }} onClick={() => setIsLightboxOpen(false)} aria-label="Close lightbox" >
                                            &times;
                                        </button>
                                        <div className="d-flex align-items-center justify-content-center w-100 flex-grow-1 position-relative">
                                            <button type="button" className="btn btn-light position-absolute start-0 ms-5" onClick={() => changeImage(-1)} style={{ zIndex: '1060', fontSize: "24px", }} aria-label="Previous image" >
                                                &#10094;
                                            </button>
                                            <img id="full-size-img" className="img-fluid shadow-lg" src={getImageUrl(currentImage)} alt={currentImage?.title || "Full size gallery image"} style={{ maxHeight: "80vh", maxWidth: "80vw", objectFit: "contain", }} />
                                            <button type="button" className="btn btn-light position-absolute end-0 me-5" onClick={() => changeImage(1)} style={{ zIndex: '1060', fontSize: "24px", }} aria-label="Next image" >
                                                &#10095;
                                            </button>
                                        </div>
                                        <div className="thumbs-wrapper">
                                            <div className="thumbnails" ref={thumbContainer}>
                                                {filteredImages.map((image, index) => (
                                                    <div key={image?.photo_id ?? index} className={`thumb ${index === currentIndex ? "active" : ""}`} onClick={() => goTo(index)} ref={(el) => (thumbRefs.current[index] = el)}>
                                                        <img key={image?.photo_id ?? index} src={getImageUrl(image)} alt={`Thumbnail ${index + 1}`} className={`rounded cursor-pointer ${index === currentIndex ? "border border-3 border-light" : ""}`} onClick={() => setCurrentIndex(index)} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <div className="comments-card bg-white p-3 rounded" style={{ maxHeight: "400px", overflowY: "auto", }} >
                                            <h5>Comments</h5>
                                            {currentImage?.comments?.length ? (
                                                currentImage.comments.map(
                                                    (comment, index) => (
                                                        <div key={comment?.id ?? index} className="row mb-3 pb-3 border-bottom" >
                                                            <div className="col-md-1">
                                                                <div className="bg-secondary rounded-circle" style={{ width: "40px", height: "40px", }} ></div>
                                                            </div>
                                                            <div className="col-md-10 ms-3">
                                                                <p className="m-0" style={{ color: "black", }} >
                                                                    <label className="head" style={{ color: "#cc445e", }} >
                                                                        {comment?.posted_by}
                                                                    </label>{" "}
                                                                    {comment?.comment || ""}
                                                                </p>
                                                                {comment?.posted_at && (
                                                                    <small className="text-muted">
                                                                        {comment.posted_at}
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <p className="text-muted mb-0">
                                                    No comments for this image.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="comments-cards bg-white p-3 rounded" style={{ width: '750px' }}>
                                            <h5>Likes</h5>
                                            <p className="text-muted mb-0">
                                                {Number(currentImage?.likes_count || 0)}{" "}
                                                likes on this image
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <footer className="site-footer">
                            <div className="footer-content">
                                <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal</p>
                            </div>
                        </footer>
                    </div>
                </>
            )
            }
        </>
    );
}
export default ClubGallerySingle;