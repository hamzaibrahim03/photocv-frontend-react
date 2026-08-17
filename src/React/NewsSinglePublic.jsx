import { useParams } from "react-router";
import Navbar from "./extra/Navbar";
import Loader from './extra/LoaderAll';
import "./assets/css/rytonstyle.css"
import { useState, useEffect } from "react";
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
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '5001', backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
                            <Navbar />
                        </nav>


                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="hero-section" style={{ backgroundImage: `url(${sinnewsData?.clubSettings?.original?.data?.settings?.cover_images?.[2]?.image_medium_url})` }} >
                                        <div className="hero-overlay">
                                            {sinnewsData?.news?.original?.data && (
                                                <div>
                                                    <div className="events-card">
                                                        <p className="date" style={{ textAlign: "left", marginTop: "140px", marginBottom: "30px", }} >
                                                            Upcoming News | {formatDate(sinnewsData.news?.original?.data?.publish_date)}
                                                        </p>
                                                        <h5 style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: "20px", width: "825px", }} >
                                                            {sinnewsData.news?.original?.data?.title}
                                                        </h5>
                                                    </div>
                                                    <p className="text-secondaryy" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: "30px", }} >
                                                        {sinnewsData.news?.original?.data?.description}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="button-group mt-3 d-flex">
                                                <button className="btn me-2" id="view" onClick={() => navigate(`/rytonnews/${sinnewsData.news?.original?.data?.id}`)} style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="contents">

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }} id="heads">
                                    <div className="events-header">
                                        <nav className="breadcrumb">
                                            <NavLink to="/rytonnews" className="events-title breadcrumb-item" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                News
                                            </NavLink>

                                            <span className="events-title breadcrumb-separator" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                &gt;
                                            </span>

                                            <span className="events-title breadcrumb-item active">
                                                {sinnewsData?.news?.original?.data?.title}
                                            </span>
                                        </nav>
                                        <div className="search-bar">
                                            <i className="fas fa-search"></i>
                                            <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }} id="overall">

                                    <div className="row">
                                        <div className="col-md-8">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }}>
                                                    <div className="card" style={{ border: 'none' }}>
                                                        <img src={sinnewsData?.news?.original?.data?.featured_image_url} alt="Meeting" style={{ maxWidth: '850px', marginBottom: '50px', width: '850px', height: '350px', borderRadius: '8px' }} />
                                                        <div className="d-flex justify-content-between" style={{ width: '850px' }}>
                                                            <h5 className="head" style={{ fontFamily: 'Inter', fontWeight: 500, fontStyle: "Medium", fontSize: "28px", lineHeight: "100%", letterSpacing: "0%", color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>{sinnewsData?.news?.original?.data.title}</h5>
                                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                                <img src={sinnewsData?.news?.original?.data?.club_news_type?.icon_url} style={{ width: '20px', height: '20px' }} />
                                                                <h5 className="head m-0" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: '400', fontStyle: 'Regular', fontSize: '18px', lineHeight: '100%', letterSpacing: '0%' }}>{sinnewsData?.news?.original?.data?.club_news_type?.name}</h5>
                                                            </div>

                                                        </div>
                                                        <p id="edate" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(sinnewsData?.news?.original?.data.publish_date)}</p>
                                                        <p className="text-secondary" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, width: '1100px' }}>{he.decode(sinnewsData?.news?.original?.data.description)}
                                                        </p>

                                                        <p className="text-secondary" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, width: '1100px' }}>{he.decode(sinnewsData?.news?.original?.data.description)}
                                                        </p>

                                                        <p className="text-secondary" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, width: '1100px' }}>{he.decode(sinnewsData?.news?.original?.data.description)}
                                                        </p>

                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="right">

                                                    <div className="more-card d-flex flex-column" id="eve">
                                                        <h5 className="head">Club Notices</h5>
                                                        {sinnewsData?.clubNotices?.original?.data?.length > 0 ? (
                                                            <div className="event-list">
                                                                {sinnewsData?.clubNotices?.original?.data.slice(0, 3).map((note) => (
                                                                    <div className="event-item" style={{ marginBottom: '10px' }}>
                                                                        {note.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={note.featured_image_url} alt={note.title} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="ename">{note.title}</span>
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

                                                    <div className="more-card d-flex flex-column" id="eve">
                                                        <h5 className="head">Events</h5>
                                                        {sinnewsData?.events?.length > 0 ? (
                                                            <div className="event-list">
                                                                {sinnewsData?.events.map((event) => (
                                                                    <div className="event-item" style={{ marginBottom: '10px' }}>
                                                                        {event.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={event.featured_image_url} alt={event.name} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="ename">{event.name}</span>
                                                                                <span id="espeaker" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>Speaker: {event.speaker}</span>
                                                                            </div>

                                                                            <div className="event-time" id="edate">
                                                                                <small className="event-date galtext" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(event.event_date)}</small><br />
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

                                                    <div className="more-card d-flex flex-column" id="eve">
                                                        <h5 className="head">Competitions</h5>
                                                        {sinnewsData?.competitions?.length > 0 ? (
                                                            <div className="event-list">
                                                                {sinnewsData?.competitions.map((comp) => (
                                                                    <div className="event-item" style={{ marginBottom: '10px' }}>
                                                                        {comp.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={comp.featured_image_url} alt={comp.name} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="ename">{comp.name}</span>
                                                                                <span id="espeaker" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                                    Judge:{" "}
                                                                                    {comp.judges?.map((judge, index) => (
                                                                                        <span key={judge.id}>
                                                                                            {judge.first_name} {judge.last_name}
                                                                                            {index < comp.judges.length - 1 ? ", " : ""}
                                                                                        </span>
                                                                                    ))}
                                                                                </span>
                                                                            </div>

                                                                            <div className="event-time" id="edate">
                                                                                <small className="event-date galtext" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(comp.start_date)}</small><br />
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

                            <section id="joincontainer">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div id="cls" className="join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="clubheading" className="heading" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="clubsub" className="head" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="btn" id="join-club" onClick={() => navigate('/rytonclub')} style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section id="footer-section">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div>
                                        <h5 id="footer-heading" className="heading footer-heading" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnewsData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="footer-description" className="head footer-description mx-auto" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnewsData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section id="footer-section">
                                <div className="container">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="contact-col">
                                                <h5 className="head mb-4" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnewsData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="icon-circles ms-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnewsData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="icon-circles ms-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="cla">
                                                    <p className="footer-text mb-0" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}> {sinnewsData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="icon-circles ms-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={sinnewsData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="social-col">
                                                <h5 className="head mb-4 text-md-start text-center" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="footer-link" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sinnewsData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="footer-link" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sinnewsData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="footer-link" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sinnewsData?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – {sinnewsData?.news?.original?.data?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: sinnewsData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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
