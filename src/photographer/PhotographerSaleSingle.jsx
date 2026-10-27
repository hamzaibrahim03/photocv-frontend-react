import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

function PhotographerSaleSingle() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState({ first_name: 'Photographer', profile_image_url: '' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });
    const [sale, setSale] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Remove this listing?')) return;
        setIsDeleting(true);
        try {
            await apiClient.delete(`/photographer/sales/${id}`);
            navigate('/my-sales');
        } catch (err) {
            console.error('Error deleting listing:', err);
            alert(err.response?.data?.message || 'Unable to remove listing.');
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            setError(null);
            try {
                await Promise.all([
                    apiClient.get('/member-admin/profile/portfolio').then((response) => {
                        const memberInfo = response.data?.member_info?.original?.data;
                        const galleryData = response.data?.gallery?.original?.data;
                        if (memberInfo) setUser(memberInfo);
                        setTotals({
                            totalPhotos: galleryData?.total_photos ?? 0,
                            totalLikes: galleryData?.total_likes ?? 0,
                            totalComments: galleryData?.total_comments ?? 0,
                        });
                    }),
                    apiClient.get(`/photographer/sales/${id}`).then((response) => {
                        if (!cancelled) setSale(response.data?.data || null);
                    }).catch((err) => {
                        if (!cancelled) setError(err.response?.data?.message || 'Unable to load this listing.');
                    }),
                ]);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [id]);

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="My Sales" />
                        <div className="content">
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <img className="img-fluid" src={user.profile_image_url || '/placeholder.jpg'} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                                                <div className="profile-info">
                                                    <h2 className="name">{user.first_name}</h2>
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
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{totals.totalLikes + totals.totalComments}</h3>
                                                    </div>
                                                    <div className="days col-md-7">
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
                                    <div className="card bg-white border-0 rounded shadow-sm p-4">
                                        {error && (
                                            <div className="alert alert-danger">{error}</div>
                                        )}
                                        {!error && sale && (
                                            <>
                                                <img src={sale.image || '/placeholder.jpg'} alt={sale.title} className="rounded mb-4" style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <h3 className="head mt-5 mb-5">{sale.title}</h3>
                                                    <span className="d-inline-block px-3 py-1 rounded-pill" style={sale.status === 'active' ? { fontSize: '13px', backgroundColor: '#e7f6ea', color: '#2f9e44' } : { fontSize: '13px', backgroundColor: '#f3e9e0', color: '#99816b' }}>
                                                        {sale.status === 'active' ? 'Available' : 'Sold'}
                                                    </span>
                                                </div>
                                                <p className="mb-4" style={{ color: '#cc445e', fontSize: '20px', fontWeight: '600' }}>£ {Number(sale.price).toFixed(0)}</p>

                                                <div className="row g-4 mb-3">
                                                    <div className="col-md-4">
                                                        <h6 style={{ color: '#cc445e' }}>Category</h6>
                                                        <p className="mb-0">{sale.category || '—'}</p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <h6 style={{ color: '#cc445e' }}>Condition</h6>
                                                        <p className="mb-0 text-capitalize">{sale.condition || '—'}</p>
                                                    </div>
                                                    {sale.sold_count > 0 && (
                                                        <div className="col-md-4">
                                                            <h6 style={{ color: '#cc445e' }}>Sold</h6>
                                                            <p className="mb-0">{sale.sold_count}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <h6 style={{ color: '#cc445e' }}>Description</h6>
                                                <p className="text-secondary" style={{ whiteSpace: 'pre-wrap' }}>{sale.description || 'No description provided.'}</p>

                                                <div className="d-flex gap-3 mt-4">
                                                    <button className="btn" id="e-view" onClick={() => navigate('/my-sales')}>Back</button>
                                                    <button className="btn" id="edit" onClick={() => navigate(`/my-sales/${id}/edit`)}>Edit</button>
                                                    <button className="btn" id="new" style={{ backgroundColor: '#cc445e' }} disabled={isDeleting} onClick={handleDelete}>
                                                        {isDeleting ? 'Removing...' : 'Delete'}
                                                    </button>
                                                </div>
                                            </>
                                        )}
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
export default PhotographerSaleSingle;
