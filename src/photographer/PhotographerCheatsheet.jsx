import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import m1 from '../club_admin/assets/images/dashboard/m1.png';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

const STAT_BAR_COLORS = ['#cc445e', '#4c4036', '#99816b'];

function PhotographerCheatsheet() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sheets, setSheets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({ first_name: 'Photographer', last_name: '', profile_image_url: '/placeholder.jpg' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });

    useEffect(() => {
        apiClient.get('/member-admin/profile/portfolio')
            .then((response) => {
                const memberInfo = response.data?.member_info?.original?.data;
                const galleryData = response.data?.gallery?.original?.data;
                if (memberInfo) setUser(memberInfo);
                setTotals({
                    totalPhotos: galleryData?.total_photos ?? 0,
                    totalLikes: galleryData?.total_likes ?? 0,
                    totalComments: galleryData?.total_comments ?? 0,
                });
            })
            .catch((error) => console.error('Error loading profile summary:', error));
    }, []);

    const fetchSheets = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get('/cheat-sheets');
            const payload = response.data?.data;
            let list = [];
            if (Array.isArray(payload)) list = payload;
            else if (Array.isArray(payload?.data)) list = payload.data;
            else if (Array.isArray(payload?.original?.data)) list = payload.original.data;
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

    const handleShare = async (sheet) => {
        const url = `${window.location.origin}/learn/${sheet.id}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: sheet.title || 'Cheat Sheet', url });
                return;
            } catch (error) {
                if (error?.name === 'AbortError') return;
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            alert('Link copied to clipboard.');
        } catch (error) {
            console.error('Error copying link:', error);
            alert(url);
        }
    };

    const formatDate = (value) => value ? new Date(value).toLocaleDateString() : '-';
    const formatRange = (min, max, prefix = '') => {
        if (min == null && max == null) return '-';
        if (min == null) return `${prefix}${max}`;
        if (max == null) return `${prefix}${min}`;
        if (String(min) === String(max)) return `${prefix}${min}`;
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
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className='dashboard-card' id="cl">
                                        <div className='profile-card'>
                                            <div className='profile-left'>
                                                <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={user.profile_image_url || '/placeholder.jpg'} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                                                <div className='profile-info'>
                                                    <h2 className='head'>{user.first_name} {user.last_name}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">My Photos</small>
                                                <h3 className="number">{totals.totalPhotos}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Interactions</small>
                                                <div className="row align-items-center">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{totals.totalLikes + totals.totalComments}</h3>
                                                    </div>
                                                    <div className="days col-md-7 text-start">
                                                        <span>Likes & Comments</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="d-flex justify-content-between align-items-center mt-4 mb-3 flex-wrap gap-2">
                                        <div className="input-group" style={{ maxWidth: '320px' }}>
                                            <span className="input-group-text bg-white" style={{ borderColor: '#a0846c' }}><i className="fas fa-search" style={{ color: '#a0846c' }}></i></span>
                                            <input type="search" className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderColor: '#a0846c' }} />
                                        </div>
                                        <div className="d-flex gap-2" style={{width: '500px'}}>
                                            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                                <option value="">All Categories</option>
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <button className="btn" id="edit" style={{width: '240px', maxWidth: '240px'}} onClick={() => navigate('/cheatsheet/add')}>+ Add New Sheet</button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-4">
                                        <h5 className="head mb-5">All Cheat Sheets</h5>
                                        <div className="g-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                                            {filtered.length === 0 && <p className="text-muted">No cheat sheets found.</p>}
                                            {filtered.map((s, index) => {
                                                const statColor = STAT_BAR_COLORS[index % STAT_BAR_COLORS.length];
                                                return (
                                                    <div key={s.id}>
                                                        <div className="rounded overflow-hidden d-flex flex-column" style={{ width: '425px', height: 'auto', minHeight: '636px', borderRadius: '10.79px', border: '0.6px solid #4C40364D' }}>
                                                            <img src={s.reference_image || m1} alt={s.title} style={{ width: '425px', height: '165px', objectFit: 'cover' }} />
                                                            <div className="p-3 d-flex flex-column flex-grow-1" style={{ cursor: 'pointer' }} onClick={() => navigate(`/cheatsheet/${s.id}`)}>
                                                                <h6 className="head">{s.title}</h6>
                                                                <p className="text-secondary flex-wrap " style={{ padding: '0 15px', width: '390px', fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '11.67px', lineHeight: '17.51px', }}>{s.description}</p>
                                                                <div className="p-3 m-2 small text-white" style={{ width: 'calc(100% - 16px)', borderRadius: '8px', backgroundColor: statColor }}>
                                                                    <div className="d-flex justify-content-between">
                                                                        <span><i className="fas fa-sliders-h me-1"></i> ISO<br /><strong>{formatRange(s.iso_min, s.iso_max)}</strong></span>
                                                                        <span><i className="fas fa-stopwatch me-1"></i> Shutter Speed<br /><strong>{formatRange(s.shutter_min, s.shutter_max)}</strong></span>
                                                                        <span><i className="fas fa-sun me-1"></i> Aperture<br /><strong>{formatRange(s.aperture_min, s.aperture_max, 'f/')}</strong></span>
                                                                    </div>
                                                                </div>
                                                                {s.tips?.length > 0 && (
                                                                    <div className="px-2 mb-2">
                                                                        <p className="mb-1 fw-bold" style={{ fontSize: '13px', color: '#4c4036' }}>Top Tips</p>
                                                                        <ul className="mb-0" style={{ fontSize: '12px', paddingLeft: '2px', color: '#4c4036', listStyle: 'none' }}>
                                                                            {s.tips.map((tip, i) => (
                                                                                <li key={i} className="d-flex align-items-start gap-2 mb-1">
                                                                                    <span style={{ color: '#cc445e', lineHeight: '1.6' }}>&bull;</span>
                                                                                    <span className="m-2" style={{ fontSize: '12px', fontWeight: '400' }}>{tip}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                {s.tags?.length > 0 && (
                                                                    <div className="d-flex gap-2 flex-wrap mb-2 px-2">
                                                                        {s.tags.map((t, i) => (
                                                                            <span key={i} style={{ display: 'inline-block', padding: '2px 12px', borderRadius: '12px', fontSize: '12px', backgroundColor: '#f3e2e6', color: '#cc445e' }} >
                                                                                {t}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <div className="d-flex justify-content-between align-items-center mt-auto">
                                                                    <small className="text-muted">Created: {formatDate(s.created_at)} &nbsp; Updated: {formatDate(s.updated_at)}</small>
                                                                    <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                                        <button className="icon-btn" onClick={() => handleDelete(s.id)}><i className="fas fa-trash-alt"></i></button>
                                                                        <button className="icon-btn" style={{ color: '#cc445e' }} onClick={() => navigate(`/cheatsheet/${s.id}/edit`)}><i className="fas fa-edit"></i></button>
                                                                        <button className="icon-btn" style={{ color: '#99816b' }} onClick={() => handleShare(s)}><i className="fas fa-share-alt"></i></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
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
            </div>
        </>
    );
}
export default PhotographerCheatsheet;
