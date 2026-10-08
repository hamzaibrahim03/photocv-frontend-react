import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
import qrCode from '../club_admin/assets/images/profile/qr_code.png';

function PhotographerPortfolio() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ first_name: 'Photographer', profile_image_url: '/placeholder.jpg', username: '' });
    const [galleries, setGalleries] = useState([]);
    const [portfolioPhotos, setPortfolioPhotos] = useState([]);
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const chunkedCards = useMemo(() => {
        const chunkSize = 3;
        const chunks = [];
        for (let i = 0; i < portfolioPhotos.length; i += chunkSize) chunks.push(portfolioPhotos.slice(i, i + chunkSize));
        return chunks;
    }, [portfolioPhotos]);

    useEffect(() => {
        async function loadPortfolio() {
            setLoading(true);
            setIsLoading(true);
            try {
                const response = await apiClient.get('/member-admin/profile/portfolio');
                const memberInfo = response.data?.member_info?.original?.data;
                const galleryData = response.data?.gallery?.original?.data;
                if (memberInfo) setUser(memberInfo);
                const galleryList = Array.isArray(galleryData?.galleries) ? galleryData.galleries : [];
                setGalleries(galleryList);
                setPortfolioPhotos(Array.isArray(galleryData?.portfolio_photos) ? galleryData.portfolio_photos : []);
                setTotals({
                    totalPhotos: galleryData?.total_photos ?? 0,
                    totalLikes: galleryData?.total_likes ?? 0,
                    totalComments: galleryData?.total_comments ?? 0,
                });
            } catch (error) {
                console.error('Error loading photographer portfolio:', error);
            } finally {
                setLoading(false);
                setIsLoading(false);
            }
        }
        loadPortfolio();
    }, []);

    const galleryTiles = useMemo(() => {
        return galleries.map((g) => {
            const photos = g.photos || [];
            return {
                id: g.id,
                image: photos[0]?.image_url || '/placeholder.jpg',
                category: g.gallery_name,
                likes: photos.reduce((sum, p) => sum + (p.likes_count || 0), 0),
                comments: photos.reduce((sum, p) => sum + (p.comments_count || 0), 0),
            };
        });
    }, [galleries]);
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
                                        <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={user.profile_image_url || '/placeholder.jpg'} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                                        <div className="profile-info">
                                            <h2 className="name">{user.first_name} {user.last_name}</h2>
                                        </div>
                                    </div>
                                    <div className="profile-icons d-flex flex-column gap-2 text-danger">
                                        <div className="icon d-flex align-items-center gap-2"><span>{totals.totalComments}</span><i className="fas fa-comments"></i></div>
                                    </div>
                                </div>
                                <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                    <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                        <small className="ca-details" style={{ fontSize: '20px' }}>My Photos</small>
                                        <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{totals.totalPhotos}</h3>
                                    </div>
                                    <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                        <small className="ca-details" style={{ fontSize: '20px' }}>Interactions</small>
                                        <div className="row mt-4 align-items-center">
                                            <div className="col-md-5">
                                                <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{totals.totalLikes + totals.totalComments}</h3>
                                            </div>
                                            <div className="days col-md-7 text-start">
                                                <span>Likes & Comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-white mt-4 border-0 rounded shadow-sm overflow-hidden p-4">
                                <h4 className="head mb-4">My Portfolio</h4>
                                {loading ? (
                                    <div className="text-center py-5 text-muted">Loading portfolio...</div>
                                ) : (
                                    <div className="d-flex flex-column gap-4">
                                        {chunkedCards.length === 0 && <p className="text-muted small">No portfolio photos yet.</p>}
                                        {chunkedCards.map((row, rowIndex) => (
                                            <div key={rowIndex} className="row g-4">
                                                {row.map((item) => (
                                                    <div key={item.id} className="col-md-4">
                                                        <div className="position-relative overflow-hidden rounded" style={{ height: '250px' }}>
                                                            <img src={item.image_url || '/placeholder.jpg'} alt={item.title || 'Portfolio photo'} className="w-100 h-100" style={{ objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                                                            <div className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <img src={user.profile_image_url || '/placeholder.jpg'} alt="Profile" className="rounded-circle" style={{ width: '40px', height: '40px' }} />
                                                                    <span className="fw-medium">{user.first_name} {user.last_name}</span>
                                                                </div>
                                                                <div className="d-flex gap-3">
                                                                    <div className="d-flex align-items-center gap-1"><span>{item.likes_count || 0}</span><i className="fas fa-heart"></i></div>
                                                                    <div className="d-flex align-items-center gap-1"><span>{item.comments_count || 0}</span><i className="fas fa-comment"></i></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="card bg-white mt-4 border-0 rounded shadow-sm p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="head m-0">My Gallery</h4>
                                    <button className="btn" style={{ border: '1px solid #99816b', color: '#99816b' }} onClick={() => navigate('/my-gallery')}>View All</button>
                                </div>
                                <div className="row g-0">
                                    {galleryTiles.length === 0 && <p className="text-muted small">No galleries yet.</p>}
                                    {galleryTiles.map(p => (
                                        <div className="col-md-3" key={p.id}>
                                            <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/my-gallery/${p.id}`)}>
                                                <img src={p.image} alt={p.category} style={{ width: '100%', height: '200px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                                                <div className="d-flex justify-content-between align-items-center px-2 py-2 text-white small" style={{ backgroundColor: '#5b4535' }}>
                                                    <span>{p.category}</span>
                                                    <span className="d-flex gap-2"><span><i className="fas fa-heart me-1"></i>{p.likes}</span><span><i className="fas fa-comment me-1"></i>{p.comments}</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="row mt-4 g-4">
                                <div className="col-md-6 offset-md-3">
                                    <div className="bg-white rounded shadow-sm border border-light p-4 text-center">
                                        <h4 className="head text-start mb-4">My QR Code</h4>
                                        <img src={qrCode} alt="QR CODE" style={{ width: '160px' }} className="mb-3" />
                                        <hr className="text-muted w-75 mx-auto" />
                                        <p className="text-secondary mb-0 mt-3">{user.username ? `${user.username}.photo.cv` : ''}</p>
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
export default PhotographerPortfolio;
