import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import HeaderRoute from '../club_admin/HeaderRoute';
import NavigationRoute from '../club_admin/NavigationRoute';
import CalendarDashboard from '../club_admin/Calendars/CalendarDashboard';
import MoreEvents from '../club_admin/events/MoreEvents';
import apiClient from '../../api/axios';
function PhotographerEvent() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [eventComments, setEventComments] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;
    const [memberCount, setMemberCount] = useState(50);
    const [eventDay, setEventDay] = useState(12);
    const fetchEvents = async () => {
        try {
            setEvents([
                { id: 1, name: 'Zoom Lecture', event_date: '2024-04-22T10:00:00Z', description: 'A lecture on photography', featured_image: '/placeholder.jpg' }
            ]);
        } catch (e) {
            console.error(e);
        }
    };
    const fetchEventComments = async () => {
        try {
            setEventComments([]);
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => {
        fetchEvents();
        fetchEventComments();
    }, []);
    const fetchSearchedEvents = useCallback(async (query) => {
        try {
        } catch (e) {
            console.error(e);
        }
        setCurrentPage(1);
    }, []);
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.length >= 3) {
                fetchSearchedEvents(search);
            } else if (search.length === 0) {
                fetchEvents();
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, fetchSearchedEvents]);
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
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Events" />
            <section className="content" style={{ padding: '0 30px' }}>
                <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                    <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                        <div className="profile-left">
                            <div className="profile-info">
                                <small className="greeting text-muted" style={{ fontSize: '18px' }}>Planned and regular club competition</small>
                                <h2 className="name m-0 text-dark head" style={{ fontSize: '30px' }}>2024 - 2025 Season</h2>
                            </div>
                        </div>
                        <div className="search-bar position-relative" style={{ width: '250px' }}>
                            <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" className="form-control" placeholder="Search..." />
                        </div>
                        <div className="quick-filter text-end">
                            <strong className="text-dark">Quick Filter</strong>
                            <small className="d-block text-muted" style={{ fontSize: '12px' }}>(Click icons to filter)</small>
                            <div className="d-flex gap-2 justify-content-end text-muted mt-2">
                                <i className="fa-regular fa-calendar" style={{ cursor: 'pointer' }}></i>
                                <i className="fa-solid fa-camera" style={{ cursor: 'pointer' }}></i>
                                <i className="fa-regular fa-newspaper" style={{ cursor: 'pointer' }}></i>
                            </div>
                            <div className="d-flex gap-2 justify-content-end text-muted mt-2">
                                <i className="fa-solid fa-trophy" style={{ cursor: 'pointer' }}></i>
                                <i className="fa-solid fa-circle-info" style={{ cursor: 'pointer' }}></i>
                                <i className="fa-regular fa-bell" style={{ cursor: 'pointer' }}></i>
                            </div>
                        </div>
                    </div>
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
                        <div className="container px-0">
                            {filteredEvents.length > 0 ? (
                                <div>
                                    {filteredEvents.map(event => (
                                        <div key={event.id} className="custom-card bg-white shadow-sm rounded p-4 mb-4 border border-light">
                                            <div className="d-flex gap-4">
                                                <img src={event.featured_image || '/placeholder.jpg'} alt="Event" className="rounded" style={{ width: '200px', height: '150px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
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
                                                    <p className="text-muted small mb-4">{event.description || 'No description provided.'}</p>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn text-white px-4" style={{ backgroundColor: '#99816b' }} onClick={() => navigate('/eventsingle')}>View</button>
                                                        <button className="btn text-white px-4" style={{ backgroundColor: '#4c4036' }} onClick={() => navigate('/events_add')}>Edit</button>
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
                                <CalendarDashboard />
                            </div>
                            <div className="bg-white rounded shadow-sm p-4 d-flex flex-column min-vh-25">
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
export default PhotographerEvent;
