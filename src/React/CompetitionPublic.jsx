import Navbar from "./extra/Navbar";
import apiClient from "../api/axios";
import Loader from './extra/LoaderAll';
import Calendar from './extra/CalendarRyton'
import "./assets/css/rytonstyle.css"
import Event from "./assets/icons/navigation/events.svg"
import Competition from "./assets/icons/navigation/competition.svg"
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router"
import he from "he";
function CompetitionPublic() {
    const navigate = useNavigate();
    const [compData, setcompData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(4);
    const [compsList, setCompsList] = useState([]);
    const [filters, setFilters] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(() => {
        getcompData();
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
            fetchSearchedComps(search);
        } else {
            setCompsList(
                compData?.competitions?.original?.data?.competitions?.original?.data ||
                []
            );
            lastSearchedRef.current = "";
        }
    }, [search, compData]);
    async function getcompData() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/competitions"
        let response = await fetch(url)
        response = await response.json()
        setcompData(response.data)
    }
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };
    const lastSearchedRef = useRef("");
    const fetchSearchedComps = useCallback(
        debounce(async (query) => {
            if (query.length >= 3 && query !== lastSearchedRef.current) {
                lastSearchedRef.current = query;
                try {
                    const response = await apiClient.get("/club/public/competitions", {
                        params: {
                            search_term: query,
                        },
                    });
                    const result = response?.data?.data?.competitions?.original?.data?.competitions?.original?.data || [];
                    setCompsList(result);
                    console.log(result)
                    setCurrentPage(1);
                } catch (error) {
                    console.error(error);
                    setCompsList([]);
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
    const formatsDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        const month = date.toLocaleString("en-GB", {
            month: "short",
        });
        return `${month} ${date.getFullYear()}`;
    };
    const formatedDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        return `${date.getFullYear()}`;
    };
    useEffect(() => {
        const competitions = compData?.competitions?.original?.data?.competitions?.original?.data || [];
        setCompsList(competitions);
        const uniqueFilters = [
            { name: "All" },
            ...Array.from(
                new Map(
                    competitions.map(item => [
                        item.competition_type?.name,
                        {
                            name: item.competition_type?.name,
                            icon: item.competition_type?.icon_url
                        }
                    ])
                ).values()
            )
        ];
        setFilters(uniqueFilters);
    }, [compData]);
    useEffect(() => {
        const carouselEl = document.querySelector(
            "#carouselExampleIndicators"
        );
        if (carouselEl && window.bootstrap) {
            new window.bootstrap.Carousel(carouselEl);
        }
        try {
            const comps = compData?.competitions?.original?.data?.competitions?.original?.data || [];
            setCompsList(comps);
        } catch (error) {
            console.error(error);
        }
    }, []);
    const filteredComps = useMemo(() => {
        let list = [...compsList];
        if (activeFilter !== "All") {
            list = list.filter(
                (item) => item.competition_type?.name === activeFilter
            );
        }
        if (search.trim() !== "" && search.length < 3) {
            const term = search.toLowerCase();
            list = list.filter(
                (item) =>
                    item.name?.toLowerCase().includes(term) ||
                    item.description?.toLowerCase().includes(term) ||
                    item.competition_type?.name?.toLowerCase().includes(term) ||
                    item.judges?.some(
                        (judge) =>
                            `${judge.first_name || ""} ${judge.last_name || ""}`
                                .toLowerCase()
                                .includes(term)
                    )
            );
        }
        return list;
    }, [compsList, activeFilter, search]);
    const paginatedComps = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredComps.slice(start, start + rowsPerPage);
    }, [filteredComps, currentPage, rowsPerPage]);
    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(filteredComps.length / rowsPerPage),
            1
        );
    }, [filteredComps, rowsPerPage]);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    console.log(paginatedComps);
    return (
        <>
            <div style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: compData?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '1001', backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
                            <Navbar />
                        </nav>
                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    {
                                        compData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="hero-section" style={{ backgroundImage: `url(${compData?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }}>
                                                <div className="hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {compData?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>
                                                            <p className="cabout" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }}>
                                                                {compData?.clubSettings?.original?.data?.club?.about}
                                                            </p>
                                                            <button id="overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color, }}>
                                                                Join Our Club
                                                            </button>
                                                            <p className="prehead" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }}>
                                                                An NYCE Club based in Apps, North East England
                                                            </p>
                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }}>
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }}>
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }}>
                                                                    <span className="flickr-dots">
                                                                        <i className="fa fa-circle"></i>
                                                                        <i className="fa fa-circle"></i>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )}
                                </div>
                                <div className="carousel-item">
                                    {
                                        compData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="hero-section" style={{ backgroundImage: `url(${compData?.clubSettings?.original?.data?.settings?.cover_images[1]?.image_medium_url})` }}>
                                                <div className="hero-overlay" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                                                    <div className="card-section" style={{ width: '100%' }}>
                                                        <div className="stat-card" style={{ width: '50%', backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color, color: compData?.clubSettings?.original?.data?.settings?.background_color, }}>
                                                            <small className="ca-details">Members</small>
                                                            {
                                                                <h3 className="number" style={{ marginTop: '30px' }}>
                                                                    {compData?.clubSettings?.original?.data?.total_members}
                                                                </h3>
                                                            }
                                                        </div>
                                                        <div className="up-event-card" style={{ width: "50%", backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color, }}>
                                                            {compData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days !== undefined &&
                                                                compData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days !== null ? (
                                                                <>
                                                                    <small className="ca-details">Next Event</small>
                                                                    <div className="row">
                                                                        <h3 className="number" style={{ marginTop: '30px' }}>
                                                                            {String(compData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days).padStart(2, "0")}
                                                                            &nbsp;
                                                                            <span className="days">days to go</span>
                                                                        </h3>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="d-flex flex-column justify-content-center align-items-center" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                        <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                    <h3 className="days" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, }}>
                                                                        No upcoming events
                                                                    </h3>
                                                                </div>
                                                            )}
                                                        </div>
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
                                        <h2 className="events-title" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Competitions</h2>
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
                                                    <div className="filter-buttons comp-filter-buttons">
                                                        {filters.map((filter) => (
                                                            <button key={filter.name} className={`filter-btn comp-filter-btn ${activeFilter === filter.name ? "active" : ""}`} onClick={() => { console.log(filter.name); setActiveFilter(filter.name); setCurrentPage(1); }}>
                                                                {filter.icon && (
                                                                    <img src={filter.icon} alt={filter.name} className="icones" />
                                                                )}
                                                                <span className="label">{filter.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4">
                                                        {paginatedComps.length > 0 ? (
                                                            <>
                                                                {paginatedComps.map((comp) => (
                                                                    <div className="events-cards p-3">
                                                                        <img src={comp.featured_thumb_url} alt={comp.name} />
                                                                        <div className="flex-grow-1 d-flex flex-column justify-content-between" id="detail">
                                                                            <div className="d-flex w-100 justify-content-between align-items-center">
                                                                                <h5 id="ename" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>{comp.name || 'Untitled Competition'}</h5>
                                                                                <div className="icon-container d-flex align-items-center">
                                                                                    <img src={comp.competition_type.icon_url} alt={comp.competition_type.name} className="type-icon" style={{ width: '25px', height: '25px' }} />
                                                                                </div>
                                                                            </div>
                                                                            <p className="galtext" id="edate" style={{ color: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                                {formatDate(comp.start_date) || 'Date Not Available'}
                                                                            </p>
                                                                            <p className="text-secondary" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                                {he.decode(comp.description)}
                                                                            </p>
                                                                            <span id="espeaker" style={{ color: compData?.clubSettings?.original?.data?.settings?.accent_color, }}>
                                                                                Judge:{" "}
                                                                                {comp.judges?.map((judge, index) => (
                                                                                    <span key={judge.id}>
                                                                                        {judge.first_name} {judge.last_name}
                                                                                        {index < comp.judges.length - 1 ? ", " : ""}
                                                                                    </span>
                                                                                ))}
                                                                            </span>
                                                                            <div className="button-groups mt-auto d-flex">
                                                                                <button onClick={() => navigate(`/rytoncomp/${comp.id}`)} className="btn me-2" id="view" click="navigate" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color }}>View Details</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-muted">No Competitions found.</div>
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
                                                    <div className="calendars-card" id="cal">
                                                        <Calendar />
                                                    </div>
                                                    <div className="more-card d-flex flex-column" id="eve">
                                                        <h5 className="head">Events</h5>
                                                        {compData?.events?.length > 0 ? (
                                                            <div className="event-list">
                                                                {compData?.events.map((event) => (
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
                                                                                <span id="espeaker" style={{ color: compData?.clubSettings?.original?.data?.settings?.accent_color }}>Speaker: {event.speaker}</span>
                                                                            </div>
                                                                            <div className="event-time" id="edate">
                                                                                <small className="event-date galtext" style={{ color: compData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(event.event_date)}</small><br />
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
                                                    <div className="ryton-season-card">
                                                        <h5 className="head">Seasons</h5>
                                                        {compData?.clubSettings?.original?.data?.seasons.length > 0 ? (
                                                            <div className="session-container">
                                                                {compData?.clubSettings?.original?.data?.seasons?.map((seas) => (
                                                                    <div key={seas.id} className={`session-card ${seas.status?.toLowerCase()}`} style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, opacity: 0.7, }}>
                                                                        <div className="session-header">
                                                                            <h3 className="clubhead">
                                                                                {formatedDate(seas.start_date)} - {formatedDate(seas.end_date)}
                                                                            </h3>
                                                                            <span className={`status ${seas.status?.toLowerCase()}`}>
                                                                                <span className="dot" style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color }}></span>
                                                                                {seas.status?.charAt(0).toUpperCase() + seas.status?.slice(1).toLowerCase()}
                                                                            </span>
                                                                        </div>
                                                                        <div className="session-body">
                                                                            <div className="ryton-info">
                                                                                <img src={Competition} alt={Competition} style={{ width: "16px", height: "16px" }} />
                                                                                {" "}
                                                                                {seas.competitions_count} Competitions
                                                                            </div>
                                                                            <div className="ryton-info">
                                                                                <img src={Event} alt={Event} style={{ width: "16px", height: "16px" }} />
                                                                                {" "}
                                                                                {seas.events_count} Events
                                                                            </div>
                                                                        </div>
                                                                        <div className="session-footer" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, }}>
                                                                            {formatsDate(seas.start_date)} – {formatsDate(seas.end_date)}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center text-muted py-4">
                                                                No seasons found.
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
                                    <div id="cls" className="join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="clubheading" className="heading" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="clubsub" className="head" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>
                                        <button className="btn" id="join-club" onClick={() => navigate('/rytonclub')} style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>
                            <section id="footer-section">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div>
                                        <h5 id="footer-heading" className="heading footer-heading" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="footer-description" className="head footer-description mx-auto" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>
                            <section id="footer-section">
                                <div className="container">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="contact-col">
                                                <h5 className="head mb-4" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>
                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="icon-circles ms-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>
                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="icon-circles ms-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>
                                                <div className="contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="cla">
                                                    <p className="footer-text mb-0" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="icon-circles ms-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={compData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="social-col">
                                                <h5 className="head mb-4 text-md-start text-center" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="footer-link" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {compData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="footer-link" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {compData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="footer-link" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {compData?.clubSettings?.original?.data?.settings?.flickr_link}
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
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – {compData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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
export default CompetitionPublic
