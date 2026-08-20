import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import Loader from './extra/LoaderAll';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import './assets/css/rytonstyle.css'

function RytonResultSlide() {
    const navigate = useNavigate();
    const [resultData, setResultData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const thumbContainer = useRef(null);
    const thumbRefs = useRef([]);

    const [searchParams] = useSearchParams();
    const id = searchParams.get("competition") || searchParams.get("result");

    const [showComments, setShowComments] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxVisible, setLightboxVisible] = useState(false);
    useEffect(() => {
        console.log("useEffect called");
        getResultData();
    }, []);
    async function getResultData() {
        try {
            console.log("Fetching...");

            const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/competition-results/${id}`;

            const response = await fetch(url);
            const json = await response.json();

            console.log(json);

            setResultData(json.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }


    const memData = useMemo(
        () => resultData?.data?.clubSettings?.original?.data || resultData?.clubSettings?.original?.data || {},
        [resultData]
    );

    const Club = useMemo(() => memData.club || {}, [memData]);

    const Color = useMemo(() => memData.settings || {}, [memData]);

    const images = useMemo(() => {
        if (Array.isArray(resultData.competitionResult)) {
            return resultData.competitionResult;
        }

        return (
            resultData?.competitionResult?.original?.data?.entries || []
        );
    }, [resultData]);

    const current = useMemo(() => {
        if (!images.length) return null
        return images[currentIndex] || images[0]
    }, [images, currentIndex])
    const fullName = current?.member_name || "";

    const lightboxImages = useMemo(
        () =>
            images.map((img) => ({
                src: img.entry_image || img.entry_image_url,
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
            setResultData(prev => ({
                ...prev,
                competitionResult: JSON.parse(storedImages),
            }));

            setCurrentIndex(Number(storedIndex) || 0);

            setIsLoading(false);
        } else {
            getResultData();
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
    console.log("resultData", resultData);
    console.log("images", images);
    return (
        <>
            <div
                style={{ backgroundColor: resultData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: resultData?.clubSettings?.original?.data?.settings?.fonts, }} >
                <Loader show={isLoading} />

                {!isLoading && (
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
                                        <img src={current.entry_image || current.entry_image_url} alt="" className="main-image" onClick={openLightbox} />
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
                                    <div className="text">
                                        <h3 className="title">
                                            {current.entry_image_title || current.entry_title}
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
                                        <div key={img.id || i} className={`thumb ${i === currentIndex ? "active" : ""}`} onClick={() => goTo(i)} ref={(el) => (thumbRefs.current[i] = el)}>
                                            <img src={img.entry_image || img.entry_image_url} alt="" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* {showComments && current && (
                                    <CommentsDrawer key={current.id} photo={current} onClose={() => setShowComments(false)} />
                                )} */}

                            <Lightbox open={lightboxVisible} close={closeLightbox} slides={lightboxImages} index={currentIndex} />
                        </section>

                        <footer className="site-footer">
                            <div className="footer-content">
                                <p className="memtext" id="fcopy">
                                    Copyright &copy; 2025 – {Club.club_name}
                                </p>

                                <p className="memtext">
                                    Powered by{" "}
                                    <a href="https://cameraclub.website" target="_blank" rel="noreferrer" style={{ color: Color.text_color, fontWeight: "bold", }}>
                                        {Club.domain_name}
                                    </a>
                                </p>
                            </div>
                        </footer>
                    </div>
                )}
            </div>
        </>
    )
}

export default RytonResultSlide
