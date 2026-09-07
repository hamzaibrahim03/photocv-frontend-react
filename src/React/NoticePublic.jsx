import Navbar from "./extra/Navbar";
import apiClient from "../api/axios";
import Loader from './extra/LoaderAll';
import "./assets/css/rytonstyle.css"
import { useState, useEffect, useMemo, useCallback } from "react";
import he from "he";
import { useNavigate } from "react-router";
function NoticePublic() {
    const navigate = useNavigate();
    const [noticeData, setnoticeData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(4);
    const [noticesList, setNoticesList] = useState([]);
    const [filters, setFilters] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(() => {
        getnoticeData();
        const carouselEl = document.querySelector('#carouselExampleIndicators')
        if (carouselEl && window.bootstrap) {
            new window.bootstrap.Carousel(carouselEl)
        }
    }, [])
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    useEffect(() => {
        if (filters.length > 0 && !activeFilter) {
            setActiveFilter(filters[0].name);
        }
    }, [filters]);
    useEffect(() => {
        if (search.length >= 3) {
            fetchSearchedNotices(search);
        } else {
            setNoticesList(
                noticeData?.clubNotices?.original?.data?.original?.data ||
                []
            );
        }
    }, [search, noticeData]);
    async function getnoticeData() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/notices"
        let response = await fetch(url)
        response = await response.json()
        setnoticeData(response.data)
    }
    console.log(noticeData)
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };
    let lastSearched = "";
    const fetchSearchedNotices = useCallback(
        debounce(async (query) => {
            if (query.length >= 3 && query !== lastSearched) {
                lastSearched = query;
                try {
                    const response = await apiClient.get("/club/public/notices", {
                        params: {
                            search_term: query,
                        },
                    });
                    const result = response?.data?.data?.clubNotices?.original?.data?.original?.data || [];
                    setNoticesList(result);
                    setCurrentPage(1);
                } catch (error) {
                    console.error(error);
                    setNoticesList([]);
                }
            }
        }, 400),
        []
    );
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        const day = date.getDate();
        const month = date.toLocaleString("en-GB", {
            month: "long",
        });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };
    useEffect(() => {
        const clubNotices = noticeData?.clubNotices?.original?.data?.original?.data || [];
        const uniqueFilters = [
            { name: "All" },
            ...Array.from(
                new Map(
                    clubNotices.map(item => [
                        item.notice_type?.name,
                        {
                            name: item.notice_type?.name,
                            icon: item.notice_type?.icon_url
                        }
                    ])
                ).values()
            )
        ];
        setFilters(uniqueFilters);
    }, [noticeData]);
    useEffect(() => {
        const carouselEl = document.querySelector(
            "#carouselExampleIndicators"
        );
        if (carouselEl && window.bootstrap) {
            new window.bootstrap.Carousel(carouselEl);
        }
        try {
            const clubNotices = noticeData?.clubNotices?.original?.data?.original?.data || [];
            setNoticesList(clubNotices);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [noticeData]);
    const filteredNotices = useMemo(() => {
        let list = [...noticesList];
        if (activeFilter !== "All") {
            list = list.filter(
                (item) => item.notice_type?.name === activeFilter ||
                    item.notice_type?.icon_url === activeFilter
            );
        }
        if (search.trim() !== "") {
            const term = search.toLowerCase();
            list = list.filter(
                (item) =>
                    item.title?.toLowerCase().includes(term) ||
                    item.description?.toLowerCase().includes(term)
            );
        }
        return list;
    }, [noticesList, activeFilter, search]);
    const paginatedNotices = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredNotices.slice(start, start + rowsPerPage);
    }, [filteredNotices, currentPage, rowsPerPage]);
    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(filteredNotices.length / rowsPerPage),
            1
        );
    }, [filteredNotices, rowsPerPage]);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    console.log(noticeData.clubNotices)
    return (
        <>
            <div style={{ backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: noticeData?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '1001', backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
                            <Navbar />
                        </nav>
                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    {
                                        noticeData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="hero-section" style={{ backgroundImage: `url(${noticeData?.clubSettings?.original?.data?.settings?.cover_images[3]?.image_medium_url})` }}>
                                                <div className="hero-overlay">
                                                    <div className="events-card">
                                                        <p className="date" style={{ textAlign: 'left', marginTop: '140px', marginBottom: '30px', }}>
                                                            Upcoming Notice | {formatDate(noticeData?.clubNotices?.original?.data?.original?.data?.[0]?.created_at)}
                                                        </p>
                                                        <h5 style={{ color: noticeData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: '20px', }}>
                                                            {noticeData?.clubNotices?.original?.data?.original?.data?.[0]?.title}
                                                        </h5>
                                                    </div>
                                                    <p className="text-secondaryy" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: '30px', }}>
                                                        {he.decode(noticeData?.clubNotices?.original?.data?.original?.data?.[0]?.description)}
                                                    </p>
                                                    <div className="button-group mt-3 d-flex">
                                                        <button className="btn me-2" id="view" onClick={() => navigate(`/rytonnotice/${noticeData.clubNotices?.original?.data?.original?.data?.[0]?.id}`)} style={{ color: noticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.accent_color, }}>
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="contents">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }} id="heads">
                                    <div className="events-header">
                                        <h2 className="events-title" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>Club Notices</h2>
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
                                                <div className="container" style={{ maxWidth: '1820px' }} id="events-left">
                                                    <div className="filter-buttons notice-filter-buttons">
                                                        {filters.map((filter) => (
                                                            <button key={filter.name} className={`filter-btn notice-filter-btn ${activeFilter === filter.name ? "active" : ""}`} onClick={() => { console.log(filter.name); setActiveFilter(filter.name); setCurrentPage(1); }}>
                                                                {filter.icon && (
                                                                    <img src={filter.icon} alt={filter.name} className="icones" />
                                                                )}
                                                                <span className="label">{filter.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4">
                                                        {paginatedNotices.length > 0 ? (
                                                            <>
                                                                {
                                                                    paginatedNotices.map((notice) => (
                                                                        <div className="events-cards p-3">
                                                                            <img src={notice.featured_image_thumb} alt={notice.title} />
                                                                            <div className="flex-grow-1 d-flex flex-column justify-content-between" id="detail">
                                                                                <div className="d-flex w-100 justify-content-between align-items-center">
                                                                                    <h5 id="ename" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>{notice.title || 'Untitled Notice'}</h5>
                                                                                    <div className="icon-container d-flex gap-2">
                                                                                        <img src={notice.notice_type?.icon_url} alt={notice.notice_type?.name} className="virtual" style={{ width: '25px', height: '25px' }} />
                                                                                    </div>
                                                                                </div>
                                                                                <p className="galtext" id="edate" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                                    {formatDate(notice.created_at) || 'Date Not Available'}
                                                                                </p>
                                                                                <p className="text-secondary" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                                    {he.decode(notice.description)}
                                                                                </p>
                                                                                <div className="button-groups mt-3 d-flex">
                                                                                    <button onClick={() => navigate(`/rytonnotice/${notice.id}`)} className="btn me-2" id="view" click="navigate" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.primary_color }}>View Details</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-muted">No notice found.</div>
                                                        )}
                                                        <div className="dt-paging">
                                                            <nav aria-label="pagination">
                                                                <button className={`dt-paging-button previous ${currentPage === 1 ? "disabled" : ""}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label="Previous">
                                                                    ‹
                                                                </button>
                                                                {Array.from({ length: totalPages }, (_, index) => {
                                                                    const page = index + 1;
                                                                    return (
                                                                        <button key={page} className={`dt-paging-button ${page === currentPage ? "current" : ""}`} onClick={() => goToPage(page)}>
                                                                            {page}
                                                                        </button>
                                                                    );
                                                                })}
                                                                <button className={`dt-paging-button next ${currentPage === totalPages ? "disabled" : ""}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Next">
                                                                    ›
                                                                </button>
                                                            </nav>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="right">
                                                    <div className="more-card d-flex flex-column" id="eve">
                                                        <h5 className="head">Club News</h5>
                                                        {noticeData?.clubNews?.length > 0 ? (
                                                            <div className="event-list">
                                                                {noticeData?.clubNews?.slice(0, 3).map((news) => (
                                                                    <div className="event-item" key={news.id} style={{ marginBottom: '10px' }}>
                                                                        {news.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={news.featured_image_url} alt={news.title} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="ename">{news.title}</span>
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
                                                    <div className="more-card d-flex flex-column" id="eve">
                                                        <h5 className="head">Events</h5>
                                                        {noticeData?.events?.length > 0 ? (
                                                            <div className="event-list">
                                                                {noticeData?.events?.map((ev) => (
                                                                    <div className="event-item" style={{ marginBottom: '10px' }}>
                                                                        {ev.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={ev.featured_image_url} alt={ev.title} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="ename">{ev.name}</span>
                                                                                <span id="espeaker" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.accent_color }}>Speaker: {ev.speaker}</span>
                                                                            </div>
                                                                            <div className="event-time" id="edate">
                                                                                <small className="event-date galtext" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(ev.event_date)}</small><br />
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
                                                        {noticeData?.competitions?.length > 0 ? (
                                                            <div className="event-list">
                                                                {noticeData?.competitions?.map((comp) => (
                                                                    <div className="event-item" style={{ marginBottom: '10px' }}>
                                                                        {comp.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={comp.featured_image_url} alt={comp.title} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="ename">{comp.name}</span>
                                                                                <span id="espeaker" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.accent_color, }}>
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
                                                                                <small className="event-date galtext" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(comp.start_date)}</small><br />
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
                                    <div id="cls" className="join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="clubheading" className="heading" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="clubsub" className="head" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>
                                        <button className="btn" id="join-club" onClick={() => navigate('/rytonclub')} style={{ color: noticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>
                            <section id="footer-section">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div>
                                        <h5 id="footer-heading" className="heading footer-heading" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}> {noticeData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="footer-description" className="head footer-description mx-auto" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}> {noticeData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>
                            <section id="footer-section">
                                <div className="container">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="contact-col">
                                                <h5 className="head mb-4" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>
                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}> {noticeData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="icon-circles ms-3" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>
                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}> {noticeData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="icon-circles ms-3" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>
                                                <div className="contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="cla">
                                                    <p className="footer-text mb-0" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}> {noticeData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="icon-circles ms-3" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={noticeData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="social-col">
                                                <h5 className="head mb-4 text-md-start text-center" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="footer-link" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {noticeData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="footer-link" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {noticeData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="footer-link" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {noticeData?.clubSettings?.original?.data?.settings?.flickr_link}
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
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – {noticeData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: noticeData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
                                </div>
                            </footer>
                        </div>
                    </div>
                )
                }
            </div>
        </>
    )
}
export default NoticePublic
