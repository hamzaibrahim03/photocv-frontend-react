import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

function PhotographerGallery() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 12;
    const [user, setUser] = useState({ first_name: 'Photographer', last_name: '', profile_image_url: '/placeholder.jpg' });
    const [photos, setPhotos] = useState([]);
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadGallery = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get('/member-admin/profile/portfolio');
                const memberInfo = response.data?.member_info?.original?.data;
                const galleryData = response.data?.gallery?.original?.data;
                if (memberInfo) setUser(memberInfo);
                const galleries = Array.isArray(galleryData?.galleries) ? galleryData.galleries : [];
                const flattenedPhotos = galleries.flatMap((gallery) =>
                    (gallery.photos || []).map((photo) => ({
                        id: photo.id,
                        image: photo.image_url || '/placeholder.jpg',
                        category: gallery.gallery_name || 'Gallery',
                        likes: photo.likes_count || 0,
                        comments: photo.comments_count || 0,
                    }))
                );
                setPhotos(flattenedPhotos);
                setTotals({
                    totalPhotos: galleryData?.total_photos ?? 0,
                    totalLikes: galleryData?.total_likes ?? 0,
                    totalComments: galleryData?.total_comments ?? 0,
                });
            } catch (error) {
                console.error('Error loading photographer gallery:', error);
                setPhotos([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadGallery();
    }, []);

    const filtered = useMemo(() => photos.filter(p => p.category.toLowerCase().includes(search.toLowerCase())), [photos, search]);
    const totalPages = Math.max(Math.ceil(filtered.length / perPage), 1);
    const paged = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Gallery" />
                        <div className="content">
                            <div className="dashboard-card">
                                <div className="profile-card">
                                    <div className="profile-left d-flex align-items-center gap-3">
                                        <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={user.profile_image_url || '/placeholder.jpg'} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                                        <div className="profile-info">
                                            <h2 className="name">{user.first_name} {user.last_name}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                    <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                        <small className="ca-details" style={{ fontSize: '20px' }}>My Photos</small>
                                        <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{totals.totalPhotos}</h3>
                                    </div>
                                    <div className="event-cards text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                        <small className="ca-details" style={{ fontSize: '20px' }}>Interactions</small>
                                        <div className="row mt-4 align-items-center">
                                            <div className="col-md-5"><h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{totals.totalLikes + totals.totalComments}</h3></div>
                                            <div className="days col-md-7 text-start"><span>Likes & Comments</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                                <div className="input-group" style={{ maxWidth: '400px' }}>
                                    <span className="input-group-text bg-white" style={{ borderColor: '#a0846c' }}><i className="fas fa-search" style={{ color: '#a0846c' }}></i></span>
                                    <input type="search" className="form-control" placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ borderColor: '#a0846c' }} />
                                </div>
                                <button className="btn text-white" style={{ backgroundColor: '#3a2e26' }} onClick={() => window.alert('Upload flow not connected to a backend yet')}>+ Add Image</button>
                            </div>

                            <div className="card bg-white border-0 rounded shadow-sm p-4">
                                <h5 className="head mb-4">My Gallery</h5>
                                <div className="row g-0">
                                    {paged.map((p, idx) => (
                                        <div className="col-md-3" key={p.id}>
                                            <div className="position-relative" style={{ cursor: 'pointer' }} onClick={() => navigate(`/my-gallery/${p.id}`)}>
                                                <span className="position-absolute m-2 px-2 py-1 text-white small rounded" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1 }}>#{(page - 1) * perPage + idx + 1}</span>
                                                <img src={p.image} alt={p.category} style={{ width: '100%', height: '220px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                                                <div className="d-flex justify-content-between align-items-center px-2 py-2 text-white small" style={{ backgroundColor: '#5b4535' }}>
                                                    <span>{p.category}</span>
                                                    <span className="d-flex gap-2">
                                                        <span><i className="fas fa-heart me-1"></i>{p.likes}</span>
                                                        <span><i className="fas fa-comment me-1"></i>{p.comments}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {paged.length === 0 && <p className="text-muted small">No photos yet.</p>}
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
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default PhotographerGallery;
