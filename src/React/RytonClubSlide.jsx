import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import Loader from './extra/LoaderAll';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import './assets/css/clubslide.css'
import CommentsDrawClub from "./CommentsDrawClub";

function RytonClubSlide() {
    const navigate = useNavigate();
    const [clubData, setclubData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const thumbContainer = useRef(null);
    const thumbRefs = useRef([]);

    const [searchParams] = useSearchParams();
    const galleryId = searchParams.get("gallery");

    const [showComments, setShowComments] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxVisible, setLightboxVisible] = useState(false);

    async function getclubData() {
        try {
            const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/gallery/${galleryId}`
            const response = await fetch(url);
            const json = await response.json();
            setclubData(json.data);
        } finally {
            setIsLoading(false);
        }
    }

    const memData = useMemo(
        () => clubData?.data?.clubSettings?.original?.data || {},
        [clubData]
    );

    const Club = useMemo(() => memData.club || {}, [memData]);

    const Color = useMemo(() => memData.settings || {}, [memData]);

    const images = useMemo(() => {
        if (clubData.galleryImages?.length) {
            return clubData.galleryImages;
        }

        return clubData?.clubGallery?.original?.data?.photos || [];
    }, [clubData]);

    const profileImage = clubData.profileImage;

    const current = useMemo(() => {
        if (!images.length) return null;
        return images[currentIndex] || images[0];
    }, [images, currentIndex]);

    const fullName = useMemo(() => {
        if (!current) return "";
        return `${current.uploaded_by_first_name || ""} ${current.uploaded_by_last_name || ""}`.trim();
    }, [current]);

    const lightboxImages = useMemo(
        () =>
            images.map((img) => ({
                src: img.image,
            })),
        [images]
    );

    const next = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const goTo = (index) => {
        setCurrentIndex(index);
    };

    const openLightbox = () => {
        setLightboxVisible(true);
    };

    const closeLightbox = () => {
        setLightboxVisible(false);
    };


    const openFullscreen = () => {
        const el = document.querySelector(".main-image");

        if (el?.requestFullscreen) {
            el.requestFullscreen();
        }
    };

    useEffect(() => {
        const storedImages = localStorage.getItem("selectedImages");
        const storedIndex = localStorage.getItem("startIndex");

        if (storedImages) {
            setclubData(prev => ({
                ...prev,
                galleryImages: JSON.parse(storedImages),
            }));

            setCurrentIndex(Number(storedIndex) || 0);

            setIsLoading(false);   // <-- add this
        } else {
            getclubData();
        }
    }, []);

    useEffect(() => {
        const activeThumb = thumbRefs.current[currentIndex];
        const container = thumbContainer.current;

        if (activeThumb && container) {
            const offset =
                activeThumb.offsetLeft -
                container.clientWidth / 2 +
                activeThumb.clientWidth / 2;

            container.scrollTo({
                left: offset,
                behavior: "smooth",
            });
        }
    }, [currentIndex]);
    console.log("Images:", images);
    console.log("Current Index:", currentIndex);
    console.log("Current:", current);
    console.log("Stored Images", JSON.parse(localStorage.getItem("selectedImages")));
    console.log("clubData", clubData);
    console.log("images", images);
    return (
        <>
            <div style={{ backgroundColor: clubData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: clubData?.clubSettings?.original?.data?.settings?.fonts, }} >
                <Loader show={isLoading} />

                {!isLoading && (
                    <div>
                        <div className={`viewer ${showComments ? "drawer-open" : ""}`}>
                            <section>
                                <div className="top-bar">
                                    <button className="back-btn" onClick={() => navigate(-1)}>
                                        ❮ &nbsp; Back
                                    </button>
                                </div>

                                <div className="image-section">
                                    <button className="nav-arrow left" onClick={prev}>
                                        ‹
                                    </button>

                                    <div className="image-wrapper">
                                        {current && (
                                            <img src={current.image} alt="" className="main-image" onClick={openLightbox} />
                                        )}

                                        <button className="expand-btn" onClick={openFullscreen}>
                                            ⤢
                                        </button>
                                    </div>

                                    <button className="nav-arrow right" onClick={next}>
                                        ›
                                    </button>

                                    <button className="open-comments" onClick={() => setShowComments(true)}>
                                        ❮
                                    </button>
                                </div>

                                {current && (
                                    <div className="d-flex image-info">
                                        {profileImage && (
                                            <img src={profileImage} alt="" className="profile-img" />
                                        )}

                                        <div className="text">
                                            <h3 className="title">
                                                {current.title}
                                            </h3>

                                            <span className="meta">
                                                by {fullName}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="thumbs-wrapper">
                                    <div className="thumbnails" ref={thumbContainer}>
                                        {images.map((img, i) => (
                                            <div key={img.id} className={`thumb ${i === currentIndex ? "active" : ""}`} onClick={() => goTo(i)} ref={(el) => (thumbRefs.current[i] = el)}>
                                                <img src={img.image} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {showComments && current && (
                                    <CommentsDrawClub key={current.photo_id} photo={current} onClose={() => setShowComments(false)} />
                                )}

                                <Lightbox open={lightboxVisible} close={closeLightbox} slides={lightboxImages} index={currentIndex} />
                            </section>

                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">
                                        Copyright &copy; 2025 – {clubData?.clubSettings?.original?.data?.club.club_name}
                                    </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: clubData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
                                </div>
                            </footer>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default RytonClubSlide