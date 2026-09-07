import React, { useState, useEffect, useMemo, useCallback } from 'react';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
function PostView() {
    const [user] = useState({
        first_name: 'Photographer',
        profile_image: '/placeholder.jpg'
    });
    const [notices, setNotices] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;
    const fetchNotices = async () => {
        try {
            setNotices([
                { id: 1, title: 'Weekly Meeting', location: 'Zoom', created_at: '2024-04-10T08:00:00Z', description: 'Weekly sync up', featured_image: '/placeholder.jpg' }
            ]);
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => {
        fetchNotices();
    }, []);
    const fetchSearchedNotices = useCallback(async (query) => {
        try {
        } catch (e) {
            console.error(e);
        }
        setCurrentPage(1);
    }, []);
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.length >= 3) {
                fetchSearchedNotices(search);
            } else if (search.length === 0) {
                fetchNotices();
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, fetchSearchedNotices]);
    const filteredNotices = useMemo(() => {
        let filtered = notices;
        if (search.trim()) {
            filtered = filtered.filter(n => n.title?.toLowerCase().includes(search.toLowerCase()));
        }
        const start = (currentPage - 1) * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [notices, search, currentPage]);
    const totalPages = useMemo(() => {
        const count = notices.filter(n => n.title?.toLowerCase().includes(search.toLowerCase())).length;
        return Math.max(Math.ceil(count / rowsPerPage), 1);
    }, [notices, search]);
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
            <HeaderRoute title="Profile" />
            <section className="content" style={{ padding: '0 30px' }}>
                <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                    <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                        <div className="profile-left d-flex align-items-center gap-3">
                            <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={user.profile_image} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                            <div className="profile-info">
                                <h2 className="name m-0 text-dark head">{user.first_name}</h2>
                            </div>
                        </div>
                        <div className="profile-icons d-flex flex-column gap-2 text-danger">
                            <div className="icon d-flex align-items-center gap-2"><span>20</span><i className="fas fa-comments"></i></div>
                            <div className="icon d-flex align-items-center gap-2"><span>53</span><i className="fas fa-desktop"></i></div>
                            <div className="icon d-flex align-items-center gap-2"><span>39</span><i className="fas fa-users"></i></div>
                        </div>
                    </div>
                    <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                        <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                            <small className="ca-details" style={{ fontSize: '20px' }}>My Photos</small>
                            <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>21</h3>
                        </div>
                        <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                            <small className="ca-details" style={{ fontSize: '20px' }}>Interactions</small>
                            <div className="row mt-4 align-items-center">
                                <div className="col-md-5">
                                    <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>99</h3>
                                </div>
                                <div className="days col-md-7 text-start">
                                    <span>Likes & Comments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <MyPosts />
                </div>
                <div className="d-flex justify-content-between align-items-center py-4">
                    <h5 className="m-0 head">My Notices</h5>
                    <button className="btn text-white px-4" style={{ backgroundColor: '#99816b' }}>View All</button>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="container px-0">
                            {filteredNotices.length > 0 ? (
                                <div>
                                    {filteredNotices.map(notice => (
                                        <div key={notice.id} className="custom-card bg-white shadow-sm rounded p-4 mb-4 border border-light">
                                            <div className="d-flex gap-4">
                                                <img src={notice.featured_image || '/placeholder.jpg'} alt="Notice" className="rounded" style={{ width: '200px', height: '150px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h5 className="m-0 head">{notice.title || 'Untitled Notice'}</h5>
                                                        <div className="icon-container text-muted d-flex gap-3">
                                                            <i className="fa-regular fa-comment"></i>
                                                            <i className="fa-solid fa-camera"></i>
                                                            <i className="fa-regular fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <p className="text-secondary small mb-2">{notice.location}</p>
                                                    <p className="text-danger fw-medium mb-3">{formatDate(notice.created_at)}</p>
                                                    <p className="text-muted small mb-4">{notice.description || 'No description provided.'}</p>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn text-white px-4" style={{ backgroundColor: '#99816b' }}>View</button>
                                                        <button className="btn text-white px-4" style={{ backgroundColor: '#4c4036' }}>Edit</button>
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
                                <div className="text-center py-5 text-muted bg-white rounded shadow-sm">No notices found.</div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <section className="d-flex flex-column gap-4">
                            <RecentComments />
                            <MoreNotices />
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default PostView;
