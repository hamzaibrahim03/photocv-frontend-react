import { useParams } from "react-router";
import Navbar from "./extra/Navbar";
import apiClient from "../api/axios";
import Loader from './extra/LoaderAll';
import "./assets/css/singlenotice.css"
import { useState, useEffect, useMemo, useCallback } from "react";
import he from "he";
import { NavLink, useNavigate } from "react-router";
function NoticeSinglePublic() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sinnoticeData, setsinnoticeData] = useState([]);
    const [sinnoticeList, setsinnoticeList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    useEffect(() => {
        getsinnoticeData(id);
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
            setsinnoticeList(
                sinnoticeData?.news?.original?.data ||
                []
            );
        }
    }, [search]);

    async function getsinnoticeData(id) {
        const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/notice/${id}`;

        const response = await fetch(url);
        const data = await response.json();

        setsinnoticeData(data.data);
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

    console.log(sinnoticeData.clubNotice)
    return (
        <>
            <div style={{ backgroundColor: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: sinnoticeData?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '5001', backgroundColor: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
                            <Navbar />
                        </nav>


                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    {
                                        sinnoticeData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="sno-hero-section" style={{ backgroundImage: `url(${sinnoticeData?.clubSettings?.original?.data?.settings?.cover_images[3]?.image_medium_url})` }} >
                                                <div className="sno-hero-overlay">
                                                    <div className="sno-events-card">
                                                        <p className="sno-date" style={{ textAlign: 'left', marginTop: '140px', marginBottom: '30px', }} >
                                                            Upcoming Notice | {formatDate(sinnoticeData?.clubNotice?.original?.data?.created_at)}
                                                        </p>

                                                        <h5 style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: '20px', }} >
                                                            {he.decode(sinnoticeData?.clubNotice?.original?.data?.title)}
                                                        </h5>
                                                    </div>

                                                    <p className="sno-text-secondaryy" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: '30px', }} >
                                                        {he.decode(sinnoticeData?.clubNotice?.original?.data?.description)}
                                                    </p>

                                                    <div className="sno-button-group mt-3 d-flex">
                                                        <button className="sno-btn me-2" id="sno-view" onClick={() => navigate(`/rytonnotice/${sinnoticeData.clubNotice?.original?.data?.id}`)} style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="sno-contents">

                            <section>
                                <div className="sno-container" style={{ maxWidth: '1820px' }} id="sno-heads">
                                    <div className="sno-events-header">
                                        <nav className="sno-breadcrumb">
                                            <NavLink to="/rytonnotice" className="sno-events-title sno-breadcrumb-item" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                Notices
                                            </NavLink>

                                            <span className="sno-events-title sno-breadcrumb-separator" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                &gt;
                                            </span>

                                            <span className="sno-events-title sno-breadcrumb-item sno-active">
                                                {sinnoticeData?.clubNotice?.original?.data?.title}
                                            </span>
                                        </nav>
                                        <div className="sno-search-bar">
                                            <i className="fas fa-search"></i>
                                            <input type="search" className="sno-search-input" id="sno-dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sno-container" style={{ maxWidth: '1820px' }} id="sno-overall">

                                    <div className="row">
                                        <div className="col-md-8">
                                            <section>
                                                <div className="sno-container">
                                                    <div className="sno-card" style={{ border: 'none' }}>
                                                        <img src={sinnoticeData?.clubNotice?.original?.data?.featured_image_url} alt="Meeting" style={{ maxWidth: '850px', width: '850px', height: '350px', borderRadius: '8px' }} />
                                                        <div className="d-flex justify-content-between" style={{ width: '850px' }}>
                                                            <h5 className="sno-head" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}>{sinnoticeData?.clubNotice?.original?.data?.title}</h5>
                                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                                <img src={sinnoticeData?.clubNotice?.original?.data?.notice_type.icon_url} style={{ width: '20px', height: '20px' }} />
                                                                <h5 className="sno-head m-0" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: '400', fontStyle: 'Regular', fontSize: '18px', lineHeight: '100%', letterSpacing: '0%' }}>{sinnoticeData?.clubNotice?.original?.data?.notice_type.name}</h5>
                                                            </div>

                                                        </div>
                                                        <p id="sno-edate" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(sinnoticeData?.clubNotice?.original?.data?.created_at)}</p>
                                                        <p className="sno-text-secondary" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color, width: '1100px' }}>
                                                            {he.decode(sinnoticeData?.clubNotice?.original?.data?.description)}
                                                        </p>

                                                        <p className="sno-text-secondary" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color, width: '1100px' }}>
                                                            {he.decode(sinnoticeData?.clubNotice?.original?.data?.description)}
                                                        </p>

                                                        <p className="sno-text-secondary" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color, width: '1100px' }}>
                                                            {he.decode(sinnoticeData?.clubNotice?.original?.data?.description)}
                                                        </p>

                                                    </div>
                                                </div>
                                            </section>
                                        </div >
                                        <div className="col-md-4">
                                            <section>
                                                <div className="sno-container" id="sno-right">

                                                    <div className="sno-more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }} id="sno-eve">
                                                        <h5 className="sno-head">Club News</h5>
                                                        {sinnoticeData?.clubNews?.length > 0 ? (
                                                            <div className="sno-event-list">
                                                                {sinnoticeData?.clubNews?.slice(0, 3).map((news) => (
                                                                    <div className="sno-event-item" key={news.id} style={{ marginBottom: '10px' }}>
                                                                        {news.featured_image_url ? (
                                                                            <img className="sno-img-fluid sno-event-img" src={news.featured_image_url} alt={news.title} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="sno-event-img sno-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="sno-event-details">
                                                                            <div className="sno-event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="sno-ename">{news.title}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center text-muted py-4">
                                                                No news found.
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="sno-more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }} id="sno-eve">
                                                        <h5 className="sno-head">Events</h5>
                                                        {sinnoticeData?.events?.length > 0 ? (
                                                            <div className="sno-event-list">
                                                                {sinnoticeData?.events?.map((ev) => (
                                                                    <div className="sno-event-item" style={{ marginBottom: '10px' }}>
                                                                        {ev.featured_image_url ? (
                                                                            <img className="sno-img-fluid sno-event-img" src={ev.featured_image_url} alt={ev.title} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="sno-event-img sno-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="sno-event-details">
                                                                            <div className="sno-event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="sno-ename">{ev.name}</span>
                                                                                <span id="sno-espeaker" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color }}>Speaker: {ev.speaker}</span>
                                                                            </div>

                                                                            <div className="sno-event-time" id="sno-edate">
                                                                                <small className="sno-event-date sno-galtext" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(ev.event_date)}</small><br />
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

                                                    <div className="sno-more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }} id="sno-eve">
                                                        <h5 className="sno-head">Competitions</h5>
                                                        {sinnoticeData?.competitions?.length > 0 ? (
                                                            <div className="sno-event-list">
                                                                {sinnoticeData?.competitions?.map((comp) => (
                                                                    <div className="sno-event-item" style={{ marginBottom: '10px' }}>
                                                                        {comp.featured_image_url ? (
                                                                            <img className="sno-img-fluid sno-event-img" src={comp.featured_image_url} alt={comp.title} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="sno-event-img sno-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="sno-event-details">
                                                                            <div className="sno-event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="sno-ename">{comp.name}</span>
                                                                                <span id="sno-espeaker" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                                    Judge:{" "}
                                                                                    {comp.judges?.map((judge, index) => (
                                                                                        <span key={judge.id}>
                                                                                            {judge.first_name} {judge.last_name}
                                                                                            {index < comp.judges.length - 1 ? ", " : ""}
                                                                                        </span>
                                                                                    ))}
                                                                                </span>
                                                                            </div>

                                                                            <div className="sno-event-time" id="sno-edate">
                                                                                <small className="sno-event-date sno-galtext" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(comp.start_date)}</small><br />
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
                                                    </div >

                                                </div >
                                            </section >
                                        </div >
                                    </div >

                                </div >
                            </section >

                            <section id="sno-joincontainer">
                                <div className="sno-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', width: '1820px' }}>
                                    <div id="sno-cls" className="sno-join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: sinnoticeData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="sno-clubheading" className="sno-heading" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="sno-clubsub" className="sno-head" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="sno-btn" id="sno-join-club" onClick={() => navigate('/rytonclub')} style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sno-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="sno-footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="sno-footer-heading" className="sno-heading sno-footer-heading" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnoticeData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="sno-footer-description" className="sno-head sno-footer-description mx-auto" style={{ maxWidth: '1145px', color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnoticeData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sno-container sno-footer-section">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="sno-contact-col">
                                                <h5 className="sno-head mb-4" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="sno-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="sno-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="sno-footer-text mb-0" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnoticeData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="sno-icon-circles ms-3" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="sno-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="sno-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="sno-footer-text mb-0" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnoticeData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="sno-icon-circles ms-3" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="sno-contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="sno-cla">
                                                    <p className="sno-footer-text mb-0" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnoticeData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="sno-icon-circles ms-3" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnoticeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={sinnoticeData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="sno-footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="sno-social-col">
                                                <h5 className="sno-head mb-4 text-md-start text-center" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="sno-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sno-cle">
                                                    <div className="sno-ficon-circles me-3" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="sno-facebook">
                                                        <p className="sno-footer-text fw-bold mb-1" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="sno-footer-link" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sinnoticeData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="sno-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sno-cle">
                                                    <div className="sno-ficon-circles me-3" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="sno-facebook">
                                                        <p className="sno-footer-text fw-bold mb-1" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="sno-footer-link" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sinnoticeData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="sno-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sno-cle">
                                                    <div className="sno-ficon-circles me-3" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="sno-flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="sno-facebook">
                                                        <p className="sno-footer-text fw-bold mb-1" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="sno-footer-link" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sinnoticeData?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="sno-site-footer">
                                <div className="sno-footer-content">
                                    <p className="sno-memtext" id="sno-fcopy">Copyright &copy; 2025 – {sinnoticeData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="sno-memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: sinnoticeData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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
export default NoticeSinglePublic

