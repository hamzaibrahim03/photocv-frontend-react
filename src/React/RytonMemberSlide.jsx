import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import Loader from './extra/LoaderAll';

import CommentsDrawMember from "./CommentsDrawMember";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import './assets/css/memberslide.css'

function RytonMemberSlide() {
    const navigate = useNavigate();
    const [memberData, setMemberData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const thumbContainer = useRef(null);
    const thumbRefs = useRef([]);

    const [searchParams] = useSearchParams();
    const galleryId = searchParams.get("gallery");

    const [showComments, setShowComments] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxVisible, setLightboxVisible] = useState(false);

    async function getMemberData() {
        try {
            const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/member/${galleryId}/galleries`
            const response = await fetch(url);
            const json = await response.json();
            setMemberData(json.data);
        } finally {
            setIsLoading(false);
        }
    }

    const memData = useMemo(
        () => memberData?.data?.clubSettings?.original?.data || {},
        [memberData]
    );

    const Club = useMemo(() => memData.club || {}, [memData]);

    const Color = useMemo(() => memData.settings || {}, [memData]);

    const images = useMemo(() => {
        if (memberData.galleryImages?.length) {
            return memberData.galleryImages;
        }

        return memberData?.memberGalleries?.original?.data?.photos || [];
    }, [memberData]);

    const profileImage = memberData?.memberGalleries?.original?.data?.member?.profile_image;
    console.log("profileImage", memberData);

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
        const el = document.querySelector(".msl-main-image");

        if (el?.requestFullscreen) {
            el.requestFullscreen();
        }
    };

    useEffect(() => {
    const storedImages = localStorage.getItem("selectedImages");
    const storedIndex = localStorage.getItem("startIndex");

    if (storedImages) {
        setMemberData(prev => ({
            ...prev,
            galleryImages: JSON.parse(storedImages),
        }));

        setCurrentIndex(Number(storedIndex) || 0);

        setIsLoading(false);   // <-- add this
    } else {
        getMemberData();
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
    console.log("memberData", memberData);
    console.log("images", images);
    return (
        <>
            <div
                style={{ backgroundColor: memberData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: memberData?.clubSettings?.original?.data?.settings?.fonts, }} >
                <Loader show={isLoading} />

                {!isLoading && (
                    <div>
                        <div className={`msl-viewer ${showComments ? "msl-drawer-open" : ""}`}>
                            <section>
                                <div className="msl-top-bar">
                                    <button className="msl-back-btn" onClick={() => navigate(-1)}>
                                        ❮ &nbsp; Back
                                    </button>
                                </div>

                                <div className="msl-image-section">
                                    <button className="msl-nav-arrow msl-left" onClick={prev}>
                                        ‹
                                    </button>

                                    <div className="msl-image-wrapper">
                                        {current && (
                                            <img src={current.image} alt="" className="msl-main-image" onClick={openLightbox} />
                                        )}

                                        <button className="msl-expand-btn" onClick={openFullscreen}>
                                            ⤢
                                        </button>
                                    </div>

                                    <button className="msl-nav-arrow msl-right" onClick={next}>
                                        ›
                                    </button>

                                    <button className="msl-open-comments" onClick={() => setShowComments(true)}>
                                        ❮
                                    </button>
                                </div>

                                {current && (
                                    <div className="msl-d-flex image-info">
                                        {profileImage && (
                                            <img src={profileImage} alt="" className="msl-profile-img" />
                                        )}

                                        <div className="msl-text">
                                            <h3 className="msl-title">
                                                {current.title}
                                            </h3>

                                            <span className="msl-meta">
                                                by {fullName}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="msl-thumbs-wrapper">
                                    <div className="msl-thumbnails" ref={thumbContainer}>
                                        {images.map((img, i) => (
                                            <div key={img.id} className={`msl-thumb ${i === currentIndex ? "active" : ""}`} onClick={() => goTo(i)} ref={(el) => (thumbRefs.current[i] = el)}>
                                                <img src={img.image} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {showComments && current && (
                                    <CommentsDrawMember key={current.id} photo={current} onClose={() => setShowComments(false)} />
                                )}

                                <Lightbox open={lightboxVisible} close={closeLightbox} slides={lightboxImages} index={currentIndex} />
                            </section>

                            <footer className="msl-site-footer">
                                <div className="msl-footer-content">
                                    <p className="msl-memtext" id="msl-fcopy">
                                        Copyright &copy; 2025 – {Club.club_name}
                                    </p>

                                    <p className="msl-memtext">
                                        Powered by{" "}
                                        <a href="https://cameraclub.website" target="_blank" rel="noreferrer" style={{ color: Color.text_color, fontWeight: "bold", }}>
                                            {Club.domain_name}
                                        </a>
                                    </p>
                                </div>
                            </footer>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default RytonMemberSlide