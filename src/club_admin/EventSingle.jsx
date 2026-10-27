import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import dayjs from 'dayjs';
import Calendar from "../Ryton/extra/CalendarRyton";
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";
import Loader from "../Ryton/extra/LoaderAll";
import Pro from './assets/icons/event_list/pro.svg';
import Cal from './assets/icons/event_list/cal.svg';
import Cam from './assets/icons/event_list/cam.svg';
import Mess from './assets/icons/event_list/mess.svg';
function EventSingle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [eventExtra, setEventExtra] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const formatDate = (date) => {
        if (!date) {
            return '';
        }
        return new Date(date).toLocaleDateString('en-GB', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };
    const formatTime = (datetimeStr) => {
        if (!datetimeStr) {
            return '';
        }
        const date = new Date(datetimeStr);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const formattedStartDate = useMemo(() => {
        if (!event?.event_date) {
            return '';
        }
        return dayjs(event.event_date).format('MMMM D, dddd');
    }, [event?.event_date]);
    const getEventData = async () => {
        try {
            setError(null);
            const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/events/${id}`;
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to load event. Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("EVENT API RESPONSE:", data);
            setEvent(data?.data || null);
        } catch (error) {
            console.error("EVENT API ERROR:", error);
            setError(error.message);
        }
    };
    async function getEventExtra() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/event-extras'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setEventExtra(data.data || {});
    };
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    id ? getEventData() : Promise.resolve(),
                    getEventExtra(),
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);
    const eventTypes = event?.types || [];
    const eventTags = event?.tags || [];
    const keywords = event?.tags_keywords ? event.tags_keywords.split(',').map(keyword => keyword.trim()).filter(Boolean) : [];
    if (!isLoading && error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h5>Unable to load event</h5>
                    <p className="mb-0">
                        {error}
                    </p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }
    if (!isLoading && !event) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">
                    Event not found.
                </div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && event && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Events" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px', margin: '0 auto', padding: '0 15px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">
                                                        Viewing event
                                                    </small>
                                                    <h2 className="name">
                                                        {event.name}
                                                    </h2>
                                                    <p className="role">
                                                        {formattedStartDate}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Total Events</small>
                                                <h3 className="number">{eventExtra?.total_events}</h3>
                                            </div>
                                            <div className="event-cards">
                                                {eventExtra?.upcoming_event?.remaining_days !== undefined &&
                                                    eventExtra?.upcoming_event?.remaining_days !== null ? (
                                                    <>
                                                        <small className="ca-details">Next Event</small>
                                                        <div className="row">
                                                            <div className="col-md-5">
                                                                <h3 className="number">{String(eventExtra?.upcoming_event?.remaining_days).padStart(2, '0')}</h3>
                                                            </div>
                                                            <div className="days col-md-7">
                                                                <span>days to go</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                            <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <h3 className="days">
                                                            No upcoming events
                                                        </h3>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px', margin: '0 auto', padding: '0 15px' }}>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <section>
                                                <div className="container">
                                                    <div id="news">
                                                        <div className="news-list">
                                                            <div className="custom-cards" style={{ display: 'flex', borderRadius: '10px', width: '100%', margin: 'auto', flexDirection: 'column', backgroundColor: 'white', padding: '20px' }}>
                                                                <div className="row">
                                                                    <div className="col-md-4">
                                                                        {event.featured_image_url ? (
                                                                            <img src={event.featured_image_url} alt={event.name} style={{ maxWidth: '300px', width: '100%', height: '250px', objectFit: 'cover' }} />
                                                                        ) : (
                                                                            <div className="d-flex justify-content-center align-items-center bg-light" style={{ width: '100%', height: '250px' }}>
                                                                                No Image
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="col-md-8">
                                                                        <div className="d-flex justify-content-space-between" style={{ gap: '300px' }}>
                                                                            <h5>
                                                                                {event.name}
                                                                            </h5>
                                                                            <div className="e-icon-container">
                                                                                <img src={event.types?.[0].icon_url} alt={event.types?.[0].name} style={{ width: "20px", height: "20px" }} />
                                                                            </div>
                                                                        </div>
                                                                        <p className="date rounded">
                                                                            {formattedStartDate}
                                                                        </p>
                                                                        <p className="text-secondary" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                                                                    </div>
                                                                </div>
                                                                <hr className="my-3" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>
                                                                            Event Type
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        {eventTypes.length > 0 ? (
                                                                            eventTypes.map(type => (
                                                                                <div key={type.id} className="d-flex align-items-center mb-2">
                                                                                    <span>{type.name}</span>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <span>
                                                                                N/A
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <hr className="my-3" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>
                                                                            Event Tags
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        {eventTags.length > 0 ? (
                                                                            eventTags.map(tag => (
                                                                                <span key={tag.id} className="badge me-2" style={{ backgroundColor: '#99816b' }}>{tag.name}
                                                                                </span>
                                                                            ))
                                                                        ) : (
                                                                            <span>N/A</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <hr className="my-3" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>
                                                                            Event Duration
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <span style={{ fontSize: '16px', color: '#4c4036' }}>
                                                                            {event.duration || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <hr className="my-3" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>
                                                                            Event Speaker
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <span style={{ fontSize: '16px', color: '#4c4036' }}>
                                                                            {event.speaker || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <hr className="my-3" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>
                                                                            Event Speaker Club
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <span style={{ fontSize: '16px', color: '#4c4036' }}>
                                                                            {event.speaker_club || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <hr className="my-3" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>
                                                                            Event Speaker Qualifications
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <span style={{ fontSize: '16px', color: '#4c4036' }}>
                                                                            {event.speaker_qualification || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <hr className="my-3" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>
                                                                            Event Status
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <span style={{ fontSize: '16px', color: '#4c4036' }}>
                                                                            {event.status || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <hr className="my-3" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>
                                                                            Gear Required
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <span style={{ fontSize: '16px', color: '#4c4036' }}>
                                                                            {event.required_gear || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <hr className="my-3" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>
                                                                            Tags / Keywords
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        {keywords.length > 0 ? (
                                                                            keywords.map((keyword, index) => (
                                                                                <span key={index} className="badge" style={{ backgroundColor: '#99816b' }}>{keyword}
                                                                                </span>
                                                                            ))
                                                                        ) : (
                                                                            <span>N/A</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <hr className="my-3" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>
                                                                            Link to related page
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        {event.url ? (
                                                                            <a href={event.url} target="_blank" rel="noopener noreferrer">
                                                                                {event.url}
                                                                            </a>
                                                                        ) : (
                                                                            'N/A'
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <hr className="my-3" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>
                                                                            RSVP Detail
                                                                        </h5>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <span style={{ fontSize: '16px', color: '#4c4036' }}>
                                                                            {event.rsvp_detail || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="row mt-3">
                                                                    <div className="col-md-6">
                                                                        <label>
                                                                            <input type="checkbox" className="me-2" checked={Boolean(event.enable_dropbox_upload)} readOnly />
                                                                            Dropbox upload
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="button-group mt-4">
                                                                    <button className="btn" id="e-view" onClick={() => navigate(-1)}>
                                                                        Back
                                                                    </button>
                                                                    <button className="btn" id="edit" onClick={() => navigate(`/event/${event.id}/edit`)}>
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                    <div className="calendar-card d-flex flex-column" style={{ width: '100%' }}>
                                                        <Calendar />
                                                    </div>
                                                    <div id="news">
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">Recent Comments</h5>
                                                            {eventExtra?.recent_comments?.slice(0, 5)?.map((event) =>
                                                                event.comments?.map((comment) => (
                                                                    <div className="event-list" style={{ marginBottom: '10px' }} key={comment.id}>
                                                                        <div className="event-item">
                                                                            <div className="col-md-2">
                                                                                {comment.user?.profile_image_url ? (
                                                                                    <img src={comment.user.profile_image_url} alt="Commenter" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                                                ) : (
                                                                                    <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                        <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="col-md-5">
                                                                                <p className="text-secondary">{comment.comment}</p>
                                                                            </div>
                                                                            <div className="col-md-5">
                                                                                <div className="event-time" style={{ textAlign: 'left', width: '90%' }}>
                                                                                    <small className="event-date">{formatDate(comment.created_at)}</small>
                                                                                    <br />
                                                                                    <small className="event-time-details">{formatTime(comment.created_at)}</small>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">More Events</h5>
                                                            {eventExtra?.random_events?.map((event) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }}>
                                                                    <div key={event.id} className="event-item">
                                                                        <div className="col-md-2">
                                                                            {event.featured_image_url ? (
                                                                                <img src={event.featured_image_url} alt="Com" style={{ width: '50px', height: '50px' }} />
                                                                            ) : (
                                                                                <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                    <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <p className="text-secondary">{event.name}</p>
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <div className="event-time" style={{ textAlign: 'left', width: '90%' }}>
                                                                                <small className="event-date">{formatDate(event.event_date)}</small><br />
                                                                                <small className="event-time-details">{formatTime(event.event_date)}</small>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank">cameraclub.website</a></p>
                                </div>
                            </footer>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default EventSingle;