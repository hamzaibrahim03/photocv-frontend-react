import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import HeaderRoute from '../club_admin/HeaderRoute';
import NavigationRoute from '../club_admin/NavigationRoute';
import Calendar from '../Ryton/extra/CalendarRyton';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
function PhotographerEvent() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [recentComments, setRecentComments] = useState([]);
    const [totalEventCount, setTotalEventCount] = useState(0);
    const [daysUntilNextEvent, setDaysUntilNextEvent] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const loadEvents = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get('/member-admin/events');
                const eventsPayload = response.data?.events?.original?.data?.original;
                setEvents(Array.isArray(eventsPayload?.dataTable?.data) ? eventsPayload.dataTable.data : []);
                setRecentComments(Array.isArray(eventsPayload?.recentComments) ? eventsPayload.recentComments : []);
                setTotalEventCount(eventsPayload?.totalEventCount ?? 0);
                setDaysUntilNextEvent(eventsPayload?.daysUntilNextEvent ?? null);
            } catch (e) {
                console.error('Error loading events:', e);
                setEvents([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadEvents();
    }, []);
    const filteredEvents = useMemo(() => {
        let filtered = events;
        if (search.trim()) {
            filtered = filtered.filter(e => e.name?.toLowerCase().includes(search.toLowerCase()));
        }
        const start = (currentPage - 1) * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [events, search, currentPage]);
    const totalPages = useMemo(() => {
        const count = events.filter(e => e.name?.toLowerCase().includes(search.toLowerCase())).length;
        return Math.max(Math.ceil(count / rowsPerPage), 1);
    }, [events, search]);
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(p => p + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(p => p - 1);
    };
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return isNaN(d) ? '' : d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    };
    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return isNaN(d) ? '' : d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    };
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Events" />
                        <div className="content">
                            <div className="dashboard-card">
                                <div className="profile-card">
                                    <div className="profile-left">
                                        <div className="profile-info">
                                            <small className="greeting text-muted" style={{ fontSize: '18px' }}>Planned and regular club events</small>
                                            <h2 className="name" style={{ fontSize: '30px' }}>My Club Events</h2>
                                        </div>
                                    </div>
                                    <div className="search-bar position-relative" style={{ width: '250px' }}>
                                        <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} type="search" className="form-control" placeholder="Search..." />
                                    </div>
                                </div>
                                <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                    <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                        <small className="ca-details" style={{ fontSize: '20px' }}>Events</small>
                                        <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{totalEventCount}</h3>
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
                            <div className="row mt-4">
                                <div className="col-md-8">
                                    <div className="container px-0">
                                        {filteredEvents.length > 0 ? (
                                            <div>
                                                {filteredEvents.map(event => (
                                                    <div key={event.id} className="custom-card bg-white shadow-sm rounded p-4 mb-4 border border-light">
                                                        <div className="d-flex gap-4">
                                                            <img src={event.featured_image_url || '/placeholder.jpg'} alt="Event" className="rounded" style={{ width: '200px', height: '150px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                            <div className="flex-grow-1">
                                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                                    <h5 className="m-0 head">{event.name || 'Untitled Event'}</h5>
                                                                    <div className="icon-container text-muted d-flex gap-3">
                                                                        <i className="fa-regular fa-comment"></i>
                                                                        <i className="fa-solid fa-camera"></i>
                                                                        <i className="fa-regular fa-calendar"></i>
                                                                    </div>
                                                                </div>
                                                                <p className="text-danger mb-2" style={{ fontWeight: '500' }}>
                                                                    {formatDate(event.event_date) || 'Date Not Available'}
                                                                </p>
                                                                <p className="text-muted small mb-4" dangerouslySetInnerHTML={{ __html: event.description || 'No description provided.' }} />
                                                                <div className="d-flex gap-2">
                                                                    <button className="btn text-white px-4" style={{ backgroundColor: '#99816b' }} onClick={() => navigate(`/my-events/${event.id}`)}>View</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <nav className="mt-5">
                                                    <ul className="pagination justify-content-center">
                                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                            <button className="page-link text-dark shadow-none" onClick={prevPage}>Previous</button>
                                                        </li>
                                                        <li className="page-item disabled">
                                                            <span className="page-link text-muted">Page {currentPage} of {totalPages}</span>
                                                        </li>
                                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                            <button className="page-link text-dark shadow-none" onClick={nextPage}>Next</button>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        ) : (
                                            <div className="text-center py-5 text-muted bg-white rounded shadow-sm">No events found.</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <section className="d-flex flex-column gap-4">
                                        <div className="bg-white rounded shadow-sm">
                                            <Calendar />
                                        </div>
                                        <div className="bg-white rounded shadow-sm p-4 d-flex flex-column min-vh-25">
                                            <h5 className="head mb-4">Recent Comments</h5>
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
                                                            <small className="text-muted">{comment.event_name}</small>
                                                        </div>
                                                        <div className="col-5 text-end text-muted">
                                                            <small className="d-block">{formatDate(comment.created_at)}</small>
                                                            <small className="d-block">{formatTime(comment.created_at)}</small>
                                                        </div>
                                                    </div>
                                                ))}
                                                {recentComments.length === 0 && <span className="text-muted small">No comments.</span>}
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default PhotographerEvent;
