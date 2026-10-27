import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

const CATALOG_API_BASE = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1';

function Pill({ color, bg, children }) {
    return (
        <span style={{ display: 'inline-block', padding: '2px 12px', borderRadius: '12px', fontSize: '12px', backgroundColor: bg, color }}>
            {children}
        </span>
    );
}

const emptyForm = {
    categoryId: '', title: '', description: '',
    shutterMin: '', shutterMax: '', isoMin: '', isoMax: '', apertureMin: '', apertureMax: '',
    lens: '', camera: '', whiteBalance: '', noiseReduction: '', notes: '', tips: [],
    accessories: [], tags: [], visibility: 'public',
};

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

function PhotographerLearningAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState(emptyForm);
    const [categories, setCategories] = useState([]);
    const [accessoryInput, setAccessoryInput] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tipInput, setTipInput] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [isLoading, setIsLoading] = useState(Boolean(id));
    const [user, setUser] = useState({ first_name: 'Photographer', last_name: '', profile_image_url: '/placeholder.jpg' });
    const [isSaving, setIsSaving] = useState(false);
    const [totals, setTotals] = useState({ totalPhotos: '0', totalLikes: '0', totalComments: 0 });

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
        async function loadCategories() {
            try {
                const response = await fetch(`${CATALOG_API_BASE}/club/public/catalog/all-grouped`, {
                    headers: { Accept: 'application/json' },
                });
                const json = await response.json();
                setCategories(json?.data?.cheat_sheet_category || []);
            } catch (err) {
                console.error('Error loading cheat sheet categories:', err);
            }
        }
        loadCategories();
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchSheet = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get(`/cheat-sheets/${id}`);
                const s = response.data?.data || response.data;
                setForm({
                    categoryId: s.category?.id ?? '',
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
                    tips: s.tips || [],
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
    const addTip = () => { if (!tipInput.trim()) return; update('tips', [...form.tips, tipInput.trim()]); setTipInput(''); };
    const removeTip = (index) => update('tips', form.tips.filter((_, i) => i !== index));
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        setImageFile(file || null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const payload = new FormData();
            if (form.categoryId) payload.append('category_id', form.categoryId);
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
            form.tips.forEach(t => payload.append('tips[]', t));
            form.accessories.forEach(a => payload.append('accessories[]', a));
            form.tags.forEach(t => payload.append('tags[]', t));
            payload.append('visibility', form.visibility);
            if (imageFile) payload.append('reference_image', imageFile);

            const multipartConfig = { headers: { 'Content-Type': undefined } };
            if (id) {
                await apiClient.post(`/cheat-sheets/${id}`, payload, {
                    ...multipartConfig,
                    params: { _method: 'PUT' },
                });
            } else {
                await apiClient.post('/cheat-sheets', payload, multipartConfig);
            }
            navigate('/cheatsheet   ');
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
                                    <div className="card bg-white border-0 rounded shadow-sm mt-4" style={{ padding: '40px 80px' }}>
                                        <h4 className="head mt-5 mb-5">{id ? 'Edit Sheet' : 'Add New Sheet'}</h4>
                                        <form onSubmit={handleSave}>
                                            <div className="row g-3 mb-4">
                                                <div className="col-md-6">
                                                    <label className="form-label">Category</label>
                                                    <select className="form-select" value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
                                                        <option value="">- Select -</option>
                                                        {categories.map((cat) => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
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
                                                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', inset: '0', opacity: '0', cursor: 'pointer' }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <h6 className="head mb-5 mt-5">Manual Settings</h6>
                                            <div className="row g-3 mb-4">
                                                <div className="col-md-6">
                                                    <label className="form-label">Shutter</label>
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <input className="form-control" value={form.shutterMin} onChange={(e) => update('shutterMin', e.target.value)} />
                                                        <span>—</span>
                                                        <input className="form-control" value={form.shutterMax} onChange={(e) => update('shutterMax', e.target.value)} />
                                                    </div>
                                                    <DualRangeTrack min={0} max={10} step={0.01} valueMin={form.shutterMin} valueMax={form.shutterMax} onChangeMin={(v) => update('shutterMin', v)} onChangeMax={(v) => update('shutterMax', v)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">ISO</label>
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <input type="number" className="form-control" value={form.isoMin} onChange={(e) => update('isoMin', e.target.value)} />
                                                        <span>—</span>
                                                        <input type="number" className="form-control" value={form.isoMax} onChange={(e) => update('isoMax', e.target.value)} />
                                                    </div>
                                                    <DualRangeTrack min={0} max={10} step={0.01} valueMin={form.isoMin} valueMax={form.isoMax} onChangeMin={(v) => update('isoMin', v)} onChangeMax={(v) => update('isoMax', v)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Aperture</label>
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <input type="number" step="0.1" className="form-control" value={form.apertureMin} onChange={(e) => update('apertureMin', e.target.value)} />
                                                        <span>—</span>
                                                        <input type="number" step="0.1" className="form-control" value={form.apertureMax} onChange={(e) => update('apertureMax', e.target.value)} />
                                                    </div>
                                                    <DualRangeTrack min={0} max={10} step={0.01} valueMin={form.apertureMin} valueMax={form.apertureMax} onChangeMin={(v) => update('apertureMin', v)} onChangeMax={(v) => update('apertureMax', v)} />
                                                </div>
                                            </div>

                                            <h6 className="head mb-5 mt-5">Essential Settings</h6>
                                            <div className="row g-3 mb-4">
                                                <div className="col-md-6"><label className="form-label">Lens</label><input className="form-control" placeholder="Text here..." value={form.lens} onChange={(e) => update('lens', e.target.value)} /></div>
                                                <div className="col-md-6"><label className="form-label">Camera</label><input className="form-control" placeholder="Text here..." value={form.camera} onChange={(e) => update('camera', e.target.value)} /></div>
                                                <div className="col-md-6"><label className="form-label">White Balance</label><input className="form-control" placeholder="Text here..." value={form.whiteBalance} onChange={(e) => update('whiteBalance', e.target.value)} /></div>
                                                <div className="col-md-6"><label className="form-label">In Camera Noise Reduction</label><input className="form-control" placeholder="Text here..." value={form.noiseReduction} onChange={(e) => update('noiseReduction', e.target.value)} /></div>
                                                <div className="col-md-12"><label className="form-label">Notes</label><textarea className="form-control" rows="3" placeholder="Text here..." value={form.notes} onChange={(e) => update('notes', e.target.value)}></textarea></div>
                                            </div>

                                            <h6 className="head mb-5 mt-5">Top Tips</h6>
                                            <div className="d-flex gap-2 mb-2">
                                                <input className="form-control" placeholder="Text here..." value={tipInput} onChange={(e) => setTipInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTip(); } }} />
                                                <button type="button" className="btn" id="edit" onClick={addTip}>+ Add Tip</button>
                                            </div>
                                            <ul className="mb-4" style={{ paddingLeft: '20px' }}>
                                                {form.tips.map((t, i) => (
                                                    <li key={i} className="d-flex align-items-center justify-content-between" style={{ maxWidth: '500px' }}>
                                                        <span>{t}</span>
                                                        <button type="button" className="btn text-danger" onClick={() => removeTip(i)}>&times;</button>
                                                    </li>
                                                ))}
                                            </ul>

                                            <h6 className="head mb-5 mt-5">Accessories</h6>
                                            <div className="d-flex gap-2 mb-2">
                                                <input className="form-control" placeholder="Accessories" value={accessoryInput} onChange={(e) => setAccessoryInput(e.target.value)} />
                                                <button type="button" className="btn" id="edit" onClick={addAccessory}>+ Add Item</button>
                                            </div>
                                            <div className="d-flex gap-2 flex-wrap mb-4">
                                                {form.accessories.map((a, i) => <Pill key={i} bg="#f3e9e0" color="#99816b">{a}</Pill>)}
                                            </div>

                                            <h6 className="head mb-5 mt-5">Tag</h6>
                                            <div className="d-flex gap-2 mb-2">
                                                <input className="form-control" placeholder="Text here..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
                                                <button type="button" className="btn" id="edit" onClick={addTag}>+ Add Tag</button>
                                            </div>
                                            <div className="d-flex gap-2 flex-wrap mb-4">
                                                {form.tags.map((t, i) => <Pill key={i} bg="#f3e2e6" color="#cc445e">{t}</Pill>)}
                                            </div>

                                            <h6 className="head mb-5 mt-5">Visibility</h6>
                                            <div className="d-flex gap-3 mb-4">
                                                {['public', 'private'].map(v => (
                                                    <div className="premium-radio">
                                                        <input type="radio" id={v} name="visibility" value={v} checked={form.visibility === v} onChange={() => update('visibility', v)} />
                                                        <label htmlFor={v}>
                                                            <span className="premium-radio-circle" />
                                                            <span className="premium-radio-content">
                                                                <span className="premium-radio-title"> {v}</span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="d-flex gap-2 pt-3 border-top">
                                                <button type="submit" className="btn" id="e-edit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                                <button type="button" className="btn" id="e-view" onClick={() => navigate('/cheatsheet')} disabled={isSaving}>Cancel</button>
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
export default PhotographerLearningAdd;
