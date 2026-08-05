import Navbar from "./extra/Navbar";
import apiClient from "../api/axios";
import Loader from './extra/LoaderAll';
import Calendar from './extra/CalendarRyton'
import "./assets/css/results.css"
import Event from "./assets/icons/navigation/events.svg"
import Competition from "./assets/icons/navigation/competition.svg"
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router"
import he from "he";
function RytonCompetitionResults() {
    const navigate = useNavigate();
    const [compData, setcompData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [compsList, setCompsList] = useState([]);
    const [filters, setFilters] = useState([]);
    const [search, setSearch] = useState("");
    const [searchSeason, setSearchSeason] = useState("");
    const [options, setOptions] = useState([]);
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
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/competition-results"
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
                    const response = await apiClient.get("/club/public/competition-results", {
                        params: {
                            search_term: query,
                        },
                    });

                    const result =
                        response?.data?.data?.competitionResults?.original?.data || [];

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

    useEffect(() => {
        const competitions =
            compData?.competitionResults?.original?.data || [];

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
                compData?.competitionResults?.original?.data || [];

            setCompsList(comps);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }

    }, []);



    // const setActiveFilter = (filter) => {
    //     activeFilter = filter.name;
    // };


    const selectedSeasonLabel = useMemo(() => {
        const seasons =
            compData?.clubSettings?.original?.data?.club?.seasons || [];

        const season = seasons.find(
            s => String(s.id) === String(searchSeason)
        );

        if (!season) return "Season";

        return `Season ${new Date(season.start_date).getFullYear()}-${new Date(season.end_date).getFullYear()}`;
    }, [compData, searchSeason]);



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

    const formatTime = (datetimeStr) => {
        const date = new Date(datetimeStr);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const goToSingleResult = (id) => {
        navigate(`/rytoncomp/results/${id}`);
    }


    const getMedalIcon = (position) => {
        switch (position) {
            case 1:
                return {
                    src: new URL('./assets/icons/positions/1.svg', import.meta.url).href,
                    name: 'First Medal'
                }
            case 2:
                return {
                    src: new URL('./assets/icons/positions/2.svg', import.meta.url).href,
                    name: 'Second Medal'
                }
            case 3:
                return {
                    src: new URL('./assets/icons/positions/3.svg', import.meta.url).href,
                    name: 'Third Medal'
                }
            default:
                return null
        }
    }


    const getTopEntries = (competition) => {
        return competition.competition_members
            .flatMap(m =>
                m.entries.map(e => ({
                    ...e,
                    member_name: m.member.first_name
                }))
            )
            .slice(0, 3)
    }


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
                                            <div className="hero-section" style={{ backgroundImage: `url(${compData?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }} >
                                                <div className="hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {compData?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>

                                                            <p className="cabout" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }} >
                                                                {compData?.clubSettings?.original?.data?.club?.about}
                                                            </p>

                                                            <button id="overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                Join Our Club
                                                            </button>

                                                            <p className="prehead" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }} >
                                                                An NYCE Club based in Apps, North East England
                                                            </p>

                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
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
                                            <div className="hero-section" style={{ backgroundImage: `url(${compData?.clubSettings?.original?.data?.settings?.cover_images[1]?.image_medium_url})` }} >
                                                <div className="hero-overlay" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                                                    <div className="card-section" style={{ width: '100%' }} >
                                                        <div className="stat-card" style={{ width: '50%', backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color, color: compData?.clubSettings?.original?.data?.settings?.background_color, }} >
                                                            <small className="ca-details">Members</small>
                                                            {
                                                                <h3 className="number" style={{ marginTop: '30px' }}>
                                                                    {compData?.clubSettings?.original?.data?.total_members}
                                                                </h3>
                                                            }
                                                        </div>

                                                        <div className="up-event-card" style={{ width: "50%", backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color, }} >
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
                                                                    <h3 className="days" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, }} >
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
                                        <h2 className="events-title" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Competition Results</h2>
                                        <div className="search-bar">
                                            <i className="fas fa-search"></i>
                                            <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }} id="season-heads">
                                    <div className="season-header">
                                        <h2 className="season-title" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                            {selectedSeasonLabel}
                                        </h2>

                                        <div className="custom-filter">
                                            <label className="filter-label">Season</label>
                                            <select className="search-bars" value={searchSeason} onChange={(e) => setSearchSeason(e.target.value)}>
                                                <option value="">- Select -</option>

                                                {compData?.clubSettings?.original?.data?.club?.seasons?.map((opt) => (
                                                    <option key={opt.id} value={opt.id}>
                                                        Season {new Date(opt.start_date).getFullYear()}-
                                                        {new Date(opt.end_date).getFullYear()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="competition-wrapper" style={{ maxWidth: '1820px' }}>
                                <div className="container competition-grid" style={{ maxWidth: '1820px' }}>
                                    {compData?.competitionResults?.original?.data?.map((competition) => {
                                        const topEntries = getTopEntries(competition);

                                        return (
                                            <div key={competition.id} className="competition-card" onClick={() => goToSingleResult(competition.id)}>
                                                <div className="covers">
                                                    <img src={topEntries[0]?.entry_image_url} alt={topEntries[0]?.entry_image_title} />

                                                    <div className="resultpics-infos d-flex justify-content-between">
                                                        <div className="winner">
                                                            <h5 className="entry-title">{topEntries[0]?.entry_image_title}</h5>
                                                            <span className="author">by {topEntries[0]?.member_name}</span>
                                                        </div>

                                                        {getMedalIcon(1) && (
                                                            <img className="medal" src={getMedalIcon(1).src} alt="" style={{ width: '25.23px', height: '30.16px', position: 'relative', textAlign: 'right' }} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="card-body" style={{ padding: '0px 10px 10px 20px' }}>
                                                    <h3 className="title">{competition.name}</h3>

                                                    <p className="date">
                                                        {formatDate(competition.start_date)},
                                                        {formatTime(competition.start_date)}
                                                    </p>

                                                    {topEntries.slice(1).map((entry, index) => (
                                                        <div className="entry-row" key={entry.id}>
                                                            <img className="thumb" src={entry.entry_image_url} alt="" />

                                                            <div className="info">
                                                                <h6 className="entry-titles" style={{ marginBottom: '0px' }}>{entry.entry_image_title}</h6>
                                                                <span className="authors" style={{ marginTop: '0px' }}>by {entry.member_name}</span>
                                                            </div>

                                                            {getMedalIcon(index + 2) && (
                                                                <img className="medal" src={getMedalIcon(index + 2).src} alt="" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section >

                            <section id="eventcontainer">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="events" id="events" style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, width: '1820px' }}>
                                        <h5 id="clubheading" className="heading" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Events & Competitions</h5>
                                        <h6 id="clubsub" className="subhead" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, paddingTop: '6px' }}>Latest and upcoming events and competitions on the club calendar</h6>
                                        <div className="upcoming-sections" style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div className="cardddd d-flex flex-column" style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.secondary_color, padding: '20px' }}>
                                                <h5 className="head" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Upcoming Events</h5>
                                                {compData?.upcomingEvents?.length > 0 ? (
                                                    <>
                                                        {compData.upcomingEvents.slice(0, 3).map((event) => (
                                                            <div className="event-list">
                                                                <div className="home-event-item" style={{ marginBottom: '10px' }}>
                                                                    <img className="img-fluid home-event-img" src={event.featured_thumb_url} alt="Event" style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color }} />
                                                                    <div className="event-details">
                                                                        <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <span id="ename" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>{event.name}</span>
                                                                            <span id="espeaker" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color }}>Speaker:{" " + event.speaker}</span>
                                                                        </div>
                                                                        <div className="galtext" id="edate">
                                                                            <small className="galtext" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>{formatDate(event.event_date)}</small><br />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="button-group mt-auto">
                                                            <button className="btn btn-sm" id="view-all" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color }}>
                                                                View All
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '250px', color: compData?.clubSettings?.original?.data?.settings?.primary_color }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                            <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <span>No events found</span>
                                                        <span style={{ textAlign: 'center', width: '420px' }}>There are currently no events scheduled. Check back soon for updates!</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="cardddd" id="calendar" style={{ border: '1px solid #7FA483', padding: '0px', height: 'auto' }}>
                                                <Calendar />
                                            </div>

                                            <div className="cardddd d-flex flex-column" style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.secondary_color, padding: '20px' }}>
                                                <h5 className="head" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Upcoming Competitions</h5>
                                                {compData?.upcomingCompetitions?.length > 0 ? (
                                                    <>
                                                        {compData.upcomingCompetitions.slice(0, 3).map((competition) => (
                                                            <div key={competition.id} className="event-list">
                                                                <div className="home-event-item" style={{ marginBottom: "10px" }}>
                                                                    <img className="img-fluid home-event-img" src={competition.featured_thumb_url} alt="Comp" style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color, }} />

                                                                    <div className="event-details">
                                                                        <div className="event-info" style={{ display: "flex", flexDirection: "column" }} >
                                                                            <span id="ename" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, }} >
                                                                                {competition.name}
                                                                            </span>
                                                                            <span id="espeaker" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, }} >
                                                                                Judge: {" "}
                                                                                {competition.judges?.map((judge, index) => (
                                                                                    <span key={judge.id}>
                                                                                        {judge.first_name} {judge.last_name}
                                                                                        {index < competition.judges.length - 1 ? ", " : ""}
                                                                                    </span>
                                                                                ))}
                                                                            </span>
                                                                        </div>

                                                                        <div className="galtext" id="edate">
                                                                            <small className="galtext" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, }} >
                                                                                {formatDate(competition.start_date)}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="button-group mt-auto">
                                                            <button className="btn btn-sm" id="view-all" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color, }} >
                                                                View All
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "250px", color: compData?.clubSettings?.original?.data?.settings?.primary_color, }} >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                            <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>

                                                        <span>No competitions found</span>

                                                        <span style={{ textAlign: "center", width: "400px", }} >
                                                            There are currently no competitions scheduled. Check back soon for updates!
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
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

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="footer-heading" className="heading footer-heading" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="footer-description" className="head footer-description mx-auto" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container footer-section">
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
                                                        <p className="footer-text fw-bold mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
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
                                                        <p className="footer-text fw-bold mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
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
                                                        <p className="footer-text fw-bold mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
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
                        </div >
                    </div >
                )
                }
            </div >
        </>
    )
}
export default RytonCompetitionResults