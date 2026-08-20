import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';

// Mock dependencies
import CalendarDashboard from '../club_admin/Calendars/CalendarDashboard';
import RecentSubmissions from '../club_admin/competitions/RecentSubmissions';
import MoreCompetitions from '../club_admin/competitions/MoreCompetitions';
import apiClient from '../../api/axios'; // assuming standard location

const PhotographerCompetitions = () => {
    const navigate = useNavigate();

    const [competitions, setCompetitions] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;

    // Stats
    const [eventDay, setEventDay] = useState(25);

    // Mock API fetch
    const fetchCompetitions = async () => {
        try {
            // const res = await apiClient.get('/competitions');
            // setCompetitions(res.data.data);
            setCompetitions([
                { id: 1, name: 'Spring Contest', start_date: '2024-03-01', result_announcement_date: '2024-04-01', submission_deadline: '2024-03-15', theme_id: 'Nature', max_entries_print: 2, allowed_image_formats: 'JPG, PNG', description: 'Show us nature.', featured_image: '/placeholder.jpg' }
            ]);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const fetchSearchedCompetitions = useCallback(async (query) => {
        try {
            /* 
            const response = await apiClient.get('/competitions', { params: { search_term: query }});
            setCompetitions(response.data.data);
            */
        } catch (error) {
            console.error(error);
            setCompetitions([]);
        }
        setCurrentPage(1);
    }, []);

    // Debounce search effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.length >= 3) {
                fetchSearchedCompetitions(search);
            } else if (search.length === 0) {
                fetchCompetitions();
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, fetchSearchedCompetitions]);

    const filteredCompetitions = useMemo(() => {
        let filtered = competitions;
        if (search.trim()) {
            filtered = filtered.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));
        }
        const start = (currentPage - 1) * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [competitions, search, currentPage]);

    const totalPages = useMemo(() => {
        const count = competitions.filter(c => c.name?.toLowerCase().includes(search.toLowerCase())).length;
        return Math.max(Math.ceil(count / rowsPerPage), 1);
    }, [competitions, search]);

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

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Competitions" />
            <section className="content" style={{ padding: '0 30px' }}>
                <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                    <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                        <div className="profile-left">
                            <div className="profile-info">
                                <small className="greeting text-muted" style={{ fontSize: '18px' }}>Planned and regular club competition</small>
                                <h2 className="name m-0 text-dark fw-bold" style={{ fontSize: '30px' }}>2024 - 2025 Season</h2>
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
                    <div className="card-section d-flex" style={{ width: '32%' }}>
                        <div className="event-card text-white text-center rounded p-4 w-100" style={{ backgroundColor: '#755840', height: '148px' }}>
                            <small className="ca-details" style={{ fontSize: '20px' }}>Next Competition</small>
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
                            {filteredCompetitions.length > 0 ? (
                                <div>
                                    {filteredCompetitions.map(competition => (
                                        <div key={competition.id} className="custom-card bg-white shadow-sm rounded p-4 mb-4 border border-light">
                                            <div className="d-flex gap-4">
                                                <img src={competition.featured_image || '/placeholder.jpg'} alt="Competition" className="rounded" style={{ width: '200px', height: '150px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h5 className="m-0 fw-bold">{competition.name || 'Untitled Competition'}</h5>
                                                        <div className="icon-container text-muted d-flex gap-3">
                                                            <i className="fa-regular fa-comment"></i>
                                                            <i className="fa-solid fa-camera"></i>
                                                            <i className="fa-regular fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <div className="row m-0 mb-3" style={{ fontSize: '14px' }}>
                                                        <div className="col-6 p-0 mb-2"><strong className="text-danger me-2">Open:</strong> {formatDate(competition.start_date)}</div>
                                                        <div className="col-6 p-0 mb-2"><strong className="text-secondary me-2" style={{ color: 'brown' }}>Result:</strong> {formatDate(competition.result_announcement_date)}</div>
                                                        <div className="col-6 p-0 mb-2"><strong className="text-secondary me-2" style={{ color: 'brown' }}>Theme:</strong> {competition.theme_id}</div>
                                                        <div className="col-6 p-0 mb-2"><strong className="text-danger me-2">Close:</strong> {formatDate(competition.submission_deadline)}</div>
                                                        <div className="col-6 p-0 mb-2"><strong className="text-secondary me-2" style={{ color: 'brown' }}>Max:</strong> {competition.max_entries_print}</div>
                                                        <div className="col-6 p-0 mb-2"><strong className="text-secondary me-2" style={{ color: 'brown' }}>Format:</strong> {competition.allowed_image_formats}</div>
                                                    </div>
                                                    <p className="text-muted small mb-4">{competition.description || 'No description provided.'}</p>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn text-white px-4" style={{ backgroundColor: '#99816b' }} onClick={() => navigate('/competitionsingle')}>View</button>
                                                        <button className="btn text-white px-4" style={{ backgroundColor: '#4c4036' }} onClick={() => navigate('/comp_edit')}>Edit</button>
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
                                <div className="text-center py-5 text-muted bg-white rounded shadow-sm">No competitions found.</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-4">
                        <section className="d-flex flex-column gap-4">
                            <div className="bg-white rounded shadow-sm">
                                <CalendarDashboard />
                            </div>
                            <div className="d-flex flex-column gap-4">
                                <RecentSubmissions />
                                <MoreCompetitions />
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PhotographerCompetitions;
