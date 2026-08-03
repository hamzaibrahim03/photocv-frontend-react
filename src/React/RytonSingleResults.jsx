import Navbar from "./extra/Navbar";
import apiClient from "../api/axios";
import Loader from './extra/LoaderAll';
import Calendar from './extra/CalendarRyton'
import "./assets/css/singleresult.css"
import Event from "./assets/icons/navigation/events.svg"
import Competition from "./assets/icons/navigation/competition.svg"
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router"
import he from "he";

function RytonSingleResults() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [compData, setcompData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [compsList, setCompsList] = useState([]);
    const [filters, setFilters] = useState([]);
    const [search, setSearch] = useState("");
    const [searchSeason, setSearchSeason] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedSlide, setSelectedSlide] = useState(null);

    const hexToRgba = (hex, alpha) => {
        if (!hex) return `rgba(0,0,0,${alpha})`;
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return `rgba(${r},${g},${b},${alpha})`;
    };

    const openSlide = (item) => {
        if (!item) return;

        const entries =
            compData?.competitionResults?.original?.data?.entries || [];

        const startIndex = entries.findIndex(
            entry => entry.id === item.id
        );

        localStorage.setItem(
            "selectedImages",
            JSON.stringify(entries)
        );

        localStorage.setItem(
            "startIndex",
            startIndex
        );

        navigate(`/rytoncomp/result/slide?competition=${id}`);
    };

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
        const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/competition-results/${id}`
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
                    const response = await apiClient.get(`/club/public/competition-results/${id}`, {
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

    const getMedalIcon = (position) => {
        switch (position) {
            case 1:
                return {
                    src: new URL('./assets/icons/positions/1.svg',
                        import.meta.url).href, name: 'First Medal'
                };
            case 2:
                return {
                    src: new URL('./assets/icons/positions/2.svg',
                        import.meta.url).href, name: 'Second Medal'
                };
            case 3:
                return {
                    src: new URL('./assets/icons/positions/3.svg',
                        import.meta.url).href, name: 'Third Medal'
                };
            case 4:
                return {
                    src: new URL('./assets/icons/positions/4.svg',
                        import.meta.url).href, name: 'Forth Medal'
                };
            case 5:
                return {
                    src: new URL('./assets/icons/positions/5.svg',
                        import.meta.url).href, name: 'Fifth Medal'
                };
            case 6:
                return {
                    src: new URL('./assets/icons/positions/6.svg',
                        import.meta.url).href, name: 'Sixth Medal'
                };
            case 7:
                return {
                    src: new URL('./assets/icons/positions/7.svg',
                        import.meta.url).href, name: 'Seventh Medal'
                };
            case 8:
                return {
                    src: new URL('./assets/icons/positions/8.svg',
                        import.meta.url).href, name: 'Eighth Medal'
                };
            case 9:
                return {
                    src: new URL('./assets/icons/positions/9.svg',
                        import.meta.url).href, name: 'Ninth Medal'
                };
            case 10:
                return {
                    src: new URL('./assets/icons/positions/c.svg',
                        import.meta.url).href, name: 'Commended'
                };
            case 11:
                return {
                    src: new URL('./assets/icons/positions/h.svg',
                        import.meta.url).href, name: 'Highly'
                };
            case 12:
                return {
                    src: new URL('./assets/icons/positions/i.svg',
                        import.meta.url).href, name: 'Intermediate'
                };
            default:
                return {
                    src: new URL('./assets/icons/positions/i.svg',
                        import.meta.url).href, name: 'Intermediate'
                };
        }
    };



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
    const competitionTitle = () =>
        compData?.competitionResult?.original?.data?.name || "";

    const competitionSeason = () => {
        const startDate = compData?.competitionResult?.original?.data?.start_date;
        if (!startDate) return "";

        const startYear = new Date(startDate).getFullYear();
        const endYear = startYear + 1;

        return `Season ${startYear}-${endYear}`;
    };

    const entries = compData?.competitionResult?.original?.data?.entries || [];
    const suggestion = useMemo(() => {
        if (!Array.isArray(compData?.clubGalleries)) return [];

        return compData?.clubGalleries.map((club) => {
            const firstPhoto = club.photos?.[0];

            return {
                gallery_id: club.gallery_id,
                gallery_name: club.gallery_name,
                total_photos: club.total_photos,
                image: firstPhoto?.image || "",
                title: firstPhoto?.title || "",
                comments_count: firstPhoto?.comments_count || 0,
                likes_count: firstPhoto?.likes_count || 0,
                uploaded_by: firstPhoto?.uploaded_by || "",
                photo_id: firstPhoto?.photo_id || "",
            };
        });
    }, [compData?.clubGalleries]);

    const columns = 5;

    function getPositionClass(index, total) {
        const row = Math.floor(index / columns);
        const col = index % columns;

        const lastIndex = total - 1;

        let classes = [];

        if (index === 0) classes.push("top-left");

        if (row === 0 && col === columns - 1) {
            classes.push("top-right");

            if (total >= 6 && total <= 9) {
                classes.push("special-radius");
            }
        }

        if (
            row === Math.floor(lastIndex / columns) &&
            col === 0
        ) {
            classes.push("bottom-left");
        }

        if (index === lastIndex) {
            classes.push("bottom-right");
        }

        return classes.join(" ");
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
                                            <div className="sre-hero-section" style={{ backgroundImage: `url(${compData?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }} >
                                                <div className="sre-hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {compData?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>

                                                            <p className="sre-cabout" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }} >
                                                                {compData?.clubSettings?.original?.data?.club?.about}
                                                            </p>

                                                            <button id="sre-overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                Join Our Club
                                                            </button>

                                                            <p className="sre-prehead" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }} >
                                                                An NYCE Club based in Apps, North East England
                                                            </p>

                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="sre-icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="sre-icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="sre-icon-circles" style={{ color: compData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <span className="sre-flickr-dots">
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
                                            <div className="sre-hero-section" style={{ backgroundImage: `url(${compData?.clubSettings?.original?.data?.settings?.cover_images[1]?.image_medium_url})` }} >
                                                <div className="sre-hero-overlay" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                                                    <div className="sre-card-section" style={{ width: '100%' }} >
                                                        <div className="sre-stat-card" style={{ width: '50%', backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color, color: compData?.clubSettings?.original?.data?.settings?.background_color, }} >
                                                            <small className="sre-ca-details">Members</small>
                                                            {
                                                                <h3 className="sre-number" style={{ marginTop: '30px' }}>
                                                                    {compData?.clubSettings?.original?.data?.total_members}
                                                                </h3>
                                                            }
                                                        </div>

                                                        <div className="sre-event-card" style={{ width: "50%", backgroundColor: compData?.clubSettings?.original?.data?.settings?.primary_color, }} >
                                                            {compData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days !== undefined &&
                                                                compData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days !== null ? (
                                                                <>
                                                                    <small className="sre-ca-details">Next Event</small>

                                                                    <div className="row">
                                                                        <h3 className="sre-number" style={{ marginTop: '30px' }}>
                                                                            {String(compData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days).padStart(2, "0")}
                                                                            &nbsp;
                                                                            <span className="sre-days">days to go</span>
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
                                                                    <h3 className="sre-days" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, }} >
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

                        <div className="sre-contents">
                            <section>
                                <div className="sre-container" id="sre-heads">
                                    <div className="sre-events-header">
                                        <h2 className="sre-events-title" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Results</h2>
                                        <div className="sre-search-bar">
                                            <i className="fas fa-search"></i>
                                            <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" className="sre-search-input" id="sre-dt-search-1" placeholder="Search" aria-controls="example1" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="sre-competition-section">
                                <div className="sre-container">
                                    <h2 className="sre-heading">
                                        {competitionTitle()} - {competitionSeason()}
                                    </h2>
                                    <div className="sre-gallery-grid">
                                        {entries.map((item, index) => (
                                            <div key={item.id || index} className="sre-gallery-card" onClick={() => openSlide(item)}>
                                                <img src={item.entry_image} className="sre-gallery-img" />
                                                <div className="sre-overlay">
                                                    <div className="sre-text">
                                                        <p className="sre-title">{item.entry_image_title}</p>
                                                        <span className="sre-author">by {item.member_name}</span>
                                                    </div>
                                                    <img src={getMedalIcon(item.position).src} alt={getMedalIcon(item.position).name} id="sre-badge" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sre-container">
                                    <div className="sre-suggestion-header d-flex justify-content-between align-items-center mb-4">
                                        <div>
                                            <h3 className="sre-heading" style={{ fontWeight: '500', color: compData?.clubSettings?.original?.data?.settings?.text_color }}>More from Club Galleries</h3>
                                            <p className="sre-clubsub" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                A preview of galleries made up of amazing photographs from club members
                                            </p>
                                        </div>
                                        <button id="sre-view" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color, border: 'none' }}>View All</button>
                                    </div>

                                    <div className="sre-suggestion-gallery">
                                        {suggestion.slice(0, 10).map((item, index) => (
                                            <div key={item.id} className={`sre-suggestion-card ${getPositionClass(index, suggestion.length)}`}>
                                                <img src={item.image} alt={item.title} style={{ objectFit: "cover", objectPosition: "top", }} />
                                                <div className={`sre-img-overlay ${getPositionClass(index, suggestion.length)}`} style={{ backgroundColor: hexToRgba(compData?.clubSettings?.original?.data?.settings?.primary_color, 0.7), }} >
                                                    <span style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, }} >
                                                        {item.title}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section id="sre-joincontainer">
                                <div className="sre-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', width: '1820px' }}>
                                    <div id="sre-cls" className="sre-join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: compData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="sre-clubheading" className="sre-heading" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="sre-clubsub" className="sre-head" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="sre-btn" id="sre-join-club" onClick={() => navigate('/rytonclub')} style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sre-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="sre-footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="sre-footer-heading" className="sre-heading sre-footer-heading" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="sre-footer-description" className="sre-head sre-footer-description mx-auto" style={{ maxWidth: '1145px', color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sre-container sre-footer-section">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="sre-contact-col">
                                                <h5 className="sre-head mb-4" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="sre-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="sre-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="sre-footer-text mb-0" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="sre-icon-circles ms-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="sre-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="sre-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="sre-footer-text mb-0" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="sre-icon-circles ms-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="sre-contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="sre-cla">
                                                    <p className="sre-footer-text mb-0" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}> {compData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="sre-icon-circles ms-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={compData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="sre-footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="sre-social-col">
                                                <h5 className="sre-head mb-4 text-md-start text-center" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="sre-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sre-cle">
                                                    <div className="sre-ficon-circles me-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="sre-facebook">
                                                        <p className="sre-footer-text fw-bold mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="sre-footer-link" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {compData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="sre-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sre-cle">
                                                    <div className="sre-ficon-circles me-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="sre-facebook">
                                                        <p className="sre-footer-text fw-bold mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="sre-footer-link" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {compData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="sre-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sre-cle">
                                                    <div className="sre-ficon-circles me-3" style={{ color: compData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="sre-flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="sre-facebook">
                                                        <p className="sre-footer-text fw-bold mb-1" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="sre-footer-link" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {compData?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="sre-site-footer">
                                <div className="sre-footer-content">
                                    <p className="sre-memtext" id="sre-fcopy">Copyright &copy; 2025 – {compData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="sre-memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: compData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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
export default RytonSingleResults

