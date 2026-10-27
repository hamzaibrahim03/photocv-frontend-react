import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
import { extractRows, groupGearByKind, GearPager } from './PhotographerGear';
import c1 from '../club_admin/assets/images/dashboard/c1.jpg';

const PAGE_SIZE = 12;

function cameraSpecLine(g) {
    return [g.mount, g.resolution].filter(Boolean).join(' • ');
}

function lensSpecLine(g) {
    const min = g.min_focal_length, max = g.max_focal_length;
    let focal = '';
    if (min || max) focal = Number(min) === Number(max) ? `${min}mm` : `${min}-${max}mm`;
    const aperture = g.min_aperture ? `f/${g.min_aperture}` : '';
    return [focal, aperture].filter(Boolean).join(' • ');
}

function accessorySpecLine(g) {
    return [g.weight, g.condition].filter(Boolean).join(', ');
}

function PhotographerGearLibrary() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterCategory] = useState('');
    const [filterSystem] = useState('');
    const [filterType] = useState('');
    const [filterModelName] = useState('');
    const [filterScore] = useState('');
    const [page, setPage] = useState(1);
    const [library, setLibrary] = useState([]);
    const [cameraCatalog, setCameraCatalog] = useState([]);
    const [lensCatalog, setLensCatalog] = useState([]);
    const [accessoryCatalog, setAccessoryCatalog] = useState([]);
    const [detailId, setDetailId] = useState(null);
    const [wizardOpen, setWizardOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [step, setStep] = useState(1);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [selectedLenses, setSelectedLenses] = useState([]);
    const [selectedAccessories, setSelectedAccessories] = useState([]);
    const [wizSystem, setWizSystem] = useState('');
    const [wizModel, setWizModel] = useState('');
    const [wizMount, setWizMount] = useState('');
    const [wizResolution, setWizResolution] = useState('');
    const [wizFocalLength, setWizFocalLength] = useState('');
    const [wizAperture, setWizAperture] = useState('');
    const [wizType, setWizType] = useState('');
    const [kitTitle, setKitTitle] = useState('');
    const [kitDescription, setKitDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState({ first_name: 'Photographer', profile_image_url: '' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const loadAll = async () => {
        setIsLoading(true);
        try {
            const [libRes, gearRes] = await Promise.all([
                apiClient.get('/gear-libraries', { params: { draw: 1, start: 0, length: -1 } }),
                apiClient.get('/gears', { params: { draw: 1, start: 0, length: -1 } }),
            ]);
            setLibrary(extractRows(libRes));
            const { cameras, lenses, accessories } = groupGearByKind(extractRows(gearRes));
            setCameraCatalog(cameras.map(g => ({ ...g, name: g.title, specLine: cameraSpecLine(g) })));
            setLensCatalog(lenses.map(g => ({ ...g, name: g.title, specLine: lensSpecLine(g) })));
            setAccessoryCatalog(accessories.map(g => ({ ...g, name: g.title, specLine: accessorySpecLine(g) })));
        } catch (error) {
            console.error('Error loading gear library:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            try {
                const profileRes = await apiClient.get('/member-admin/profile/portfolio');
                if (cancelled) return;
                const memberInfo = profileRes.data?.member_info?.original?.data;
                const galleryData = profileRes.data?.gallery?.original?.data;
                if (memberInfo) setUser(memberInfo);
                setTotals({
                    totalPhotos: galleryData?.total_photos ?? 0,
                    totalLikes: galleryData?.total_likes ?? 0,
                    totalComments: galleryData?.total_comments ?? 0,
                });
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);
    useEffect(() => { loadAll(); }, []);

    const kitItems = (kit) => [...(kit.cameras || []), ...(kit.lenses || []), ...(kit.accessories || [])];

    const filtered = library.filter(k => {
        if (!(k.title || '').toLowerCase().includes(search.toLowerCase())) return false;
        const items = kitItems(k);
        if (filterCategory && !items.some(i => i.category?.name === filterCategory)) return false;
        if (filterSystem && !items.some(i => i.system === filterSystem)) return false;
        if (filterType && !items.some(i => i.type === filterType)) return false;
        if (filterModelName && !items.some(i => i.model_name === filterModelName)) return false;
        if (filterScore && !items.some(i => Number(i.rating || 0) >= Number(filterScore))) return false;
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginatedKits = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const resetWizard = () => {
        setStep(1); setSelectedCamera(null); setSelectedLenses([]); setSelectedAccessories([]);
        setKitTitle(''); setKitDescription(''); setEditingId(null);
        setWizSystem(''); setWizModel(''); setWizMount(''); setWizResolution('');
        setWizFocalLength(''); setWizAperture(''); setWizType('');
    };
    const openWizard = () => { resetWizard(); setWizardOpen(true); };
    const closeWizard = () => { setWizardOpen(false); resetWizard(); };

    const openEditWizard = (kit) => {
        setStep(1);
        setEditingId(kit.id);
        setKitTitle(kit.title || '');
        setKitDescription(kit.description || '');
        const firstCamera = kit.cameras?.[0];
        setSelectedCamera(firstCamera ? { ...firstCamera, name: firstCamera.title, specLine: cameraSpecLine(firstCamera) } : null);
        setSelectedLenses((kit.lenses || []).map(l => ({ ...l, name: l.title, specLine: lensSpecLine(l) })));
        setSelectedAccessories((kit.accessories || []).map(a => ({ ...a, name: a.title, specLine: accessorySpecLine(a) })));
        setWizardOpen(true);
    };

    const toggleLens = (lens) => setSelectedLenses(prev => prev.some(l => l.id === lens.id) ? prev.filter(l => l.id !== lens.id) : [...prev, lens]);
    const toggleAccessory = (acc) => setSelectedAccessories(prev => prev.some(a => a.id === acc.id) ? prev.filter(a => a.id !== acc.id) : [...prev, acc]);

    const saveKit = async (e) => {
        e.preventDefault();
        const gear_ids = [
            ...(selectedCamera ? [selectedCamera.id] : []),
            ...selectedLenses.map(l => l.id),
            ...selectedAccessories.map(a => a.id),
        ];
        try {
            setIsSaving(true);
            const payload = { title: kitTitle || 'Untitled Library', description: kitDescription, gear_ids };
            if (editingId) {
                await apiClient.put(`/gear-libraries/${editingId}`, payload);
            } else {
                await apiClient.post('/gear-libraries', payload);
            }
            closeWizard();
            await loadAll();
        } catch (error) {
            console.error('Error saving gear library:', error);
            alert(error?.response?.data?.message || 'Unable to save gear library.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this gear library?')) return;
        try {
            await apiClient.delete(`/gear-libraries/${id}`);
            setLibrary(prev => prev.filter(k => k.id !== id));
        } catch (error) {
            console.error('Error deleting gear library:', error);
            alert(error?.response?.data?.message || 'Unable to delete gear library.');
        }
    };

    const detailKit = library.find(k => k.id === detailId);

    const wizSystemOptions = [...new Set(cameraCatalog.map(c => c.system).filter(Boolean))].sort();
    const wizModelOptions = [...new Set(cameraCatalog.filter(c => !wizSystem || c.system === wizSystem).map(c => c.model_name).filter(Boolean))].sort();
    const wizMountOptions = [...new Set(cameraCatalog.map(c => c.mount).filter(Boolean))].sort();
    const wizResolutionOptions = [...new Set(cameraCatalog.map(c => c.resolution).filter(Boolean))].sort();
    const wizardCameraOptions = cameraCatalog.filter(c =>
        (!wizSystem || c.system === wizSystem) &&
        (!wizModel || c.model_name === wizModel) &&
        (!wizMount || c.mount === wizMount) &&
        (!wizResolution || c.resolution === wizResolution)
    );

    const mountFilteredLenses = lensCatalog.filter(l => !selectedCamera?.mount || l.mount === selectedCamera.mount);
    const wizFocalLengthOptions = [...new Set(mountFilteredLenses.map(l => l.min_focal_length != null && l.min_focal_length !== '' ? `${l.min_focal_length}mm` : null).filter(Boolean))].sort();
    const wizApertureOptions = [...new Set(mountFilteredLenses.map(l => l.min_aperture != null && l.min_aperture !== '' ? `f/${l.min_aperture}` : null).filter(Boolean))].sort();
    const wizardLensOptions = mountFilteredLenses.filter(l =>
        (!wizFocalLength || `${l.min_focal_length}mm` === wizFocalLength) &&
        (!wizAperture || `f/${l.min_aperture}` === wizAperture)
    );

    const wizTypeOptions = [...new Set(accessoryCatalog.map(a => a.type).filter(Boolean))].sort();
    const wizardAccessoryOptions = accessoryCatalog.filter(a => !wizType || a.type === wizType);

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
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={user.profile_image_url || c1} alt="Profile" onError={(e) => { e.target.src = c1; }} />
                                                <div className="profile-info">
                                                    <h2 className="name">{user.first_name}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className='ca-details'>My Photos</small>
                                                <h3 className="number">{totals.totalPhotos}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className='ca-details'>Interactions</small>
                                                <div className="row align-items-center">
                                                    <div className="col-md-5">
                                                        <h3 className="number">
                                                            {totals.totalLikes + totals.totalComments}
                                                        </h3>
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
                                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                                            <h4 className="head m-0">My Gear Library</h4>
                                            <div className="d-flex gap-3 align-items-center">
                                                <div style={{ position: 'relative' }}>
                                                    <input className="form-control" style={{ width: '260px', paddingRight: '34px' }} placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                                                    <i className="fas fa-search" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#99816b' }}></i>
                                                </div>
                                                <button type="button" className='btn' id="edit" style={{ whiteSpace: 'nowrap', flexShrink: '0', width: '190px', maxWidth: '190px' }} onClick={openWizard}>+ Add New Library</button>
                                            </div>
                                        </div>

                                        <div className="row g-4">
                                            {filtered.length === 0 && <p className="text-muted">No gear libraries yet.</p>}
                                            {paginatedKits.map(kit => {
                                                const firstCamera = kit.cameras?.[0];
                                                return (
                                                    <div className="col-md-4" key={kit.id}>
                                                        <div className="h-100 d-flex flex-column rounded p-3" style={{ background: '#F3EEE8' }}>
                                                            <h6 className="head mb-2">{kit.title}</h6>
                                                            <p className="text-secondary mb-3" style={{ width: '300px', fontSize: '12px', fontWeight: '400', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', }} >
                                                                {kit.description}
                                                            </p>
                                                            <div className="bg-white rounded p-3 mb-3 flex-grow-1" style={{ border: '1px solid #e4ddd6' }}>
                                                                <ul className="mb-0 ps-3" style={{ fontSize: '13px' }}>
                                                                    {firstCamera ? <li>{firstCamera.title}</li> : <li className="text-muted">No camera selected</li>}
                                                                    {kit.counts?.lenses > 0 && <li>{kit.counts.lenses} Lens{kit.counts.lenses > 1 ? 'es' : ''}</li>}
                                                                    {kit.counts?.accessories > 0 && <li>{kit.counts.accessories} Accessor{kit.counts.accessories > 1 ? 'ies' : 'y'}</li>}
                                                                </ul>
                                                            </div>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <button className="btn" id="e-edit" onClick={() => setDetailId(kit.id)}>View Details</button>
                                                                <div className="d-flex gap-3">
                                                                    <button type="button" className="btn p-0 border-0 bg-transparent" style={{ color: '#cc445e' }} onClick={() => handleDelete(kit.id)} aria-label="Delete library" >
                                                                        <i className="fas fa-trash-alt"></i>
                                                                    </button>
                                                                    <button type="button" className="btn p-0 border-0 bg-transparent" style={{ color: '#cc445e' }} onClick={() => openEditWizard(kit)} aria-label="Edit library" >
                                                                        <i className="fas fa-pen"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <GearPager page={currentPage} totalPages={totalPages} onChange={setPage} />
                                        <button className="btn" id="e-view" onClick={() => navigate('/gear')}>Back</button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    {detailKit && (
                                        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: '1050' }} onClick={() => setDetailId(null)}>
                                            <div className="bg-white rounded p-4" style={{ maxWidth: '560px', width: '92%', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <h4 className="head m-0">{detailKit.title}</h4>
                                                    <button className="btn" onClick={() => setDetailId(null)}><i className="fas fa-times"></i></button>
                                                </div>
                                                <p className="text-secondary">{detailKit.description}</p>
                                                <hr />
                                                <h6 className="head" style={{ color: '#cc445e' }}><i className="fas fa-camera me-2"></i>Camera</h6>
                                                {detailKit.cameras?.length ? detailKit.cameras.map(c => (
                                                    <div className="mb-3" key={c.id}>
                                                        <div className="fw-medium">{c.title}</div>
                                                        <small className="text-muted d-block">{cameraSpecLine(c)}</small>
                                                    </div>
                                                )) : <p className="text-muted">None selected</p>}
                                                <hr />
                                                <h6 className="head" style={{ color: '#cc445e' }}><i className="fas fa-crop me-2"></i>Lenses ({detailKit.lenses?.length || 0})</h6>
                                                {(detailKit.lenses || []).map(l => (
                                                    <div className="mb-3" key={l.id}>
                                                        <div className="fw-medium">{l.title}</div>
                                                        <small className="text-muted d-block">{lensSpecLine(l)}</small>
                                                    </div>
                                                ))}
                                                <hr />
                                                <h6 className="head" style={{ color: '#cc445e' }}><i className="fas fa-suitcase me-2"></i>Accessories ({detailKit.accessories?.length || 0})</h6>
                                                {(detailKit.accessories || []).map(a => (
                                                    <div className="mb-3" key={a.id}>
                                                        <div className="fw-medium">{a.title}</div>
                                                        <small className="text-muted d-block">{accessorySpecLine(a)}</small>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    {wizardOpen && (
                                        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: '1050' }} onClick={closeWizard}>
                                            <div className="bg-white rounded p-4" style={{ maxWidth: '760px', width: '92%', maxHeight: '88vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                                                <div className="position-relative mb-4">
                                                    <h3 className="head text-center m-0">Gear Selector</h3>
                                                    <button className="btn position-absolute top-0 end-0 p-0" style={{ border: 'none', background: 'transparent' }} onClick={closeWizard}><i className="fas fa-times"></i></button>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mb-4 text-center">
                                                    {['Choose Camera', 'Choose Lenses', 'Choose Accessories', 'Final Setup'].map((label, i) => (
                                                        <div key={label} className="flex-grow-1">
                                                            <div className="rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-1" style={{ width: '32px', height: '32px', backgroundColor: step >= i + 1 ? '#cc445e' : '#e4ddd6' }}>{i + 1}</div>
                                                            <div className="small" style={{ color: step === i + 1 ? '#cc445e' : '#999' }}>{label}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {step >= 2 && selectedCamera && (
                                                    <div className="rounded p-3 mb-4" style={{ border: '1px solid #e4ddd6', background: '#faf8f6' }}>
                                                        <div className="small text-muted mb-2">Your picks</div>
                                                        <div className="mb-2 pb-2" style={{ borderBottom: (selectedLenses.length > 0 || selectedAccessories.length > 0) ? '1px solid #eee' : 'none' }}>
                                                            <div className="small text-muted mb-1">Camera</div>
                                                            <div className="d-flex align-items-center gap-3">
                                                                <img src={selectedCamera.image || c1} alt={selectedCamera.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />
                                                                <div>
                                                                    <div className="fw-medium">{selectedCamera.name}</div>
                                                                    <span className="d-inline-block px-2 py-1 rounded" style={{ backgroundColor: '#fde8ec', color: '#cc445e', fontSize: '11px' }}>{selectedCamera.resolution || selectedCamera.specLine}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {step >= 3 && selectedLenses.length > 0 && (
                                                            <div className="mb-2 pb-2" style={{ borderBottom: selectedAccessories.length > 0 ? '1px solid #eee' : 'none' }}>
                                                                <div className="small text-muted mb-1">Lens{selectedLenses.length > 1 ? 'es' : ''}</div>
                                                                {selectedLenses.map(lens => (
                                                                    <div className="d-flex align-items-center gap-3 mb-2" key={lens.id}>
                                                                        <img src={lens.image || c1} alt={lens.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />
                                                                        <div>
                                                                            <div className="fw-medium">{lens.name}</div>
                                                                            <span className="d-inline-block px-2 py-1 rounded" style={{ backgroundColor: '#fde8ec', color: '#cc445e', fontSize: '11px' }}>{lens.specLine}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {step >= 4 && selectedAccessories.length > 0 && (
                                                            <div>
                                                                <div className="small text-muted mb-1">Accessories</div>
                                                                {selectedAccessories.map((acc, idx) => (
                                                                    <div className="d-flex align-items-center gap-3 py-2" style={{ borderTop: idx > 0 ? '1px solid #eee' : 'none' }} key={acc.id}>
                                                                        <img src={acc.image || c1} alt={acc.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                                                                        <div className="fw-medium">{acc.name}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {step === 1 && (
                                                    <>
                                                        <div className="row mb-3">
                                                            <div className='col-md-6'>
                                                                <label className="d-block">System</label>
                                                                <select className="form-select" value={wizSystem} onChange={(e) => { setWizSystem(e.target.value); setWizModel(''); }}>
                                                                    <option value="">-- Select --</option>
                                                                    {wizSystemOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                                </select>
                                                            </div>
                                                            <div className='col-md-6'>
                                                                <label className="d-block">Model</label>
                                                                <select className="form-select" value={wizModel} onChange={(e) => setWizModel(e.target.value)}>
                                                                    <option value="">-- Select --</option>
                                                                    {wizModelOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="row mb-3">
                                                            <div className='col-md-6'>
                                                                <label className="d-block">Mount</label>
                                                                <select className="form-select" value={wizMount} onChange={(e) => { setWizMount(e.target.value); setWizModel(''); }}>
                                                                    <option value="">-- Select --</option>
                                                                    {wizMountOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                                </select>
                                                            </div>
                                                            <div className='col-md-6'>
                                                                <label className="d-block">Resolution</label>
                                                                <select className="form-select" value={wizResolution} onChange={(e) => setWizResolution(e.target.value)}>
                                                                    <option value="">-- Select --</option>
                                                                    {wizResolutionOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="row g-3">
                                                            {!wizSystem && <p className="text-muted">Select a system to see matching cameras.</p>}
                                                            {wizSystem && wizardCameraOptions.length === 0 && <p className="text-muted">No cameras in your gear yet. Add some from the Gear page first.</p>}
                                                            {wizSystem && wizardCameraOptions.map(cam => (
                                                                <div className="col-4" key={cam.id}>
                                                                    <div className="rounded p-2 text-center" style={{ cursor: 'pointer', border: selectedCamera?.id === cam.id ? '2px solid #cc445e' : '1px solid #ddd' }} onClick={() => { setSelectedCamera(cam); if (cam.mount !== selectedCamera?.mount) setSelectedLenses([]); }}>
                                                                        <img src={cam.image || c1} alt={cam.name} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} />
                                                                        <div className="small fw-medium">{cam.name}</div>
                                                                        <div className="small text-muted">{cam.specLine}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                                {step === 2 && (
                                                    <>
                                                        <div className="row mb-3">
                                                            <div className='col-md-6'>
                                                                <label className="d-block">Focal Length</label>
                                                                <select className="form-select" value={wizFocalLength} onChange={(e) => setWizFocalLength(e.target.value)}>
                                                                    <option value="">-- Select --</option>
                                                                    {wizFocalLengthOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                                </select>
                                                            </div>
                                                            <div className='col-md-6'>
                                                                <label className="d-block">Aperture</label>
                                                                <select className="form-select" value={wizAperture} onChange={(e) => setWizAperture(e.target.value)}>
                                                                    <option value="">-- Select --</option>
                                                                    {wizApertureOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="row g-3">
                                                            {!selectedCamera && <p className="text-muted">Select a camera first to see compatible lenses.</p>}
                                                            {selectedCamera && wizardLensOptions.length === 0 && <p className="text-muted">No lenses for this camera's system yet.</p>}
                                                            {selectedCamera && wizardLensOptions.map(lens => {
                                                                const checked = selectedLenses.some(l => l.id === lens.id);
                                                                return (
                                                                    <div className="col-4" key={lens.id}>
                                                                        <div className="rounded p-2 text-center position-relative" style={{ cursor: 'pointer', border: '1px solid #ddd' }} onClick={() => toggleLens(lens)}>
                                                                            <div className="position-absolute d-flex align-items-center justify-content-center" style={{ top: '8px', right: '8px', width: '20px', height: '20px', borderRadius: '4px', border: checked ? 'none' : '1px solid #bbb', backgroundColor: checked ? '#cc445e' : '#fff' }}>
                                                                                {checked && <i className="fas fa-check" style={{ fontSize: '11px', color: '#fff' }}></i>}
                                                                            </div>
                                                                            <img src={lens.image || c1} alt={lens.name} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} />
                                                                            <div className="small fw-medium">{lens.name}</div>
                                                                            <div className="small text-muted">{lens.specLine}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                                {step === 3 && (
                                                    <>
                                                        <div className="row mb-3">
                                                            <div className='col-md-12'>
                                                                <label className="d-block">Type</label>
                                                                <select className="form-select" value={wizType} onChange={(e) => setWizType(e.target.value)}>
                                                                    <option value="">-- Select --</option>
                                                                    {wizTypeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="row g-3">
                                                            {!wizType && <p className="text-muted">Select a type to see matching accessories.</p>}
                                                            {wizType && wizardAccessoryOptions.length === 0 && <p className="text-muted">No accessories in your gear yet.</p>}
                                                            {wizType && wizardAccessoryOptions.map(acc => {
                                                                const checked = selectedAccessories.some(a => a.id === acc.id);
                                                                return (
                                                                    <div className="col-4" key={acc.id}>
                                                                        <div className="rounded p-2 text-center position-relative" style={{ cursor: 'pointer', border: '1px solid #ddd' }} onClick={() => toggleAccessory(acc)}>
                                                                            <div className="position-absolute d-flex align-items-center justify-content-center" style={{ top: '8px', right: '8px', width: '20px', height: '20px', borderRadius: '4px', border: checked ? 'none' : '1px solid #bbb', backgroundColor: checked ? '#cc445e' : '#fff' }}>
                                                                                {checked && <i className="fas fa-check" style={{ fontSize: '11px', color: '#fff' }}></i>}
                                                                            </div>
                                                                            <img src={acc.image || c1} alt={acc.name} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} />
                                                                            <div className="small fw-medium">{acc.name}</div>
                                                                            <div className="small text-muted">{acc.specLine}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                                {step === 4 && (
                                                    <form onSubmit={saveKit}>
                                                        <label className="form-label">Title</label>
                                                        <input className="form-control mb-3" placeholder="Text here..." value={kitTitle} onChange={(e) => setKitTitle(e.target.value)} required />
                                                        <label className="form-label">Description</label>
                                                        <textarea className="form-control" rows="4" placeholder="Text here..." value={kitDescription} onChange={(e) => setKitDescription(e.target.value)}></textarea>
                                                        <div className="d-flex justify-content-end mt-4">
                                                            <button type="submit" className="btn" id="edit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                                        </div>
                                                    </form>
                                                )}

                                                {step < 4 && (
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button type="button" className="btn" style={{ border: '1px solid #99816b', color: '#99816b' }} disabled={step === 1} onClick={() => setStep(s => s - 1)}>Previous</button>
                                                        <button type="button" className="btn" id="edit" onClick={() => setStep(s => s + 1)}>Next</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
export default PhotographerGearLibrary;
