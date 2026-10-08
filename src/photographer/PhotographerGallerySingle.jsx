import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient, { readApiResponse } from '../api/axios';

function PhotographerGallerySingle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [index, setIndex] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [posting, setPosting] = useState(false);
    const [lightbox, setLightbox] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOwnGallery = async () => {
            try {
                setIsLoading(true);
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                const memberId = storedUser?.id;
                const username = storedUser?.username || 'rytonlocal';
                if (!memberId) {
                    console.error('No logged-in member id found.');
                    setPhotos([]);
                    return;
                }
                const response = await fetch(
                    `http://${username}-staging.cameraclub.website:8000/api/v1/member/${memberId}/galleries`,
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                        },
                    }
                );
                const data = await readApiResponse(response);
                if (!response.ok) {
                    throw new Error(data?.message || `API Error ${response.status}`);
                }
                const galleries = Array.isArray(data?.data?.galleries) ? data.data.galleries : [];
                const memberData = data?.data?.member || null;
                setMember(memberData);
                const flattened = galleries.flatMap((gallery) =>
                    (gallery.photos || []).map((photo) => ({
                        ...photo,
                        galleryName: gallery.gallery_name || 'Gallery',
                    }))
                );
                setPhotos(flattened);
                const targetId = parseInt(id, 10);
                const foundIndex = flattened.findIndex((p) => p.photo_id === targetId);
                setIndex(foundIndex >= 0 ? foundIndex : 0);
            } catch (error) {
                console.error('Error loading own gallery:', error);
                setPhotos([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadOwnGallery();
    }, [id]);

    const currentPhoto = photos[index];
    const memberName = useMemo(() => {
        if (!member) return 'My';
        const fullName = `${member.first_name || ''} ${member.last_name || ''}`.trim();
        return fullName || member.username || 'My';
    }, [member]);

    const prev = () => setIndex(i => (photos.length ? (i - 1 + photos.length) % photos.length : 0));
    const next = () => setIndex(i => (photos.length ? (i + 1) % photos.length : 0));

    const getImageUrl = (photo) => {
        if (!photo) return '';
        return photo.large_url || photo.medium_url || photo.image || photo.original_url || photo.thumb_url || '';
    };

    const postComment = async () => {
        if (!newComment.trim() || posting || !currentPhoto?.photo_id) return;
        try {
            setPosting(true);
            const response = await apiClient.post(`/photos/${currentPhoto.photo_id}/comments`, {
                body: newComment.trim(),
            });
            const comment = response.data?.data || {
                id: Date.now(),
                comment: newComment.trim(),
                posted_by: 'You',
            };
            setPhotos(prevPhotos => prevPhotos.map((p, i) =>
                i === index ? { ...p, comments: [...(p.comments || []), comment] } : p
            ));
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
                            <div className="dashboard-card">
                                <div className="profile-cardd-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded flex-grow-1">
                                    <div>
                                        <small className="text-muted">My Gallery</small>
                                        <h2 className="name">{memberName}</h2>
                                        <small className="text-danger">Image {photos.length ? index + 1 : 0} of {photos.length}</small>
                                    </div>
                                    <button className="btn" onClick={() => navigate('/my-gallery')} style={{ border: '1px solid #a0846c', color: '#a0846c' }}>Back to Gallery</button>
                                </div>
                                <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                    <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                        <small className="ca-details" style={{ fontSize: '20px' }}>Likes</small>
                                        <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{currentPhoto?.likes_count || 0}</h3>
                                    </div>
                                    <div className="event-cards text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                        <small className="ca-details" style={{ fontSize: '20px' }}>Comments</small>
                                        <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{currentPhoto?.comments?.length || 0}</h3>
                                    </div>
                                </div>
                            </div>

                            {currentPhoto ? (
                                <>
                                    <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                                        <h5 className="head mb-3">{memberName}'s Gallery</h5>
                                        <div className="position-relative" style={{ cursor: 'zoom-in' }} onClick={() => setLightbox(true)}>
                                            <button type="button" className="btn position-absolute top-50 start-0 translate-middle-y text-white" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 1 }} onClick={(e) => { e.stopPropagation(); prev(); }}><i className="fas fa-chevron-left"></i></button>
                                            <img src={getImageUrl(currentPhoto)} alt={currentPhoto?.title || 'Gallery'} className="w-100 rounded" style={{ maxHeight: '520px', objectFit: 'cover' }} />
                                            <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y text-white" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 1 }} onClick={(e) => { e.stopPropagation(); next(); }}><i className="fas fa-chevron-right"></i></button>
                                        </div>
                                        <h5 className="head mt-4">{currentPhoto?.title || ''}</h5>
                                        <p className="text-secondary">{currentPhoto?.description || ''}</p>
                                    </div>

                                    <div className="row g-4 mt-1">
                                        <div className="col-md-6">
                                            <div className="card bg-white border-0 rounded shadow-sm p-4" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                                <h5 className="head mb-3">Comments</h5>
                                                {currentPhoto?.comments?.length ? (
                                                    currentPhoto.comments.map((c, idx) => (
                                                        <div key={c.id ?? idx} className="d-flex gap-2 mb-3">
                                                            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
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
                                                    <button className="btn text-white" style={{ backgroundColor: '#3a2e26' }} disabled={posting}>{posting ? '...' : 'Post'}</button>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card bg-white border-0 rounded shadow-sm p-4">
                                                <h5 className="head mb-3">Likes</h5>
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

                        {lightbox && currentPhoto && (
                            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.92)', zIndex: 1050 }} onClick={() => setLightbox(false)}>
                                <div className="position-relative" style={{ maxWidth: '85%' }} onClick={(e) => e.stopPropagation()}>
                                    <button type="button" className="btn position-absolute top-50 start-0 translate-middle-y text-white" style={{ left: '-60px' }} onClick={prev}><i className="fas fa-chevron-left fa-2x"></i></button>
                                    <img src={getImageUrl(currentPhoto)} alt="Lightbox" className="rounded" style={{ maxHeight: '75vh', maxWidth: '100%', objectFit: 'contain' }} />
                                    <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y text-white" style={{ right: '-60px' }} onClick={next}><i className="fas fa-chevron-right fa-2x"></i></button>
                                    <button type="button" className="btn position-absolute text-white" style={{ top: '-40px', right: '0' }} onClick={() => setLightbox(false)}><i className="fas fa-times fa-2x"></i></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
export default PhotographerGallerySingle;
