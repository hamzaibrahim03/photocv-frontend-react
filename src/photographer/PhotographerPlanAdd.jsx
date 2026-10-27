import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

const emptyLocationForm = { title: '', location: '', description: '', visited: false };
const emptyDayOutForm = { title: '', plannedDate: '', location: '', photographyDescription: '', description: '', gear: '', status: 'upcoming' };

function PhotographerPlanAdd() {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const params = new URLSearchParams(routerLocation.search);
    const editId = params.get('id');
    const initialType = params.get('type') === 'dayout' ? 'dayout' : 'location';

    const [type, setType] = useState(initialType);
    const [locationForm, setLocationForm] = useState(emptyLocationForm);
    const [dayOutForm, setDayOutForm] = useState(emptyDayOutForm);
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [isLoading, setIsLoading] = useState(Boolean(editId));
    const [isSaving, setIsSaving] = useState(false);
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

    useEffect(() => {
        if (!editId) return;
        const fetchRecord = async () => {
            try {
                setIsLoading(true);
                if (type === 'location') {
                    const response = await apiClient.get(`/planned-locations/${editId}`);
                    const l = response.data?.data || response.data;
                    setLocationForm({
                        title: l.title || '',
                        location: l.location || '',
                        description: l.description || '',
                        visited: !!l.visited,
                    });
                    setExistingImage(l.feature_image || '');
                } else {
                    const response = await apiClient.get(`/planned-day-outs/${editId}`);
                    const d = response.data?.data || response.data;
                    setDayOutForm({
                        title: d.title || '',
                        plannedDate: d.planned_date ? d.planned_date.substring(0, 10) : '',
                        location: d.location || '',
                        photographyDescription: d.photography_description || '',
                        description: d.description || '',
                        gear: d.gear || '',
                        status: d.status || 'upcoming',
                    });
                }
            } catch (error) {
                console.error('Error loading plan:', error);
                alert(error?.response?.data?.message || 'Unable to load record.');
                navigate('/plans');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecord();
    }, [editId, type]);

    const updateLocation = (key, value) => setLocationForm(prev => ({ ...prev, [key]: value }));
    const updateDayOut = (key, value) => setDayOutForm(prev => ({ ...prev, [key]: value }));
    const handleImageChange = (e) => setImageFile(e.target.files?.[0] || null);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            if (type === 'location') {
                const payload = new FormData();
                payload.append('title', locationForm.title);
                payload.append('location', locationForm.location || '');
                payload.append('description', locationForm.description || '');
                payload.append('visited', locationForm.visited ? '1' : '0');
                if (imageFile) payload.append('feature_image', imageFile);

                if (editId) {
                    await apiClient.post(`/planned-locations/${editId}`, payload, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        params: { _method: 'PUT' },
                    });
                } else {
                    await apiClient.post('/planned-locations', payload, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                }
            } else {
                const body = {
                    title: dayOutForm.title,
                    planned_date: dayOutForm.plannedDate || null,
                    location: dayOutForm.location || '',
                    photography_description: dayOutForm.photographyDescription || '',
                    description: dayOutForm.description || '',
                    gear: dayOutForm.gear || '',
                    status: dayOutForm.status || 'upcoming',
                };
                if (editId) {
                    await apiClient.put(`/planned-day-outs/${editId}`, body);
                } else {
                    await apiClient.post('/planned-day-outs', body);
                }
            }
            navigate('/plans');
        } catch (error) {
            console.error('Error saving plan:', error);
            alert(error?.response?.data?.message || 'Unable to save record.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!editId || !window.confirm('Delete this record?')) return;
        try {
            if (type === 'location') {
                await apiClient.delete(`/planned-locations/${editId}`);
            } else {
                await apiClient.delete(`/planned-day-outs/${editId}`);
            }
            navigate('/plans');
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert(error?.response?.data?.message || 'Unable to delete record.');
        }
    };

    const imagePreview = imageFile ? URL.createObjectURL(imageFile) : existingImage;

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
                                    <div className="card bg-white mt-4 border-0 rounded shadow-sm p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h4 className="head mb-5 mt-5">{editId ? 'Edit' : 'Add New'} {type === 'location' ? 'Planned Location' : 'Planned Day Out'}</h4>
                                            {!editId && (
                                                <div className="d-flex gap-2">
                                                    <button type="button" className={`btn ${type === 'location' ? '' : 'btn-outline-secondary'}`} style={type === 'location' ? { backgroundColor: '#3a2e26', color: '#fff' } : {}} onClick={() => setType('location')}>Planned Location</button>
                                                    <button type="button" className={`btn ${type === 'dayout' ? '' : 'btn-outline-secondary'}`} style={type === 'dayout' ? { backgroundColor: '#3a2e26', color: '#fff' } : {}} onClick={() => setType('dayout')}>Day Out</button>
                                                </div>
                                            )}
                                        </div>

                                        {type === 'location' ? (
                                            <form onSubmit={handleSave}>
                                                <div className="row g-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Title</label>
                                                        <input className="form-control" placeholder="Text here..." value={locationForm.title} onChange={(e) => updateLocation('title', e.target.value)} required />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Location</label>
                                                        <input className="form-control" placeholder="Text here..." value={locationForm.location} onChange={(e) => updateLocation('location', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="row g-4 mt-1">
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Description</label>
                                                        <textarea className="form-control" rows="6" placeholder="Text here..." value={locationForm.description} onChange={(e) => updateLocation('description', e.target.value)}></textarea>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Image</label>
                                                        <label htmlFor="plan-location-image" className="d-flex flex-column align-items-center justify-content-center text-center" style={{ border: '1px dashed #a0846c', borderRadius: '8px', minHeight: '140px', cursor: 'pointer', overflow: 'hidden', background: '#fdfbf9' }}>
                                                            {imagePreview ? (
                                                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                                                            ) : (
                                                                <>
                                                                    <i className="fas fa-cloud-upload-alt mb-2" style={{ color: '#cc445e', fontSize: '22px' }}></i>
                                                                    <span className="small text-muted">Drag image to upload<br />or <span style={{ color: '#cc445e' }}>Browse Image</span></span>
                                                                </>
                                                            )}
                                                            <input id="plan-location-image" type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                                                    <button type="button" className="btn" id="e-view" onClick={() => navigate('/plans')}>Back</button>
                                                    <div className="d-flex gap-2">
                                                        <button type="submit" className="btn" id="edit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                                        {editId && <button type="button" className="btn" id="e-view" onClick={handleDelete}>Delete</button>}
                                                    </div>
                                                </div>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleSave}>
                                                <div className="row g-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Title</label>
                                                        <input className="form-control" placeholder="Text here..." value={dayOutForm.title} onChange={(e) => updateDayOut('title', e.target.value)} required />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Planned Date</label>
                                                        <input type="date" className="form-control" value={dayOutForm.plannedDate} onChange={(e) => updateDayOut('plannedDate', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label className="form-label fw-medium">Location</label>
                                                        <input className="form-control" placeholder="Text here..." value={dayOutForm.location} onChange={(e) => updateDayOut('location', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Description</label>
                                                        <textarea className="form-control" rows="4" placeholder="Text here..." value={dayOutForm.description} onChange={(e) => updateDayOut('description', e.target.value)}></textarea>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Photography Description</label>
                                                        <textarea className="form-control" rows="4" placeholder="Text here..." value={dayOutForm.photographyDescription} onChange={(e) => updateDayOut('photographyDescription', e.target.value)}></textarea>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Gear</label>
                                                        <input className="form-control" placeholder="Text here..." value={dayOutForm.gear} onChange={(e) => updateDayOut('gear', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-medium">Status</label>
                                                        <select className="form-select" value={dayOutForm.status} onChange={(e) => updateDayOut('status', e.target.value)}>
                                                            <option value="upcoming">Upcoming</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="visited">Visited</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                                                    <button type="button" className="btn" id="e-view" onClick={() => navigate('/plans')}>Back</button>
                                                    <div className="d-flex gap-2">
                                                        <button type="submit" className="btn" id="edit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                                        {editId && <button type="button" className="btn" id="e-view" onClick={handleDelete}>Delete</button>}
                                                    </div>
                                                </div>
                                            </form>
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
                )
                }
            </div>
        </>
    );
}
export default PhotographerPlanAdd;
