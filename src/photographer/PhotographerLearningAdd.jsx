import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

const emptyForm = {
    title: '', description: '',
    shutterMin: '', shutterMax: '', isoMin: '', isoMax: '', apertureMin: '', apertureMax: '',
    lens: '', camera: '', whiteBalance: '', noiseReduction: '', notes: '',
    accessories: [], tags: [], visibility: 'public',
};

function PhotographerLearningAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState(emptyForm);
    const [accessoryInput, setAccessoryInput] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [isLoading, setIsLoading] = useState(Boolean(id));
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchSheet = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get(`/cheat-sheets/${id}`);
                const s = response.data?.data || response.data;
                setForm({
                    title: s.title || '',
                    description: s.description || '',
                    shutterMin: s.shutter_min ?? '',
                    shutterMax: s.shutter_max ?? '',
                    isoMin: s.iso_min ?? '',
                    isoMax: s.iso_max ?? '',
                    apertureMin: s.aperture_min ?? '',
                    apertureMax: s.aperture_max ?? '',
                    lens: s.lens || '',
                    camera: s.camera || '',
                    whiteBalance: s.white_balance || '',
                    noiseReduction: s.noise_reduction || '',
                    notes: s.notes || '',
                    accessories: s.accessories || [],
                    tags: s.tags || [],
                    visibility: s.visibility || 'public',
                });
                setExistingImage(s.reference_image || '');
            } catch (error) {
                console.error('Error loading cheat sheet:', error);
                alert(error?.response?.data?.message || 'Unable to load cheat sheet.');
                navigate('/learn');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSheet();
    }, [id]);

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
    const addAccessory = () => { if (!accessoryInput.trim()) return; update('accessories', [...form.accessories, accessoryInput.trim()]); setAccessoryInput(''); };
    const addTag = () => { if (!tagInput.trim()) return; update('tags', [...form.tags, tagInput.trim()]); setTagInput(''); };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        setImageFile(file || null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const payload = new FormData();
            payload.append('title', form.title);
            payload.append('description', form.description || '');
            if (form.shutterMin !== '') payload.append('shutter_min', form.shutterMin);
            if (form.shutterMax !== '') payload.append('shutter_max', form.shutterMax);
            if (form.isoMin !== '') payload.append('iso_min', form.isoMin);
            if (form.isoMax !== '') payload.append('iso_max', form.isoMax);
            if (form.apertureMin !== '') payload.append('aperture_min', form.apertureMin);
            if (form.apertureMax !== '') payload.append('aperture_max', form.apertureMax);
            payload.append('lens', form.lens || '');
            payload.append('camera', form.camera || '');
            payload.append('white_balance', form.whiteBalance || '');
            payload.append('noise_reduction', form.noiseReduction || '');
            payload.append('notes', form.notes || '');
            form.accessories.forEach(a => payload.append('accessories[]', a));
            form.tags.forEach(t => payload.append('tags[]', t));
            payload.append('visibility', form.visibility);
            if (imageFile) payload.append('reference_image', imageFile);

            if (id) {
                await apiClient.post(`/cheat-sheets/${id}`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    params: { _method: 'PUT' },
                });
            } else {
                await apiClient.post('/cheat-sheets', payload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            navigate('/learn');
        } catch (error) {
            console.error('Error saving cheat sheet:', error);
            alert(error?.response?.data?.message || 'Unable to save cheat sheet.');
        } finally {
            setIsSaving(false);
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
                            <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                                <h4 className="head mb-4">{id ? 'Edit Sheet' : 'Add New Sheet'}</h4>
                                <form onSubmit={handleSave}>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6"><label className="form-label">Title</label><input className="form-control" placeholder="Text here..." value={form.title} onChange={(e) => update('title', e.target.value)} required /></div>
                                        <div className="col-md-6"><label className="form-label">Description</label><textarea className="form-control" rows="4" placeholder="Text here..." value={form.description} onChange={(e) => update('description', e.target.value)}></textarea></div>
                                        <div className="col-md-6">
                                            <label className="form-label">Upload Reference Image</label>
                                            <div className="border rounded d-flex flex-column align-items-center justify-content-center text-muted position-relative" style={{ height: '110px', borderStyle: 'dashed' }}>
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Reference" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <>
                                                        <i className="fas fa-image mb-2"></i><span>Upload image</span>
                                                    </>
                                                )}
                                                <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                            </div>
                                        </div>
                                    </div>

                                    <h6 className="head mb-3">Manual Settings</h6>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label">Shutter</label>
                                            <div className="d-flex gap-2 align-items-center">
                                                <input className="form-control" value={form.shutterMin} onChange={(e) => update('shutterMin', e.target.value)} />
                                                <span>—</span>
                                                <input className="form-control" value={form.shutterMax} onChange={(e) => update('shutterMax', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">ISO</label>
                                            <div className="d-flex gap-2 align-items-center">
                                                <input type="number" className="form-control" value={form.isoMin} onChange={(e) => update('isoMin', e.target.value)} />
                                                <span>—</span>
                                                <input type="number" className="form-control" value={form.isoMax} onChange={(e) => update('isoMax', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Aperture</label>
                                            <div className="d-flex gap-2 align-items-center">
                                                <input type="number" step="0.1" className="form-control" value={form.apertureMin} onChange={(e) => update('apertureMin', e.target.value)} />
                                                <span>—</span>
                                                <input type="number" step="0.1" className="form-control" value={form.apertureMax} onChange={(e) => update('apertureMax', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    <h6 className="head mb-3">Essential Settings</h6>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6"><label className="form-label">Lens</label><input className="form-control" placeholder="Text here..." value={form.lens} onChange={(e) => update('lens', e.target.value)} /></div>
                                        <div className="col-md-6"><label className="form-label">Camera</label><input className="form-control" placeholder="Text here..." value={form.camera} onChange={(e) => update('camera', e.target.value)} /></div>
                                        <div className="col-md-6"><label className="form-label">White Balance</label><input className="form-control" placeholder="Text here..." value={form.whiteBalance} onChange={(e) => update('whiteBalance', e.target.value)} /></div>
                                        <div className="col-md-6"><label className="form-label">In Camera Noise Reduction</label><input className="form-control" placeholder="Text here..." value={form.noiseReduction} onChange={(e) => update('noiseReduction', e.target.value)} /></div>
                                        <div className="col-md-12"><label className="form-label">Notes</label><textarea className="form-control" rows="3" placeholder="Text here..." value={form.notes} onChange={(e) => update('notes', e.target.value)}></textarea></div>
                                    </div>

                                    <h6 className="head mb-2">Accessories</h6>
                                    <div className="d-flex gap-2 mb-2">
                                        <input className="form-control" placeholder="Accessories" value={accessoryInput} onChange={(e) => setAccessoryInput(e.target.value)} />
                                        <button type="button" className="btn text-white text-nowrap" style={{ backgroundColor: '#3a2e26' }} onClick={addAccessory}>+ Add Item</button>
                                    </div>
                                    <div className="d-flex gap-2 flex-wrap mb-4">
                                        {form.accessories.map((a, i) => <span key={i} className="badge" style={{ backgroundColor: '#f3e9e0', color: '#99816b' }}>{a}</span>)}
                                    </div>

                                    <h6 className="head mb-2">Tag</h6>
                                    <div className="d-flex gap-2 mb-2">
                                        <input className="form-control" placeholder="Text here..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
                                        <button type="button" className="btn text-white text-nowrap" style={{ backgroundColor: '#3a2e26' }} onClick={addTag}>+ Add Tag</button>
                                    </div>
                                    <div className="d-flex gap-2 flex-wrap mb-4">
                                        {form.tags.map((t, i) => <span key={i} className="badge" style={{ backgroundColor: '#f3e2e6', color: '#cc445e' }}>{t}</span>)}
                                    </div>

                                    <h6 className="head mb-2">Visibility</h6>
                                    <div className="d-flex gap-3 mb-4">
                                        {['public', 'private'].map(v => (
                                            <label key={v} className="border rounded px-3 py-2 d-flex align-items-center gap-2" style={{ cursor: 'pointer', textTransform: 'capitalize' }}>
                                                <input type="radio" name="visibility" checked={form.visibility === v} onChange={() => update('visibility', v)} /> {v}
                                            </label>
                                        ))}
                                    </div>

                                    <div className="d-flex gap-2 pt-3 border-top">
                                        <button type="submit" className="btn" id="e-edit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                        <button type="button" className="btn" id="e-view" onClick={() => navigate('/learn')} disabled={isSaving}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default PhotographerLearningAdd;
