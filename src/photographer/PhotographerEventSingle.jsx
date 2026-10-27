import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
import dayjs from 'dayjs';
import Calendar from '../Ryton/extra/CalendarRyton';
function PhotographerEventSingle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [memberCount, setMemberCount] = useState(0);
    const [daysUntilNextEvent, setDaysUntilNextEvent] = useState(null);
    const [recentComments, setRecentComments] = useState([]);
    const [moreEvents, setMoreEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [, setError] = useState(null);
    useEffect(() => {
        const loadEvent = async () => {
            if (!id) {
                setError('Event id is missing from the route.');
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setError(null);
                const response = await apiClient.get(`/member-admin/event/${id}`);
                const payload = response.data?.data || {};
                setEvent(payload.event || null);
                setMemberCount(payload.memberCount || 0);
                setDaysUntilNextEvent(payload.daysUntilNextEvent ?? null);
                setRecentComments(Array.isArray(payload.recentComments) ? payload.recentComments : []);
            } catch (err) {
                console.error('Error loading event:', err);
                setError(err.response?.data?.message || 'Unable to load event.');
                setEvent(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadEvent();
    }, [id]);
    useEffect(() => {
        const loadMoreEvents = async () => {
            try {
                const response = await apiClient.get('/member-admin/events');
                const eventsPayload = response.data?.events?.original?.data?.original;
                const list = Array.isArray(eventsPayload?.dataTable?.data) ? eventsPayload.dataTable.data : [];
                setMoreEvents(list.filter((e) => String(e.id) !== String(id)).slice(0, 4));
            } catch (err) {
                console.error('Error loading more events:', err);
                setMoreEvents([]);
            }
        };
        loadMoreEvents();
    }, [id]);
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
        <>
            <Loader show={isLoading} />
            {!isLoading && !event && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Events" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="card bg-white border-0 rounded shadow-sm p-5 mt-4 text-center text-muted">
                                    Event not found.
                                    <div className="mt-3"><button className="btn" id="edit" onClick={() => navigate('/my-events')}>Back to Events</button></div>
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
            {!isLoading && event && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Events" />
                    <div className="content">
                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card" id="cl">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting">Viewing Event</small>
                                                <h2 className="name">{event.name}</h2>
                                                <small className="role">{formattedStartDate}</small>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                        <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                            <small className="ca-details" style={{ fontSize: '20px' }}>Club Members</small>
                                            <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{memberCount}</h3>
                                        </div>
                                        <div className="event-cards text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                            <small className="ca-details" style={{ fontSize: '20px' }}>Next Event</small>
                                            <div className="row mt-4 align-items-center">
                                                <div className="col-md-5">
                                                    <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>
                                                        {daysUntilNextEvent !== null ? Math.max(Math.round(daysUntilNextEvent), 0) : '-'}
                                                    </h3>
                                                </div>
                                                <div className="days col-md-7 text-start">
                                                    <span>days to go</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="card bg-white p-4 rounded shadow-sm border border-light">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <img src={event.featured_image_url || '/placeholder.jpg'} alt={event.name} className="img-fluid rounded w-100" style={{ maxHeight: '200px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
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
                                                    <p className="text-secondary mb-3" dangerouslySetInnerHTML={{ __html: event.description || '' }} style={{ width: '550px' }} />
                                                </div>
                                                <div className="col-12">
                                                    <hr className="my-3 text-muted" />
                                                    <div className="row mb-2">
                                                        <div className="col-6"><h5 className="text-muted fs-6">Event Duration</h5></div>
                                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.duration || 'N/A'}</h5></div>
                                                    </div>
                                                    <hr className="my-3 text-light" />
                                                    <div className="row mb-2">
                                                        <div className="col-6"><h5 className="text-muted fs-6">Event Speaker</h5></div>
                                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.speaker || 'N/A'}</h5></div>
                                                    </div>
                                                    <hr className="my-3 text-light" />
                                                    <div className="row mb-2">
                                                        <div className="col-6"><h5 className="text-muted fs-6">Event Speaker Club</h5></div>
                                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.speaker_club || 'N/A'}</h5></div>
                                                    </div>
                                                    <hr className="my-3 text-light" />
                                                    <div className="row mb-2">
                                                        <div className="col-6"><h5 className="text-muted fs-6">Event Speaker Qualifications</h5></div>
                                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.speaker_qualification || 'N/A'}</h5></div>
                                                    </div>
                                                    <hr className="my-3 text-light" />
                                                    <div className="row mb-2">
                                                        <div className="col-6"><h5 className="text-muted fs-6">Event Status</h5></div>
                                                        <div className="col-6"><h5 className="fs-6 fw-normal text-capitalize">{event.status || 'N/A'}</h5></div>
                                                    </div>
                                                    <hr className="my-3 text-light" />
                                                    <div className="row mb-2">
                                                        <div className="col-6"><h5 className="text-muted fs-6">Gear Required</h5></div>
                                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.required_gear || 'N/A'}</h5></div>
                                                    </div>
                                                    <hr className="my-3 text-light" />
                                                    <div className="row mb-2">
                                                        <div className="col-6"><h5 className="text-muted fs-6">Tags / Keywords</h5></div>
                                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.tags_keywords || 'N/A'}</h5></div>
                                                    </div>
                                                    <hr className="my-3 text-light" />
                                                    <div className="row mb-2">
                                                        <div className="col-6"><h5 className="text-muted fs-6">Link to related page</h5></div>
                                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.url ? <a href={event.url} target="_blank" rel="noopener noreferrer">{event.url}</a> : 'N/A'}</h5></div>
                                                    </div>
                                                    <hr className="my-3 text-light" />
                                                    <div className="row mb-2">
                                                        <div className="col-6"><h5 className="text-muted fs-6">RSVP Detail</h5></div>
                                                        <div className="col-6"><h5 className="fs-6 fw-normal">{event.rsvp_detail || 'N/A'}</h5></div>
                                                    </div>
                                                    <div className="row mt-4 mb-4">
                                                        <div className="col-6">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <input type="checkbox" id="dropbox" checked={Boolean(event.enable_dropbox_upload)} readOnly />
                                                                <label htmlFor="dropbox" className="fs-6 fw-normal">Dropbox upload</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn" id="e-view" onClick={() => navigate(-1)}>Back</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <section className="d-flex flex-column gap-4">
                                            <div className="bg-white rounded shadow-sm">
                                                <Calendar />
                                            </div>
                                            <div className="bg-white rounded shadow-sm p-4 d-flex flex-column" style={{ minHeight: '300px' }}>
                                                <h5 className="head mb-5">Recent Comments</h5>
                                                <div className="d-flex flex-column gap-3 mb-4">
                                                    {recentComments.slice(0, 4).map(comment => (
                                                        <div key={comment.comment_id} className="row align-items-center mb-3">
                                                            <div className="col-2">
                                                                <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '36px', height: '36px' }}>
                                                                    <i className="fa-regular fa-user"></i>
                                                                </div>
                                                            </div>
                                                            <div className="col-5">
                                                                <strong className="small d-block">{comment.user}</strong>
                                                                <p className="text-secondary small m-0">{comment.comment}</p>
                                                            </div>
                                                            <div className="col-5 text-end text-muted">
                                                                <small className="d-block">{formatDate(comment.created_at)}</small>
                                                                <small className="d-block">{formatTime(comment.created_at)}</small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {recentComments.length === 0 && <span className="text-muted small">No comments.</span>}
                                                </div>
                                                <div className="mt-auto d-flex gap-2">
                                                    <button className="btn" id="e-view" onClick={() => navigate('/my-events')}>View All</button>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded shadow-sm p-4">
                                                <h5 className="head mb-4">More Events</h5>
                                                {moreEvents.length === 0 && <span className="text-muted small">No other events.</span>}
                                                {moreEvents.map((e) => (
                                                    <div key={e.id} className="row align-items-center mb-3" style={{ cursor: 'pointer' }} onClick={() => navigate(`/my-events/${e.id}`)}>
                                                        <div className="col-2">
                                                            <img src={e.featured_image_url || e.featured_image || '/placeholder.jpg'} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} onError={(ev) => { ev.target.src = '/placeholder.jpg'; }} />
                                                        </div>
                                                        <div className="col-6">
                                                            <strong className="small d-block">{e.name}</strong>
                                                        </div>
                                                        <div className="col-4 text-end text-muted">
                                                            <small className="d-block">{formatDate(e.event_date)}</small>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button className="btn" id="e-view" onClick={() => navigate('/my-events')}>View All</button>
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
        </>
    );
};
export default PhotographerEventSingle;
