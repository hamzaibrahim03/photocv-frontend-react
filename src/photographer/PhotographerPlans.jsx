import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import c1 from '../club_admin/assets/images/dashboard/c1.jpg';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

function PhotographerPlans() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [locations, setLocations] = useState([]);
    const [dayOuts, setDayOuts] = useState([]);
    const [page, setPage] = useState(1);
    const perPage = 4;
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [locRes, dayRes] = await Promise.all([
                apiClient.get('/planned-locations'),
                apiClient.get('/planned-day-outs'),
            ]);
            const locPayload = locRes.data?.data;
            const locList = Array.isArray(locPayload) ? locPayload : locPayload?.data || [];
            setLocations(locList);

            const dayPayload = dayRes.data?.data;
            const dayList = Array.isArray(dayPayload) ? dayPayload : dayPayload?.data || [];
            setDayOuts(dayList);
        } catch (error) {
            console.error('Error loading plans:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = locations.filter(l =>
        (l.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.location || '').toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.max(Math.ceil(filtered.length / perPage), 1);
    const paged = filtered.slice((page - 1) * perPage, page * perPage);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this planned location?')) return;
        try {
            await apiClient.delete(`/planned-locations/${id}`);
            setLocations(prev => prev.filter(l => l.id !== id));
        } catch (error) {
            console.error('Error deleting location:', error);
            alert(error?.response?.data?.message || 'Unable to delete location.');
        }
    };

    const toggleVisited = async (id) => {
        const loc = locations.find(l => l.id === id);
        if (!loc) return;
        const nextVisited = !loc.visited;
        setLocations(prev => prev.map(l => l.id === id ? { ...l, visited: nextVisited } : l));
        try {
            await apiClient.put(`/planned-locations/${id}`, { visited: nextVisited });
        } catch (error) {
            console.error('Error updating location:', error);
            setLocations(prev => prev.map(l => l.id === id ? { ...l, visited: !nextVisited } : l));
        }
    };

    const handleDeleteDayOut = async (id) => {
        if (!window.confirm('Delete this planned day out?')) return;
        try {
            await apiClient.delete(`/planned-day-outs/${id}`);
            setDayOuts(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error('Error deleting day out:', error);
            alert(error?.response?.data?.message || 'Unable to delete day out.');
        }
    };

    const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';
    const formatTime = (value) => value ? new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

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
                                <div className="profile-card">
                                    <div className="profile-left d-flex align-items-center gap-3">
                                        <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={c1} alt="Profile" />
                                        <div className="profile-info">
                                            <h2 className="name">Photographer</h2>
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
                                    <div className="event-cards text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                        <small className="ca-details" style={{ fontSize: '20px' }}>Interactions</small>
                                        <div className="row mt-4 align-items-center">
                                            <div className="col-md-5"><h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>99</h3></div>
                                            <div className="days col-md-7 text-start"><span>Likes & Comments</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-white mt-4 border-0 rounded shadow-sm p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="head m-0">Planned Locations</h5>
                                    <div className="d-flex align-items-center gap-2">
                                        <input type="search" className="form-control" placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ border: '1px solid #a0846c', width: '220px' }} />
                                        <button className="btn" id="e-edit" onClick={() => navigate('/plans/add?type=location')}>Add</button>
                                    </div>
                                </div>
                                <div className="row g-4">
                                    {paged.length === 0 && <p className="text-muted">No planned locations found.</p>}
                                    {paged.map(loc => (
                                        <div className="col-md-6" key={loc.id}>
                                            <div className="note-card p-3 rounded d-flex gap-3" style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0px 3px 15px 0px #0000001A' }}>
                                                <img src={loc.feature_image || c1} alt={loc.title} style={{ width: '120px', height: '110px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                                                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                                    <div>
                                                        <h6 className="head mb-1">{loc.title}</h6>
                                                        <h6 className="date" style={{ color: '#cc445e', fontSize: '13px' }}>{loc.location}</h6>
                                                        <p className="text-secondary small mb-2" style={{ width: '500px' }}>{loc.description}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <label className="small d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                                                            <input type="checkbox" checked={!!loc.visited} onChange={() => toggleVisited(loc.id)} /> {loc.visited ? 'Visited' : 'Not Visited'}
                                                        </label>
                                                        <div className="d-flex gap-2">
                                                            <button className="icon-btn" onClick={() => handleDelete(loc.id)}><i className="fas fa-trash-alt"></i></button>
                                                            <button className="icon-btn" onClick={() => navigate(`/plans/add?type=location&id=${loc.id}`)}><i className="fas fa-edit"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <nav className="mt-4">
                                        <ul className="pagination justify-content-end">
                                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button></li>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                                <li key={p} className={`page-item ${p === page ? 'active' : ''}`}><button className="page-link" onClick={() => setPage(p)}>{p}</button></li>
                                            ))}
                                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button></li>
                                        </ul>
                                    </nav>
                                )}
                            </div>

                            <div className="card bg-white mt-4 border-0 rounded shadow-sm p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="head m-0">My Planned Day Out</h5>
                                    <button className="btn" id="e-edit" onClick={() => navigate('/plans/add?type=dayout')}>Add</button>
                                </div>
                                <div className="row g-4">
                                    {dayOuts.length === 0 && <p className="text-muted">No planned day outs found.</p>}
                                    {dayOuts.map(d => (
                                        <div className="col-md-4" key={d.id}>
                                            <div className="note-card p-3 rounded" style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0px 3px 15px 0px #0000001A', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <h6 className="head mb-3">{d.title}</h6>
                                                {d.photography_description && <div className="d-flex align-items-center gap-2 mb-2 text-secondary small"><i className="fas fa-clipboard-list" style={{ color: '#a0846c' }}></i> {d.photography_description}</div>}
                                                {d.planned_date && <div className="d-flex align-items-center gap-2 mb-2 text-secondary small"><i className="fas fa-clock" style={{ color: '#a0846c' }}></i> {formatDate(d.planned_date)}<br />{formatTime(d.planned_date)}</div>}
                                                {d.gear && <div className="d-flex align-items-center gap-2 mb-2 text-secondary small"><i className="fas fa-camera" style={{ color: '#a0846c' }}></i> {d.gear}</div>}
                                                {d.location && <div className="d-flex align-items-center gap-2 mb-3 text-secondary small"><i className="fas fa-map-marker-alt" style={{ color: '#a0846c' }}></i> {d.location}</div>}
                                                <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                                                    <span className="small fw-medium text-capitalize">{d.status || '-'}</span>
                                                    <div className="d-flex gap-2">
                                                        <button className="icon-btn" onClick={() => handleDeleteDayOut(d.id)}><i className="fas fa-trash-alt"></i></button>
                                                        <button className="icon-btn" onClick={() => navigate(`/plans/add?type=dayout&id=${d.id}`)}><i className="fas fa-edit"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default PhotographerPlans;
