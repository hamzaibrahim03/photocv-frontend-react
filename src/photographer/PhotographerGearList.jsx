import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
import { extractRows, groupGearByKind, GearPager } from './PhotographerGear';
import c1 from '../club_admin/assets/images/dashboard/c1.jpg';

const PAGE_SIZE = 12;

function PhotographerGearList() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const validKind = ['cameras', 'lenses', 'accessories'].includes(searchParams.get('category'));
    const [activeKind, setActiveKind] = useState(validKind ? searchParams.get('category') : 'all');
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterSystem, setFilterSystem] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterModelName, setFilterModelName] = useState('');
    const [filterScore, setFilterScore] = useState('');
    const [page, setPage] = useState(1);
    const [allGear, setAllGear] = useState([]);
    const [user, setUser] = useState({ first_name: 'Photographer', profile_image_url: '' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            try {
                const [gearRes, profileRes] = await Promise.all([
                    apiClient.get('/gears', { params: { draw: 1, start: 0, length: -1 } }),
                    apiClient.get('/member-admin/profile/portfolio'),
                ]);
                if (cancelled) return;

                const { cameras, lenses, accessories } = groupGearByKind(extractRows(gearRes));
                setAllGear([
                    ...cameras.map(g => ({ ...g, _kind: 'cameras' })),
                    ...lenses.map(g => ({ ...g, _kind: 'lenses' })),
                    ...accessories.map(g => ({ ...g, _kind: 'accessories' })),
                ]);

                const memberInfo = profileRes.data?.member_info?.original?.data;
                const galleryData = profileRes.data?.gallery?.original?.data;
                if (memberInfo) setUser(memberInfo);
                setTotals({
                    totalPhotos: galleryData?.total_photos ?? 0,
                    totalLikes: galleryData?.total_likes ?? 0,
                    totalComments: galleryData?.total_comments ?? 0,
                });
            } catch (error) {
                console.error('Error loading gear list:', error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const categoryOptions = [...new Set(allGear.map(g => g.category?.name).filter(Boolean))].sort();
    const systemOptions = [...new Set(allGear.map(g => g.system).filter(Boolean))].sort();
    const typeOptions = [...new Set(allGear.map(g => g.type).filter(Boolean))].sort();
    const modelNameOptions = [...new Set(allGear.map(g => g.model_name).filter(Boolean))].sort();

    const filtered = allGear.filter(g => {
        if (activeKind !== 'all' && g._kind !== activeKind) return false;
        if (!(g.title || '').toLowerCase().includes(search.toLowerCase())) return false;
        if (filterCategory && g.category?.name !== filterCategory) return false;
        if (filterSystem && g.system !== filterSystem) return false;
        if (filterType && g.type !== filterType) return false;
        if (filterModelName && g.model_name !== filterModelName) return false;
        if (filterScore && Number(g.rating || 0) < Number(filterScore)) return false;
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginatedGear = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const resetFilters = () => {
        setSearch(''); setFilterCategory(''); setFilterSystem(''); setFilterType(''); setFilterModelName(''); setFilterScore(''); setPage(1);
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
                                    <div className="d-flex gap-2 flex-wrap mb-3">
                                        {[
                                            { id: 'all', label: <><i className="fas fa-th-large me-2"></i>All Gear</> },
                                            { id: 'cameras', label: <><i className="fas fa-camera me-2"></i>Cameras</> },
                                            { id: 'lenses', label: <><i className="fas fa-circle-notch me-2"></i>Lens</> },
                                            { id: 'accessories', label: <><i className="fas fa-toolbox me-2"></i>Accessories</> },
                                        ].map(tab => (
                                            <button key={tab.id} className="btn" style={activeKind === tab.id ? { backgroundColor: '#3a2e26', color: '#fff', border: '1px solid #3a2e26' } : { border: '1px solid #99816b', color: '#99816b' }} onClick={() => { setActiveKind(tab.id); setPage(1); }} >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                    <input className="form-control mb-3" style={{ maxWidth: '320px' }} placeholder="Search gear by name..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px', display: 'flex' }}>
                                    <div className='card' style={{ flex: '0 0 1296px', borderRadius: '10px', boxShadow: '0px 10px 20px 0px #99816B26', width: '1296px', padding: '15px 20px', margin: '20px 0' }}>
                                        <div className='d-flex align-items-end flex-wrap' style={{ gap: '14px' }}>
                                            <div>
                                                <label className="d-block">Category</label>
                                                <select className='form-select' style={{ width: '210px' }} value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}>
                                                    <option value="">-- Select --</option>
                                                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="d-block">System</label>
                                                <select className='form-select' style={{ width: '210px' }} value={filterSystem} onChange={(e) => { setFilterSystem(e.target.value); setPage(1); }}>
                                                    <option value="">-- Select --</option>
                                                    {systemOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="d-block">Type</label>
                                                <select className='form-select' style={{ width: '210px' }} value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}>
                                                    <option value="">-- Select --</option>
                                                    {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="d-block">Model Name</label>
                                                <select className='form-select' style={{ width: '210px' }} value={filterModelName} onChange={(e) => { setFilterModelName(e.target.value); setPage(1); }}>
                                                    <option value="">-- Select --</option>
                                                    {modelNameOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="d-block">Score</label>
                                                <input type="text" className='form-control' style={{ width: '210px' }} placeholder="Text here..." value={filterScore} onChange={(e) => { setFilterScore(e.target.value); setPage(1); }} />
                                            </div>

                                            <button type="button" className='btn' id="e-view" onClick={resetFilters}>Reset</button>
                                        </div>
                                    </div>

                                    <div className='card' style={{ flex: '0 0 auto', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'center', padding: '15px', margin: '20px 0' }}>
                                        <button type="button" className='btn' id="edit" style={{ width: '160px', maxWidth: '160px' }} onClick={() => navigate('/gear/add')}>+ Add New Gear</button>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="row g-4">
                                        {paginatedGear.length === 0 && <p className="text-muted">No gear found.</p>}
                                        {paginatedGear.map(g => (
                                            <div className="col-md-6" key={g.id}>
                                                <div className="note-card p-3 rounded d-flex gap-3" style={{ background: '#FFFFFF', borderRadius: '10px', width: '730px', height: '227px' }}>
                                                    <img src={g.image || c1} alt={g.title} style={{ width: '225px', height: '188px', borderRadius: '8px', objectFit: 'cover', flexShrink: '0' }} />
                                                    <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: '0' }}>
                                                        <div>
                                                            <div className="d-flex">
                                                                <h6 className="head">{g.title}</h6>
                                                            </div>
                                                            {g.serial_number && <small className="text-muted">{g.serial_number}</small>}
                                                            <p className="text-secondary" style={{ fontSize: '11px', fontWeight: '400', paddingLeft: '20px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{g.description}</p>
                                                            <div className="d-flex gap-2">
                                                                {g.category?.name && <span className="d-inline-block px-2 py-1 rounded" style={{ height: '25px', borderRadius: '13px', gap: '4.09px', border: '0.41px solid #4C4036', fontWeight: '400', fontSize: '10px', }}>{g.category.name}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex gap-2 mt-2">
                                                            <button className="btn" id="e-view" onClick={() => navigate(`/gear/${g.id}`)}>View</button>
                                                            <button className="btn" id="e-edit" onClick={() => navigate(`/gear/${g.id}/edit`)}>Edit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <GearPager page={currentPage} totalPages={totalPages} onChange={setPage} />
                                    <button className="btn mt-4" style={{ border: '1px solid #99816b', color: '#99816b' }} onClick={() => navigate('/gear')}>Back</button>
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
export default PhotographerGearList;
