import Navbar from "./extra/Navbar";
import apiClient from "../api/axios";
import Loader from './extra/LoaderAll';
import Calendar from './extra/CalendarRyton'
import "./assets/css/clubstyle.css"
import Event from "./assets/icons/navigation/events.svg"
import Competition from "./assets/icons/navigation/competition.svg"
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router"
import he from "he";
function EventPublic() {
    const navigate = useNavigate();
    const [eventData, seteventData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(4);
    const [eventsList, setEventsList] = useState([]);
    const [filters, setFilters] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(() => {
        geteventData();
    }, [])
    useEffect(() => {
        if (!isLoading) {
            const carouselEl = document.querySelector('#carouselExampleIndicators')
            if (carouselEl && window.bootstrap) {
                new window.bootstrap.Carousel(carouselEl)
            }
        }
    }, [isLoading]);
    useEffect(() => {
        if (search.length >= 3) {
            fetchSearchedEvents(search);
        } else {
            setEventsList(
                eventData?.events?.original?.data?.original?.data ||
                []
            );
        }
    }, [search]);
    useEffect(() => {
        if (filters.length > 0 && !activeFilter) {
            setActiveFilter(filters[0].name);
        }
    }, [filters]);

    async function geteventData() {
        setIsLoading(true);
        try {
            const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/events"
            let response = await fetch(url)
            response = await response.json()
            seteventData(response.data)
        } catch (error) {
            console.error("Error fetching event data:", error);
        } finally {
            setIsLoading(false);
        }
    }
    console.log(eventData)

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

    const fetchSearchedEvents = useCallback(
        debounce(async (query) => {
            if (query.length >= 3 && query !== lastSearched) {
                lastSearched = query;

                try {
                    const response = await apiClient.get("/club/public/events", {
                        params: {
                            search_term: query,
                        },
                    });

                    const result =
                        response?.data?.data?.events?.original?.data?.original?.data || [];

                    setEventsList(result);
                    setCurrentPage(1);
                } catch (error) {
                    console.error(error);
                    setEventsList([]);
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
        const events =
            eventData?.events?.original?.data?.original?.data || [];
        setEventsList(events);
        const allTypes = events.flatMap((event) => event.types || []);

        // Remove duplicate filter names
        const uniqueFilters = [
            { name: "All" },
            ...Array.from(
                new Map(
                    allTypes.map((type) => [
                        type.name,
                        {
                            name: type.name,
                            icon: type.icon_url, // if available
                        },
                    ])
                ).values(),
            ),
        ];

        setFilters(uniqueFilters);
    }, [eventData]);
    useEffect(() => {
    }, []);
    const filteredEvents = useMemo(() => {
        console.log("Active Filter:", activeFilter);

        let list = [...eventsList];

        if (activeFilter !== "All") {
            list = list.filter((event) =>
                event.types?.some((t) => {
                    console.log(t.name, activeFilter);
                    return t.name === activeFilter;
                })
            );
        }

        return list;
    }, [eventsList, activeFilter, search]);
    const paginatedEvents = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;

        return filteredEvents.slice(start, start + rowsPerPage);
    }, [filteredEvents, currentPage, rowsPerPage]);

    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(filteredEvents.length / rowsPerPage),
            1
        );
    }, [filteredEvents, rowsPerPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    // const setActiveFilter = (filter) => {
    //     activeFilter = filter.name;
    // };


    return (
        <>
            <div style={{ backgroundColor: eventData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: eventData?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '5001', backgroundColor: eventData?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
                            <Navbar />
                        </nav>


                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="hero-section" style={{ backgroundImage: `url(${eventData?.clubSettings?.original?.data?.settings?.cover_images?.[2]?.image_medium_url})` }} >
                                        <div className="hero-overlay">
                                            {eventData?.events?.original?.data?.original?.data?.slice(0, 1).map((event) => (
                                                <>
                                                    <div key={event.id}>
                                                        <div className="events-card">
                                                            <p className="date">
                                                                Upcoming Event | {formatDate(event.event_date)}
                                                            </p>

                                                            <h5 style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: '20px', width: '1000px' }} >
                                                                {event.name}
                                                            </h5>

                                                            <p className="text-secondaryy">
                                                                {he.decode(event.description)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="button-group mt-3 d-flex">
                                                        <button className="btn me-2" id="view" onClick={() => navigate(`/rytonevent/${event.id}`)} style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.accent_color }} >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </>
                                            ))}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contents">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }} id="heads">
                                    <div className="events-header">
                                        <h2 className="events-title" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>Events</h2>
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
                                                    <div className="filter-buttons">
                                                        {filters.map((filter) => (
                                                            <button key={filter.name} className={`filter-btn ${activeFilter === filter.name ? "active" : ""}`} onClick={() => { console.log(filter.name); setActiveFilter(filter.name); setCurrentPage(1); }} >
                                                                {filter.icon && (
                                                                    <img src={filter.icon} alt={filter.name} className="icones" />
                                                                )}
                                                                <span className="label">{filter.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4">
                                                        {paginatedEvents.length > 0 ? (
                                                            <>
                                                                {paginatedEvents.map((event) => (
                                                                    <div className="events-cards p-3">
                                                                        <img src={event.featured_thumb_url} alt={event.name} />
                                                                        <div className="flex-grow-1 d-flex flex-column justify-content-between" id="detail">
                                                                            <div className="d-flex w-100 justify-content-between align-items-center">
                                                                                <h5 id="ename" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>{event.name}</h5>
                                                                                <div className="icon-container d-flex gap-2">
                                                                                    <img src={event.types?.[0]?.icon_url} alt={event.types?.[0]?.name} className="virtual" />
                                                                                </div>
                                                                            </div>
                                                                            <p className="galtext" id="edate" style={{ color: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                                {formatDate(event.event_date)}
                                                                            </p>
                                                                            <p className="text-secondary" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                                {he.decode(event.description)}
                                                                            </p>
                                                                            <p id="espeaker" style={{ color: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                                Speaker:  {event.speaker}
                                                                            </p>
                                                                            <div className="button-groups mt-auto d-flex">
                                                                                <button onClick={() => navigate(`/rytonevent/${event.id}`)} className="btn me-2" id="view" click="navigate" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.primary_color }}>View Details</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        ) : (

                                                            <div className="text-center text-muted">No events found.</div>
                                                        )}

                                                        <div className="dt-paging">
                                                            <nav aria-label="pagination">
                                                                <button className={`dt-paging-button previous ${currentPage === 1 ? "disabled" : ""}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label="Previous" >
                                                                    ‹
                                                                </button>

                                                                {Array.from({ length: totalPages }, (_, index) => {
                                                                    const page = index + 1;

                                                                    return (
                                                                        <button key={page} className={`dt-paging-button ${page === currentPage ? "current" : ""}`} onClick={() => goToPage(page)} >
                                                                            {page}
                                                                        </button>
                                                                    );
                                                                })}

                                                                <button className={`dt-paging-button next ${currentPage === totalPages ? "disabled" : ""}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Next" >
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

                                                    <div className="calendars-card" id="calendar">
                                                        <Calendar />
                                                    </div>

                                                    <div className="more-card d-flex flex-column" id="eve" >
                                                        <h5 className="head">Competitions</h5>

                                                        {eventData?.competitions?.length > 0 ? (
                                                            <div className="event-list">
                                                                {eventData.competitions.map((comp) => (
                                                                    <div className="event-item" key={comp.id}>
                                                                        {comp.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={comp.featured_image_url} alt={comp.name} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}

                                                                        <div className="event-details">
                                                                            <div className="event-info">
                                                                                <span id="ename">{comp.name}</span>

                                                                                <span id="espeaker" style={{ color: eventData?.clubSettings?.original?.data?.settings?.accent_color, }} >
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
                                                                                <small className="event-date galtext" style={{ color: eventData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                                    {formatDate(comp.start_date)}
                                                                                </small>
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

                                                    <div className="season-card">
                                                        <h5 className="head">Seasons</h5>
                                                        {eventData?.clubSettings?.original?.data?.seasons.length > 0 ? (
                                                            <div className="session-container">
                                                                {eventData?.clubSettings?.original?.data?.seasons?.map((seas) => (
                                                                    <div key={seas.id} className={`session-card ${seas.status?.toLowerCase()}`} style={{ backgroundColor: eventData?.clubSettings?.original?.data?.settings?.background_color, opacity: 0.7, }} >
                                                                        <div className="session-header">
                                                                            <h3 className="clubhead">
                                                                                {formatedDate(seas.start_date)} - {formatedDate(seas.end_date)}
                                                                            </h3>

                                                                            <span className={`status ${seas.status?.charAt(0).toUpperCase() + seas.status?.slice(1).toLowerCase()}`}>
                                                                                <span className="dot" style={{ backgroundColor: eventData?.clubSettings?.original?.data?.settings?.primary_color }}></span>
                                                                                {seas.status?.charAt(0).toUpperCase() + seas.status?.slice(1).toLowerCase()}
                                                                            </span>
                                                                        </div>

                                                                        <div className="session-body">
                                                                            <div className="info">
                                                                                <img src={Competition} alt={Competition} />
                                                                                {" "}
                                                                                {seas.competitions_count} Competitions
                                                                            </div>

                                                                            <div className="info">
                                                                                <img src={Event} alt="Event" />
                                                                                {" "}
                                                                                {seas.events_count} Events
                                                                            </div>
                                                                        </div>

                                                                        <div className="session-footer" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color, }} >
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
                                                </div >
                                            </section >
                                        </div >
                                    </div >

                                </div >
                            </section >

                            <section id="joincontainer">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div id="cls" className="join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: eventData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="clubheading" className="heading" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="clubsub" className="head" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="btn" id="join-club" onClick={() => navigate('/rytonclub')} style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section id="footer-section">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div>
                                        <h5 id="footer-heading" className="heading footer-heading" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}> {eventData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="footer-description" className="head footer-description mx-auto" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}> {eventData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section id="footer-section">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="contact-col">
                                                <h5 className="head mb-4" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}> {eventData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="icon-circles ms-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}> {eventData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="icon-circles ms-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="cla">
                                                    <p className="footer-text mb-0" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}> {eventData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="icon-circles ms-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={eventData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="social-col">
                                                <h5 className="head mb-4 text-md-start text-center" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="footer-link" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {eventData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="footer-link" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {eventData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="footer-link" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {eventData?.clubSettings?.original?.data?.settings?.flickr_link}
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
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – {eventData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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

export default EventPublic