import { useParams } from "react-router";
import Navbar from "./extra/Navbar";
import Loader from './extra/LoaderAll';
import Calendar from './extra/CalendarRyton'
import "./assets/css/rytonstyle.css"
import Event from "./assets/icons/navigation/events.svg"
import Competition from "./assets/icons/navigation/competition.svg"
import { useState, useEffect } from "react";
import he from "he";
import { NavLink, useNavigate } from "react-router";
function EventSinglePublic() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sineventData, setsineventData] = useState([]);
    const [sineventsList, setsinEventsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    useEffect(() => {
        getsineventData(id);
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
            fetchSearchedEvents(search);
        } else {
            setsinEventsList(
                sineventData?.events?.original?.data?.original?.data ||
                []
            );
        }
    }, [search]);
    async function getsineventData(id) {
        const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/event/${id}`;
        const response = await fetch(url);
        const data = await response.json();
        setsineventData(data.data);
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        const day = date.getDate();
        const month = date.toLocaleString("en-GB", { month: "long" });
        const year = date.getFullYear();
        const suffix = day % 10 === 1 && day !== 11 ? "st" :
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
    console.log(sineventData?.event?.original?.data)
    return (
        <>
            <div style={{ backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.background_color, fontFamily: sineventData?.clubSettings?.original?.data?.settings?.fonts }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <div>
                        <nav className="navbar navbar-expand-lg custom-navbar shadow-sm" style={{ position: 'sticky', top: '0', zIndex: '5001', backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.background_color, height: '100px' }}>
                            <Navbar />
                        </nav>
                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="hero-section" style={{ backgroundImage: `url(${sineventData?.clubSettings?.original?.data?.settings?.cover_images?.[2]?.image_medium_url})` }}>
                                        <div className="hero-overlay">
                                            <div key={sineventData?.event?.original?.data?.id}>
                                                <div className="events-card">
                                                    <p className="date">
                                                        Upcoming Event | {formatDate(sineventData?.event?.original?.data?.event_date)}
                                                    </p>
                                                    <h5 style={{ color: sineventData?.clubSettings?.original?.data?.settings?.background_color, marginBottom: '20px', width: '1000px' }}>
                                                        {sineventData?.event?.original?.data?.name}
                                                    </h5>
                                                    <p className="text-secondaryy">
                                                        {sineventData?.event?.original?.data?.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="button-group mt-3 d-flex">
                                                <button onClick={() => navigate(`/event/${sineventData?.event?.original?.data?.id}`)} className="btn me-2" id="view" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="contents">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }} id="heads">
                                    <div className="events-header">
                                        <nav className="breadcrumb">
                                            <NavLink to="/rytonevent" className="events-title breadcrumb-item" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color, }}>
                                                Events
                                            </NavLink>
                                            <span className="events-title breadcrumb-separator" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color, }}>
                                                &gt;
                                            </span>
                                            <span className="events-title breadcrumb-item active">
                                                {sineventData?.event?.original?.data?.name}
                                            </span>
                                        </nav>
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
                                                    <div className="card" style={{ border: 'none' }}>
                                                        <img src={sineventData?.event?.original?.data?.featured_image_url} alt={sineventData?.event?.original?.data?.name} style={{ maxWidth: '850px', marginBottom: '50px', width: '850px', height: '350px', borderRadius: '8px' }} />
                                                        <div className="d-flex justify-content-between" style={{ width: '850px' }}>
                                                            <h5 className="head" style={{ fontFamily: 'Inter', fontWeight: 500, fontStyle: "Medium", fontSize: "28px", lineHeight: "100%", letterSpacing: "0%", color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>{sineventData?.event?.original?.data?.name}</h5>
                                                            {sineventData?.event?.original?.data?.types?.map((t, i) => (
                                                                <div key={t.id || i} className="d-flex align-items-center justify-content-center gap-3" style={{ width: '180px' }}>
                                                                    <img className="head" src={t.icon_url} alt={t.name} style={{ width: "20px", height: "20px" }} />
                                                                    <h5 className="head" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 400, fontSize: "18px", lineHeight: "100%", letterSpacing: "0%", }}>
                                                                        {t.name}
                                                                    </h5>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <p id="edate" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                            {formatDate(sineventData?.event?.original?.data?.event_date)}
                                                        </p>
                                                        <p className="text-secondary" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: "25px", }}>
                                                            {sineventData?.event?.original?.data?.description
                                                                ? he.decode(sineventData.event.original.data.description)
                                                                : ""}
                                                        </p>
                                                        <p className="text-secondary" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: "25px", }}>
                                                            {sineventData?.event?.original?.data?.description
                                                                ? he.decode(sineventData.event.original.data.description)
                                                                : ""}
                                                        </p>
                                                        <p className="text-secondary" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: "25px", }}>
                                                            {sineventData?.event?.original?.data?.description
                                                                ? he.decode(sineventData.event.original.data.description)
                                                                : ""}
                                                        </p>
                                                        <div className="divider4" style={{ marginLeft: '-5px' }}></div>
                                                        <div className="row" id="eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                    Event Duration
                                                                </h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    {sineventData?.event?.original?.data?.duration}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                        <div className="divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                    Event Speaker
                                                                </h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    {sineventData?.event?.original?.data?.speaker}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                        <div className="divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                    Event Speaker Club
                                                                </h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    {sineventData?.event?.original?.data?.speaker_club}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                        <div className="divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                    Event Speaker Qualifications
                                                                </h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    {sineventData?.event?.original?.data?.speaker_qualification}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                        <div className="divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                    Event Status
                                                                </h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    {sineventData?.event?.original?.data?.status}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                        <div className="divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        {sineventData?.event?.original?.data?.status !== "completed" && (
                                                            <>
                                                                <div className="row" id="eventdetails">
                                                                    <div className="col-md-5">
                                                                        <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                            Gear Required
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-7">
                                                                        <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                            {sineventData?.event?.original?.data?.required_gear}
                                                                        </h5>
                                                                    </div>
                                                                </div>
                                                                <div className="divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                            </>
                                                        )}
                                                        <div className="row" id="eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                    Tags / Keywords
                                                                </h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    {sineventData?.event?.original?.data?.tags_keywords}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                        <div className="divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        <div className="row" id="eventdetails">
                                                            <div className="col-md-5">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                                    Link to related page
                                                                </h5>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                                    {sineventData?.event?.original?.data?.url}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                        <div className="divider3" style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginTop: '15px', marginBottom: '15px' }}></div>
                                                        {sineventData?.event?.original?.data?.status !== "completed" && (
                                                            <div className="row" id="eventdetails">
                                                                <div className="col-md-5">
                                                                    <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color, }}>
                                                                        RSVP Details
                                                                    </h5>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <h5 className="clubhead" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color, }}>
                                                                        {sineventData?.event?.original?.data?.rsvp_detail}
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {sineventData?.event?.original?.data?.status === "completed" && (
                                                            <>
                                                                <div className="divider5"></div>
                                                                <div style={{ height: "auto", border: "none", backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.background_color, }}>
                                                                    <div className="d-flex justify-content-between align-items-end mb-3" id="cl">
                                                                        <div>
                                                                            <h5 className="head" style={{ fontSize: '28px', color: sineventData?.clubSettings?.original?.data?.settings?.text_color, marginTop: '0px', marginBottom: '50px', }}>
                                                                                Event Gallery
                                                                            </h5>
                                                                        </div>
                                                                    </div>
                                                                    <div className="event-resultpics">
                                                                        {sineventData?.event?.original?.data?.images?.filter((item) => item.image).map((item, index) => (
                                                                            <div key={item.id || index} className="event-resultpics-items">
                                                                                <img src={item.image_url} alt={`Event ${index + 1}`} style={{ objectFit: "cover", objectPosition: "top", }} />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
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
                                                    <div className="more-card d-flex flex-column" id="eve">
                                                        <h5 className="head">Competitions</h5>
                                                        {sineventData?.competitions?.length > 0 ? (
                                                            <div className="event-list">
                                                                {sineventData.competitions.map((comp) => (
                                                                    <div className="event-item" key={comp.id}>
                                                                        {comp.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={comp.featured_image_url} alt={comp.name} onError={(e) => { e.target.style.display = "none"; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: "flex", flexDirection: "column", }}>
                                                                                <span id="ename">{comp.name}</span>
                                                                                <span id="espeaker" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color, }}>
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
                                                                                <small className="event-date galtext" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.accent_color, }}>
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
                                                    <div className="ryton-season-card">
                                                        <h5 className="head">Seasons</h5>
                                                        {sineventData?.clubSettings?.original?.data?.seasons.length > 0 ? (
                                                            <div className="session-container">
                                                                {sineventData?.clubSettings?.original?.data?.seasons?.map((seas) => (
                                                                    <div key={seas.id} className={`session-card ${seas.status?.toLowerCase()}`} style={{ backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.background_color }}>
                                                                        <div className="session-header">
                                                                            <h3 className="clubhead">
                                                                                {formatedDate(seas.start_date)} - {formatedDate(seas.end_date)}
                                                                            </h3>
                                                                            <span className={`status ${seas.status?.toLowerCase()}`}>
                                                                                <span className="dot" style={{ backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.primary_color }}></span>
                                                                                {seas.status?.charAt(0).toUpperCase() + seas.status?.slice(1).toLowerCase()}
                                                                            </span>
                                                                        </div>
                                                                        <div className="session-body">
                                                                            <div className="ryton-info">
                                                                                <img src={Competition} alt="Competition" style={{ width: "16px", height: "16px" }} />
                                                                                {" "}
                                                                                {seas.competitions_count} Competitions
                                                                            </div>
                                                                            <div className="ryton-info">
                                                                                <img src={Event} alt="Event" style={{ width: "16px", height: "16px" }} />
                                                                                {" "}
                                                                                {seas.events_count} Events
                                                                            </div>
                                                                        </div>
                                                                        <div className="session-footer" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color, }}>
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
                                    <div id="cls" className="join d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4" style={{ backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.secondary_color }}>
                                        <div>
                                            <h5 id="clubheading" className="heading" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                Ready to join the club & work on something exciting?
                                            </h5>
                                            <p id="clubsub" className="head" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color, marginBottom: '0px' }}>
                                                Join the club and let’s create something amazing.
                                            </p>
                                        </div>
                                        <button className="btn" id="join-club" onClick={() => navigate('/rytonclub')} style={{ color: sineventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                            Join Club
                                        </button>
                                    </div>
                                </div>
                            </section>
                            <section id="footer-section">
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div>
                                        <h5 id="footer-heading" className="heading footer-heading" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}> {sineventData?.clubSettings?.original?.data?.settings?.footer_text} </h5>
                                        <p id="footer-description" className="head footer-description mx-auto" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}> {sineventData?.clubSettings?.original?.data?.settings?.footer_description} </p>
                                    </div>
                                </div>
                            </section>
                            <section id="footer-section">
                                <div className="container">
                                    <div className="row align-items-center text-center text-md-start">
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-md-end">
                                            <div className="contact-col">
                                                <h5 className="head mb-4" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Contact</h5>
                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}> {sineventData?.clubSettings?.original?.data?.club.address} </p>
                                                    <div className="icon-circles ms-3" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-map-marker-alt"></i>
                                                    </div>
                                                </div>
                                                <div className="contact-item mb-3 d-flex justify-content-md-end justify-content-center align-items-center" id="cla" style={{ paddingBottom: '10px' }}>
                                                    <p className="footer-text mb-0" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}> {sineventData?.clubSettings?.original?.data?.club.phone} </p>
                                                    <div className="icon-circles ms-3" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-phone"></i>
                                                    </div>
                                                </div>
                                                <div className="contact-item d-flex justify-content-md-end justify-content-center align-items-center" id="cla">
                                                    <p className="footer-text mb-0" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}> {sineventData?.clubSettings?.original?.data?.club.email} </p>
                                                    <div className="icon-circles ms-3" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.accent_color }}>
                                                        <i className="fas fa-envelope"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center" style={{ paddingTop: '-10px' }}>
                                            <img src={sineventData?.clubSettings?.original?.data?.settings?.footer_img_url} alt="sample" className="footer-img" />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="social-col">
                                                <h5 className="head mb-4 text-md-start text-center" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color, paddingBottom: '10px' }}>Social Links</h5>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-facebook-f"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>Facebook</p>
                                                        <a href="fb_link" target="_blank" className="footer-link" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sineventData?.clubSettings?.original?.data?.settings?.fb_link}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <i className="fab fa-instagram"></i>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>Instagram</p>
                                                        <a href="insta_link" target="_blank" className="footer-link" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sineventData?.clubSettings?.original?.data?.settings?.insta_link}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="social-item d-flex align-items-center justify-content-md-start justify-content-center" id="cle">
                                                    <div className="ficon-circles me-3" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.background_color, backgroundColor: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                        <span className="flickr-dots"><i className="fa fa-circle"></i><i className="fa fa-circle"></i></span>
                                                    </div>
                                                    <div id="facebook">
                                                        <p className="footer-text head mb-1" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>Flickr</p>
                                                        <a href="flickr_link" className="footer-link" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color }}>
                                                            {sineventData?.clubSettings?.original?.data?.settings?.flickr_link}
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
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – {sineventData?.clubSettings?.original?.data?.club.club_name} </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank" style={{ color: sineventData?.clubSettings?.original?.data?.settings?.text_color, fontWeight: 'bold' }}>cameraclub.website</a></p>
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
export default EventSinglePublic
