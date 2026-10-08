import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import c1 from '../club_admin/assets/images/dashboard/c1.jpg';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

// Frontend suitability slider keys (1-5 scale) and their backend `suitability_*` column names (0-100 scale).
// "weddingEvents" is a single UI slider that maps to the two related backend columns (wedding + event).
export const suitabilityFields = [
    'birdWildlife', 'sportsAction', 'portraits', 'travel', 'street',
    'weddingEvents', 'walkAround', 'vlogging', 'landscape', 'macro', 'studio',
];
export const suitabilityLabels = {
    birdWildlife: 'Bird / Wildlife', sportsAction: 'Sports / Action', portraits: 'Portraits',
    travel: 'Travel Photography', street: 'Street Photography', weddingEvents: 'Wedding/Events',
    walkAround: 'Walk Around', vlogging: 'Vlogging/Video', landscape: 'Landscape',
    macro: 'Macro/Close-up', studio: 'Studio / Product',
};
// Maps a UI suitability key to the backend column key(s) under Gear::SUITABILITY_FIELDS (minus the `suitability_` prefix).
export const suitabilityBackendKeys = {
    birdWildlife: ['wildlife'], sportsAction: ['sports'], portraits: ['portrait'],
    travel: ['travel'], street: ['street'], weddingEvents: ['wedding', 'event'],
    walkAround: ['walk_around'], vlogging: ['vlogging'], landscape: ['landscape'],
    macro: ['macro'], studio: ['studio'],
};
// UI slider is 1-5 (matching the 5 label stops), backend stores 0-100. Both use the same 5 label breakpoints.
export const levelToScore = (level) => Math.max(0, Math.min(100, (Number(level) - 1) * 25));
export const scoreToLevel = (score) => Math.max(1, Math.min(5, Math.round(Number(score || 0) / 25) + 1));

// Groups a flat list of the member's own gear the same way GearLibraryResource does on the backend,
// so the gear-library wizard can let people pick from real gear instead of a hardcoded catalog.
export function groupGearByKind(gearList) {
    const isCamera = (g) => (g.category?.name || g.category || '').toLowerCase().includes('camera');
    const isLens = (g) => (g.category?.name || g.category || '').toLowerCase().includes('lens');
    const cameras = gearList.filter(isCamera);
    const lenses = gearList.filter(isLens);
    const accessories = gearList.filter((g) => !isCamera(g) && !isLens(g));
    return { cameras, lenses, accessories };
}

// The gear list/show endpoints are backed by a Yajra DataTables query. Response shape can vary
// (DataTables wrapper vs a plain array), so unwrap defensively instead of assuming one shape.
export function extractRows(response) {
    const body = response?.data;
    const payload = body?.data ?? body;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.original?.data)) return payload.original.data;
    if (Array.isArray(payload?.original?.data?.data)) return payload.original.data.data;
    return [];
}

