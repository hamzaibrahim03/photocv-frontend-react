import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

function PhotographerWishlistAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isEditMode = Boolean(id);

    const [listType, setListType] = useState(searchParams.get('type') === 'gift' ? 'gift' : 'wish');
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [link, setLink] = useState('');
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            try {
                const tasks = [
                    apiClient.get('/gear-extras').then((response) => {
                        const extras = response.data?.data || response.data || {};
                        setCategories(extras.gear_categories || []);
                    }),
                ];
                if (isEditMode) {
                    tasks.push(
                        apiClient.get(`/gear-wishlists/${id}`).then((response) => {
                            const item = response.data?.data;
                            if (!item) return;
                            setListType(item.list_type || 'wish');
                            setTitle(item.title || '');
                            setBrand(item.brand || '');
                            setPrice(item.price ?? '');
                            setCategoryId(item.category?.id ?? '');
                            setLink(item.link || '');
                            setExistingImage(item.image || '');
                        })
                    );
                }
                await Promise.all(tasks);
            } catch (err) {
                console.error('Error loading wishlist item:', err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [id, isEditMode]);

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        if (!title.trim()) {
            setError('Please give this item a title.');
            return;
        }
        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append('list_type', listType);
            payload.append('title', title.trim());
            if (brand.trim()) payload.append('brand', brand.trim());
            if (price !== '') payload.append('price', price);
            if (categoryId) payload.append('category_id', categoryId);
            if (link.trim()) payload.append('link', link.trim());
            if (imageFile) payload.append('image', imageFile);

            if (isEditMode) {
                payload.append('_method', 'PUT');
                await apiClient.post(`/gear-wishlists/${id}`, payload, { headers: { 'Content-Type': undefined } });
            } else {
                await apiClient.post('/gear-wishlists', payload, { headers: { 'Content-Type': undefined } });
            }
            navigate('/gear');
        } catch (err) {
            console.error('Error saving wishlist item:', err);
            setError(err.response?.data?.message || 'Unable to save this item.');
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
                        <HeaderRoute title="Gear" />
                        <div className="content">
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-4">
                                        <h4 className="head mb-4">{isEditMode ? 'Edit Item' : 'Add New Item'}</h4>

                                        <div className="d-flex gap-3 mb-4">
                                            <div className="premium-radio">
                                                <input type="radio" id="list-wish" name="listType" value="new" checked={listType === 'wish'} onChange={() => setListType('wish')} />
                                                <label htmlFor="list-wish">
                                                    <span className="premium-radio-circle" />
                                                    <span className="premium-radio-content">
                                                        <span className="premium-radio-title">
                                                            Wish List
                                                        </span>
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="premium-radio">
                                                <input type="radio" id="list-gift" name="listType" value="new" checked={listType === 'gift'} onChange={() => setListType('gift')} />
                                                <label htmlFor="list-gift">
                                                    <span className="premium-radio-circle" />
                                                    <span className="premium-radio-content">
                                                        <span className="premium-radio-title">
                                                            Gift List
                                                        </span>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        {error && <div className="alert alert-danger py-2 small">{error}</div>}

                                        <form onSubmit={handleSave}>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Title</label>
                                                    <input className="form-control" placeholder="e.g. Travel Tripod" value={title} onChange={(e) => setTitle(e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Brand</label>
                                                    <input className="form-control" placeholder="e.g. Peak Design" value={brand} onChange={(e) => setBrand(e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Price</label>
                                                    <input type="number" min="0" step="0.01" className="form-control" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Category</label>
                                                    <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                                        <option value="">- None -</option>
                                                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Link (optional)</label>
                                                    <input type="url" className="form-control" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Upload Image</label>
                                                    <input type="file" accept="image/*" className="form-control" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                                                    {existingImage && !imageFile && (
                                                        <img src={existingImage} alt="Current" className="mt-2 rounded" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="d-flex gap-3 mt-4">
                                                <button type="submit" className="btn" id="edit" disabled={isSaving}>
                                                    {isSaving ? 'Saving...' : 'Save'}
                                                </button>
                                                <button type="button" className="btn" id="e-view" onClick={() => navigate('/gear')}>Cancel</button>
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
export default PhotographerWishlistAdd;
