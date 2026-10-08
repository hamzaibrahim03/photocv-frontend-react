import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import c1 from '../club_admin/assets/images/dashboard/c1.jpg';
import m1 from '../club_admin/assets/images/dashboard/m1.png';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

function PhotographerLearning() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sheets, setSheets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSheets = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get('/cheat-sheets');
            const payload = response.data?.data;
            const list = Array.isArray(payload) ? payload : payload?.data || [];
            setSheets(list);
        } catch (error) {
            console.error('Error loading cheat sheets:', error);
            setSheets([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSheets();
    }, []);

    const filtered = sheets.filter(s =>
        (s.title || '').toLowerCase().includes(search.toLowerCase()) &&
        (category === '' || s.category?.name === category)
    );
    const categories = [...new Set(sheets.map(s => s.category?.name).filter(Boolean))];

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this cheat sheet?')) return;
        try {
            await apiClient.delete(`/cheat-sheets/${id}`);
            setSheets(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting cheat sheet:', error);
            alert(error?.response?.data?.message || 'Unable to delete cheat sheet.');
        }
    };

    const formatDate = (value) => value ? new Date(value).toLocaleDateString() : '-';
    const formatRange = (min, max, prefix = '') => {
        if (min == null && max == null) return '-';
        if (min == null) return `${prefix}${max}`;
        if (max == null) return `${prefix}${min}`;
        return `${prefix}${min} - ${prefix}${max}`;
    };

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
                                        <div className="profile-info"><h2 className="name">Photographer</h2></div>
                                    </div>
                                </div>
                                <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                    <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                        <small style={{ fontSize: '20px' }}>My Photos</small>
                                        <h3 className="number mt-4" style={{ fontSize: '48px' }}>21</h3>
                                    </div>
                                    <div className="event-cards text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                        <small style={{ fontSize: '20px' }}>Interactions</small>
                                        <h3 className="number mt-4" style={{ fontSize: '48px' }}>99</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-4 mb-3 flex-wrap gap-2">
                                <div className="input-group" style={{ maxWidth: '320px' }}>
                                    <span className="input-group-text bg-white" style={{ borderColor: '#a0846c' }}><i className="fas fa-search" style={{ color: '#a0846c' }}></i></span>
                                    <input type="search" className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderColor: '#a0846c' }} />
                                </div>
                                <div className="d-flex gap-2">
                                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="">All Categories</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <button className="btn text-white text-nowrap" style={{ backgroundColor: '#3a2e26' }} onClick={() => navigate('/learn/add')}>+ Add New Sheet</button>
                                </div>
                            </div>

                            <div className="d-flex gap-3 mb-3">
                                <button className="btn" style={{ border: '1px solid #99816b', color: '#99816b' }} onClick={() => navigate('/notebook')}><i className="fas fa-book me-2"></i>Notebook</button>
                                <button className="btn" style={{ border: '1px solid #99816b', color: '#99816b' }} onClick={() => navigate('/insights')}><i className="fas fa-lightbulb me-2"></i>Insights & Practice Log</button>
                            </div>

                            <div className="card bg-white border-0 rounded shadow-sm p-4">
                                <h5 className="head mb-4">All Cheat Sheets</h5>
                                <div className="row g-4">
                                    {filtered.length === 0 && <p className="text-muted">No cheat sheets found.</p>}
                                    {filtered.map(s => (
                                        <div className="col-md-4" key={s.id}>
                                            <div className="rounded overflow-hidden h-100 d-flex flex-column" style={{ boxShadow: '0px 3px 15px 0px #0000001A' }}>
                                                <img src={s.reference_image || m1} alt={s.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                                <div className="p-3 d-flex flex-column flex-grow-1">
                                                    <h6 className="head">{s.title}</h6>
                                                    <p className="text-secondary small flex-grow-1">{s.description}</p>
                                                    <div className="border rounded p-2 mb-2 small">
                                                        <div className="text-muted mb-1">Camera Setting</div>
                                                        <div className="d-flex justify-content-between">
                                                            <span>ISO<br /><strong>{formatRange(s.iso_min, s.iso_max)}</strong></span>
                                                            <span>Shutter Speed<br /><strong>{formatRange(s.shutter_min, s.shutter_max)}</strong></span>
                                                            <span>Aperture<br /><strong>{formatRange(s.aperture_min, s.aperture_max, 'f/')}</strong></span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                                        <small className="text-muted">Created: {formatDate(s.created_at)} &nbsp; Updated: {formatDate(s.updated_at)}</small>
                                                        <div className="d-flex gap-2">
                                                            <button className="icon-btn" onClick={() => handleDelete(s.id)}><i className="fas fa-trash-alt"></i></button>
                                                            <button className="icon-btn" style={{ color: '#cc445e' }} onClick={() => navigate(`/learn/${s.id}/edit`)}><i className="fas fa-edit"></i></button>
                                                        </div>
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
export default PhotographerLearning;