function PhotographerGear() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [system, setSystem] = useState('');
    const [type, setType] = useState('');
    const [score, setScore] = useState('');
    const [gear, setGear] = useState([]);
    const [categories, setCategories] = useState([]);
    const [systems, setSystems] = useState([]);
    const [types, setTypes] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            try {
                const [gearRes, extrasRes] = await Promise.all([
                    apiClient.get('/gears', { params: { draw: 1, start: 0, length: -1 } }),
                    apiClient.get('/gear-extras'),
                ]);
                if (cancelled) return;
                setGear(extractRows(gearRes));
                const extras = extrasRes.data?.data || extrasRes.data || {};
                setCategories(extras.gear_categories || []);
                setSystems(extras.systems || []);
                setTypes(extras.types || []);
            } catch (error) {
                console.error('Error loading gear:', error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const filtered = gear.filter(g =>
        (g.title || '').toLowerCase().includes(search.toLowerCase()) &&
        (categoryId === '' || String(g.category_id) === String(categoryId)) &&
        (system === '' || g.system === system) &&
        (type === '' || g.type === type) &&
        (score === '' || Number(g.rating || 0) >= Number(score))
    );

    const resetFilters = () => { setSearch(''); setCategoryId(''); setSystem(''); setType(''); setScore(''); };

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Gear" />
                        <div className="content">
                            <div className="dashboard-card">
                                <div className="profile-card">
                                    <div className="profile-left d-flex align-items-center gap-3">
                                        <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={c1} alt="Profile" />
                                        <div className="profile-info">
                                            <h2 className="name">Photographer</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                    <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                        <small style={{ fontSize: '20px' }}>My Photos</small>
                                        <h3 className="number mt-4" style={{ fontSize: '48px' }}>21</h3>
                                    </div>
                                    <div className="event-cards text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                        <small style={{ fontSize: '20px' }}>Interactions</small>
                                        <h3 className="number mt-4" style={{ fontSize: '48px' }}>99</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-white border-0 rounded shadow-sm p-3 mb-4">
                                <div className="d-flex flex-wrap gap-3 align-items-end justify-content-between">
                                    <div className="d-flex flex-wrap gap-2 align-items-end">
                                        <div>
                                            <label className="form-label small mb-1">Category</label>
                                            <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                                <option value="">- Select -</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="form-label small mb-1">System</label>
                                            <select className="form-select" value={system} onChange={(e) => setSystem(e.target.value)}>
                                                <option value="">- Select -</option>
                                                {systems.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="form-label small mb-1">Type</label>
                                            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                                                <option value="">- Select -</option>
                                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="form-label small mb-1">Score</label>
                                            <input className="form-control" placeholder="Min rating..." type="number" min="1" max="10" value={score} onChange={(e) => setScore(e.target.value)} />
                                        </div>
                                        <button className="btn" style={{ border: '1px solid #99816b', color: '#99816b', height: '38px' }} onClick={resetFilters}>Reset</button>
                                    </div>
                                    <button className="btn text-white" style={{ backgroundColor: '#3a2e26' }} onClick={() => navigate('/gear/add')}>+ Add New Gear</button>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <input type="search" className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: '300px', border: '1px solid #a0846c' }} />
                                <button className="btn" style={{ border: '1px solid #99816b', color: '#99816b' }} onClick={() => navigate('/gear/library')}><i className="fas fa-suitcase me-2"></i>Gear Library</button>
                            </div>

                            <div className="row g-4">
                                {filtered.length === 0 && <p className="text-muted">No gear found.</p>}
                                {filtered.map(g => (
                                    <div className="col-md-6" key={g.id}>
                                        <div className="note-card p-3 rounded d-flex gap-3" style={{ background: '#FFFFFF', borderRadius: '10px', boxShadow: '0px 3px 15px 0px #0000001A' }}>
                                            <img src={g.image || c1} alt={g.title} style={{ width: '140px', height: '120px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                                            <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                                <div>
                                                    <div className="d-flex justify-content-between">
                                                        <h6 className="head mb-0">{g.title}</h6>
                                                        {(g.purchase_price || g.purchase_price === 0) && <strong style={{ color: '#cc445e' }}>£{g.purchase_price}</strong>}
                                                    </div>
                                                    {g.serial_number && <small className="text-muted">{g.serial_number}</small>}
                                                    <p className="text-secondary small mt-1 mb-2">{g.description}</p>
                                                    <div className="d-flex gap-2">
                                                        {g.category?.name && <span className="badge" style={{ backgroundColor: '#f3e9e0', color: '#99816b' }}>{g.category.name}</span>}
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-2 mt-2">
                                                    <button className="btn btn-sm" id="e-view" onClick={() => navigate(`/gear/${g.id}`)}>View</button>
                                                    <button className="btn" id="e-edit" onClick={() => navigate(`/gear/${g.id}/edit`)}>Edit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default PhotographerGear;
