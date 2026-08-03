import Navbar from "./extra/Navbar";
import apiClient from "../api/axios";
import Loader from './extra/LoaderAll';
import Calendar from './extra/CalendarRyton'
import "./assets/css/eventpublic.css"
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
                                    <div className="ep-hero-section" style={{ backgroundImage: `url(${eventData?.clubSettings?.original?.data?.settings?.cover_images?.[2]?.image_medium_url})` }} >
                                        <div className="ep-hero-overlay">
                                            {eventData?.events?.original?.data?.original?.data?.slice(0, 1).map((event) => (
                                                <>
                                                    <div key={event.id}>
                                                        <div className="ep-events-card">
                                                            <p className="ep-date">
                                                                Upcoming Event | {formatDate(event.event_date)}
                                                            </p>

                                                            <h5 style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: '20px', width: '1000px' }} >
                                                                {event.name}
                                                            </h5>

                                                            <p className="ep-text-secondaryy">
                                                                {he.decode(event.description)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="ep-button-group mt-3 d-flex">
                                                        <button className="btn me-2" id="ep-view" onClick={() => navigate(`/rytonevent/${event.id}`)} style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.accent_color }} >
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

                        <div className="ep-contents">
                            <section>
                                <div className="ep-container" style={{ maxWidth: '1820px' }} id="ep-heads">
                                    <div className="ep-events-header">
                                        <h2 className="ep-events-title" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>Events</h2>
                                        <div className="ep-search-bar">
                                            <i className="fas fa-search"></i>
                                            <input type="search" className="ep-search-input" id="ep-dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="ep-container" style={{ maxWidth: '1820px' }} id="ep-overall">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <section>
                                                <div className="ep-container" style={{ maxWidth: '1820px' }} id="ep-events-left">
                                                    <div className="ep-filter-buttons" style={{ gap: '40px' }}>
                                                        {filters.map((filter) => (
                                                            <button key={filter.name} className={`ep-filter-btn ${activeFilter === filter.name ? "ep-active" : ""}`} onClick={() => { console.log(filter.name); setActiveFilter(filter.name); setCurrentPage(1); }} >
                                                                {filter.icon && (
                                                                    <img src={filter.icon} alt={filter.name} className="ep-icones" />
                                                                )}
                                                                <span className="ep-label">{filter.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4">
                                                        {paginatedEvents.length > 0 ? (
                                                            <>
                                                                {paginatedEvents.map((event) => (
                                                                    <div className="ep-events-cards p-3">
                                                                        <img src={event.featured_thumb_url} alt={event.name} />
                                                                        <div className="flex-grow-1 d-flex flex-column justify-content-between" id="ep-detail">
                                                                            <div className="d-flex w-100 justify-content-between align-items-center">
                                                                                <h5 id="ep-ename" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>{event.name}</h5>
                                                                                <div className="ep-icon-container d-flex gap-2">
                                                                                    <img src={event.types?.[0]?.icon_url} alt={event.types?.[0]?.name} className="ep-virtual" style={{ width: '25px', height: '25px' }} />
                                                                                </div>
                                                                            </div>
                                                                            <p className="ep-galtext" id="ep-edate" style={{ color: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                                {formatDate(event.event_date)}
                                                                            </p>
                                                                            <p className="ep-text-secondary" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                                {he.decode(event.description)}
                                                                            </p>
                                                                            <p id="ep-espeaker" style={{ color: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                                Speaker:  {event.speaker}
                                                                            </p>
                                                                            <div className="ep-button-groups mt-auto d-flex">
                                                                                <button onClick={() => navigate(`/rytonevent/${event.id}`)} className="btn me-2" id="ep-view" click="navigate" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.primary_color }}>View Details</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        ) : (

                                                            <div className="text-center text-muted">No events found.</div>
                                                        )}

                                                        <div className="ep-dt-paging">
                                                            <nav aria-label="pagination">
                                                                <button className={`ep-dt-paging-button previous ${currentPage === 1 ? "ep-disabled" : ""}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label="Previous" >
                                                                    ‹
                                                                </button>

                                                                {Array.from({ length: totalPages }, (_, index) => {
                                                                    const page = index + 1;

                                                                    return (
                                                                        <button key={page} className={`ep-dt-paging-button ${page === currentPage ? "ep-current" : ""}`} onClick={() => goToPage(page)} >
                                                                            {page}
                                                                        </button>
                                                                    );
                                                                })}

                                                                <button className={`ep-dt-paging-button next ${currentPage === totalPages ? "ep-disabled" : ""}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Next" >
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
                                                <div className="ep-container" id="ep-right">

                                                    <div className="ep-cardddd ep-calendar-card" id="ep-calendar" style={{ padding: '0px', height: 'auto' }}>
                                                        <Calendar />
                                                    </div>

                                                    <div className="ep-more-card d-flex flex-column" style={{ padding: "30px", height: "auto" }} id="ep-eve" >
                                                        <h5 className="ep-head">Competitions</h5>

                                                        {eventData?.competitions?.length > 0 ? (
                                                            <div className="ep-event-list">
                                                                {eventData.competitions.map((comp) => (
                                                                    <div className="ep-event-item" key={comp.id} style={{ gap: "20px" }} >
                                                                        {comp.featured_image_url ? (
                                                                            <img className="ep-img-fluid ep-event-img" src={comp.featured_image_url} alt={comp.name} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="ep-event-img ep-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}

                                                                        <div className="ep-event-details">
                                                                            <div className="ep-event-info" style={{ display: "flex", flexDirection: "column", }} >
                                                                                <span id="ep-ename">{comp.name}</span>

                                                                                <span id="ep-espeaker" style={{ color: eventData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                                    Judge:{" "}
                                                                                    {comp.judges?.map((judge, index) => (
                                                                                        <span key={judge.id}>
                                                                                            {judge.first_name} {judge.last_name}
                                                                                            {index < comp.judges.length - 1 ? ", " : ""}
                                                                                        </span>
                                                                                    ))}
                                                                                </span>
                                                                            </div>

                                                                            <div className="ep-event-time" id="ep-edate">
                                                                                <small className="ep-event-date ep-galtext" style={{ color: eventData?.clubSettings?.original?.data?.settings?.accent_color, }} >
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

                                                    <div className="ep-season-card" style={{ padding: '30px' }}>
                                                        <h5 className="ep-head">Seasons</h5>
                                                        {eventData?.clubSettings?.original?.data?.seasons.length > 0 ? (
                                                            <div className="ep-session-container">
                                                                {eventData?.clubSettings?.original?.data?.seasons?.map((seas) => (
                                                                    <div key={seas.id} className={`ep-session-card ${seas.status?.toLowerCase()}`} style={{ backgroundColor: eventData?.clubSettings?.original?.data?.settings?.background_color, opacity: 0.7, }} >
                                                                        <div className="ep-session-header">
                                                                            <h3 className="ep-clubhead">
                                                                                {formatedDate(seas.start_date)} - {formatedDate(seas.end_date)}
                                                                            </h3>

                                                                            <span className={`ep-status ${seas.status?.charAt(0).toUpperCase() + seas.status?.slice(1).toLowerCase()}`}>
                                                                                <span className="ep-dot" style={{ backgroundColor: eventData?.clubSettings?.original?.data?.settings?.primary_color }}></span>
                                                                                {seas.status?.charAt(0).toUpperCase() + seas.status?.slice(1).toLowerCase()}
                                                                            </span>
                                                                        </div>

                                                                        <div className="ep-session-body">
                                                                            <div className="ep-info">
                                                                                <img src={Competition} alt={Competition} style={{ width: "16px", height: "16px" }} />
                                                                                {" "}
                                                                                {seas.competitions_count} Competitions
                                                                            </div>

                                                                            <div className="ep-info">
                                                                                <img src={Event} alt="Event" style={{ width: "16px", height: "16px" }} />
                                                                                {" "}
                                                                                {seas.events_count} Events
                                                                            </div>
                                                                        </div>

                                                                        <div className="ep-session-footer" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color, }} >
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

                            <section id="ep-joincontainer">
                                <div className="ep-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', width: '1820px' }}>
                                    <div id="ep-cls" className="ep-join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: eventData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="ep-clubheading" className="ep-heading" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="ep-clubsub" className="ep-head" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="btn" id="ep-join-club" onClick={() => navigate('/rytonclub')} style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="ep-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="ep-footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="ep-footer-heading" className="ep-heading ep-footer-heading" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}> {eventData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="ep-footer-description" className="ep-head ep-footer-description mx-auto" style={{ maxWidth: '1145px', color: eventData?.clubSettings?.original?.data?.settings?.text_color }}> {eventData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="ep-container ep-footer-section">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="ep-contact-col">
                                                <h5 className="ep-head mb-4" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="ep-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="ep-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="ep-footer-text mb-0" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}> {eventData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="ep-icon-circles ms-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="ep-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="ep-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="ep-footer-text mb-0" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}> {eventData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="ep-icon-circles ms-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="ep-contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="ep-cla">
                                                    <p className="ep-footer-text mb-0" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}> {eventData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="ep-icon-circles ms-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={eventData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="ep-footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="ep-social-col">
                                                <h5 className="ep-head mb-4 text-md-start text-center" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="ep-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="ep-cle">
                                                    <div className="ep-ficon-circles me-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="ep-facebook">
                                                        <p className="ep-footer-text fw-bold mb-1" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="ep-footer-link" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {eventData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="ep-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="ep-cle">
                                                    <div className="ep-ficon-circles me-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="ep-facebook">
                                                        <p className="ep-footer-text fw-bold mb-1" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="ep-footer-link" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {eventData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="ep-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="ep-cle">
                                                    <div className="ep-ficon-circles me-3" style={{ color: eventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="ep-flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="ep-facebook">
                                                        <p className="ep-footer-text fw-bold mb-1" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="ep-footer-link" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {eventData?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="ep-site-footer">
                                <div className="ep-footer-content">
                                    <p className="ep-memtext" id="ep-fcopy">Copyright &copy; 2025 – {eventData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="ep-memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: eventData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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