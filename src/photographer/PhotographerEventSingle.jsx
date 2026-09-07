import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin  /NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import CalendarDashboard from '../club_admin/Calendars/CalendarDashboard';
import QuickFilters from '../club_admin/events/QuickFilters';
import MoreEvents from '../club_admin/events/MoreEvents';
import dayjs from 'dayjs';
function PhotographerEventSingle() {
    const navigate = useNavigate();
    const [memberCount, setMemberCount] = useState(50);
    const [eventDay, setEventDay] = useState(12);
    const [eventComments, setEventComments] = useState([]);
    const [event, setEvent] = useState({
        name: 'Zoom Lecture',
        event_date: '2024-04-22T10:00:00Z',
        description: 'A lecture on photography. Detailed overview of techniques.',
        duration: '2 hours',
        speaker: 'John Doe',
        speaker_club: 'Photo Club',
        speaker_qualification: 'Pro',
        status: 'Scheduled',
        required_gear: 'None',
        tags_keywords: 'Zoom, Lecture',
        url: 'http://example.com',
        rsvp_detail: 'RSVP by April 20'
    });
    useEffect(() => {
    }, []);
    const formattedStartDate = useMemo(() => {
        return event?.event_date ? dayjs(event.event_date).format('MMMM D, YYYY h:mm A') : '';
    }, [event]);
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return isNaN(d) ? '' : d.toLocaleDateString();
    };
    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return isNaN(d) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Events" />
            <section className="content" style={{ padding: '0 30px' }}>
                <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                    <QuickFilters greeting="Viewing Event" name="Zoom Lecture" role="April 22, Tuesday" />
                    <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                        <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                            <small className="ca-details" style={{ fontSize: '20px' }}>Events</small>
                            <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{memberCount}</h3>
                        </div>
                        <div className="event-cards text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                            <small className="ca-details" style={{ fontSize: '20px' }}>Next Event</small>
                            <div className="row mt-4 align-items-center">
                                <div className="col-md-5">
                                    <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{eventDay}</h3>
                                </div>
                                <div className="days col-md-7 text-start">
                                    <span>days to go</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-8">
                        <div className="custom-card bg-white p-4 rounded shadow-sm border border-light">
                            <div className="row">
                                <div className="col-md-4">
                                    <img src="/placeholder.jpg" alt="Meeting" className="img-fluid rounded w-100" style={{ maxHeight: '200px', objectFit: 'cover' }} />
                                </div>
                                <div className="col-md-8 px-4">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <h5 className="head m-0">{event.name}</h5>
                                        <div className="icon-container d-flex gap-3 text-muted">
                                            <i className="fas fa-comment-alt cursor-pointer"></i>
                                            <i className="fas fa-camera cursor-pointer"></i>
                                            <i className="fas fa-calendar-alt cursor-pointer"></i>
                                        </div>
                                    </div>
                                    <p className="date text-danger fw-medium mb-3">{formattedStartDate}</p>
                                    <p className="text-secondary mb-3">{event.description}</p>
                                </div>
                                <div className="col-12 mt-3">
                                    <p className="text-secondary">{event.description}</p>
                                    <p className="text-secondary">{event.description}</p>
                                    <p className="text-secondary">{event.description}</p>
                                </div>
                                <div className="col-12">
                                    <hr className="my-3 text-muted" />
                                    <div className="row mb-2">
                                        <div className="col-6"><h5 className="text-muted fs-6">Event Duration</h5></div>
                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.duration}</h5></div>
                                    </div>
                                    <hr className="my-3 text-light" />
                                    <div className="row mb-2">
                                        <div className="col-6"><h5 className="text-muted fs-6">Event Speaker</h5></div>
                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.speaker}</h5></div>
                                    </div>
                                    <hr className="my-3 text-light" />
                                    <div className="row mb-2">
                                        <div className="col-6"><h5 className="text-muted fs-6">Event Speaker Club</h5></div>
                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.speaker_club}</h5></div>
                                    </div>
                                    <hr className="my-3 text-light" />
                                    <div className="row mb-2">
                                        <div className="col-6"><h5 className="text-muted fs-6">Event Speaker Qualifications</h5></div>
                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.speaker_qualification}</h5></div>
                                    </div>
                                    <hr className="my-3 text-light" />
                                    <div className="row mb-2">
                                        <div className="col-6"><h5 className="text-muted fs-6">Event Status</h5></div>
                                        <div className="col-6"><h5 className="fs-6 fw-normal text-capitalize">{event.status}</h5></div>
                                    </div>
                                    <hr className="my-3 text-light" />
                                    <div className="row mb-2">
                                        <div className="col-6"><h5 className="text-muted fs-6">Gear Required</h5></div>
                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.required_gear}</h5></div>
                                    </div>
                                    <hr className="my-3 text-light" />
                                    <div className="row mb-2">
                                        <div className="col-6"><h5 className="text-muted fs-6">Tags / Keywords</h5></div>
                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.tags_keywords}</h5></div>
                                    </div>
                                    <hr className="my-3 text-light" />
                                    <div className="row mb-2">
                                        <div className="col-6"><h5 className="text-muted fs-6">Link to related page</h5></div>
                                        <div className="col-6"><h5 className="fs-6 fw-normal"><a href={event.url}>{event.url}</a></h5></div>
                                    </div>
                                    <hr className="my-3 text-light" />
                                    <div className="row mb-2">
                                        <div className="col-6"><h5 className="text-muted fs-6">RSVP Detail</h5></div>
                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.rsvp_detail}</h5></div>
                                    </div>
                                    <div className="row mt-4 mb-4">
                                        <div className="col-6">
                                            <div className="d-flex align-items-center gap-2">
                                                <input type="checkbox" id="dropbox" />
                                                <label htmlFor="dropbox" className="fs-6 fw-normal">Dropbox upload</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn text-white px-4" style={{ backgroundColor: '#99816b' }} onClick={() => navigate(-1)}>Back</button>
                                        <button className="btn text-white px-4" style={{ backgroundColor: '#4c4036' }}>Edit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <section className="d-flex flex-column gap-4">
                            <div className="bg-white rounded shadow-sm">
                                <CalendarDashboard />
                            </div>
                            <div className="bg-white rounded shadow-sm p-4 d-flex flex-column" style={{ minHeight: '300px' }}>
                                <h5 className="head mb-4">Recent Comments</h5>
                                <div className="d-flex flex-column gap-3 mb-4">
                                    {eventComments.slice(0, 4).map(c => (
                                        <div key={c.id}>
                                            {c.comments?.map(comment => (
                                                <div key={comment.id} className="row align-items-center mb-3">
                                                    <div className="col-2">
                                                        <img src={comment.user?.profile_image_url || '/placeholder.jpg'} alt="Com" className="rounded-circle w-100" />
                                                    </div>
                                                    <div className="col-5">
                                                        <p className="text-secondary small m-0">{comment.comment}</p>
                                                    </div>
                                                    <div className="col-5 text-end text-muted">
                                                        <small className="d-block">{formatDate(comment.created_at)}</small>
                                                        <small className="d-block">{formatTime(comment.created_at)}</small>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    {eventComments.length === 0 && <span className="text-muted small">No comments.</span>}
                                </div>
                                <div className="mt-auto d-flex gap-2">
                                    <button className="btn text-white w-50" style={{ backgroundColor: '#99816b' }} onClick={() => navigate('/notices')}>View All</button>
                                    <button className="btn text-white w-50" style={{ backgroundColor: '#4c4036' }} onClick={() => navigate('/notice_single')}>Add New</button>
                                </div>
                            </div>
                            <MoreEvents />
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default PhotographerEventSingle;
