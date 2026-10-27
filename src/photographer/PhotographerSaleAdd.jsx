import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

function PhotographerSaleAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [user, setUser] = useState({ first_name: 'Photographer', profile_image_url: '' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState('used');
    const [status, setStatus] = useState('active');
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            try {
                const tasks = [
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
                ];
                if (isEditMode) {
                    tasks.push(
                        apiClient.get(`/photographer/sales/${id}`).then((response) => {
                            const sale = response.data?.data;
                            if (!sale) return;
                            setTitle(sale.title || '');
                            setCategory(sale.category || '');
                            setDescription(sale.description || '');
                            setPrice(sale.price ?? '');
                            setCondition(sale.condition || 'used');
                            setStatus(sale.status || 'active');
                            setExistingImage(sale.image || '');
                        })
                    );
                }
                await Promise.all(tasks);
            } catch (error) {
                console.error('Error loading sale form:', error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [id, isEditMode]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setImageFile(file);
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        if (!title.trim() || price === '') {
            alert('Please fill in at least the title and price.');
            return;
        }
        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append('title', title.trim());
            payload.append('category', category.trim());
            payload.append('description', description.trim());
            payload.append('price', price);
            payload.append('condition', condition);
            payload.append('status', status);
            if (imageFile) payload.append('image', imageFile);

            if (isEditMode) {
                payload.append('_method', 'PUT');
                await apiClient.post(`/photographer/sales/${id}`, payload);
            } else {
                await apiClient.post('/photographer/sales', payload);
            }
            navigate('/my-sales');
        } catch (error) {
            console.error('Error saving listing:', error);
            alert(error.response?.data?.message || 'Unable to save listing.');
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
                                        <h4 className="head mb-5">{isEditMode ? 'Edit Item' : 'Add New Item'}</h4>
                                        <form onSubmit={submitForm}>
                                            <div className="row g-4">
                                                <div className="col-md-6">
                                                    <label className="form-label">Title</label>
                                                    <input type="text" className="form-control" placeholder="Text here..." value={title} onChange={(e) => setTitle(e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Category</label>
                                                    <input type="text" className="form-control" placeholder="Text here..." value={category} onChange={(e) => setCategory(e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Description</label>
                                                    <textarea className="form-control" rows="6" placeholder="Text here..." value={description} onChange={(e) => setDescription(e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Upload Image</label>
                                                    <label htmlFor="sale-image-upload" className="d-flex flex-column align-items-center justify-content-center rounded" style={{ border: '1px dashed #a0846c', height: '155px', cursor: 'pointer', overflow: 'hidden' }}>
                                                        {imageFile ? (
                                                            <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : existingImage ? (
                                                            <img src={existingImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-image fa-lg text-muted mb-2"></i>
                                                                <small className="text-muted">Upload image</small>
                                                            </>
                                                        )}
                                                    </label>
                                                    <input id="sale-image-upload" type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Price</label>
                                                    <input type="number" min="0" step="0.01" className="form-control" placeholder="Text here..." value={price} onChange={(e) => setPrice(e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label d-block">Condition</label>
                                                    <div className="d-flex gap-3">
                                                        <div className="premium-radio">
                                                            <input type="radio" id="condition-used" name="condition" value="used" checked={condition === 'used'} onChange={() => setCondition('used')} />
                                                            <label htmlFor="condition-used">
                                                                <span className="premium-radio-circle" />
                                                                <span className="premium-radio-content">
                                                                    <span className="premium-radio-title">
                                                                        Used
                                                                    </span>
                                                                </span>
                                                            </label>
                                                        </div>
                                                        <div className="premium-radio">
                                                            <input type="radio" id="condition-new" name="condition" value="new" checked={condition === 'new'} onChange={() => setCondition('new')} />
                                                            <label htmlFor="condition-new">
                                                                <span className="premium-radio-circle" />
                                                                <span className="premium-radio-content">
                                                                    <span className="premium-radio-title">
                                                                        New
                                                                    </span>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label d-block">Status</label>
                                                    <div className="d-flex gap-3">
                                                        <div className="premium-radio">
                                                            <input type="radio" id="status-active" name="status" value="active" checked={status === 'active'} onChange={() => setStatus('active')} />
                                                            <label htmlFor="status-active">
                                                                <span className="premium-radio-circle" />
                                                                <span className="premium-radio-content">
                                                                    <span className="premium-radio-title">
                                                                        Active
                                                                    </span>
                                                                </span>
                                                            </label>
                                                        </div>
                                                        <div className="premium-radio">
                                                            <input type="radio" id="status-sold" name="status" value="sold" checked={status === 'sold'} onChange={() => setStatus('sold')} />
                                                            <label htmlFor="status-sold">
                                                                <span className="premium-radio-circle" />
                                                                <span className="premium-radio-content">
                                                                    <span className="premium-radio-title">
                                                                        Sold
                                                                    </span>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-3 mt-4">
                                                <button type="submit" className="btn" id="e-view" disabled={isSaving}>
                                                    {isSaving ? 'Saving...' : 'Save'}
                                                </button>
                                                <button type="button" className="btn" id="edit" onClick={() => navigate('/my-sales')}>Cancel</button>
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
export default PhotographerSaleAdd;
