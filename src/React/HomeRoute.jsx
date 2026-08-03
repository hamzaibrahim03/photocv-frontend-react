import './assets/css/clubstyle.css'
import logo from './images/clubs/logo/logo.svg'
import heart from './images/Heart.svg'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react'
import Calendar from './extra/CalendarRyton'
import Navbar from './extra/Navbar'
import Loader from './extra/LoaderAll';
import { useNavigate } from 'react-router';
function HomeRoute() {
    const navigate = useNavigate();
    const [homeData, sethomeData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        gethomeData();
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

    async function gethomeData() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/home"
        let response = await fetch(url)
        response = await response.json()
        sethomeData(response.data)
    }
    console.log(homeData)
    dayjs.extend(relativeTime);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "";

        const day = date.getDate();
        const month = date.toLocaleString("en-GB", {
            month: "long"
        });
        const year = date.getFullYear();

        const suffix =
            day % 10 === 1 && day !== 11 ? "st" :
                day % 10 === 2 && day !== 12 ? "nd" :
                    day % 10 === 3 && day !== 13 ? "rd" : "th";

        return `${day}${suffix} ${month} ${year}`;
    };

    const timeAgo = (date) => {
        return dayjs(date).fromNow();
    };

    const validMembers =
        homeData?.memberGalleries?.filter(
            (member) => member.galleries?.length > 0
        ) || [];

    const resultData =
        homeData?.latestResults?.original?.data || [];

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
            <div style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: homeData?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '1001', backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
                            <Navbar />
                        </nav>

                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1" ></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2" ></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3" ></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4" ></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5" ></button>
                            </div>

                            <div className="carousel-inner">

                                <div className="carousel-item active">
                                    {
                                        homeData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="hero-section" style={{ backgroundImage: `url(${homeData?.clubSettings?.original?.data?.settings?.cover_images[0]?.image_medium_url})` }} >
                                                <div className="hero-overlay">
                                                    {
                                                        <div>
                                                            <h1 style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '400' }}>
                                                                {homeData?.clubSettings?.original?.data?.club?.club_name}
                                                            </h1>

                                                            <p className="cabout" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, fontWeight: '200' }} >
                                                                {homeData?.clubSettings?.original?.data?.club?.about}
                                                            </p>

                                                            <button id="overlay-button" onClick={() => navigate('/rytonclub')} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                                Join Our Club
                                                            </button>

                                                            <p className="prehead" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, paddingTop: '20px', }} >
                                                                An NYCE Club based in Apps, North East England
                                                            </p>

                                                            <div className="d-flex">
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: homeData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: homeData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
                                                                    <i className="fab fa-instagram"></i>
                                                                </a>
                                                                <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: homeData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none', }} >
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
                                        homeData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="hero-section" style={{ backgroundImage: `url(${homeData?.clubSettings?.original?.data?.settings?.cover_images[1]?.image_medium_url})` }} >
                                                <div className="hero-overlay" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                                                    <div className="card-section" style={{ width: '100%' }} >
                                                        <div className="stat-card" style={{ width: '50%', backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color, color: homeData?.clubSettings?.original?.data?.settings?.background_color, }} >
                                                            <small className="ca-details">Members</small>
                                                            {
                                                                <h3 className="number" style={{ marginTop: '30px' }}>
                                                                    {homeData?.clubSettings?.original?.data?.total_members}
                                                                </h3>
                                                            }
                                                        </div>

                                                        <div className="event-card" style={{ width: "50%", backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color, }} >
                                                            {homeData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days !== undefined &&
                                                                homeData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days !== null ? (
                                                                <>
                                                                    <small className="ca-details">Next Event</small>

                                                                    <div className="row">
                                                                        <h3 className="number" style={{ marginTop: '30px' }}>
                                                                            {String(homeData?.clubSettings?.original?.data?.upcoming_event_days_count?.remaining_days).padStart(2, "0")}
                                                                            &nbsp;
                                                                            <span className="days">days to go</span>
                                                                        </h3>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="d-flex flex-column justify-content-center align-items-center" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                        <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                    <h3 className="days" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, }} >
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

                                <div className="carousel-item">
                                    {
                                        homeData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="hero-section" style={{ backgroundImage: `url(${homeData?.clubSettings?.original?.data?.settings?.cover_images?.[2]?.image_medium_url})` }} >
                                                <div className="hero-overlay" >
                                                    {homeData?.singleEvent?.map((event) => (
                                                        <>
                                                            <div key={event.id} style={{ padding: '53px 42px 42px 53px' }}>
                                                                <div className="events-card">
                                                                    <p className="date">
                                                                        Upcoming Event | {formatDate(event.event_date)}
                                                                    </p>

                                                                    <h5 style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: '20px', width: '1000px' }} >
                                                                        {event.name}
                                                                    </h5>
                                                                </div>
                                                                <p className="text-secondaryy">
                                                                    {event.description}
                                                                </p>
                                                            </div>

                                                            <div className="button-group mt-3 d-flex" style={{ padding: '0px 0px 0px 53px' }} >
                                                                <button id="view" className="btn me-2" onClick={() => navigate(`/rytonevent/${event.id}`)} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                    View Details
                                                                </button>
                                                            </div>
                                                        </>
                                                    ))}

                                                </div >
                                            </div>
                                        )}
                                </div>

                                <div className="carousel-item">
                                    {
                                        homeData?.clubSettings?.original?.data?.settings?.cover_images?.length > 0 && (
                                            <div className="hero-section" style={{ backgroundImage: `url(${homeData?.clubSettings?.original?.data?.settings?.cover_images[3]?.image_medium_url})` }} >
                                                <div className="hero-overlay">
                                                    <div className="events-card">
                                                        <p className="date" style={{ textAlign: 'left', marginTop: '140px', marginBottom: '30px', }} >
                                                            Upcoming Notice | {formatDate(homeData?.latest_notice?.original?.data?.created_at)}
                                                        </p>

                                                        <h5 style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: '20px', }} >
                                                            {homeData?.latest_notice?.original?.data?.title}
                                                        </h5>
                                                    </div>

                                                    <p className="text-secondaryy" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: '30px', }} >
                                                        {homeData?.latest_notice?.original?.data?.description}
                                                    </p>

                                                    <div className="button-group mt-3 d-flex">
                                                        <button id="view" className="btn me-2" onClick={() => navigate(`/rytonnotice/${homeData?.latest_notice?.original?.data?.id}`)} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </div>

                                <div className="carousel-item">
                                    <div className="hero-section" style={{ backgroundImage: `url(${homeData?.clubSettings?.original?.data?.settings?.cover_images?.[2]?.image_medium_url})` }} >
                                        <div className="hero-overlay">
                                            {homeData?.clubNews?.[0] && (
                                                <div>
                                                    <div className="events-card">
                                                        <p className="date" style={{ textAlign: "left", marginTop: "140px", marginBottom: "30px", }} >
                                                            Upcoming News | {formatDate(homeData.clubNews[0].publish_date)}
                                                        </p>
                                                        <h5 style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: "20px", width: "825px", }} >
                                                            {homeData.clubNews[0].title}
                                                        </h5>
                                                    </div>
                                                    <p className="text-secondaryy" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: "30px", }} >
                                                        {homeData.clubNews[0].description}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="button-group mt-3 d-flex">
                                                <button id="view" className="btn me-2" onClick={() => navigate(`/rytonnews/${homeData?.clubNews[0]?.id}`)} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color, }} >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" >
                                <span className="carousel-control-prev-icon"></span>
                            </button>

                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" >
                                <span className="carousel-control-next-icon"></span>
                            </button>
                        </div>

                        <div className="contents">
                            <section id="herocontainer">
                                <div className="container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    {
                                        <div style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, paddingBottom: '15px', height: 'auto', border: 'none' }}>
                                            <div className="hero-grid" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, alignItems: 'center' }}>
                                                <div className="hero-image">
                                                    <img src={homeData?.clubSettings?.original?.data?.settings?.header_img_url} alt="hero" style={{ borderRadius: '20px' }} />
                                                </div>

                                                <div className="hero-content">
                                                    <h1 id="clubheading" className="heading" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: '400' }}>
                                                        {homeData?.clubSettings?.original?.data?.settings?.header_title}
                                                    </h1>
                                                    <p id="home-clubsub" className="home-subhead" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, }}>
                                                        {homeData?.clubSettings?.original?.data?.settings?.header_description?.split("\n").map((text, index) => (
                                                            <span key={index}>{text}<br /></span>
                                                        ))}
                                                    </p>
                                                    <button id="learn-more" className="btn" onClick={() => navigate('/rytonclub')} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color }}>Learn More</button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </section>

                            <section id="clubcontainer">
                                <div className="container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="club-banners d-flex justify-content-between align-items-center px-4 py-2" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color }}>
                                        {
                                            <div style={{ marginLeft: '5px' }}>
                                                <div id="bhead" className="head" style={{ textAlign: 'left', color: homeData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                    {homeData?.clubSettings?.original?.data?.club?.club_name}
                                                </div>
                                                <small id="bpre" className="prehead" style={{ textAlign: 'left', alignItems: 'left', color: homeData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                    {homeData?.clubSettings?.original?.data?.club?.tag_line}
                                                </small>
                                            </div>
                                        }

                                        <div className="d-flex gap-2" style={{ marginRight: '5px' }}>
                                            <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: homeData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none' }}>
                                                <i className="fab fa-facebook-f"></i>
                                            </a>
                                            <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: homeData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none' }}>
                                                <i className="fab fa-instagram"></i>
                                            </a>

                                            <a href="#" target="_blank" rel="noopener noreferrer" className="icon-circles" style={{ color: homeData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, textDecoration: 'none' }}>
                                                <span className="flickr-dots icon-circles" style={{ fontWeight: 'bold' }}><i className="fa fa-circle" aria-hidden="true"></i><i className="fa fa-circle" aria-hidden="true"></i></span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="galcontainer">
                                <div className="container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div style={{ height: 'auto', border: 'none', backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color }}>
                                        <div id="cl" className="d-flex justify-content-between align-items-end mb-3" style={{ marginRight: '5px' }}>
                                            <div style={{ alignItems: 'flex-end' }}>
                                                <h5 id="clubheading" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '15px' }}>Club Galleries</h5>
                                                <p id="clubsub" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                    A preview of galleries made up of amazing photographs from club members
                                                </p>
                                            </div>

                                            <button id="club-gallery" className="btn" onClick={() => navigate('/rytongal/club')} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                View All Club Galleries
                                            </button>
                                        </div>
                                        <div className="home-clubpics">
                                            {homeData?.clubGalleries?.original?.data?.map((gallery, index) => (
                                                <div key={gallery.id} className={`home-clubpics-item ${getPositionClass(index, homeData?.clubGalleries?.original?.data?.length || 0)}`}>
                                                    <img src={gallery.photos?.[0]?.thumb_url} alt={gallery.gallery_name} style={{ objectFit: "cover", objectPosition: "top", }} />
                                                    <div className={`home-clubpics-info ${getPositionClass(index, homeData?.clubGalleries?.original?.data?.length || 0)}`} style={{ backgroundColor: hexToRgba(homeData?.clubSettings?.original?.data?.settings?.primary_color, 0.7), }} >
                                                        <span style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, }} >
                                                            {gallery.gallery_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="eventcontainer">
                                <div className="container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="events" id="events" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, width: '1820px' }}>
                                        <h5 id="clubheading" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>Events & Competitions</h5>
                                        <h6 id="clubsub" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, paddingTop: '6px' }}>Latest and upcoming events and competitions on the club calendar</h6>
                                        <div className="upcoming-sections" style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div className="cardddd d-flex flex-column" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.secondary_color, padding: '20px' }}>
                                                <h5 className="head" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Upcoming Events</h5>
                                                {homeData?.upcomingEvents?.length > 0 ? (
                                                    <>
                                                        {homeData.upcomingEvents.map((event) => (
                                                            <div className="event-list">
                                                                <div className="home-event-item" style={{ marginBottom: '10px' }}>
                                                                    <img className="img-fluid home-event-img" src={event.featured_thumb_url} alt="Event" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color }} />


                                                                    <div className="event-details">
                                                                        <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <span id="ename" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>{event.name}</span>
                                                                            <span id="espeaker" style={{ color: homeData?.clubSettings?.original?.data?.settings?.primary_color }}>Speaker:{" " + event.speaker}</span>
                                                                        </div>

                                                                        <div className="galtext" id="edate">
                                                                            <small className="galtext" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>{formatDate(event.event_date)}</small><br />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="button-group mt-auto">
                                                            <button className="btn btn-sm" id="view-all" onClick={() => navigate('/rytonevent')} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color }}>
                                                                View All
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '250px', color: homeData?.clubSettings?.original?.data?.settings?.primary_color }}>
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

                                            <div className="cardddd d-flex flex-column" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.secondary_color, padding: '20px' }}>
                                                <h5 className="head" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Upcoming Competitions</h5>
                                                {homeData?.upcomingCompetitions?.length > 0 ? (
                                                    <>
                                                        {homeData.upcomingCompetitions.map((competition) => (
                                                            <div key={competition.id} className="event-list">
                                                                <div className="home-event-item" style={{ marginBottom: "10px" }}>
                                                                    <img className="img-fluid home-event-img" src={competition.featured_thumb_url} alt="Comp" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color, }} />

                                                                    <div className="event-details">
                                                                        <div className="event-info" style={{ display: "flex", flexDirection: "column" }} >
                                                                            <span id="ename" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, }} >
                                                                                {competition.name}
                                                                            </span>
                                                                            <span id="espeaker" style={{ color: homeData?.clubSettings?.original?.data?.settings?.primary_color, }} >
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
                                                                            <small className="galtext" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, }} >
                                                                                {formatDate(competition.start_date)}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="button-group mt-auto">
                                                            <button id="view-all" className="btn btn-sm" onClick={() => navigate('/rytoncomp')} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color, }} >
                                                                View All
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "250px", color: homeData?.clubSettings?.original?.data?.settings?.primary_color, }} >
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

                            <section id="membercontainer">
                                <div className="container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div id="gal" style={{ marginBottom: '10px', backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color }}>
                                        <div id="cl" className="d-flex justify-content-between align-items-end mb-3" style={{ marginRight: '0', paddingTop: '20px' }}>
                                            <div>
                                                <h5 id="clubheading" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '15px' }}>Member Galleries</h5>
                                                <p id="clubsub" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>A preview of galleries uploaded by our amazing photographers from the club</p>
                                            </div>

                                            <button id="member-gallery" className="btn" onClick={() => navigate('/rytongal/member')} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                View All Member Galleries
                                            </button>
                                        </div>

                                        <div className="upcoming-section" style={{ display: 'flex' }}>
                                            <div className="card" style={{ height: 'auto', border: 'none', marginTop: '-1px', paddingBottom: '0px', backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, margin: '0px' }}>
                                                <div className="pics" >
                                                    {validMembers.map((member, index) => (
                                                        <div key={member.id} className={`pics-items ${getPositionClass(index, validMembers.length)}`} >
                                                            <img src={member?.galleries?.[0]?.photos?.[0]?.thumb_url} alt={member.username} style={{ objectFit: "cover", objectPosition: "top", }} />
                                                            <div className={`pics-infos ${getPositionClass(index, validMembers.length)}`} style={{ backgroundColor: hexToRgba(homeData?.clubSettings?.original?.data?.settings?.primary_color, 0.7), }} >
                                                                <div style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, }} >
                                                                    {member?.galleries?.[0]?.gallery_name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="lcardddd" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, backgroundColor: hexToRgba(homeData?.clubSettings?.original?.data?.settings?.secondary_color, 0.4) }}>
                                                <h5 className="head" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>Latest Members</h5>
                                                <div className="row" style={{ paddingTop: '30px' }}>
                                                    {
                                                        homeData?.latestMembers?.members?.slice(0, 6).map((member) => (
                                                            <div className="col-6" style={{ marginBottom: '20px' }}>
                                                                <div className="home-event-items text-center" style={{ gap: '20px' }}>
                                                                    <img className="img-fluid home-event-img" src={member.profile_image_url} alt={member.first_name} style={{ width: '50px', height: '50px', borderRadius: '7px', objectFit: 'cover', objectPosition: 'top', backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color }} />

                                                                    <div className="memtext" id="memname" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                        <span> {member.first_name + " " + member.last_name} </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="latest-interaction" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                <div className="container" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.secondary_color, maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <h5 id="clubheading" className="heading" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '12px' }}>Latest interactions</h5>
                                    <h6 id="clubsub" className="subhead" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>A preview of comments and reactions on the photos other posts on the club website</h6>
                                    <div className="row" style={{ marginTop: '30px' }} id="laint">
                                        <div className="col-12 col-md-6 mb-4">
                                            <div className="card home-comments-card shadow-sm" style={{ height: '330px', borderRadius: '10px', backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, margin: '0px' }}>
                                                <div className="card-header border-0" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                    <h5 className="mb-0" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, paddingLeft: '-25px' }}>Recent Comments</h5>
                                                </div>

                                                <div className="card-body overflow-auto" style={{ maxHeight: '360px', marginLeft: '-21px', padding: '5px' }}>
                                                    {
                                                        homeData?.latestInteractions?.map((interaction) => (
                                                            <div className="home-event-item d-flex" style={{ padding: '0px 35px', gap: '30px', marginBottom: '20px' }}>
                                                                <img src={interaction.images.thumb_url} alt="Interaction Image" className="img-fluid comimg" />

                                                                <div className="event-details d-flex justify-content-between align-items-start">
                                                                    <div className="event-info">
                                                                        <div className="d-flex align-items-center">
                                                                            <p id="comtext" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                                <strong>
                                                                                    {interaction.uploaded_by.username}
                                                                                </strong>
                                                                                {interaction.comments?.[0]?.comment || "No comments yet"}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <a href="#" id="comreply" className="small me-3" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                                Reply
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                    <div className="galtext ms-3">
                                                                        <span className="small" id="comdate" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                            {timeAgo(interaction.comments?.[0]?.created_at)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="card home-comments-cards shadow-sm p-4" style={{ marginTop: '0px', borderRadius: '10px', backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                <div className="card-header border-0" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                    <h5 className="mb-0" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, paddingLeft: '-25px' }}>Recent Likes</h5>
                                                </div>

                                                <div className="card-body">
                                                    <div className="interaction-grid">
                                                        {
                                                            homeData?.latestInteractions?.slice(0, 10)?.map((interaction) => (
                                                                <div className="interaction-item">
                                                                    <div className="like-card text-center position-relative">
                                                                        <img src={interaction.images.thumb_url} className="img-fluid" id="likeimg" alt="User" />
                                                                        <span className="heart-icon" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color, color: homeData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                            <img src={heart} alt="icon" style={{ width: '14px', height: '13px' }} />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="newscontainer">
                                <div className="container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="events d-flex justify-content-between align-items-end mb-3" id="cl" style={{ marginRight: '0', backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color }}>
                                        <div>
                                            <h5 id="clubheading" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '15px' }}>Latest Updates</h5>
                                            <p id="clubsub" className="subhead" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>Latest results from our camera club competitions, and news posted on our website</p>
                                        </div>

                                        <button id="view-results" className="btn" onClick={() => navigate('/rytoncomp/results')} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color }}>
                                            View All Results
                                        </button>
                                    </div>
                                    <div className="upcoming-sectionss" style={{ display: 'flex' }}>
                                        <div className="ncardddd d-flex flex-column" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                            <h5 className="head" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>Latest News</h5>
                                            {
                                                homeData?.clubNews?.length > 0 ? (
                                                    <>
                                                        {homeData.clubNews.slice(0, 3).map((news) => (
                                                            <div key={news.id} className="event-list" style={{ paddingTop: "20px" }} >
                                                                <div className="home-event-item" style={{ marginBottom: "10px" }}>
                                                                    <img className="img-fluid home-event-img" src={news.featured_image_thumb} alt="News" />

                                                                    <div className="event-details">
                                                                        <span className="prehead" id="pname" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: "600", }} >
                                                                            {news.title}
                                                                        </span>

                                                                        <div className="galtext" id="edate" style={{ marginBottom: '0' }}>
                                                                            <small className="galtext" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, }} >
                                                                                {formatDate(news.created_at)}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="button-group mt-auto">
                                                            <button id="view-all" className="btn btn-sm" onClick={() => navigate('/rytonnews')} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color, }} >
                                                                View All
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "250px", color: homeData?.clubSettings?.original?.data?.settings?.primary_color, }} >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" >
                                                            <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>

                                                        <span>No news found</span>

                                                        <span style={{ textAlign: "center", width: "420px" }}>
                                                            There are currently no news scheduled. Check back soon for updates!
                                                        </span>
                                                    </div>
                                                )
                                            }

                                        </div>

                                        <div className="card" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, width: '60%', height: 'auto', border: 'none', borderRadius: '10px', marginTop: '13px' }}>
                                            <div className="resultpics" style={{ marginTop: '-12px'}}>
                                                {resultData.map((result, index) => (
                                                    <div key={result.id || index} className={`resultpics-items ${getPositionClass(index, resultData.length)}`} >
                                                        <img src={result?.competition_members?.[0]?.entries?.[0]?.entry_image_thumb} alt={result.name} style={{ width: '100%', height: '195px', objectFit: "cover", objectPosition: "top", }} />
                                                        <div className={`resultpics-infos ${getPositionClass(index, resultData.length)}`} style={{ backgroundColor: hexToRgba(homeData?.clubSettings?.original?.data?.settings?.primary_color, 0.7), }} >
                                                            <div style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, }} >
                                                                {result?.competition_members?.[0]?.entries?.[0]?.entry_image_title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="joincontainer">
                                <div className="container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', width: '1820px' }}>
                                    <div id="cls" className="join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="clubheading" className="heading" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="clubsub" className="head" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>

                                        <button className="btn" id="join-club" onClick={() => navigate('/rytonclub')} style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px', padding: '0 25px', margin: '0 auto', flexDirection: 'column' }}>
                                    <div className="footer-section" style={{ paddingTop: '30px' }}>
                                        <h5 id="footer-heading" className="heading footer-heading" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}> {homeData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="footer-description" className="head footer-description mx-auto" style={{ maxWidth: '1145px', color: homeData?.clubSettings?.original?.data?.settings?.text_color }}> {homeData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container footer-section">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="contact-col">
                                                <h5 className="head mb-4" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>

                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}> {homeData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="icon-circles ms-3" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>

                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}> {homeData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="icon-circles ms-3" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>

                                                <div className="contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="cla">
                                                    <p className="footer-text mb-0" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}> {homeData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="icon-circles ms-3" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={homeData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="social-col">
                                                <h5 className="head mb-4 text-md-start text-center" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="footer-link" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {homeData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="footer-link" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {homeData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: homeData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text fw-bold mb-1" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="footer-link" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {homeData?.clubSettings?.original?.data?.settings?.flickr_link}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="home-site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – {homeData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: homeData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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

export default HomeRoute