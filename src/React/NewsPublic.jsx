import Navbar from "./extra/Navbar";
import apiClient from "../api/axios";
import Loader from './extra/LoaderAll';
import Calendar from './extra/CalendarRyton'
import "./assets/css/newspublic.css"
import Event from "./assets/icons/navigation/events.svg"
import Competition from "./assets/icons/navigation/competition.svg"
import { useState, useEffect, useMemo, useCallback } from "react";
import he from "he";
import { useNavigate } from "react-router";
function NewsPublic() {
    const navigate = useNavigate();
    const [newsData, setnewsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(4);
    const [newsList, setNewsList] = useState([]);
    const [filters, setFilters] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(() => {
        getnewsData();
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
            fetchSearchedNews(search);
        } else {
            setNewsList(
                newsData?.clubNews?.original?.data?.original?.data || []
            );
        }
    }, [search, newsData]);

    async function getnewsData() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/news"
        let response = await fetch(url)
        response = await response.json()
        setnewsData(response.data)
    }
    console.log(newsData)

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

    const fetchSearchedNews = useCallback(
        debounce(async (query) => {
            if (query.length >= 3 && query !== lastSearched) {
                lastSearched = query;

                try {
                    const response = await apiClient.get("/club/public/news", {
                        params: {
                            search_term: query,
                        },
                    });

                    const result =
                        response?.data?.data?.clubNews?.original?.data?.original?.data || [];

                    setNewsList(result);
                    setCurrentPage(1);
                } catch (error) {
                    console.error(error);
                    setNewsList([]);
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
        const clubNews =
            newsData?.clubNews?.original?.data?.original?.data || [];

        const uniqueFilters = [
            { name: "All" },
            ...Array.from(
                new Map(
                    clubNews.map(item => [
                        item.club_news_type?.name,
                        {
                            name: item.club_news_type?.name,
                            icon: item.club_news_type?.icon_url
                        }
                    ])
                ).values()
            )
        ];

        setFilters(uniqueFilters);
    }, [newsData]);
    useEffect(() => {

        const carouselEl = document.querySelector(
            "#carouselExampleIndicators"
        );

        if (carouselEl && window.bootstrap) {
            new window.bootstrap.Carousel(carouselEl);
        }

        try {
            const clubNews =
                newsData?.clubNews?.original?.data?.original?.data || [];

            setNewsList(clubNews);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }


    }, [newsData]);
    const filteredNews = useMemo(() => {
        let list = [...newsList];

        // Filter by news type
        if (activeFilter !== "All") {
            list = list.filter(
                (item) => item.club_news_type?.name === activeFilter
            );
        }

        // Search
        if (search.trim() !== "") {
            const term = search.toLowerCase();

            list = list.filter(
                (item) =>
                    item.title?.toLowerCase().includes(term) ||
                    item.description?.toLowerCase().includes(term)
            );
        }

        return list;
    }, [newsList, activeFilter, search]);
    const paginatedNews = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;

        return filteredNews.slice(start, start + rowsPerPage);
    }, [filteredNews, currentPage, rowsPerPage]);

    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(filteredNews.length / rowsPerPage),
            1
        );
    }, [filteredNews, rowsPerPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    // const setActiveFilter = (filter) => {
    //     activeFilter = filter.name;
    // };
    console.log(newsData?.clubNews)

    return (
        <>
            <div style={{ backgroundColor: newsData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: newsData?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '1001', backgroundColor: newsData?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
                            <Navbar />
                        </nav>


                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="np-hero-section" style={{ backgroundImage: `url(${newsData?.clubSettings?.original?.data?.settings?.cover_images?.[2]?.image_medium_url})` }} >
                                        <div className="np-hero-overlay">
                                            {newsData?.clubNews?.original?.data?.original?.data?.[0] && (
                                                <div>
                                                    <div className="np-events-card">
                                                        <p className="np-date" style={{ textAlign: "left", marginTop: "140px", marginBottom: "30px", }} >
                                                            Upcoming News | {formatDate(newsData.clubNews?.original?.data?.original?.data[0]?.publish_date)}
                                                        </p>
                                                        <h5 style={{ color: newsData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: "20px", width: "825px", }} >
                                                            {newsData.clubNews?.original?.data?.original?.data[0]?.title}
                                                        </h5>
                                                    </div>
                                                    <p className="np-text-secondaryy" style={{ color: newsData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: "30px", }} >
                                                        {newsData.clubNews?.original?.data?.original?.data[0]?.description}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="np-button-group mt-3 d-flex">
                                                <button className="np-btn me-2" id="np-view" onClick={() => navigate(`/rytonnews/${newsData.clubNews?.original?.data?.original?.data[0]?.id}`)} style={{ color: newsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: newsData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="np-contents">
                            <section>
                                <div className="np-container" style={{ maxWidth: '1820px' }} id="np-heads">
                                    <div className="np-events-header">
                                        <h2 className="np-events-title" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}>Club News</h2>
                                        <div className="np-search-bar">
                                            <i className="fas fa-search"></i>
                                            <input type="search" className="np-search-input" id="np-dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="np-container" style={{ maxWidth: '1820px' }} id="np-overall">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <section>
                                                <div className="np-container" style={{ maxWidth: '1820px' }} id="np-events-left">
                                                    <div className="np-filter-buttons">
                                                        {filters.map((filter) => (
                                                            <button key={filter.name} className={`np-filter-btn ${activeFilter === filter.name ? "np-active" : ""}`} onClick={() => { console.log(filter.name); setActiveFilter(filter.name); setCurrentPage(1); }} >
                                                                {filter.icon && (
                                                                    <img src={filter.icon} alt={filter.name} className="np-icones" />
                                                                )}

                                                                <span className="np-label">{filter.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4">
                                                        {paginatedNews.length > 0 ? (
                                                            <>
                                                                {paginatedNews.map((news) => (
                                                                    <div className="np-events-cards p-3">
                                                                        <img src={news.featured_image_thumb} alt={news.title} />
                                                                        <div className="flex-grow-1 d-flex flex-column justify-content-between" id="np-detail">
                                                                            <div className="d-flex w-100 justify-content-between align-items-center">
                                                                                <h5 id="np-ename" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}>{news.title || 'Untitled News'}</h5>
                                                                                <div className="np-icon-container d-flex gap-2">
                                                                                    <img src={news.club_news_type?.icon_url} alt={news.club_news_type?.name} className="np-virtual" style={{ width: '25px', height: '25px' }} />
                                                                                </div>
                                                                            </div>
                                                                            <p className="np-galtext" id="np-edate" style={{ color: newsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                                {formatDate(news.publish_date) || 'Date Not Available'}
                                                                            </p>
                                                                            <p className="np-text-secondary" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                                {he.decode(news.description || 'No description provided.')}
                                                                            </p>
                                                                            <div className="np-button-groups mt-3 d-flex">
                                                                                <button onClick={() => navigate(`/rytonnews/${news.id}`)} className="np-btn me-2" id="np-view" click="navigate" style={{ color: newsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: newsData?.clubSettings?.original?.data?.settings?.primary_color }}>View Details</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        ) : (

                                                            <div className="text-center text-muted">No news found.</div>
                                                        )}

                                                        <div className="np-dt-paging">
                                                            <nav aria-label="pagination">
                                                                <button className={`np-dt-paging-button np-previous ${currentPage === 1 ? "np-disabled" : ""}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label="Previous" >
                                                                    ‹
                                                                </button>

                                                                {Array.from({ length: totalPages }, (_, index) => {
                                                                    const page = index + 1;

                                                                    return (
                                                                        <button key={page} className={`np-dt-paging-button ${page === currentPage ? "np-current" : ""}`} onClick={() => goToPage(page)} >
                                                                            {page}
                                                                        </button>
                                                                    );
                                                                })}

                                                                <button className={`np-dt-paging-button np-next ${currentPage === totalPages ? "np-disabled" : ""}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Next" >
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
                                                <div className="np-container" id="np-right">

                                                    <div className="np-more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }} id="np-eve">
                                                        <h5 className="np-head">Club Notices</h5>
                                                        {newsData?.clubNotices?.original?.data?.length > 0 ? (
                                                            <div className="np-event-list">
                                                                {newsData?.clubNotices?.original?.data.map((note) => (
                                                                    <div className="np-event-item" style={{ marginBottom: '10px' }}>
                                                                        {note.featured_image_url ? (
                                                                            <img className="np-img-fluid np-event-img" src={note.featured_image_url} alt={note.title} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="np-event-img np-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="np-event-details">
                                                                            <div className="np-event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="np-ename">{note.title}</span>
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

                                                    <div className="np-more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }} id="np-eve">
                                                        <h5 className="np-head">Events</h5>
                                                        {newsData?.events?.length > 0 ? (
                                                            <div className="np-event-list">
                                                                {newsData?.events.map((event) => (
                                                                    <div className="np-event-item" style={{ marginBottom: '10px' }}>
                                                                        {event.featured_image_url ? (
                                                                            <img className="np-img-fluid np-event-img" src={event.featured_image_url} alt={event.name} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="np-event-img np-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="np-event-details">
                                                                            <div className="np-event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="np-ename">{event.name}</span>
                                                                                <span id="np-espeaker" style={{ color: newsData?.clubSettings?.original?.data?.settings?.accent_color }}>Speaker: {event.speaker}</span>
                                                                            </div>

                                                                            <div className="np-event-time" id="np-edate">
                                                                                <small className="np-event-date np-galtext" style={{ color: newsData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(event.event_date)}</small><br />
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

                                                    <div className="np-more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }} id="np-eve">
                                                        <h5 className="np-head">Competitions</h5>
                                                        {newsData?.competitions?.length > 0 ? (
                                                            <div className="np-event-list">
                                                                {newsData?.competitions.map((comp) => (
                                                                    <div className="np-event-item" style={{ marginBottom: '10px' }}>
                                                                        {comp.featured_image_url ? (
                                                                            <img className="np-img-fluid np-event-img" src={comp.featured_image_url} alt={comp.name} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="np-event-img np-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="np-event-details">
                                                                            <div className="np-event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="np-ename">{comp.name}</span>
                                                                                <span id="np-espeaker" style={{ color: newsData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                                    Judge:{" "}
                                                                                    {comp.judges?.map((judge, index) => (
                                                                                        <span key={judge.id}>
                                                                                            {judge.first_name} {judge.last_name}
                                                                                            {index < comp.judges.length - 1 ? ", " : ""}
                                                                                        </span>
                                                                                    ))}
                                                                                </span>
                                                                            </div>

                                                                            <div className="np-event-time" id="np-edate">
                                                                                <small className="np-event-date np-galtext" style={{ color: newsData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(comp.start_date)}</small><br />
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

                            <section id="np-joincontainer">
                                <div className="np-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', width: '1820px' }}>
                                    <div id="np-cls" className="np-join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: newsData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="np-clubheading" className="np-heading" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="np-clubsub" className="np-head" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="np-btn" id="np-join-club" onClick={() => navigate('/rytonclub')} style={{ color: newsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: newsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="np-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="np-footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="np-footer-heading" className="np-heading np-footer-heading" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}> {newsData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="np-footer-description" className="np-head np-footer-description mx-auto" style={{ maxWidth: '1145px', color: newsData?.clubSettings?.original?.data?.settings?.text_color }}> {newsData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="np-container np-footer-section">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="np-contact-col">
                                                <h5 className="np-head mb-4" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="np-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="np-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="np-footer-text mb-0" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}> {newsData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="np-icon-circles ms-3" style={{ color: newsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: newsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="np-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="np-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="np-footer-text mb-0" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}> {newsData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="np-icon-circles ms-3" style={{ color: newsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: newsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="np-contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="np-cla">
                                                    <p className="np-footer-text mb-0" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}> {newsData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="np-icon-circles ms-3" style={{ color: newsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: newsData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={newsData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="np-footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="np-social-col">
                                                <h5 className="np-head mb-4 text-md-start text-center" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="np-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="np-cle">
                                                    <div className="np-ficon-circles me-3" style={{ color: newsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: newsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="np-facebook">
                                                        <p className="np-footer-text fw-bold mb-1" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="np-footer-link" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {newsData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="np-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="np-cle">
                                                    <div className="np-ficon-circles me-3" style={{ color: newsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: newsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="np-facebook">
                                                        <p className="np-footer-text fw-bold mb-1" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="np-footer-link" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {newsData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="np-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="np-cle">
                                                    <div className="np-ficon-circles me-3" style={{ color: newsData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: newsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="np-flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="np-facebook">
                                                        <p className="np-footer-text fw-bold mb-1" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="np-footer-link" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {newsData?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="np-site-footer">
                                <div className="np-footer-content">
                                    <p className="np-memtext" id="np-fcopy">Copyright &copy; 2025 – {newsData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="np-memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: newsData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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
export default NewsPublic
