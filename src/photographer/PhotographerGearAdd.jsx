import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import { suitabilityFields, suitabilityLabels, suitabilityBackendKeys, levelToScore, scoreToLevel } from './PhotographerGear';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

const emptyForm = {
    title: '', description: '', categoryId: '', price: '',
    system: '', type: '', modelName: '', storageName: '',
    purchaseDate: '', dealer: '', serialNumber: '', insured: '', firmwareLink: '',
    mount: '', dimensions: '', weight: '', focalMin: '', focalMax: '', apertureMin: '', apertureMax: '',
    focusDistance: '', magnification: '',
    suitability: Object.fromEntries(suitabilityFields.map(f => [f, 3])),
    shutterCount: '', priorityTag: '', notes: '', rating: 5,
};

function appendIfSet(payload, key, value) {
    if (value !== '' && value !== null && value !== undefined) {
        payload.append(key, value);
    }
}

function PhotographerGearAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [form, setForm] = useState(emptyForm);
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            try {
                const extrasRes = await apiClient.get('/gear-extras');
                const extras = extrasRes.data?.data || extrasRes.data || {};
                if (!cancelled) setCategories(extras.gear_categories || []);

                if (id) {
                    const gearRes = await apiClient.get(`/gears/${id}`);
                    const g = gearRes.data?.data || gearRes.data || {};
                    if (cancelled) return;
                    const suitability = { ...emptyForm.suitability };
                    suitabilityFields.forEach(f => {
                        const [primaryKey] = suitabilityBackendKeys[f];
                        const value = g.suitability?.[primaryKey]?.value;
                        if (value !== undefined) suitability[f] = scoreToLevel(value);
                    });
                    setForm({
                        ...emptyForm,
                        title: g.title || '',
                        description: g.description || '',
                        categoryId: g.category_id || '',
                        price: g.purchase_price ?? '',
                        system: g.system || '',
                        type: g.type || '',
                        modelName: g.model_name || '',
                        storageName: g.storage_name || '',
                        purchaseDate: g.purchase_date || '',
                        dealer: g.vendor || '',
                        serialNumber: g.serial_number || '',
                        insured: g.insured === true ? 'Yes' : g.insured === false ? 'No' : '',
                        firmwareLink: g.firmware_link || '',
                        mount: g.mount || '',
                        dimensions: g.dimensions ?? '',
                        weight: g.weight || '',
                        focalMin: g.min_focal_length ?? '',
                        focalMax: g.max_focal_length ?? '',
                        apertureMin: g.min_aperture ?? '',
                        apertureMax: g.max_aperture ?? '',
                        focusDistance: g.min_focus_distance ?? '',
                        magnification: g.max_magnification ?? '',
                        suitability,
                        shutterCount: g.shutter_count ?? '',
                        priorityTag: g.priority_tag || '',
                        notes: g.notes || '',
                        rating: g.rating || 5,
                    });
                    setExistingImage(g.image || '');
                }
            } catch (error) {
                console.error('Error loading gear:', error);
                if (id) {
                    alert(error?.response?.data?.message || 'Unable to load gear item.');
                    navigate('/gear');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [id]);

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
    const updateSuitability = (key, value) => setForm(prev => ({ ...prev, suitability: { ...prev.suitability, [key]: Number(value) } }));

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
            appendIfSet(payload, 'description', form.description);
            if (imageFile) payload.append('image', imageFile);
            appendIfSet(payload, 'category_id', form.categoryId);
            appendIfSet(payload, 'system', form.system);
            appendIfSet(payload, 'type', form.type);
            appendIfSet(payload, 'model_name', form.modelName);
            appendIfSet(payload, 'storage_name', form.storageName);
            appendIfSet(payload, 'purchase_price', form.price);
            appendIfSet(payload, 'purchase_date', form.purchaseDate);
            appendIfSet(payload, 'vendor', form.dealer);
            appendIfSet(payload, 'serial_number', form.serialNumber);
            if (form.insured === 'Yes') payload.append('insured', 1);
            if (form.insured === 'No') payload.append('insured', 0);
            appendIfSet(payload, 'firmware_link', form.firmwareLink);
            appendIfSet(payload, 'mount', form.mount);
            appendIfSet(payload, 'dimensions', form.dimensions);
            appendIfSet(payload, 'weight', form.weight);
            appendIfSet(payload, 'min_focal_length', form.focalMin);
            appendIfSet(payload, 'max_focal_length', form.focalMax);
            appendIfSet(payload, 'min_aperture', form.apertureMin);
            appendIfSet(payload, 'max_aperture', form.apertureMax);
            appendIfSet(payload, 'min_focus_distance', form.focusDistance);
            appendIfSet(payload, 'max_magnification', form.magnification);
            suitabilityFields.forEach(f => {
                const score = levelToScore(form.suitability[f]);
                suitabilityBackendKeys[f].forEach(key => payload.append(`suitability_${key}`, score));
            });
            appendIfSet(payload, 'shutter_count', form.shutterCount);
            appendIfSet(payload, 'priority_tag', form.priorityTag);
            appendIfSet(payload, 'notes', form.notes);
            payload.append('rating', form.rating);

            if (isEditMode) {
                await apiClient.post(`/gears/${id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' }, params: { _method: 'PUT' } });
                navigate(`/gear/${id}`);
            } else {
                await apiClient.post('/gears', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
                navigate('/gear');
            }
        } catch (error) {
            console.error('Error saving gear:', error);
            if (error?.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
            alert(error?.response?.data?.message || 'Unable to save gear item.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !window.confirm('Delete this gear item?')) return;
        try {
            await apiClient.delete(`/gears/${id}`);
            navigate('/gear');
        } catch (error) {
            console.error('Error deleting gear:', error);
            alert(error?.response?.data?.message || 'Unable to delete gear item.');
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
                        <HeaderRoute title="Gear" />
                        <div className="content">
                            <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                                <form onSubmit={handleSave}>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-4">
                                            <label className="border rounded d-flex flex-column align-items-center justify-content-center text-muted" style={{ height: '150px', borderStyle: 'dashed', cursor: 'pointer', overflow: 'hidden' }}>
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Gear" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <>
                                                        <i className="fas fa-image mb-2" style={{ fontSize: '24px' }}></i>
                                                        <span>Upload image</span>
                                                    </>
                                                )}
                                                <input type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
                                            </label>
                                            {errors.image && <div className="text-danger small mt-1">{Array.isArray(errors.image) ? errors.image[0] : errors.image}</div>}
                                        </div>
                                        <div className="col-md-8">
                                            <label className="form-label">Title</label>
                                            <input className={`form-control mb-3 ${errors.title ? 'is-invalid' : ''}`} placeholder="Text here..." value={form.title} onChange={(e) => update('title', e.target.value)} required />
                                            {errors.title && <div className="invalid-feedback">{Array.isArray(errors.title) ? errors.title[0] : errors.title}</div>}
                                            <label className="form-label">Description</label>
                                            <textarea className="form-control" rows="3" placeholder="Text here..." value={form.description} onChange={(e) => update('description', e.target.value)}></textarea>
                                        </div>
                                    </div>

                                    <h6 className="head mb-3">Basic Gear Information</h6>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label">Category</label>
                                            <select className="form-select" value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
                                                <option value="">- Select -</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6"><label className="form-label">System</label><input className="form-control" value={form.system} onChange={(e) => update('system', e.target.value)} placeholder="- Select -" /></div>
                                        <div className="col-md-6"><label className="form-label">Type</label><input className="form-control" placeholder="e.g., Prime Lens, Telephoto, Mirrorless" value={form.type} onChange={(e) => update('type', e.target.value)} /></div>
                                        <div className="col-md-6"><label className="form-label">Model Name</label><input className="form-control" placeholder="e.g., Canon R5, XF 18-135mm" value={form.modelName} onChange={(e) => update('modelName', e.target.value)} /></div>
                                        <div className="col-md-12"><label className="form-label">Storage Name</label><input className="form-control" placeholder="Optional" value={form.storageName} onChange={(e) => update('storageName', e.target.value)} /></div>
                                    </div>

                                    <h6 className="head mb-3">Purchase & Ownership Details</h6>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6"><label className="form-label">Brought for (Price)</label><input type="number" className="form-control" value={form.price} onChange={(e) => update('price', e.target.value)} /></div>
                                        <div className="col-md-6"><label className="form-label">Purchase Date</label><input type="date" className="form-control" value={form.purchaseDate} onChange={(e) => update('purchaseDate', e.target.value)} /></div>
                                        <div className="col-md-6"><label className="form-label">Dealer</label><input className="form-control" value={form.dealer} onChange={(e) => update('dealer', e.target.value)} /></div>
                                        <div className="col-md-6"><label className="form-label">Serial Number</label><input className="form-control" value={form.serialNumber} onChange={(e) => update('serialNumber', e.target.value)} /></div>
                                        <div className="col-md-6">
                                            <label className="form-label">Insured?</label>
                                            <select className="form-select" value={form.insured} onChange={(e) => update('insured', e.target.value)}>
                                                <option value="">- Select -</option><option>Yes</option><option>No</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6"><label className="form-label">Firmware Link</label><input className="form-control" placeholder="URL Link..." value={form.firmwareLink} onChange={(e) => update('firmwareLink', e.target.value)} /></div>
                                    </div>

                                    <h6 className="head mb-3">Technical Specifications</h6>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-12"><label className="form-label">Mount</label><input className="form-control" value={form.mount} onChange={(e) => update('mount', e.target.value)} placeholder="- Select -" /></div>
                                        <div className="col-md-6"><label className="form-label">Dimensions (Diameter / Length in mm)</label><input className="form-control" value={form.dimensions} onChange={(e) => update('dimensions', e.target.value)} /></div>
                                        <div className="col-md-6"><label className="form-label">Weight (g)</label><input className="form-control" value={form.weight} onChange={(e) => update('weight', e.target.value)} /></div>
                                        <div className="col-md-6">
                                            <label className="form-label">Focal Length (mm)</label>
                                            <div className="d-flex gap-2 align-items-center">
                                                <input type="number" className="form-control" value={form.focalMin} onChange={(e) => update('focalMin', e.target.value)} />
                                                <span>—</span>
                                                <input type="number" className="form-control" value={form.focalMax} onChange={(e) => update('focalMax', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Aperture Range</label>
                                            <div className="d-flex gap-2 align-items-center">
                                                <input type="number" className="form-control" value={form.apertureMin} onChange={(e) => update('apertureMin', e.target.value)} />
                                                <span>—</span>
                                                <input type="number" className="form-control" value={form.apertureMax} onChange={(e) => update('apertureMax', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-6"><label className="form-label">Focus Distance</label><input type="number" className="form-control" value={form.focusDistance} onChange={(e) => update('focusDistance', e.target.value)} /></div>
                                        <div className="col-md-6"><label className="form-label">Magnification (x)</label><input type="number" className="form-control" value={form.magnification} onChange={(e) => update('magnification', e.target.value)} /></div>
                                    </div>

                                    <h6 className="head mb-3">Photography Suitability</h6>
                                    <div className="mb-4">
                                        {suitabilityFields.map(f => (
                                            <div className="d-flex align-items-center gap-3 mb-2" key={f}>
                                                <div style={{ width: '180px' }} className="small">{suitabilityLabels[f]}</div>
                                                <input type="range" min="1" max="5" className="form-range flex-grow-1" value={form.suitability[f]} onChange={(e) => updateSuitability(f, e.target.value)} />
                                            </div>
                                        ))}
                                        <div className="d-flex justify-content-between small text-muted" style={{ marginLeft: '192px' }}>
                                            <span>Not Recommended</span><span>Occasionally Usable</span><span>Moderately Suitable</span><span>Highly Suitable</span><span>Perfect Fit</span>
                                        </div>
                                    </div>

                                    <h6 className="head mb-3">Maintenance & Status</h6>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6"><label className="form-label">Shutter Count (For cameras)</label><input className="form-control" placeholder="Numeric Text here..." value={form.shutterCount} onChange={(e) => update('shutterCount', e.target.value)} /></div>
                                        <div className="col-md-6"><label className="form-label">Pick / Priority Tag</label><input className="form-control" placeholder='e.g., "Go-to Lens"' value={form.priorityTag} onChange={(e) => update('priorityTag', e.target.value)} /></div>
                                        <div className="col-md-12"><label className="form-label">Notes</label><textarea className="form-control" rows="3" placeholder="Additional notes goes here..." value={form.notes} onChange={(e) => update('notes', e.target.value)}></textarea></div>
                                    </div>

                                    <h6 className="head mb-3">Ratings</h6>
                                    <div className="mb-4">
                                        <input type="range" min="1" max="10" className="form-range" value={form.rating} onChange={(e) => update('rating', e.target.value)} />
                                        <div className="d-flex justify-content-between small text-muted">{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <span key={n}>{n}</span>)}</div>
                                    </div>

                                    <div className="d-flex justify-content-between pt-3 border-top">
                                        <button type="button" className="btn" id="e-view" onClick={() => navigate('/gear')}>Back</button>
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn" id="e-edit" style={{ backgroundColor: '#3a2e26' }} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                            {id && <button type="button" className="btn text-white" style={{ backgroundColor: '#cc445e' }} onClick={handleDelete} disabled={isSaving}>Delete</button>}
                                        </div>
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
export default PhotographerGearAdd;
