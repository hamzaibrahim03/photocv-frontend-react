import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';


function PhotographerGalleryEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState({ first_name: 'Photographer', last_name: '', profile_image_url: '/placeholder.jpg' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });

    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [allowComments, setAllowComments] = useState(true);
    const [allowLikes, setAllowLikes] = useState(true);
    const [visibility, setVisibility] = useState('public');
    const [showInPortfolio, setShowInPortfolio] = useState(true);
    const [showExif, setShowExif] = useState(true);

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

    useEffect(() => {
        const loadPhoto = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`/member-admin/profile/portfolio/photo/${id}`);
                const data = response.data?.data || response.data;
                setTitle(data?.title || '');
                setDescription(data?.description || '');
                setAllowComments(data?.allow_comments !== false);
                setAllowLikes(data?.allow_likes !== false);
                setVisibility(data?.visibility || 'public');
                setShowInPortfolio(data?.show_in_portfolio !== false);
                setShowExif(data?.show_exif !== false);
                setExistingImageUrl(data?.large_url || data?.medium_url || data?.image_url || '');
            } catch (error) {
                console.error('Error loading photo:', error);
                setError('Unable to load this photo.');
            } finally {
                setIsLoading(false);
            }
        };
        loadPhoto();
    }, [id]);

    const imagePreview = imageFile ? URL.createObjectURL(imageFile) : existingImageUrl;

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append('title', title);
            payload.append('description', description);
            payload.append('allow_comments', allowComments ? '1' : '0');
            payload.append('allow_likes', allowLikes ? '1' : '0');
            payload.append('visibility', visibility);
            payload.append('show_in_portfolio', showInPortfolio ? '1' : '0');
            payload.append('show_exif', showExif ? '1' : '0');
            if (imageFile) payload.append('image', imageFile);

            await apiClient.post(`/gallery-photo/${id}/update`, payload, {
                headers: { 'Content-Type': undefined },
            });
            navigate(`/my-gallery/${id}`);
        } catch (error) {
            console.error('Error updating photo:', error);
            setError(error?.response?.data?.message || 'Unable to update this photo.');
        } finally {
            setIsSaving(false);
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
                                    <div className="dashboard-card" id="cl">
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
                                                        <h3 className="number">{totals.totalLikes + totals.totalComments}</h3>
                                                    </div>
                                                    <div className="days col-md-7 text-start">
                                                        <span>Likes &amp; Comments</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                                        {error && <div className="alert alert-danger">{error}</div>}
                                        <form onSubmit={handleSave}>
                                            <div className="row g-4 mb-4">
                                                <div className="col-md-6">
                                                    <label className="form-label">Upload Image</label>
                                                    <label className="border rounded d-flex flex-column align-items-center justify-content-center text-muted" style={{ height: '280px', borderStyle: 'dashed', cursor: 'pointer' }}>
                                                        <i className="fas fa-image mb-2" style={{ fontSize: '24px' }}></i>
                                                        <span>Upload image</span>
                                                        <input type="file" accept="image/*" className="d-none" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                                                    </label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Preview Image</label>
                                                    <div className="border rounded overflow-hidden" style={{ height: '280px', backgroundColor: '#f3ede7' }}>
                                                        {imagePreview ? (
                                                            <img src={imagePreview} alt="Preview" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                                        ) : (
                                                            <div className="d-flex align-items-center justify-content-center h-100 text-muted">No image</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row g-4 mb-4">
                                                <div className="col-md-6">
                                                    <label className="form-label">Title</label>
                                                    <input className="form-control" placeholder="Text here..." value={title} onChange={(e) => setTitle(e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Description</label>
                                                    <textarea className="form-control" rows="4" placeholder="Text here..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                                </div>
                                            </div>

                                            <h6 className="head mt-5 mb-5">Image Settings</h6>
                                            <div className="row g-4 mb-4">
                                                <div className="col-md-6">
                                                    <label>Comments</label>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="premium-radio">
                                                                <input type="radio" id="comments-enable" name="comments" value="enable" />
                                                                <label htmlFor="comments-enable">
                                                                    <span className="premium-radio-circle" />
                                                                    <span className="premium-radio-content">
                                                                        <span className="premium-radio-title">
                                                                            Enable
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="premium-radio">
                                                                <input type="radio" id="comments-disable" name="comments" value="disable" />
                                                                <label htmlFor="comments-disable">
                                                                    <span className="premium-radio-circle" />
                                                                    <span className="premium-radio-content">
                                                                        <span className="premium-radio-title">
                                                                            Disable
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Likes</label>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="premium-radio">
                                                                <input type="radio" id="likes-enable" name="likes" value="enable" />
                                                                <label htmlFor="likes-enable">
                                                                    <span className="premium-radio-circle" />
                                                                    <span className="premium-radio-content">
                                                                        <span className="premium-radio-title">
                                                                            Enable
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="premium-radio">
                                                                <input type="radio" id="likes-disable" name="likes" value="disable" />
                                                                <label htmlFor="likes-disable">
                                                                    <span className="premium-radio-circle" />
                                                                    <span className="premium-radio-content">
                                                                        <span className="premium-radio-title">
                                                                            Disable
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md-6">
                                                    <label>Appearance</label>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="premium-radio">
                                                                <input type="radio" id="appearance-public" name="appearance" value="public" />
                                                                <label htmlFor="appearance-public">
                                                                    <span className="premium-radio-circle" />
                                                                    <span className="premium-radio-content">
                                                                        <span className="premium-radio-title">
                                                                            Public
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="premium-radio">
                                                                <input type="radio" id="appearance-private" name="appearance" value="private" />
                                                                <label htmlFor="appearance-private">
                                                                    <span className="premium-radio-circle" />
                                                                    <span className="premium-radio-content">
                                                                        <span className="premium-radio-title">
                                                                            Private
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <label>Display in Portfolio</label>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="premium-radio">
                                                                <input type="radio" id="portfolio-enable" name="portfolio" value="enable" />
                                                                <label htmlFor="portfolio-enable">
                                                                    <span className="premium-radio-circle" />
                                                                    <span className="premium-radio-content">
                                                                        <span className="premium-radio-title">
                                                                            Enable
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="premium-radio">
                                                                <input type="radio" id="portfolio-disable" name="portfolio" value="disable" />
                                                                <label htmlFor="portfolio-disable">
                                                                    <span className="premium-radio-circle" />
                                                                    <span className="premium-radio-content">
                                                                        <span className="premium-radio-title">
                                                                            Disable
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h6 className="head mt-5 mb-5">EXIF Details</h6>
                                            <div className="row g-4 mb-4">
                                                <div className="col-md-6">
                                                    <label>EXIF Display</label>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="premium-radio">
                                                                <input type="radio" id="exif-enable" name="exif" value="enable" />
                                                                <label htmlFor="exif-enable">
                                                                    <span className="premium-radio-circle" />
                                                                    <span className="premium-radio-content">
                                                                        <span className="premium-radio-title">
                                                                            Enable
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="premium-radio">
                                                                <input type="radio" id="exif-disable" name="exif" value="disable" />
                                                                <label htmlFor="exif-disable">
                                                                    <span className="premium-radio-circle" />
                                                                    <span className="premium-radio-content">
                                                                        <span className="premium-radio-title">
                                                                            Disable
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex gap-2 pt-3 border-top">
                                                <button type="submit" className="btn" id="edit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                                <button type="button" className="btn" id="e-view" onClick={() => navigate(`/my-gallery/${id}`)}>Cancel</button>
                                            </div>
                                        </form>
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
export default PhotographerGalleryEdit;
