import { useParams } from "react-router";
import Navbar from "./extra/Navbar";
import apiClient from "../api/axios";
import Loader from './extra/LoaderAll';
import Calendar from './extra/CalendarRyton'
import "./assets/css/singlecomp.css"
import Event from "./assets/icons/navigation/events.svg"
import Competition from "./assets/icons/navigation/competition.svg"
import { useState, useEffect, useMemo, useCallback } from "react";
import he from "he";
import { NavLink, useNavigate } from "react-router";
function CompetitionSinglePublic() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sincompData, setsincompData] = useState([]);
    const [sincompsList, setsincompsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    useEffect(() => {
        getsincompData(id);
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
            fetchSearchedComps(search);
        } else {
            setsincompsList(
                sincompData?.competitions?.original?.data ||
                []
            );
        }
    }, [search]);

    async function getsincompData(id) {
        const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/competition/${id}`;

        const response = await fetch(url);
        const data = await response.json();

        setsincompData(data.data);
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

    const filteredEntries = () => {
        const entries = sincompData?.competition?.original?.data?.entries || [];
        const validPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const seen = new Set();

        return entries
            .filter(item => {
                if (validPositions.includes(item.position) && !seen.has(item.position)) {
                    seen.add(item.position);
                    return true;
                }
                return false;
            })
            .sort((a, b) => validPositions.indexOf(a.position) - validPositions.indexOf(b.position));
    };




    const getMedalIcon = (position) => {
        switch (position) {
            case 1:
                return { src: new URL('./assets/icons/positions/1.svg', import.meta.url).href, name: 'First Medal' };
            case 2:
                return { src: new URL('./assets/icons/positions/2.svg', import.meta.url).href, name: 'Second Medal' };
            case 3:
                return { src: new URL('./assets/icons/positions/3.svg', import.meta.url).href, name: 'Third Medal' };
            case 4:
                return { src: new URL('./assets/icons/positions/4.svg', import.meta.url).href, name: 'Forth Medal' };
            case 5:
                return { src: new URL('./assets/icons/positions/5.svg', import.meta.url).href, name: 'Fifth Medal' };
            case 6:
                return { src: new URL('./assets/icons/positions/6.svg', import.meta.url).href, name: 'Sixth Medal' };
            case 7:
                return { src: new URL('./assets/icons/positions/7.svg', import.meta.url).href, name: 'Seventh Medal' };
            case 8:
                return { src: new URL('./assets/icons/positions/8.svg', import.meta.url).href, name: 'Eighth Medal' };
            case 9:
                return { src: new URL('./assets/icons/positions/9.svg', import.meta.url).href, name: 'Ninth Medal' };
            case 10:
                return { src: new URL('./assets/icons/positions/c.svg', import.meta.url).href, name: 'Commended' };
            case 11:
                return { src: new URL('./assets/icons/positions/h.svg', import.meta.url).href, name: 'Highly' };
            case 12:
                return { src: new URL('./assets/icons/positions/i.svg', import.meta.url).href, name: 'Intermediate' };
            default:
                return null;
        }
    };

    const hexToRgba = (hex, alpha) => {
        if (!hex) return `rgba(0,0,0,${alpha})`;

        let r = 0,
            g = 0,
            b = 0;

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

    console.log(sincompData.competition)
    return (
        <>
            <div style={{ backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: sincompData?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '5001', backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
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
                                        sincompData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="sco-hero-section" style={{ backgroundImage: `url(${sincompData?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }} >
                                                <div className="sco-hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {sincompData?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>

                                                            <p className="sco-cabout" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }} >
                                                                {sincompData?.clubSettings?.original?.data?.club?.about}
                                                            </p>

                                                            <button id="sco-overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                Join Our Club
                                                            </button>

                                                            <p className="sco-prehead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }} >
                                                                An NYCE Club based in Apps, North East England
                                                            </p>

                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="sco-icon-circles" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="sco-icon-circles" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="sco-icon-circles" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <span className="sco-flickr-dots">
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
                                        sincompData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="sco-hero-section" style={{ backgroundImage: `url(${sincompData?.clubSettings?.original?.data?.settings?.cover_images[1]?.image_medium_url})` }} >
                                                <div className="sco-hero-overlay" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                                                    <div className="sco-card-section" style={{ width: '100%' }} >
                                                        <div className="sco-stat-card" style={{ width: '50%', backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.accent_color, color: sincompData?.clubSettings?.original?.data?.settings?.background_color, }} >
                                                            <small className="sco-ca-details">Members</small>
                                                            {
                                                                <h3 className="sco-number" style={{ marginTop: '30px' }}>
                                                                    {sincompData?.clubSettings?.original?.data?.total_members}
                                                                </h3>
                                                            }
                                                        </div>

                                                        <div className="sco-event-card" style={{ width: "50%", backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.primary_color, }} >
                                                            {sincompData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days !== undefined &&
                                                                sincompData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days !== null ? (
                                                                <>
                                                                    <small className="sco-ca-details">Next Event</small>

                                                                    <div className="row">
                                                                        <h3 className="sco-number" style={{ marginTop: '30px' }}>
                                                                            {String(sincompData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days).padStart(2, "0")}
                                                                            &nbsp;
                                                                            <span className="sco-days">days to go</span>
                                                                        </h3>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="d-flex flex-column justify-content-center align-items-center" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                        <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                    <h3 className="sco-days" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, }} >
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

                        <div className="sco-contents">

                            <section>
                                <div className="sco-container" style={{ maxWidth: '1820px' }} id="sco-heads">
                                    <div className="sco-events-header">
                                        <nav className="sco-breadcrumb">
                                            <NavLink to="/rytoncomp" className="sco-events-title sco-breadcrumb-item" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                Competitions
                                            </NavLink>

                                            <span className="sco-events-title sco-breadcrumb-separator" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                &gt;
                                            </span>

                                            <span className="sco-events-title sco-breadcrumb-item sco-active">
                                                {sincompData?.competition?.original?.data?.name}
                                            </span>
                                        </nav>
                                        <div className="sco-search-bar">
                                            <i className="fas fa-search"></i>
                                            <input type="text" placeholder="Search" className="sco-search-input" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sco-container" style={{ width: '1820px', maxWidth: '1820px' }} id="sco-overall">

                                    <div className="row">
                                        <div className="col-md-8">
                                            <section>
                                                <div className="sco-container" id="sco-events-left">
                                                    <div className="sco-card" style={{ border: 'none' }}>
                                                        <img src={sincompData?.competition?.original?.data?.featured_image_url} alt="Meeting" style={{ maxWidth: '850px', width: '850px', height: '350px', borderRadius: '8px' }} />
                                                        <div className="d-flex justify-content-between" style={{ width: '850px' }}>
                                                            <h5 className="sco-head" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>{sincompData?.competition?.original?.data?.name}</h5>
                                                            <div className="d-flex align-items-center justify-content-center gap-3">
                                                                <img className="sco-head" src={sincompData?.competition?.original?.data?.competition_type?.icon_url} style={{ width: '20px', height: '20px' }} />
                                                                <h5 className="sco-head" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: '400', fontStyle: 'Regular', fontSize: '18px', lineHeight: '100%', letterSpacing: '0%' }}>{sincompData?.competition?.original?.data?.competition_type?.name}</h5>
                                                            </div>
                                                        </div>
                                                        <p id="sco-edate" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(sincompData?.competition?.original?.data?.start_date)}</p>
                                                        <p className="sco-text-secondary" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {he.decode(sincompData?.competition?.original?.data?.description)}
                                                        </p>
                                                        <p className="sco-text-secondary" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {he.decode(sincompData?.competition?.original?.data?.description)}
                                                        </p>
                                                        <p className="sco-text-secondary" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {he.decode(sincompData?.competition?.original?.data?.description)}
                                                        </p>
                                                        <div className="sco-divider4"></div>
                                                        <div className="row" id="sco-eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>Competition Type</h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>{sincompData?.competition?.original?.data?.print_vs_digital}</h5>
                                                            </div>
                                                        </div >

                                                        <div className="sco-divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="sco-eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>Competition Judge</h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    {sincompData?.competition?.original?.data?.judges?.map((judge, i, arr) => (
                                                                        <span key={judge.id || i}>
                                                                            {judge.first_name} {judge.last_name}
                                                                            {i < arr.length - 1 && ", "}
                                                                        </span>
                                                                    ))}
                                                                </h5>
                                                            </div>
                                                        </div >

                                                        <div className="sco-divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="sco-eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>Theme</h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>{sincompData?.competition?.original?.data?.theme_id}</h5>
                                                            </div >
                                                        </div >

                                                        <div className="sco-divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="sco-eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>Colour/Monochrome</h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>{sincompData?.competition?.original?.data?.color_vs_mono}</h5>
                                                            </div >
                                                        </div >

                                                        <div className="sco-divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="sco-eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>Status</h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>{sincompData?.competition?.original?.data?.status}</h5>
                                                            </div >
                                                        </div >

                                                        <div className="sco-divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="sco-eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>Gear Required</h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>Yes</h5>
                                                            </div >
                                                        </div >

                                                        <div className="sco-divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="sco-eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>Max Number of Entries per Participants</h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    {sincompData?.competition?.original?.data?.max_entries_print + " Images"}
                                                                </h5>
                                                            </div >
                                                        </div >

                                                        <div className="sco-divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="sco-eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>Deadline for Submission</h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>{formatDate(sincompData?.competition?.original?.data?.submission_deadline)}</h5>
                                                            </div >
                                                        </div >

                                                        <div className="sco-divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="sco-eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>Result Announcement Date</h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="sco-clubhead" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    {formatDate(sincompData?.competition?.original?.data?.result_announcement_date)}
                                                                </h5>
                                                            </div >
                                                        </div >

                                                        <div className="sco-divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        {sincompData?.competition?.original?.data?.status !== "completed" && (
                                                            <>
                                                                <div className="sco-divider5"></div>

                                                                <div style={{ height: 'auto', border: 'none', backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                    <div className="d-flex justify-content-between align-items-end mb-3" id="sco-cl">
                                                                        <div style={{ alignItems: 'flex-end' }}>
                                                                            <h5 className="sco-head" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>Competition Results</h5>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sco-resultpics">
                                                                        {filteredEntries().map((item, index) => (
                                                                            <div key={item.entry_id || index} className="sco-resultpics-items">
                                                                                {item.entry_image && item.entry_image.length > 0 && (
                                                                                    <div>
                                                                                        <img src={item.entry_image} alt={item.entry_image_title || 'Competition entry image'} />
                                                                                        <div className="sco-resultpics-infos d-flex flex-row justify-content-between" style={{ backgroundColor: hexToRgba(sincompData?.clubSettings?.original?.data?.settings?.primary_color, 0.7) }}  >
                                                                                            <div className="d-flex flex-column">
                                                                                                <h4 className="sco-title" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color }}>{item.entry_image_title}</h4>
                                                                                                <span className="sco-name" style={{ color: hexToRgba(sincompData?.clubSettings?.original?.data?.settings?.secondary_color, 0.85), textAlign: 'left' }}>
                                                                                                    by {item.member_name}
                                                                                                </span>
                                                                                            </div>
                                                                                            {getMedalIcon(item.position) && (
                                                                                                <img src={getMedalIcon(item.position).src} alt={getMedalIcon(item.position).name} id="sco-medal-inline" />
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div >
                                                            </>
                                                        )}
                                                    </div >
                                                </div >
                                            </section >
                                        </div >
                                        <div className="col-md-4">
                                            <section>
                                                <div className="sco-container" id="sco-right">

                                                    <div className="sco-calendar-card" style={{ padding: '0px' }} id="sco-cal">
                                                        <Calendar />
                                                    </div>

                                                    <div className="sco-more-card d-flex flex-column" style={{ padding: '30px', height: 'auto' }} id="sco-eve">
                                                        <h5 className="sco-head">Events</h5>
                                                        {sincompData?.events?.length > 0 ? (
                                                            <div className="sco-event-list">
                                                                {sincompData?.events.map((event) => (
                                                                    <div className="sco-event-item" style={{ marginbottom: '10px' }}>
                                                                        {event.featured_image_url ? (
                                                                            <img className="sco-img-fluid sco-event-img" src={event.featured_image_url} alt={event.name} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="sco-event-img sco-fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="sco-event-details">
                                                                            <div className="sco-event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="sco-ename">{event.name}</span>
                                                                                <span id="sco-espeaker" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>Speaker: {event.speaker}</span>
                                                                            </div>

                                                                            <div className="sco-event-time" id="sco-edate">
                                                                                <small className="sco-event-date sco-galtext" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>{formatDate(event.event_date)}</small><br />
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

                                                    <div className="sco-season-card" style={{ padding: '30px' }}>
                                                        <h5 className="sco-head">Seasons</h5>
                                                        {sincompData?.clubSettings?.original?.data?.seasons.length > 0 ? (
                                                            <div className="sco-session-container">
                                                                {sincompData?.clubSettings?.original?.data?.seasons?.map((seas) => (
                                                                    <div key={seas.id} className={`sco-session-card ${seas.status?.toLowerCase()}`} style={{ backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.background_color }} >
                                                                        <div className="sco-session-header">
                                                                            <h3 className="sco-clubhead">
                                                                                {formatedDate(seas.start_date)} - {formatedDate(seas.end_date)}
                                                                            </h3>

                                                                            <span className={`sco-status ${seas.status?.toLowerCase()}`}>
                                                                                <span className="sco-dot" style={{ backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}></span>
                                                                                {seas.status?.charAt(0).toUpperCase() + seas.status?.slice(1).toLowerCase()}
                                                                            </span>
                                                                        </div>

                                                                        <div className="sco-session-body">
                                                                            <div className="sco-info">
                                                                                <img src={Competition} alt={Competition} style={{ width: "16px", height: "16px" }} />
                                                                                {" "}
                                                                                {seas.competitions_count} Competitions
                                                                            </div>

                                                                            <div className="sco-info">
                                                                                <img src={Event} alt={Event} style={{ width: "16px", height: "16px" }} />
                                                                                {" "}
                                                                                {seas.events_count} Events
                                                                            </div>
                                                                        </div>

                                                                        <div className="sco-session-footer" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color, }} >
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

                            <section id="sco-joincontainer">
                                <div className="sco-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', width: '1820px' }}>
                                    <div id="sco-cls" className="sco-join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="sco-clubheading" className="sco-heading" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="sco-clubsub" className="sco-head" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="sco-btn" id="sco-join-club" onClick={() => navigate('/rytonclub')} style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sco-container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="sco-footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="sco-footer-heading" className="sco-heading sco-footer-heading" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}> {sincompData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="sco-footer-description" className="sco-head sco-footer-description mx-auto" style={{ maxWidth: '1145px', color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}> {sincompData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="sco-container sco-footer-section">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="sco-contact-col">
                                                <h5 className="sco-head mb-4" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="sco-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="sco-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="sco-footer-text mb-0" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}> {sincompData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="sco-icon-circles ms-3" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="sco-contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="sco-cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="sco-footer-text mb-0" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}> {sincompData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="sco-icon-circles ms-3" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="sco-contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="sco-cla">
                                                    <p className="sco-footer-text mb-0" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}> {sincompData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="sco-icon-circles ms-3" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={sincompData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="sco-footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="sco-social-col">
                                                <h5 className="sco-head mb-4 text-md-start text-center" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="sco-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sco-cle">
                                                    <div className="sco-ficon-circles me-3" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="sco-facebook">
                                                        <p className="sco-footer-text fw-bold mb-1" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="sco-footer-link" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sincompData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="sco-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sco-cle">
                                                    <div className="sco-ficon-circles me-3" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="sco-facebook">
                                                        <p className="sco-footer-text fw-bold mb-1" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="sco-footer-link" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sincompData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="sco-social-item d-flex align-items-center justify-content-md-start justify-content-center" id="sco-cle">
                                                    <div className="sco-ficon-circles me-3" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="sco-flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="sco-facebook">
                                                        <p className="sco-footer-text fw-bold mb-1" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="sco-footer-link" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sincompData?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="sco-site-footer">
                                <div className="sco-footer-content">
                                    <p className="sco-memtext" id="sco-fcopy">Copyright &copy; 2025 – {sincompData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="sco-memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: sincompData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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
export default CompetitionSinglePublic
