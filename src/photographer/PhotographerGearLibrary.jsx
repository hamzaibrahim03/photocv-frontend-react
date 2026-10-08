import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
import { extractRows, groupGearByKind } from './PhotographerGear';

function gearSpecs(g) {
    return [g.mount, g.resolution || g.model_name].filter(Boolean).join(' • ');
}

function PhotographerGearLibrary() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
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
    const [kitTitle, setKitTitle] = useState('');
    const [kitDescription, setKitDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

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
            setCameraCatalog(cameras.map(g => ({ id: g.id, name: g.title, specs: gearSpecs(g) })));
            setLensCatalog(lenses.map(g => ({ id: g.id, name: g.title, specs: gearSpecs(g) })));
            setAccessoryCatalog(accessories.map(g => ({ id: g.id, name: g.title, specs: gearSpecs(g) })));
        } catch (error) {
            console.error('Error loading gear library:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadAll(); }, []);

    const filtered = library.filter(k => (k.title || '').toLowerCase().includes(search.toLowerCase()));

    const resetWizard = () => {
        setStep(1); setSelectedCamera(null); setSelectedLenses([]); setSelectedAccessories([]);
        setKitTitle(''); setKitDescription(''); setEditingId(null);
    };
    const openWizard = () => { resetWizard(); setWizardOpen(true); };
    const closeWizard = () => { setWizardOpen(false); resetWizard(); };

    const openEditWizard = (kit) => {
        setStep(1);
        setEditingId(kit.id);
        setKitTitle(kit.title || '');
        setKitDescription(kit.description || '');
        const firstCamera = kit.cameras?.[0];
        setSelectedCamera(firstCamera ? { id: firstCamera.id, name: firstCamera.title, specs: gearSpecs(firstCamera) } : null);
        setSelectedLenses((kit.lenses || []).map(l => ({ id: l.id, name: l.title, specs: gearSpecs(l) })));
        setSelectedAccessories((kit.accessories || []).map(a => ({ id: a.id, name: a.title, specs: gearSpecs(a) })));
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
            const payload = { title: kitTitle || 'Untitled Kit', description: kitDescription, gear_ids };
            if (editingId) {
                await apiClient.put(`/gear-libraries/${editingId}`, payload);
            } else {
                await apiClient.post('/gear-libraries', payload);
            }
            closeWizard();
            await loadAll();
        } catch (error) {
            console.error('Error saving gear library:', error);
            alert(error?.response?.data?.message || 'Unable to save gear kit.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this gear kit?')) return;
        try {
            await apiClient.delete(`/gear-libraries/${id}`);
            setLibrary(prev => prev.filter(k => k.id !== id));
        } catch (error) {
            console.error('Error deleting gear library:', error);
            alert(error?.response?.data?.message || 'Unable to delete gear kit.');
        }
    };

    const detailKit = library.find(k => k.id === detailId);

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
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="head m-0">My Gear Library</h5>
                                    <div className="d-flex gap-2">
                                        <input type="search" className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: '1px solid #a0846c' }} />
                                        <button className="btn text-white text-nowrap" style={{ backgroundColor: '#3a2e26' }} onClick={openWizard}>+ Add New Library</button>
                                    </div>
                                </div>
                                <div className="row g-4">
                                    {filtered.length === 0 && <p className="text-muted">No gear kits yet.</p>}
                                    {filtered.map(kit => (
                                        <div className="col-md-4" key={kit.id}>
                                            <div className="note-card p-3 rounded" style={{ background: '#f8f3ee', borderRadius: '10px' }}>
                                                <h6 className="head mb-2">{kit.title}</h6>
                                                <p className="text-secondary small">{kit.description}</p>
                                                <div className="border rounded bg-white p-3 mb-3">
                                                    <div className="small">• {kit.cameras?.[0] ? kit.cameras[0].title : '—'}</div>
                                                    <div className="small">• {kit.lenses?.length || 0} Lenses</div>
                                                    <div className="small">• {kit.accessories?.length || 0} Accessories</div>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <button className="btn" id="edit" onClick={() => setDetailId(kit.id)}>View Details</button>
                                                    <div className="d-flex gap-2">
                                                        <button className="icon-btn" onClick={() => handleDelete(kit.id)}><i className="fas fa-trash-alt"></i></button>
                                                        <button className="icon-btn" onClick={() => openEditWizard(kit)}><i className="fas fa-edit"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn mt-4" style={{ border: '1px solid #99816b', color: '#99816b' }} onClick={() => navigate('/gear')}>Back</button>
                            </div>
                        </div>

                        {detailKit && (
                            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={() => setDetailId(null)}>
                                <div className="bg-white rounded p-4" style={{ maxWidth: '560px', width: '92%', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h4 className="head m-0">{detailKit.title}</h4>
                                        <button className="btn" onClick={() => setDetailId(null)}><i className="fas fa-times"></i></button>
                                    </div>
                                    <p className="text-secondary">{detailKit.description}</p>
                                    <hr />
                                    <h6 className="head"><i className="fas fa-camera me-2" style={{ color: '#cc445e' }}></i>Camera</h6>
                                    {detailKit.cameras?.length ? detailKit.cameras.map(c => <div className="mb-2" key={c.id}><div>{c.title}</div><small className="text-muted">{gearSpecs(c)}</small></div>) : <p className="text-muted">None selected</p>}
                                    <hr />
                                    <h6 className="head"><i className="fas fa-crop me-2" style={{ color: '#cc445e' }}></i>Lenses ({detailKit.lenses?.length || 0})</h6>
                                    {(detailKit.lenses || []).map(l => <div className="mb-2" key={l.id}><div>{l.title}</div><small className="text-muted">{gearSpecs(l)}</small></div>)}
                                    <hr />
                                    <h6 className="head"><i className="fas fa-suitcase me-2" style={{ color: '#cc445e' }}></i>Accessories ({detailKit.accessories?.length || 0})</h6>
                                    {(detailKit.accessories || []).map(a => <div className="mb-2" key={a.id}><div>{a.title}</div><small className="text-muted">{gearSpecs(a)}</small></div>)}
                                </div>
                            </div>
                        )}

                        {wizardOpen && (
                            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={closeWizard}>
                                <div className="bg-white rounded p-4" style={{ maxWidth: '640px', width: '92%', maxHeight: '88vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h4 className="head m-0">Gear Selector</h4>
                                        <button className="btn" onClick={closeWizard}><i className="fas fa-times"></i></button>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-4 text-center">
                                        {['Choose Camera', 'Choose Lenses', 'Choose Accessories', 'Final Setup'].map((label, i) => (
                                            <div key={label} className="flex-grow-1">
                                                <div className="rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-1" style={{ width: '32px', height: '32px', backgroundColor: step >= i + 1 ? '#cc445e' : '#e4ddd6' }}>{i + 1}</div>
                                                <div className="small" style={{ color: step === i + 1 ? '#cc445e' : '#999' }}>{label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {step === 1 && (
                                        <div className="row g-3">
                                            {cameraCatalog.length === 0 && <p className="text-muted">No cameras in your gear yet. Add some from the Gear page first.</p>}
                                            {cameraCatalog.map(cam => (
                                                <div className="col-4" key={cam.id}>
                                                    <div className="border rounded p-2 text-center" style={{ cursor: 'pointer', borderColor: selectedCamera?.id === cam.id ? '#cc445e' : '#ddd', borderWidth: selectedCamera?.id === cam.id ? '2px' : '1px' }} onClick={() => setSelectedCamera(cam)}>
                                                        <i className="fas fa-camera d-block mb-2" style={{ fontSize: '20px' }}></i>
                                                        <div className="small fw-medium">{cam.name}</div>
                                                        <div className="small text-muted">{cam.specs}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {step === 2 && (
                                        <div className="row g-3">
                                            {lensCatalog.length === 0 && <p className="text-muted">No lenses in your gear yet.</p>}
                                            {lensCatalog.map(lens => (
                                                <div className="col-4" key={lens.id}>
                                                    <div className="border rounded p-2 text-center position-relative" style={{ cursor: 'pointer' }} onClick={() => toggleLens(lens)}>
                                                        <input type="checkbox" className="position-absolute" style={{ top: '6px', right: '6px' }} checked={selectedLenses.some(l => l.id === lens.id)} readOnly />
                                                        <i className="fas fa-circle-notch d-block mb-2" style={{ fontSize: '20px' }}></i>
                                                        <div className="small fw-medium">{lens.name}</div>
                                                        <div className="small text-muted">{lens.specs}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {step === 3 && (
                                        <div className="row g-3">
                                            {accessoryCatalog.length === 0 && <p className="text-muted">No accessories in your gear yet.</p>}
                                            {accessoryCatalog.map(acc => (
                                                <div className="col-4" key={acc.id}>
                                                    <div className="border rounded p-2 text-center position-relative" style={{ cursor: 'pointer' }} onClick={() => toggleAccessory(acc)}>
                                                        <input type="checkbox" className="position-absolute" style={{ top: '6px', right: '6px' }} checked={selectedAccessories.some(a => a.id === acc.id)} readOnly />
                                                        <i className="fas fa-toolbox d-block mb-2" style={{ fontSize: '20px' }}></i>
                                                        <div className="small fw-medium">{acc.name}</div>
                                                        <div className="small text-muted">{acc.specs}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {step === 4 && (
                                        <form onSubmit={saveKit}>
                                            <label className="form-label">Title</label>
                                            <input className="form-control mb-3" placeholder="Text here..." value={kitTitle} onChange={(e) => setKitTitle(e.target.value)} required />
                                            <label className="form-label">Description</label>
                                            <textarea className="form-control" rows="4" placeholder="Text here..." value={kitDescription} onChange={(e) => setKitDescription(e.target.value)}></textarea>
                                            <div className="d-flex justify-content-end mt-4">
                                                <button type="submit" className="btn text-white" style={{ backgroundColor: '#3a2e26' }} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                            </div>
                                        </form>
                                    )}

                                    {step < 4 && (
                                        <div className="d-flex justify-content-between mt-4">
                                            <button type="button" className="btn" style={{ border: '1px solid #99816b', color: '#99816b' }} disabled={step === 1} onClick={() => setStep(s => s - 1)}>Previous</button>
                                            <button type="button" className="btn text-white" style={{ backgroundColor: '#3a2e26' }} onClick={() => setStep(s => s + 1)}>Next</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
export default PhotographerGearLibrary;
