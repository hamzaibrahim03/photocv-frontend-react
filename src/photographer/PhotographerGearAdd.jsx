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
    focusDistanceMin: '', focusDistanceMax: '', magnification: '',
    suitability: Object.fromEntries(suitabilityFields.map(f => [f, 3])),
    shutterCount: '', priorityTag: '', notes: '', rating: 5,
};

function appendIfSet(payload, key, value) {
    if (value !== '' && value !== null && value !== undefined) {
        payload.append(key, value);
    }
}

const COMMON_MOUNTS = [
    'Canon EF', 'Canon EF-S', 'Canon RF', 'Nikon F', 'Nikon Z',
    'Sony E', 'Sony FE', 'Fujifilm X', 'Fujifilm G', 'Micro Four Thirds',
    'L-Mount', 'Pentax K', 'Leica M', 'Leica L',
];

function DualRangeTrack({ min, max, step, valueMin, valueMax, onChangeMin, onChangeMax }) {
    const lo = valueMin === '' || valueMin === undefined || valueMin === null ? min : Number(valueMin);
    const hi = valueMax === '' || valueMax === undefined || valueMax === null ? min : Number(valueMax);
    const toPct = (v) => Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100));
    const pctLo = toPct(lo);
    const pctHi = toPct(hi);
    return (
        <div className="position-relative mt-2" style={{ height: '1rem' }}>
            <div className="position-absolute" style={{ top: '0.25rem', left: '0', right: '0', height: '0.5rem', background: '#dee2e6', borderRadius: '1rem' }}>
                <div className="position-absolute" style={{ top: '0', bottom: '0', left: `${Math.min(pctLo, pctHi)}%`, width: `${Math.abs(pctHi - pctLo)}%`, background: '#cc445e', borderRadius: '1rem' }} />
            </div>
            <input type="range" min={min} max={max} step={step} value={lo} className="form-range pink-thumb dual-range-input" onChange={(e) => onChangeMin(Math.min(Number(e.target.value), hi))} />
            <input type="range" min={min} max={max} step={step} value={hi} className="form-range pink-thumb dual-range-input" onChange={(e) => onChangeMax(Math.max(Number(e.target.value), lo))} />
        </div>
    );
}

function PhotographerGearAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [form, setForm] = useState(emptyForm);
    const [categories, setCategories] = useState([]);
    const [systems, setSystems] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState({ first_name: 'Photographer', last_name: '', profile_image_url: '/placeholder.jpg' });
    const [totals, setTotals] = useState({ totalPhotos: '0', totalLikes: '0', totalComments: 0 });
    const [galleryPhotos, setGalleryPhotos] = useState([]);

    const [gearImageFiles, setGearImageFiles] = useState([]);
    const [existingGearImages, setExistingGearImages] = useState([]);
    const [removeGearImageIds, setRemoveGearImageIds] = useState([]);
    const [selectedGalleryPhotos, setSelectedGalleryPhotos] = useState([]);
    const [showGalleryPicker, setShowGalleryPicker] = useState(false);

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
                const galleryList = Array.isArray(galleryData?.galleries) ? galleryData.galleries : [];
                const flattenedPhotos = galleryList.flatMap((gallery) =>
                    (gallery.photos || []).map((photo) => ({
                        id: photo.id,
                        image: photo.image_url || '/placeholder.jpg',
                        title: photo.title || gallery.gallery_name,
                    }))
                );
                setGalleryPhotos(flattenedPhotos);
            })
            .catch((error) => console.error('Error loading profile summary:', error));
    }, []);

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            try {
                const extrasRes = await apiClient.get('/gear-extras');
                const extras = extrasRes.data?.data || extrasRes.data || {};
                if (!cancelled) {
                    setCategories(extras.gear_categories || []);
                    setSystems(extras.systems || []);
                }

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
                        focusDistanceMin: g.min_focus_distance ?? '',
                        focusDistanceMax: g.max_focus_distance ?? '',
                        magnification: g.max_magnification ?? '',
                        suitability,
                        shutterCount: g.shutter_count ?? '',
                        priorityTag: g.priority_tag || '',
                        notes: g.notes || '',
                        rating: g.rating || 5,
                    });
                    setExistingImage(g.image || '');
                    setExistingGearImages(Array.isArray(g.gear_images) ? g.gear_images : []);
                    setSelectedGalleryPhotos(Array.isArray(g.photos_using_gear) ? g.photos_using_gear : []);
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

    const handleGearImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        setGearImageFiles((prev) => [...prev, ...files]);
        e.target.value = '';
    };

    const removeNewGearImage = (index) => {
        setGearImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingGearImage = (imageId) => {
        setExistingGearImages((prev) => prev.filter((img) => img.id !== imageId));
        setRemoveGearImageIds((prev) => [...prev, imageId]);
    };

    const toggleGalleryPhoto = (photo) => {
        setSelectedGalleryPhotos((prev) => (
            prev.some((p) => p.id === photo.id)
                ? prev.filter((p) => p.id !== photo.id)
                : [...prev, { id: photo.id, title: photo.title, thumb_url: photo.image }]
        ));
    };

    const removeSelectedGalleryPhoto = (photoId) => {
        setSelectedGalleryPhotos((prev) => prev.filter((p) => p.id !== photoId));
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
            appendIfSet(payload, 'min_focus_distance', form.focusDistanceMin);
            appendIfSet(payload, 'max_focus_distance', form.focusDistanceMax);
            appendIfSet(payload, 'max_magnification', form.magnification);
            suitabilityFields.forEach(f => {
                const score = levelToScore(form.suitability[f]);
                suitabilityBackendKeys[f].forEach(key => payload.append(`suitability_${key}`, score));
            });
            appendIfSet(payload, 'shutter_count', form.shutterCount);
            appendIfSet(payload, 'priority_tag', form.priorityTag);
            appendIfSet(payload, 'notes', form.notes);
            payload.append('rating', form.rating);

            gearImageFiles.forEach((file) => payload.append('gear_images[]', file));
            removeGearImageIds.forEach((imgId) => payload.append('remove_gear_image_ids[]', imgId));
            selectedGalleryPhotos.forEach((p) => payload.append('photo_ids[]', p.id));

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
                                    <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                                        <h4 className="head mt-5 mb-5">{id ? 'Edit Gear' : 'Add New Gear'}</h4>
                                        <form onSubmit={handleSave}>
                                            <div className='row'>
                                                <div className='col-md-8'>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-4">
                                                            <label className="border rounded d-flex flex-column align-items-center justify-content-center text-muted" style={{ height: '220px', borderStyle: 'dashed', cursor: 'pointer', overflow: 'hidden' }}>
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

                                                    <h6 className="head mb-5 mt-5">Basic Gear Information</h6>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Category</label>
                                                            <select className="form-select" value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
                                                                <option value="">- Select -</option>
                                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">System</label>
                                                            <input className="form-control" list="system-options" placeholder="e.g., Canon, Nikon, Sony" value={form.system} onChange={(e) => update('system', e.target.value)} />
                                                            <datalist id="system-options">
                                                                {systems.map(s => <option key={s} value={s} />)}
                                                            </datalist>
                                                        </div>
                                                    </div>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Type</label>
                                                            <input className="form-control" placeholder="e.g., Prime Lens, Telephoto, Mirrorless" value={form.type} onChange={(e) => update('type', e.target.value)} />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Model Name</label>
                                                            <input className="form-control" placeholder="e.g., Canon R5, XF 18-135mm" value={form.modelName} onChange={(e) => update('modelName', e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Storage Name</label>
                                                            <input className="form-control" placeholder="Optional" value={form.storageName} onChange={(e) => update('storageName', e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <h6 className="head mb-5 mt-5">Purchase & Ownership Details</h6>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Brought for (Price)</label>
                                                            <input type="number" className="form-control" value={form.price} onChange={(e) => update('price', e.target.value)} />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Purchase Date</label>
                                                            <input type="date" className="form-control" value={form.purchaseDate} onChange={(e) => update('purchaseDate', e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Dealer</label>
                                                            <input className="form-control" value={form.dealer} onChange={(e) => update('dealer', e.target.value)} />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Serial Number</label>
                                                            <input className="form-control" value={form.serialNumber} onChange={(e) => update('serialNumber', e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Insured?</label>
                                                            <select className="form-select" value={form.insured} onChange={(e) => update('insured', e.target.value)}>
                                                                <option value="">- Select -</option>
                                                                <option>Yes</option>
                                                                <option>No</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Firmware Link</label>
                                                            <input className="form-control" placeholder="URL Link..." value={form.firmwareLink} onChange={(e) => update('firmwareLink', e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <h6 className="head mb-5 mt-5">Technical Specifications</h6>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-12">
                                                            <label className="form-label">Mount</label>
                                                            <input className="form-control" list="mount-options" placeholder="e.g., Canon RF, Sony E" value={form.mount} onChange={(e) => update('mount', e.target.value)} />
                                                            <datalist id="mount-options">
                                                                {COMMON_MOUNTS.map(m => <option key={m} value={m} />)}
                                                            </datalist>
                                                        </div>
                                                    </div>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Dimensions (Diameter / Length in mm)</label>
                                                            <input className="form-control" type="number" value={form.dimensions} onChange={(e) => update('dimensions', e.target.value)} placeholder='0.00' />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Weight (g)</label>
                                                            <input className="form-control" value={form.weight} onChange={(e) => update('weight', e.target.value)} placeholder='0.00' />
                                                        </div>
                                                    </div>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Focal Length (mm)</label>
                                                            <div className="d-flex gap-2 align-items-center">
                                                                <input type="number" className="form-control" value={form.focalMin} onChange={(e) => update('focalMin', e.target.value)} />
                                                                <span>—</span>
                                                                <input type="number" className="form-control" value={form.focalMax} onChange={(e) => update('focalMax', e.target.value)} />
                                                            </div>
                                                            <DualRangeTrack min={0} max={600} step={1} valueMin={form.focalMin} valueMax={form.focalMax} onChangeMin={(v) => update('focalMin', v)} onChangeMax={(v) => update('focalMax', v)} />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Aperture Range</label>
                                                            <div className="d-flex gap-2 align-items-center">
                                                                <input type="number" className="form-control" value={form.apertureMin} onChange={(e) => update('apertureMin', e.target.value)} />
                                                                <span>—</span>
                                                                <input type="number" className="form-control" value={form.apertureMax} onChange={(e) => update('apertureMax', e.target.value)} />
                                                            </div>
                                                            <DualRangeTrack min={0} max={32} step={0.1} valueMin={form.apertureMin} valueMax={form.apertureMax} onChangeMin={(v) => update('apertureMin', v)} onChangeMax={(v) => update('apertureMax', v)} />
                                                        </div>
                                                    </div>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Focus Distance</label>
                                                            <div className="d-flex gap-2 align-items-center">
                                                                <input type="number" className="form-control" value={form.focusDistanceMin} onChange={(e) => update('focusDistanceMin', e.target.value)} />
                                                                <span>—</span>
                                                                <input type="number" className="form-control" value={form.focusDistanceMax} onChange={(e) => update('focusDistanceMax', e.target.value)} />
                                                            </div>
                                                            <DualRangeTrack min={0} max={10} step={0.01} valueMin={form.focusDistanceMin} valueMax={form.focusDistanceMax} onChangeMin={(v) => update('focusDistanceMin', v)} onChangeMax={(v) => update('focusDistanceMax', v)} />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Magnification (x)</label>
                                                            <input type="number" className="form-control" value={form.magnification} onChange={(e) => update('magnification', e.target.value)} placeholder='0.00' />
                                                            <input type="range" className="form-range mt-2 pink-thumb pink-range-fill" min="0" max="5" step="0.01" value={form.magnification || 0} style={{ '--range-progress': `${((Number(form.magnification) || 0) / 5) * 100}%` }} onChange={(e) => update('magnification', e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='row'>
                                                <div className='col-md-10'>
                                                    <h6 className="head mb-5 mt-5">Photography Suitability</h6>
                                                    <div className="mb-4 p-4">
                                                        <div className="d-flex justify-content-between small text-muted mb-2" style={{ marginLeft: '192px', fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '18px', lineHeight: '20px', letterSpacing: '0%', gap: '55px' }}>
                                                            <span>Not Recommended</span><span>Occasionally Usable</span><span>Moderately Suitable</span><span>Highly Suitable</span><span>Perfect Fit</span>
                                                        </div>
                                                        <div className='line' style={{ border: '1px solid #000000', height: '0px', margin: '34px 0' }} />
                                                        {suitabilityFields.map(f => (
                                                            <React.Fragment key={f}>
                                                                <div className="d-flex align-items-center gap-3 mb-2">
                                                                    <div style={{ fontFamily: 'Inter', fontWeight: '400', fontStyle: 'Regular', fontSize: '18px', lineHeight: '20px', letterSpacing: '0%', width: '200px' }} className="small">{suitabilityLabels[f]}</div>
                                                                    <input type="range" min="1" max="5" className="form-range flex-grow-1 pink-thumb pink-range-fill" value={form.suitability[f]} style={{ '--range-progress': `${((form.suitability[f] - 1) / 4) * 100}%` }} onChange={(e) => updateSuitability(f, e.target.value)} />
                                                                </div>
                                                                <div className='line' style={{ border: '1px solid #000000', height: '0px', margin: '34px 0' }} />
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='row'>
                                                <div className='col-md-8'>
                                                    <h6 className="head mb-5 mt-5">Maintenance & Status</h6>
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6"><label className="form-label">Shutter Count (For cameras)</label><input className="form-control" placeholder="Numeric Text here..." value={form.shutterCount} onChange={(e) => update('shutterCount', e.target.value)} /></div>
                                                        <div className="col-md-6"><label className="form-label">Pick / Priority Tag</label><input className="form-control" placeholder='e.g., "Go-to Lens"' value={form.priorityTag} onChange={(e) => update('priorityTag', e.target.value)} /></div>
                                                        <div className="col-md-12"><label className="form-label">Notes</label><textarea className="form-control" rows="3" placeholder="Additional notes goes here..." value={form.notes} onChange={(e) => update('notes', e.target.value)}></textarea></div>
                                                    </div>

                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Photos of Gear</label>
                                                            <label className="border rounded d-flex flex-column align-items-center justify-content-center text-muted p-3" style={{ minHeight: '140px', borderStyle: 'dashed', cursor: 'pointer' }}>
                                                                <i className="fas fa-cloud-upload-alt mb-2" style={{ fontSize: '22px' }}></i>
                                                                <span className="small mb-2">Drag image to upload or</span>
                                                                <span className="btn text-white" style={{ backgroundColor: '#cc445e' }}>Browse Image</span>
                                                                <input type="file" accept="image/*" multiple className="d-none" onChange={handleGearImagesChange} />
                                                            </label>
                                                            {(existingGearImages.length > 0 || gearImageFiles.length > 0) && (
                                                                <div className="d-flex flex-wrap gap-2 mt-2">
                                                                    {existingGearImages.map((img) => (
                                                                        <div key={`existing-${img.id}`} className="position-relative">
                                                                            <img src={img.url} alt="Gear" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                                                                            <button type="button" className="btn btn-danger position-absolute" style={{ top: '-8px', right: '-8px', padding: '0 6px', borderRadius: '50%' }} onClick={() => removeExistingGearImage(img.id)}>×</button>
                                                                        </div>
                                                                    ))}
                                                                    {gearImageFiles.map((file, idx) => (
                                                                        <div key={`new-${idx}`} className="position-relative">
                                                                            <img src={URL.createObjectURL(file)} alt="Gear" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                                                                            <button type="button" className="btn btn-danger position-absolute" style={{ top: '-8px', right: '-8px', padding: '0 6px', borderRadius: '50%' }} onClick={() => removeNewGearImage(idx)}>×</button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Photos using Gear</label>
                                                            <div className="border rounded d-flex flex-column align-items-center justify-content-center text-muted p-3" style={{ minHeight: '140px', borderStyle: 'dashed' }}>
                                                                <i className="fas fa-images mb-2" style={{ fontSize: '22px' }}></i>
                                                                <span className="small mb-2">Pick photos from your gallery that were taken with this gear</span>
                                                                <button type="button" className="btn text-white" style={{ backgroundColor: '#cc445e' }} onClick={() => setShowGalleryPicker(true)}>Import from Gallery</button>
                                                            </div>
                                                            {selectedGalleryPhotos.length > 0 && (
                                                                <div className="d-flex flex-wrap gap-2 mt-2">
                                                                    {selectedGalleryPhotos.map((p) => (
                                                                        <div key={`gallery-${p.id}`} className="position-relative">
                                                                            <img src={p.thumb_url} alt={p.title || 'Photo'} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                                                                            <button type="button" className="btn btn-danger position-absolute" style={{ top: '-8px', right: '-8px', padding: '0 6px', borderRadius: '50%' }} onClick={() => removeSelectedGalleryPhoto(p.id)}>×</button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <h6 className="head mb-5 mt-5">Ratings</h6>
                                                    <div className="mb-4">
                                                        <input type="range" min="1" max="10" className="form-range pink-thumb pink-range-fill" value={form.rating} style={{ '--range-progress': `${((form.rating - 1) / 9) * 100}%` }} onChange={(e) => update('rating', e.target.value)} />
                                                        <div className="d-flex small text-muted">
                                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <span key={n} className="flex-fill text-center">{n}</span>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="button-group">
                                                <button type="submit" className="btn me-2" id="e-edit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                                <button type="button" className="btn" id="e-view" onClick={() => navigate('/gear')}>Cancel</button>
                                            </div>
                                        </form>

                                        {showGalleryPicker && (
                                            <div className="export-modal-overlay">
                                                <div className="export-modal">
                                                    <div className="export-modal-header">
                                                        <h2>Import from Gallery</h2>
                                                        <button type="button" className="export-close-btn" onClick={() => setShowGalleryPicker(false)}>×</button>
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                        {galleryPhotos.length === 0 && <p className="text-muted small">No photos in your gallery yet.</p>}
                                                        {galleryPhotos.map((photo) => {
                                                            const isSelected = selectedGalleryPhotos.some((p) => p.id === photo.id);
                                                            return (
                                                                <div key={photo.id} className="position-relative" style={{ cursor: 'pointer', border: isSelected ? '3px solid #cc445e' : '3px solid transparent', borderRadius: '6px' }} onClick={() => toggleGalleryPhoto(photo)} >
                                                                    <img src={photo.image} alt={photo.title} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                                                                    {isSelected && <i className="fas fa-check-circle position-absolute" style={{ top: '4px', right: '4px', color: '#cc445e', background: 'white', borderRadius: '50%' }}></i>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="export-modal-footer">
                                                        <button type="button" className="export-now-btn" onClick={() => setShowGalleryPicker(false)}>Done</button>
                                                    </div>
                                                </div>
                                            </div>
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
export default PhotographerGearAdd;
