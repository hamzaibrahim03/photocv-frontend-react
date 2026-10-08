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
                            <div className="card bg-white mt-4 border-0 rounded shadow-sm p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="head m-0">{editId ? 'Edit' : 'Add New'} {type === 'location' ? 'Planned Location' : 'Planned Day Out'}</h4>
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
                                            <div className="col-md-12">
                                                <label className="form-label fw-medium">Description</label>
                                                <textarea className="form-control" rows="4" placeholder="Text here..." value={locationForm.description} onChange={(e) => updateLocation('description', e.target.value)}></textarea>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Feature Image</label>
                                                <div className="border rounded d-flex flex-column align-items-center justify-content-center text-muted position-relative" style={{ height: '160px', borderStyle: 'dashed', cursor: 'pointer' }}>
                                                    {imagePreview ? (
                                                        <img src={imagePreview} alt="Location" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-image mb-2" style={{ fontSize: '24px' }}></i>
                                                            <span>Upload image</span>
                                                        </>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                                </div>
                                            </div>
                                            <div className="col-md-6 d-flex align-items-center">
                                                <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                                                    <input type="checkbox" checked={locationForm.visited} onChange={(e) => updateLocation('visited', e.target.checked)} /> Visited
                                                </label>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                                            <button type="button" className="btn text-white" style={{ backgroundColor: '#99816b' }} onClick={() => navigate('/plans')}>Back</button>
                                            <div className="d-flex gap-2">
                                                <button type="submit" className="btn text-white" style={{ backgroundColor: '#3a2e26' }} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                                {editId && <button type="button" className="btn text-white" style={{ backgroundColor: '#99816b' }} onClick={handleDelete}>Delete</button>}
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
                                            <button type="button" className="btn text-white" style={{ backgroundColor: '#99816b' }} onClick={() => navigate('/plans')}>Back</button>
                                            <div className="d-flex gap-2">
                                                <button type="submit" className="btn text-white" style={{ backgroundColor: '#3a2e26' }} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                                {editId && <button type="button" className="btn text-white" style={{ backgroundColor: '#99816b' }} onClick={handleDelete}>Delete</button>}
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default PhotographerPlanAdd;
