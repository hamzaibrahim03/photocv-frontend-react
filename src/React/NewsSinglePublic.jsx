import { useParams } from "react-router";
import Navbar from "./extra/Navbar";
import apiClient from "../api/axios";
import Loader from './extra/LoaderAll';
import "./assets/css/singlenews.css"
import { useState, useEffect, useMemo, useCallback } from "react";
import he from "he";
import { NavLink, useNavigate } from "react-router";
function NewsSinglePublic() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sinnewsData, setsinnewsData] = useState([]);
    const [sinnewsList, setsinnewsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    useEffect(() => {
        getsinnewsData(id);
        const carouselEl = document.querySelector('#carouselExampleIndicators')
        if (carouselEl && window.bootstrap) {
            new window.bootstrap.Carousel(carouselEl)
        }
    }, [id])
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    useEffect(() => {
        if (search.length >= 3) {
            fetchSearchedNews(search);
        } else {
            setsinnewsList(
                sinnewsData?.news?.original?.data ||
                []
            );
        }
    }, [search]);

    async function getsinnewsData(id) {
        const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/news/${id}`;

        const response = await fetch(url);
        const data = await response.json();

        setsinnewsData(data.data);
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        const day = date.getDate();
        const month = date.toLocaleString("en-GB", { month: "long" });
        const year = date.getFullYear();
        const suffix =
            day % 10 === 1 && day !== 11 ? "st" :
                day % 10 === 2 && day !== 12 ? "nd" :
                    day % 10 === 3 && day !== 13 ? "rd" : "th";
        return `${day}${suffix} ${month} ${year}`;
    };


    const formatsDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        const month = date.toLocaleString("en-GB", { month: "short" });
        const year = date.getFullYear();

        return ` ${month} ${year}`;
    };

    const formatedDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        const year = date.getFullYear();

        return ` ${year}`;
    };

    console.log(sinnewsData.news)
    return (
        <>
            <div style={{ backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: sinnewsData?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '5001', backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, height: '108px' }}>
                            <Navbar />
                        </nav>


                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="sne-hero-section" style={{ backgroundImage: `url(${sinnewsData?.clubSettings?.original?.data?.settings?.cover_images?.[2]?.image_medium_url})` }} >
                                        <div className="sne-hero-overlay">
                                            {sinnewsData?.news?.original?.data && (
                                                <div>
                                                    <div className="sne-events-card">
                                                        <p className="sne-date" style={{ textAlign: "left", marginTop: "140px", marginBottom: "30px", }} >
                                                            Upcoming News | {formatDate(sinnewsData.news?.original?.data?.publish_date)}
                                                        </p>
                                                        <h5 style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: "20px", width: "825px", }} >
                                                            {sinnewsData.news?.original?.data?.title}
                                                        </h5>
                                                    </div>
                                                    <p className="sne-text-secondaryy" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: "30px", }} >
                                                        {sinnewsData.news?.original?.data?.description}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="sne-button-group mt-3 d-flex">
                                                <button className="sne-btn me-2" id="sne-view" onClick={() => navigate(`/rytonnews/${sinnewsData.news?.original?.data?.id}`)} style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sne-contents">

                            <section>
                                <div className="sne-container" style={{ maxWidth: '1820px' }} id="sne-heads">
                                    <div className="sne-events-header">
                                        <nav className="sne-breadcrumb">
                                            <NavLink to="/rytonnews" className="sne-events-title sne-breadcrumb-item" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                News
                                            </NavLink>

                                            <span className="sne-events-title sne-breadcrumb-separator" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                &gt;
                                            </span>

                                            <span className="sne-events-title sne-breadcrumb-item sne-active">
                                                {sinnewsData?.news?.original?.data?.title}
                                            </span>
                                        </nav>
                                        <div className="sne-search-bar">
                                            <i className="fas fa-search"></i>
                                            <input type="search" className="sne-search-input" id="sne-dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sne-container" style={{ maxWidth: '1820px' }} id="sne-overall">

                                    <div className="row">
                                        <div className="col-md-8">
                                            <section>
                                                <div className="sne-container">
                                                    <div className="sne-card" style={{ border: 'none' }}>
                                                        <img src={sinnewsData?.news?.original?.data?.featured_image_url} alt="Meeting" style={{ maxWidth: '850px', width: '850px', height: '350px', borderRadius: '8px' }} />
                                                        <div className="d-flex justify-content-between" style={{ width: '850px' }}>
                                                            <h5 className="sne-head" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>{sinnewsData?.news?.original?.data.title}</h5>
                                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                                <img src={sinnewsData?.news?.original?.data?.club_news_type?.icon_url} style={{ width: '20px', height: '20px' }} />
                                                                <h5 className="sne-head m-0" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: '400', fontStyle: 'Regular', fontSize: '18px', lineHeight: '100%', letterSpacing: '0%' }}>{sinnewsData?.news?.original?.data?.club_news_type?.name}</h5>
                                                            </div>

                                                        </div>
                                                        <p id="sne-edate" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(sinnewsData?.news?.original?.data.publish_date)}</p>
                                                        <p className="sne-text-secondary" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, width: '1100px' }}>{he.decode(sinnewsData?.news?.original?.data.description)}
                                                        </p>

                                                        <p className="sne-text-secondary" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, width: '1100px' }}>{he.decode(sinnewsData?.news?.original?.data.description)}
                                                        </p>

                                                        <p className="sne-text-secondary" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, width: '1100px' }}>{he.decode(sinnewsData?.news?.original?.data.description)}
                                                        </p>

                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                        <div className="col-md-4">
                                            <section>
                                                <div className="sne-container" id="sne-right">

                                                    <div className="sne-more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }} id="sne-eve">
                                                        <h5 className="sne-head">Club Notices</h5>
                                                        {sinnewsData?.clubNotices?.original?.data?.length > 0 ? (
                                                            <div className="sne-event-list">
                                                                {sinnewsData?.clubNotices?.original?.data.slice(0, 3).map((note) => (
                                                                    <div className="sne-event-item" style={{ marginBottom: '10px' }}>
                                                                        {note.featured_image_url ? (
                                                                            <img className="sne-img-fluid sne-event-img" src={note.featured_image_url} alt={note.title} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="sne-event-img sne-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="sne-event-details">
                                                                            <div className="sne-event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="sne-ename">{note.title}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center text-muted py-4">
                                                                No notices found.
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="sne-more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }} id="sne-eve">
                                                        <h5 className="sne-head">Events</h5>
                                                        {sinnewsData?.events?.length > 0 ? (
                                                            <div className="sne-event-list">
                                                                {sinnewsData?.events.map((event) => (
                                                                    <div className="sne-event-item" style={{ marginBottom: '10px' }}>
                                                                        {event.featured_image_url ? (
                                                                            <img className="sne-img-fluid sne-event-img" src={event.featured_image_url} alt={event.name} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="sne-event-img sne-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="sne-event-details">
                                                                            <div className="sne-event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="sne-ename">{event.name}</span>
                                                                                <span id="sne-espeaker" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>Speaker: {event.speaker}</span>
                                                                            </div>

                                                                            <div className="sne-event-time" id="sne-edate">
                                                                                <small className="sne-event-date sne-galtext" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(event.event_date)}</small><br />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center text-muted py-4">
                                                                No events found.
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="sne-more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }} id="sne-eve">
                                                        <h5 className="sne-head">Competitions</h5>
                                                        {sinnewsData?.competitions?.length > 0 ? (
                                                            <div className="sne-event-list">
                                                                {sinnewsData?.competitions.map((comp) => (
                                                                    <div className="sne-event-item" style={{ marginBottom: '10px' }}>
                                                                        {comp.featured_image_url ? (
                                                                            <img className="sne-img-fluid sne-event-img" src={comp.featured_image_url} alt={comp.name} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="sne-event-img sne-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="sne-event-details">
                                                                            <div className="sne-event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="sne-ename">{comp.name}</span>
                                                                                <span id="sne-espeaker" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                                    Judge:{" "}
                                                                                    {comp.judges?.map((judge, index) => (
                                                                                        <span key={judge.id}>
                                                                                            {judge.first_name} {judge.last_name}
                                                                                            {index < comp.judges.length - 1 ? ", " : ""}
                                                                                        </span>
                                                                                    ))}
                                                                                </span>
                                                                            </div>

                                                                            <div className="sne-event-time" id="sne-edate">
                                                                                <small className="sne-event-date galtext" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(comp.start_date)}</small><br />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center text-muted py-4">
                                                                No competitions found.
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>
                                            </section>
                                        </div>
                                    </div>

                                </div>
                            </section>

                            <section id="sne-joincontainer">
                                <div className="sne-container" style={{ maxWidth: '1820px', width: '1820px' }}>
                                    <div id="sne-cls" className="sne-join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="sne-clubheading" className="sne-heading" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="sne-clubsub" className="sne-head" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="sne-btn" id="sne-join-club" onClick={() => navigate('/rytonclub')} style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sne-container" style={{ maxWidth: '1820px', flexDirection: 'column' }}>
                                    <div className="sne-footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="sne-footer-heading" className="sne-heading sne-footer-heading" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnewsData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="sne-footer-description" className="sne-head sne-footer-description mx-auto" style={{ maxWidth: '1145px', color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnewsData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sne-container sne-footer-section">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="sne-contact-col">
                                                <h5 className="sne-head mb-4" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="sne-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="sne-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="sne-footer-text mb-0" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnewsData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="sne-icon-circles ms-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="sne-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="sne-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="sne-footer-text mb-0" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnewsData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="sne-icon-circles ms-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="sne-contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="sne-cla">
                                                    <p className="sne-footer-text mb-0" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnewsData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="sne-icon-circles ms-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={sinnewsData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="sne-footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="sne-social-col">
                                                <h5 className="sne-head mb-4 text-md-start text-center" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="sne-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sne-cle">
                                                    <div className="sne-ficon-circles me-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="sne-facebook">
                                                        <p className="sne-footer-text fw-bold mb-1" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="sne-footer-link" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sinnewsData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="sne-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sne-cle">
                                                    <div className="sne-ficon-circles me-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="sne-facebook">
                                                        <p className="sne-footer-text fw-bold mb-1" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="sne-footer-link" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sinnewsData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="sne-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sne-cle">
                                                    <div className="sne-ficon-circles me-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="sne-flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="sne-facebook">
                                                        <p className="sne-footer-text fw-bold mb-1" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="sne-footer-link" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sinnewsData?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="sne-site-footer">
                                <div className="sne-footer-content">
                                    <p className="sne-memtext" id="sne-fcopy">Copyright &copy; 2025 – {sinnewsData?.news?.original?.data?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="sne-memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
                                </div>
                            </footer>
                        </div >
                    </div >
                )
                }
            </div >
        </>
    )
}
export default NewsSinglePublic
