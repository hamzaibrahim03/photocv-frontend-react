import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import dayjs from 'dayjs';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import CalendarDashboard from '../React/extra/CalendarRyton';
import MoreEvents from './MoreEvents'; // Ensure this matches actual location
import Pro from './assets/icons/event_list/pro.svg';
import Cal from './assets/icons/event_list/cal.svg';
import Cam from './assets/icons/event_list/cam.svg';
import Mess from './assets/icons/event_list/mess.svg';

const EventSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Replaced Vue Pinia store with local state
    const [events, setEvents] = useState([]);
    const [eventcomments, setEventcomments] = useState([]);
    const [memberCount, setMemberCount] = useState(0);
    const [eventDay, setEventDay] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const event = useMemo(() => events.find(e => e.id == id) || {}, [events, id]);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-GB', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });

    const formatTime = (datetimeStr) => {
        const date = new Date(datetimeStr);
        return date.toLocaleTimeString('en-US', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formattedStartDate = useMemo(() =>
        event?.event_date
            ? dayjs(event.event_date).format('MMMM D, dddd')
            : '', [event]
    );

    useEffect(() => {
        // Mock fetch actions that used to be in the Vue store
        const fetchEventDetails = async () => {
            setIsLoading(true);
            try {
                // In a real scenario, use actual API endpoints
                // fetchEvents() & fetchEventComments() logic here
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEventDetails();
    }, []);

    return (
        <div style={{ backgroundColor: 'white' }}>
            <NavigationRoute />
            <HeaderRoute title="Events" />
            <div className="content" style={{ padding: '0 30px' }}>
                <section>
                    <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                        <div className="dashboard-card d-flex align-items-center justify-content-between" style={{ padding: '20px 0 40px', gap: '15px' }}>
                            <div className="profile-card d-flex align-items-center justify-content-between shadow-sm p-4 bg-white rounded" style={{ height: '148px', width: '65.8%' }}>
                                <div className="profile-left d-flex align-items-center">
                                    <div className="profile-info">
                                        <small className="greeting text-muted" style={{ fontSize: '16px' }}>Viewing event</small>
                                        <h2 className="name" style={{ fontSize: '30px', fontWeight: '500', color: '#4c4036' }}>{event.name}</h2>
                                        <p className="role" style={{ fontSize: '16px', color: '#cc445e' }}>{formattedStartDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                    <small className="ca-details" style={{ fontSize: '20px' }}>Events</small>
                                    <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{memberCount}</h3>
                                </div>
                                <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                    <small className="ca-details" style={{ fontSize: '20px' }}>Next Event</small>
                                    <div className="row mt-4">
                                        <div className="col-md-5">
                                            <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{String(eventDay).padStart(2, '0')}</h3>
                                        </div>
                                        <div className="days col-md-7 text-start">
                                            <span style={{ fontSize: '16px' }}>days to go</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container" style={{ maxWidth: '1810px', margin: '0 auto', padding: '0 15px' }}>
                        <div className="row">
                            <div className="col-md-8">
                                <section>
                                    <div className="container p-0">
                                        <div id="news">
                                            <div className="news-list">
                                                <div className="custom-card bg-white p-4 rounded mb-4 shadow-sm">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <img src={event.featured_image_url} alt="Meeting" style={{ maxWidth: '300px', width: '300px', height: '250px', objectFit: 'cover' }} />
                                                        </div>
                                                        <div className="col-md-8">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <h5>{event.name}</h5>
                                                                <div className="icon-container ms-3">
                                                                    <img src={Mess} alt="icon" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                                                                    <img src={Cam} alt="icon" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                                                                    <img src={Pro} alt="icon" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                                                                    <img src={Cal} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                </div>
                                                            </div>
                                                            <p className="date rounded">{formattedStartDate}</p>
                                                            <p className="text-secondary" dangerouslySetInnerHTML={{ __html: event.description }}></p>
                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="row">
                                                            <div className="col-md-6"><h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>Event Duration</h5></div>
                                                            <div className="col-md-6"><h5 className="namess" style={{ fontSize: '16px', color: '#4c4036' }}>{event.duration}</h5></div>
                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="row">
                                                            <div className="col-md-6"><h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>Event Speaker</h5></div>
                                                            <div className="col-md-6"><h5 className="namess" style={{ fontSize: '16px', color: '#4c4036' }}>{event.speaker}</h5></div>
                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="row">
                                                            <div className="col-md-6"><h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>Event Speaker Club</h5></div>
                                                            <div className="col-md-6"><h5 className="namess" style={{ fontSize: '16px', color: '#4c4036' }}>{event.speaker_club}</h5></div>
                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="row">
                                                            <div className="col-md-6"><h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>Event Speaker Qualifications</h5></div>
                                                            <div className="col-md-6"><h5 className="namess" style={{ fontSize: '16px', color: '#4c4036' }}>{event.speaker_qualification}</h5></div>
                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="row">
                                                            <div className="col-md-6"><h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>Event Status</h5></div>
                                                            <div className="col-md-6"><h5 className="namess" style={{ fontSize: '16px', color: '#4c4036' }}>{event.status}</h5></div>
                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="row">
                                                            <div className="col-md-6"><h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>Gear Required</h5></div>
                                                            <div className="col-md-6"><h5 className="namess" style={{ fontSize: '16px', color: '#4c4036' }}>{event.required_gear}</h5></div>
                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="row">
                                                            <div className="col-md-6"><h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>Tags / Keywords Speaker</h5></div>
                                                            <div className="col-md-6"><h5 className="namess" style={{ fontSize: '16px', color: '#4c4036' }}>{event.tags_keywords}</h5></div>
                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="row">
                                                            <div className="col-md-6"><h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>Link to related page</h5></div>
                                                            <div className="col-md-6"><h5 className="namess" style={{ fontSize: '16px', color: '#4c4036' }}>{event.url}</h5></div>
                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="row">
                                                            <div className="col-md-6"><h5 className="role" style={{ fontSize: '16px', color: '#cc445e' }}>RSVP Detail</h5></div>
                                                            <div className="col-md-6"><h5 className="namess" style={{ fontSize: '16px', color: '#4c4036' }}>{event.rsvp_detail}</h5></div>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <div className="col-md-6">
                                                                <h5 className="namess" style={{ fontSize: '16px', color: '#4c4036' }}>
                                                                    <input type="checkbox" className="me-2" /> Dropbox upload
                                                                </h5>
                                                            </div>
                                                        </div>
                                                        <div className="button-group mt-4">
                                                            <button className="btn text-white me-3" style={{ backgroundColor: '#99816b', width: '120px' }} onClick={() => navigate(-1)}>Back</button>
                                                            <Link to={`/events_add/${event.id}`}>
                                                                <button className="btn text-white" style={{ backgroundColor: '#4c4036', width: '120px' }}>Edit</button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="col-md-4">
                                <section>
                                    <div className="container p-0" id="right">
                                        <div className="bg-white rounded p-3 mb-4 shadow-sm h-auto">
                                            {/* CalendarDashboard logic mock */}
                                            <CalendarDashboard />
                                        </div>
                                        <div id="news">
                                            <div className="bg-white rounded p-4 d-flex flex-column shadow-sm mb-4">
                                                <h5 className="head font-weight-bold" style={{ fontSize: '24px' }}>Recent Comments</h5>

                                                {eventcomments.slice(0, 1).map((c) => (
                                                    <div key={c.id} className="event-list mt-3">
                                                        {c.comments && c.comments.map((comment) => (
                                                            <div key={comment.id} className="event-item d-flex align-items-start mb-3 gap-3">
                                                                <div className="col-md-2">
                                                                    {comment.user?.profile_image_url ? (
                                                                        <img src={comment.user?.profile_image_url} alt="Com" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />
                                                                    ) : (
                                                                        <div className="fallback-box d-flex justify-content-center align-items-center bg-light" style={{ width: '50px', height: '50px', borderRadius: '5px' }}>
                                                                            <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="col-md-5">
                                                                    <p className="text-secondary m-0" style={{ fontSize: '14px' }}>{comment.comment}</p>
                                                                </div>
                                                                <div className="col-md-5 text-end">
                                                                    <small className="event-date d-block" style={{ fontSize: '12px' }}>{formatDate(comment.created_at)}</small>
                                                                    <small className="event-time-details text-muted" style={{ fontSize: '12px' }}>{formatTime(comment.created_at)}</small>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}

                                                <div className="button-group mt-auto pt-3">
                                                    <Link to="/notices">
                                                        <button className="btn text-white me-2" style={{ backgroundColor: '#99816b' }}>View All</button>
                                                    </Link>
                                                    <Link to="/notice_single">
                                                        <button className="btn text-white" style={{ backgroundColor: '#4c4036' }}>Add New</button>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Mock for MoreEvents component */}
                                            {/* <MoreEvents /> */}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EventSingle;
