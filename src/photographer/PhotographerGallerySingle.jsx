import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

function PhotographerGallerySingle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [posting, setPosting] = useState(false);
    const [lightbox, setLightbox] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [photoIds, setPhotoIds] = useState([]);
    const [filmstrip, setFilmstrip] = useState([]);

    useEffect(() => {
        apiClient.get('/member-admin/profile/portfolio')
            .then((response) => {
                const galleryData = response.data?.gallery?.original?.data;
                const galleries = Array.isArray(galleryData?.galleries) ? galleryData.galleries : [];
                const allPhotos = galleries.flatMap((gallery) => (gallery.photos || []));
                setPhotoIds(allPhotos.map((photo) => photo.id));
                setFilmstrip(allPhotos.map((photo) => ({ id: photo.id, image: photo.image_url || '/placeholder.jpg' })));
            })
            .catch((error) => console.error('Error loading gallery photo order:', error));
    }, []);

    useEffect(() => {
        const loadPhoto = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get(`/member-admin/profile/portfolio/photo/${id}`);
                const data = response.data?.data || response.data;
                setCurrentPhoto(data || null);
            } catch (error) {
                console.error('Error loading photo:', error);
                setCurrentPhoto(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadPhoto();
    }, [id]);

    const memberName = currentPhoto?.gallery_name || 'My Gallery';
    const positionInList = photoIds.indexOf(Number(id));

    const prev = () => {
        if (photoIds.length === 0) return;
        const i = positionInList >= 0 ? positionInList : 0;
        navigate(`/my-gallery/${photoIds[(i - 1 + photoIds.length) % photoIds.length]}`);
    };
    const next = () => {
        if (photoIds.length === 0) return;
        const i = positionInList >= 0 ? positionInList : 0;
        navigate(`/my-gallery/${photoIds[(i + 1) % photoIds.length]}`);
    };

    const getImageUrl = (photo) => {
        if (!photo) return '';
        return photo.large_url || photo.medium_url || photo.image_url || photo.original_url || photo.thumb_url || '';
    };

    const shareImage = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: currentPhoto?.title || 'Photo', url });
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
        }
    };

    const postComment = async () => {
        if (!newComment.trim() || posting || !currentPhoto?.id) return;
        try {
            setPosting(true);
            const response = await apiClient.post(`/photos/${currentPhoto.id}/comments`, {
                body: newComment.trim(),
            });
            const comment = response.data?.data || {
                id: Date.now(),
                comment: newComment.trim(),
                posted_by: 'You',
            };
            setCurrentPhoto(prev => ({ ...prev, comments: [...(prev.comments || []), comment] }));
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setPosting(false);
        }
    };

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
                                            <div className='profile-left' style={{ justifyContent: 'space-between', display: 'flex' }}>
                                                <div className='profile-info'>
                                                    <small className="greeting">My Gallery</small>
                                                    <h2 className="name">{memberName}</h2>
                                                    <small className="role">Image {positionInList >= 0 ? positionInList + 1 : 0} of {photoIds.length}</small>

                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button className="btn" onClick={() => navigate('/my-gallery')} id="e-view" style={{ maxWidth: '160px', width: '160px' }}>Back to Gallery</button>
                                                    {currentPhoto && (
                                                        <button className="btn" onClick={() => navigate(`/my-gallery/${id}/edit`)} id="edit">
                                                            <i className="fas fa-pen me-2"></i>Edit
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details" style={{ fontSize: '20px' }}>Likes</small>
                                                <h3 className="number">{currentPhoto?.likes_count || 0}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Comments</small>
                                                <h3 className="number">{currentPhoto?.comments?.length || 0}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    {currentPhoto ? (
                                        <>
                                            <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h5 className="head mt-5 mb-5">{memberName}'s Gallery</h5>
                                                    <div className="d-flex gap-3 text-secondary">
                                                        <button type="button" className="btn btn-link text-secondary p-0" title="Share" onClick={shareImage}><i className="fas fa-share-alt"></i></button>
                                                        <button type="button" className="btn btn-link text-secondary p-0" title="Fullscreen" onClick={() => setLightbox(true)}><i className="fas fa-expand"></i></button>
                                                    </div>
                                                </div>
                                                <div className="position-relative" style={{ cursor: 'zoom-in' }} onClick={() => setLightbox(true)}>
                                                    <button type="button" className="btn position-absolute top-50 start-0 translate-middle-y text-white" style={{ background: 'rgba(0,0,0,0.4)', zIndex: '1' }} onClick={(e) => { e.stopPropagation(); prev(); }}><i className="fas fa-chevron-left"></i></button>
                                                    <img src={getImageUrl(currentPhoto)} alt={currentPhoto?.title || 'Gallery'} className="w-100 rounded" style={{ maxHeight: '520px', objectFit: 'cover' }} />
                                                    <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y text-white" style={{ background: 'rgba(0,0,0,0.4)', zIndex: '1' }} onClick={(e) => { e.stopPropagation(); next(); }}><i className="fas fa-chevron-right"></i></button>
                                                </div>
                                                <h5 className="head mt-4">{currentPhoto?.title || ''}</h5>
                                                <p className="text-secondary">{currentPhoto?.description || ''}</p>
                                            </div>

                                            <div className="row g-4 mt-1">
                                                <div className="col-md-6">
                                                    <div className="card bg-white border-0 rounded shadow-sm p-4" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                                        <h5 className="head mt-5 mb-5">Comments</h5>
                                                        {currentPhoto?.comments?.length ? (
                                                            currentPhoto.comments.map((c, idx) => (
                                                                <div key={c.id ?? idx} className="d-flex gap-2 mb-3">
                                                                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '40px', height: '40px', flexShrink: '0' }}>
                                                                        <i className="fa-regular fa-user"></i>
                                                                    </div>
                                                                    <div>
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <strong className="small">{c.posted_by || 'Unknown'}</strong>
                                                                        </div>
                                                                        <p className="mb-1 small">{c.comment}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-muted small">No comments yet.</p>
                                                        )}
                                                        <form className="d-flex gap-2 mt-2" onSubmit={(e) => { e.preventDefault(); postComment(); }}>
                                                            <input className="form-control" placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                                                            <button className="btn" id="edit" disabled={posting}>{posting ? '...' : 'Post'}</button>
                                                        </form>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="card bg-white border-0 rounded shadow-sm p-4">
                                                        <h5 className="head mt-5 mb-5">Likes</h5>
                                                        <div className="d-flex flex-wrap gap-3">
                                                            {currentPhoto?.likes?.length ? (
                                                                currentPhoto.likes.map((like, i) => (
                                                                    <div key={like.id ?? i} className="d-flex flex-column align-items-center" style={{ width: '64px' }}>
                                                                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '48px', height: '48px' }}>
                                                                            <i className="fas fa-heart" style={{ color: '#cc445e' }}></i>
                                                                        </div>
                                                                        <small className="text-truncate" style={{ maxWidth: '64px' }}>{like.liked_by}</small>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-muted small mb-0">No likes yet.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-5">
                                            <p className="text-muted mb-0">No gallery images found.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal </p>
                                    <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank">cameraclub.website</a></p>
                                </div>
                            </footer>
                        </div>

                        {lightbox && currentPhoto && (
                            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column" style={{ background: '#000', zIndex: '1050' }}>
                                <div className="d-flex align-items-center p-3">
                                    <button type="button" className="btn text-white d-flex align-items-center gap-2" onClick={() => setLightbox(false)}>
                                        <i className="fas fa-chevron-left"></i> Back
                                    </button>
                                </div>
                                <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative px-5">
                                    <button type="button" className="btn position-absolute start-0 text-white" onClick={prev}><i className="fas fa-chevron-left fa-2x"></i></button>
                                    <img src={getImageUrl(currentPhoto)} alt="Lightbox" className="rounded" style={{ maxHeight: '70vh', maxWidth: '85%', objectFit: 'contain' }} />
                                    <button type="button" className="btn position-absolute end-0 text-white" onClick={next}><i className="fas fa-chevron-right fa-2x"></i></button>
                                </div>
                                {filmstrip.length > 1 && (
                                    <div className="d-flex gap-2 justify-content-center p-3 flex-wrap">
                                        {filmstrip.map((p) => (
                                            <img key={p.id} src={p.image} alt="" onClick={() => navigate(`/my-gallery/${p.id}`)} style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: String(p.id) === String(id) ? '3px solid #cc445e' : '3px solid transparent', opacity: String(p.id) === String(id) ? 1 : 0.6, }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
export default PhotographerGallerySingle;
