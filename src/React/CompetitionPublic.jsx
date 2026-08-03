import Navbar from "./extra/Navbar";
import apiClient from "../api/axios";
import Loader from './extra/LoaderAll';
import Calendar from './extra/CalendarRyton'
import "./assets/css/compstyle.css"
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

                    const result =
                        response?.data?.data?.competitions?.original?.data?.competitions?.original?.data || [];

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
        const competitions =
            compData?.competitions?.original?.data?.competitions?.original?.data || [];

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
            const comps =
                compData?.competitions?.original?.data?.competitions?.original?.data || [];

            setCompsList(comps);
        } catch (error) {
            console.error(error);
        }


    }, []);

    const filteredComps = useMemo(() => {
        let list = [...compsList];

        // Filter by competition type
        if (activeFilter !== "All") {
            list = list.filter(
                (item) => item.competition_type?.name === activeFilter
            );
        }

        // Search - only filter locally if we did not perform a server-side search
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

    // const setActiveFilter = (filter) => {
    //     activeFilter = filter.name;
    // };

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
                                            <div className="co-hero-section" style={{ backgroundImage: `url(${compData?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }} >
                                                <div className="co-hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {compData?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>

                                                            <p className="co-cabout" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }} >
                                                                {compData?.clubSettings?.original?.data?.club?.about}
                                                            </p>

                                                            <button id="co-overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                Join Our Club
                                                            </button>

                                                            <p className="co-prehead" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }} >
                                                                An NYCE Club based in Apps, North East England
                                                            </p>

                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="co-icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="co-icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="co-icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <span className="co-flickr-dots">
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
                                            <div className="co-hero-section" style={{ backgroundImage: `url(${compData?.clubSettings?.original?.data?.settings?.cover_images[1]?.image_medium_url})` }} >
                                                <div className="co-hero-overlay" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                                                    <div className="co-card-section" style={{ width: '100%' }} >
                                                        <div className="co-stat-card" style={{ width: '50%', backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color, color: compData?.clubSettings?.original?.data?.settings?.background_color, }} >
                                                            <small className="co-ca-details">Members</small>
                                                            {
                                                                <h3 className="co-number" style={{ marginTop: '30px' }}>
                                                                    {compData?.clubSettings?.original?.data?.total_members}
                                                                </h3>
                                                            }
                                                        </div>

                                                        <div className="co-event-card" style={{ width: "50%", backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color, }} >
                                                            {compData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days !== undefined &&
                                                                compData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days !== null ? (
                                                                <>
                                                                    <small className="co-ca-details">Next Event</small>

                                                                    <div className="row">
                                                                        <h3 className="co-number" style={{ marginTop: '30px' }}>
                                                                            {String(compData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days).padStart(2, "0")}
                                                                            &nbsp;
                                                                            <span className="co-days">days to go</span>
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
                                                                    <h3 className="co-days" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, }} >
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

                        <div className="co-contents">
                            <section>
                                <div className="co-container" style={{ maxWidth: '1820px' }} id="co-heads">
                                    <div className="co-events-header">
                                        <h2 className="co-events-title" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Competitions</h2>
                                        <div className="co-search-bar">
                                            <i className="fas fa-search"></i>
                                            <input type="search" className="co-search-input" id="co-dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="co-container" style={{ maxWidth: '1820px' }} id="co-overall">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <section>
                                                <div className="co-container" id="co-events-left">
                                                    <div className="co-filter-buttons">
                                                        {filters.map((filter) => (
                                                            <button key={filter.name} className={`co-filter-btn ${activeFilter === filter.name ? "co-active" : ""}`} onClick={() => { console.log(filter.name); setActiveFilter(filter.name); setCurrentPage(1); }} >
                                                                {filter.icon && (
                                                                    <img src={filter.icon} alt={filter.name} className="co-icones" />
                                                                )}

                                                                <span className="co-label">{filter.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className="mt-4">
                                                        {paginatedComps.length > 0 ? (
                                                            <>
                                                                {paginatedComps.map((comp) => (
                                                                    <div className="co-events-cards p-3">
                                                                        <img src={comp.featured_thumb_url} alt={comp.name} />
                                                                        <div className="flex-grow-1 d-flex flex-column justify-content-between" id="co-detail">
                                                                            <div className="d-flex w-100 justify-content-between align-items-center">
                                                                                <h5 id="co-ename" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>{comp.name || 'Untitled Competition'}</h5>
                                                                                <div className="co-icon-container d-flex align-items-center">
                                                                                    <img src={comp.competition_type.icon_url} alt={comp.competition_type.name} className="co-type-icon" style={{ width: '25px', height: '25px' }} />
                                                                                </div>
                                                                            </div>
                                                                            <p className="co-galtext" id="co-edate" style={{ color: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                                {formatDate(comp.start_date) || 'Date Not Available'}
                                                                            </p>
                                                                            <p className="co-text-secondary" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                                {he.decode(comp.description)}
                                                                            </p>
                                                                            <span id="co-espeaker" style={{ color: compData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                                Judge:{" "}
                                                                                {comp.judges?.map((judge, index) => (
                                                                                    <span key={judge.id}>
                                                                                        {judge.first_name} {judge.last_name}
                                                                                        {index < comp.judges.length - 1 ? ", " : ""}
                                                                                    </span>
                                                                                ))}
                                                                            </span>

                                                                            <div className="co-button-groups mt-auto d-flex">
                                                                                <button onClick={() => navigate(`/rytoncomp/${comp.id}`)} className="btn me-2" id="co-view" click="navigate" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color }}>View Details</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-muted">No Competitions found.</div>
                                                        )}

                                                        <div className="co-dt-paging">
                                                            <nav aria-label="pagination">
                                                                <button className={`co-dt-paging-button previous ${currentPage === 1 ? "co-disabled" : ""}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label="Previous" >
                                                                    ‹
                                                                </button>

                                                                {Array.from({ length: totalPages }, (_, index) => {
                                                                    const page = index + 1;

                                                                    return (
                                                                        <button key={page} className={`co-dt-paging-button ${page === currentPage ? "co-current" : ""}`} onClick={() => goToPage(page)} >
                                                                            {page}
                                                                        </button>
                                                                    );
                                                                })}

                                                                <button className={`co-dt-paging-button next ${currentPage === totalPages ? "co-disabled" : ""}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Next" >
                                                                    ›
                                                                </button>
                                                            </nav>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div >

                                        <div className="col-md-4">
                                            <section>
                                                <div className="co-container" id="co-right">

                                                    <div className="co-calendar-card" style={{ padding: '0px' }} id="co-cal">
                                                        <Calendar />
                                                    </div>

                                                    <div className="co-more-card d-flex flex-column" style={{ padding: '30px', height: 'auto' }} id="co-eve">
                                                        <h5 className="co-head">Events</h5>
                                                        {compData?.events?.length > 0 ? (
                                                            <div className="co-event-list">
                                                                {compData?.events.map((event) => (
                                                                    <div className="co-event-item" style={{ marginBottom: '10px' }}>
                                                                        {event.featured_image_url ? (
                                                                            <img className="co-img-fluid co-event-img" src={event.featured_image_url} alt={event.name} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="co-event-img co-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="co-event-details">
                                                                            <div className="co-event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="co-ename">{event.name}</span>
                                                                                <span id="co-espeaker" style={{ color: compData?.clubSettings?.original?.data?.settings?.accent_color }}>Speaker: {event.speaker}</span>
                                                                            </div>

                                                                            <div className="co-event-time" id="co-edate">
                                                                                <small className="co-event-date co-galtext" style={{ color: compData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(event.event_date)}</small><br />
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

                                                    <div className="co-season-card" style={{ padding: '30px' }}>
                                                        <h5 className="co-head">Seasons</h5>
                                                        {compData?.clubSettings?.original?.data?.seasons.length > 0 ? (
                                                            <div className="co-session-container">
                                                                {compData?.clubSettings?.original?.data?.seasons?.map((seas) => (
                                                                    <div key={seas.id} className={`co-session-card ${seas.status?.toLowerCase()}`} style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, opacity: 0.7, }} >
                                                                        <div className="co-session-header">
                                                                            <h3 className="co-clubhead">
                                                                                {formatedDate(seas.start_date)} - {formatedDate(seas.end_date)}
                                                                            </h3>

                                                                            <span className={`co-status ${seas.status?.toLowerCase()}`}>
                                                                                <span className="co-dot" style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color }}></span>
                                                                                {seas.status?.charAt(0).toUpperCase() + seas.status?.slice(1).toLowerCase()}
                                                                            </span>
                                                                        </div>

                                                                        <div className="co-session-body">
                                                                            <div className="co-info">
                                                                                <img src={Competition} alt={Competition} style={{ width: "16px", height: "16px" }} />
                                                                                {" "}
                                                                                {seas.competitions_count} Competitions
                                                                            </div>

                                                                            <div className="co-info">
                                                                                <img src={Event} alt={Event} style={{ width: "16px", height: "16px" }} />
                                                                                {" "}
                                                                                {seas.events_count} Events
                                                                            </div>
                                                                        </div>

                                                                        <div className="co-session-footer" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, }} >
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
                                                    </div >
                                                </div>
                                            </section >
                                        </div >
                                    </div >

                                </div >
                            </section >

                            <section id="co-joincontainer">
                                <div className="co-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', width: '1820px' }}>
                                    <div id="co-cls" className="co-join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="co-clubheading" className="co-heading" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="co-clubsub" className="co-head" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="co-btn" id="co-join-club" onClick={() => navigate('/rytonclub')} style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="co-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="co-footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="co-footer-heading" className="co-heading co-footer-heading" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="co-footer-description" className="co-head co-footer-description mx-auto" style={{ maxWidth: '1145px', color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="co-container co-footer-section">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="co-contact-col">
                                                <h5 className="co-head mb-4" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="co-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="co-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="co-footer-text mb-0" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="co-icon-circles ms-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="co-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="co-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="co-footer-text mb-0" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="co-icon-circles ms-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="co-contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="co-cla">
                                                    <p className="co-footer-text mb-0" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="co-icon-circles ms-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={compData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="co-footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="co-social-col">
                                                <h5 className="co-head mb-4 text-md-start text-center" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="co-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="co-cle">
                                                    <div className="co-ficon-circles me-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="co-facebook">
                                                        <p className="co-footer-text fw-bold mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="co-footer-link" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {compData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="co-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="co-cle">
                                                    <div className="co-ficon-circles me-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="co-facebook">
                                                        <p className="co-footer-text fw-bold mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="co-footer-link" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {compData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="co-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="co-cle">
                                                    <div className="co-ficon-circles me-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="co-flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="co-facebook">
                                                        <p className="co-footer-text fw-bold mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="co-footer-link" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {compData?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="co-site-footer">
                                <div className="co-footer-content">
                                    <p className="co-memtext" id="co-fcopy">Copyright &copy; 2025 – {compData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="co-memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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
export default CompetitionPublic


