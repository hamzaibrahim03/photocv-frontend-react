import React, { useState, useEffect, useMemo, useCallback } from 'react';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
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
    const [isLoading, setIsLoading] = useState(false);
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Profile" />
                        <div className="content">
                            <div className="dashboard-card">
                                <div className="profile-card" >
                                    <div className="profile-left">
                                        <img className="img-fluid" src={user.profile_image} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                                        <div className="profile-info">
                                            <h2 className="name">{user.first_name}</h2>
                                        </div>
                                    </div>
                                    <div className="profile-icons">
                                        <div className="icon"><span>20</span><i className="fas fa-comments"></i></div>
                                        <div className="icon"><span>53</span><i className="fas fa-desktop"></i></div>
                                        <div className="icon"><span>39</span><i className="fas fa-users"></i></div>
                                    </div>
                                </div>
                                <div className="card-section">
                                    <div className="stat-card">
                                        <small className="ca-details">My Photos</small>
                                        <h3 className="number">21</h3>
                                    </div>
                                    <div className="event-cards">
                                        <small className="ca-details">Interactions</small>
                                        <div className="row">
                                            <div className="col-md-5">
                                                <h3 className="number">99</h3>
                                            </div>
                                            <div className="days col-md-7">
                                                <span>Likes & Comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center py-4">
                                <h5 className="m-0 head">My Notices</h5>
                                <button className="btn" id="e-view">View All</button>
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
                                                                    <button className="btn" id="e-view">View</button>
                                                                    <button className="btn" id="e-edit">Edit</button>
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
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default PostView;
