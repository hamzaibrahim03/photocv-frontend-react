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
    const [galleries, setGalleries] = useState([]);
    const [joinedClubs, setJoinedClubs] = useState([]);
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [savedLibrary, setSavedLibrary] = useState([]);

    useEffect(() => {
        apiClient.get('/saved-library-items', { params: { category: 'Galleries' } })
            .then((res) => {
                const data = res.data?.data || res.data;
                setSavedLibrary(Array.isArray(data) ? data : []);
            })
            .catch((error) => console.error('Error loading saved library:', error));
    }, []);

    const isBookmarked = (id) => savedLibrary.some(item => item.item_id === id && item.category === 'Galleries');

    const toggleBookmark = async (photo) => {
        try {
            const response = await apiClient.post('/saved-library-items', {
                category: 'Galleries',
                item_id: photo.id,
                title: photo.category || 'Photo',
                description: '',
                date: '',
                image: photo.image || '',
            });
            const saved = response.data?.data?.saved;
            if (saved) {
                const savedItem = response.data?.data?.item;
                setSavedLibrary(prev => [...prev, savedItem || { item_id: photo.id, category: 'Galleries' }]);
                navigate('/photo-library');
            } else {
                setSavedLibrary(prev => prev.filter(s => !(s.item_id === photo.id && s.category === 'Galleries')));
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    const loadGallery = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get('/member-admin/profile/portfolio');
            const memberInfo = response.data?.member_info?.original?.data;
            const galleryData = response.data?.gallery?.original?.data;
            if (memberInfo) setUser(memberInfo);
            const galleryList = Array.isArray(galleryData?.galleries) ? galleryData.galleries : [];
            const flattenedPhotos = galleryList.flatMap((gallery) =>
                (gallery.photos || []).map((photo) => ({
                    id: photo.id,
                    image: photo.image_url || '/placeholder.jpg',
                    category: gallery.gallery_name || 'Gallery',
                    likes: photo.likes_count || 0,
                    comments: photo.comments_count || 0,
                }))
            );
            setPhotos(flattenedPhotos);
            setGalleries(galleryList);
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

    useEffect(() => {
        loadGallery();
        apiClient.get('/joined-clubs')
            .then((res) => setJoinedClubs(res.data?.data || res.data || []))
            .catch((error) => console.error('Error loading joined clubs:', error));
    }, []);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadGalleryId, setUploadGalleryId] = useState('');
    const [newGalleryName, setNewGalleryName] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [imageTitle, setImageTitle] = useState('');
    const [imageDescription, setImageDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const openUploadModal = () => {
        setUploadGalleryId(galleries[0]?.id ? String(galleries[0].id) : 'new');
        setNewGalleryName('');
        setImageFiles([]);
        setImageTitle('');
        setImageDescription('');
        setUploadError('');
        setShowUploadModal(true);
    };

    const handleFilesChange = (e) => {
        setImageFiles(Array.from(e.target.files || []));
    };

    const handleUploadSubmit = async () => {
        if (imageFiles.length === 0) {
            setUploadError('Please choose at least one image.');
            return;
        }
        if (uploadGalleryId === 'new' && !newGalleryName.trim()) {
            setUploadError('Please enter a name for the new gallery.');
            return;
        }
        setIsUploading(true);
        setUploadError('');
        try {
            let galleryId = uploadGalleryId;
            if (uploadGalleryId === 'new') {
                const clubId = galleries[0]?.club_id || joinedClubs[0]?.id;
                if (!clubId) {
                    setUploadError('No club found on your account to create a gallery in.');
                    setIsUploading(false);
                    return;
                }
                const createResponse = await apiClient.post('/create-gallery', {
                    gallery_name: newGalleryName.trim(),
                    is_active: true,
                    club_id: clubId,
                });
                const createdGallery = createResponse.data?.data || createResponse.data;
                galleryId = createdGallery?.id;
            }

            const payload = new FormData();
            payload.append('gallery_id', galleryId);
            const galleryName = uploadGalleryId === 'new'
                ? newGalleryName.trim()
                : galleries.find((g) => String(g.id) === String(galleryId))?.gallery_name || '';
            payload.append('gallery_name', galleryName);
            payload.append('is_active', '1');
            imageFiles.forEach((file) => {
                payload.append('images[]', file);
                payload.append('title[]', imageTitle);
                payload.append('description[]', imageDescription);
            });

            await apiClient.post('/upload-gallery-images', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setShowUploadModal(false);
            await loadGallery();
        } catch (error) {
            console.error('Error uploading gallery images:', error);
            const serverErrors = error.response?.data?.errors;
            const firstError = serverErrors ? Object.values(serverErrors)[0]?.[0] : null;
            setUploadError(firstError || error.response?.data?.message || 'Unable to upload images.');
        } finally {
            setIsUploading(false);
        }
    };

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
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={user.profile_image_url || '/placeholder.jpg'} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                                                <div className="profile-info">
                                                    <h2 className="name">{user.first_name} {user.last_name}</h2>
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
                                                        <h3 className="number">
                                                            {totals.totalLikes + totals.totalComments}
                                                        </h3>
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
                                    <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                                        <div className="input-group" style={{ maxWidth: '400px' }}>
                                            <span className="input-group-text bg-white" style={{ borderColor: '#a0846c' }}><i className="fas fa-search" style={{ color: '#a0846c' }}></i></span>
                                            <input type="search" className="form-control" placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ borderColor: '#a0846c' }} />
                                        </div>
                                        <button className="btn" id="edit" onClick={openUploadModal}>+ Add Image</button>
                                    </div>
                                </div>
                            </section>

                            {showUploadModal && (
                                <div className="export-modal-overlay">
                                    <div className="export-modal">
                                        <div className="export-modal-header">
                                            <h2>Add Image</h2>
                                            <button type="button" className="export-close-btn" onClick={() => setShowUploadModal(false)}>×</button>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Gallery</label>
                                            <select className="form-select" value={uploadGalleryId} onChange={(e) => setUploadGalleryId(e.target.value)}>
                                                {galleries.map((g) => (
                                                    <option key={g.id} value={g.id}>{g.gallery_name}</option>
                                                ))}
                                                <option value="new">+ Create New Gallery</option>
                                            </select>
                                        </div>

                                        {uploadGalleryId === 'new' && (
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold">New Gallery Name</label>
                                                <input type="text" className="form-control" value={newGalleryName} onChange={(e) => setNewGalleryName(e.target.value)} placeholder="e.g. Landscapes" />
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Images</label>
                                            <input type="file" className="form-control" accept="image/jpeg,image/png,image/jpg" multiple onChange={handleFilesChange} />
                                            {imageFiles.length > 0 && (
                                                <small className="text-muted d-block mt-1">{imageFiles.length} file(s) selected</small>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Title (optional)</label>
                                            <input type="text" className="form-control" value={imageTitle} onChange={(e) => setImageTitle(e.target.value)} />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Description (optional)</label>
                                            <textarea className="form-control" rows="2" value={imageDescription} onChange={(e) => setImageDescription(e.target.value)} />
                                        </div>

                                        {uploadError && <p className="text-danger small">{uploadError}</p>}

                                        <div className="export-modal-footer">
                                            <button type="button" className="btn" id="edit" onClick={() => setShowUploadModal(false)}>Cancel</button>
                                            <button type="button" className="btn" id="e-view" disabled={isUploading} onClick={handleUploadSubmit}>
                                                {isUploading ? 'Uploading...' : 'Upload'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-4">
                                        <h5 className="head mt-5 mb-5">My Gallery</h5>
                                        <div className="row g-0">
                                            {paged.map((p, idx) => (
                                                <div className="col-md-3" key={p.id}>
                                                    <div className="position-relative" style={{ cursor: 'pointer' }} onClick={() => navigate(`/my-gallery/${p.id}`)}>
                                                        <span className="position-absolute m-2 px-2 py-1 text-white small rounded" style={{ background: 'rgba(0,0,0,0.5)', zIndex: '1' }}>#{(page - 1) * perPage + idx + 1}</span>
                                                        <button type="button" className="btn position-absolute m-2 text-white" style={{ top: '0', right: '44px', background: isBookmarked(p.id) ? '#cc445e' : 'rgba(0,0,0,0.5)', zIndex: '1', padding: '4px 8px' }} title="Bookmark" onClick={(e) => { e.stopPropagation(); toggleBookmark(p); }} >
                                                            <i className={isBookmarked(p.id) ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>
                                                        </button>
                                                        <button type="button" className="btn position-absolute m-2 text-white" style={{ top: '0', right: '0', background: 'rgba(0,0,0,0.5)', zIndex: '1', padding: '4px 8px' }} title="Share" onClick={async (e) => { e.stopPropagation(); const url = `${window.location.origin}/my-gallery/${p.id}`; try { if (navigator.share) await navigator.share({ title: p.category, url }); else { await navigator.clipboard.writeText(url); alert('Link copied to clipboard.'); } } catch { /* user cancelled */ } }} >
                                                            <i className="fas fa-share-alt"></i>
                                                        </button>
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
export default PhotographerGallery;
