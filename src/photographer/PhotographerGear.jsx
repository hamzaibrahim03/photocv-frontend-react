import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import c1 from '../club_admin/assets/images/dashboard/c1.jpg';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

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
export const suitabilityBackendKeys = {
    birdWildlife: ['wildlife'], sportsAction: ['sports'], portraits: ['portrait'],
    travel: ['travel'], street: ['street'], weddingEvents: ['wedding', 'event'],
    walkAround: ['walk_around'], vlogging: ['vlogging'], landscape: ['landscape'],
    macro: ['macro'], studio: ['studio'],
};
export const levelToScore = (level) => Math.max(0, Math.min(100, (Number(level) - 1) * 25));
export const scoreToLevel = (score) => Math.max(1, Math.min(5, Math.round(Number(score || 0) / 25) + 1));

export function groupGearByKind(gearList) {
    const isCamera = (g) => (g.category?.name || g.category || '').toLowerCase().includes('camera');
    const isLens = (g) => (g.category?.name || g.category || '').toLowerCase().includes('lens');
    const cameras = gearList.filter(isCamera);
    const lenses = gearList.filter(isLens);
    const accessories = gearList.filter((g) => !isCamera(g) && !isLens(g));
    return { cameras, lenses, accessories };
}

export function extractRows(response) {
    const body = response?.data;
    const payload = body?.data ?? body;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.original?.data)) return payload.original.data;
    if (Array.isArray(payload?.original?.data?.data)) return payload.original.data.data;
    return [];
}

const GEAR_PAGE_SIZE = 4;

export function GearPager({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null;
    return (
        <nav className="mt-3 d-flex justify-content-end">
            <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChange(page - 1)}>&lsaquo;</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onChange(p)} style={p === page ? { backgroundColor: '#cc445e', borderColor: '#cc445e' } : undefined}>{p}</button>
                    </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChange(page + 1)}>&rsaquo;</button>
                </li>
            </ul>
        </nav>
    );
}

function PhotographerGear() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [gear, setGear] = useState([]);
    const [, setCategories] = useState([]);

    const [user, setUser] = useState({ first_name: 'Photographer', profile_image_url: '' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });

    const [camerasPage, setCamerasPage] = useState(1);
    const [lensesPage, setLensesPage] = useState(1);
    const [accessoriesPage, setAccessoriesPage] = useState(1);

    const [sales, setSales] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [giftList, setGiftList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            try {
                const [gearRes, extrasRes, profileRes, salesRes, wishRes, giftRes] = await Promise.all([
                    apiClient.get('/gears', { params: { draw: 1, start: 0, length: -1 } }),
                    apiClient.get('/gear-extras'),
                    apiClient.get('/member-admin/profile/portfolio'),
                    apiClient.get('/photographer/sales'),
                    apiClient.get('/gear-wishlists', { params: { list_type: 'wish' } }),
                    apiClient.get('/gear-wishlists', { params: { list_type: 'gift' } }),
                ]);
                if (cancelled) return;
                setGear(extractRows(gearRes));
                const extras = extrasRes.data?.data || extrasRes.data || {};
                setCategories(extras.gear_categories || []);

                const memberInfo = profileRes.data?.member_info?.original?.data;
                const galleryData = profileRes.data?.gallery?.original?.data;
                if (memberInfo) setUser(memberInfo);
                setTotals({
                    totalPhotos: galleryData?.total_photos ?? 0,
                    totalLikes: galleryData?.total_likes ?? 0,
                    totalComments: galleryData?.total_comments ?? 0,
                });

                setSales(salesRes.data?.data || salesRes.data || []);
                setWishlist(wishRes.data?.data?.original?.data || []);
                setGiftList(giftRes.data?.data?.original?.data || []);
            } catch (error) {
                console.error('Error loading gear:', error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const searched = gear.filter(g => (g.title || '').toLowerCase().includes(search.toLowerCase()));
    const { cameras, lenses, accessories } = groupGearByKind(searched);

    const toggleWishlistPurchased = async (list, setList, item) => {
        const next = !item.is_purchased;
        setList(list.map(i => i.id === item.id ? { ...i, is_purchased: next } : i));
        try {
            await apiClient.put(`/gear-wishlists/${item.id}`, { is_purchased: next });
        } catch (error) {
            console.error('Error updating wishlist item:', error);
            setList(list.map(i => i.id === item.id ? { ...i, is_purchased: item.is_purchased } : i));
        }
    };

    const shareGiftList = async () => {
        const url = `${window.location.origin}/gear`;
        if (navigator.share) {
            try {
                await navigator.share({ title: `${user.first_name || 'My'} Gift List`, url });
                return;
            } catch (error) {
                if (error?.name === 'AbortError') return;
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            alert('Gift list link copied to clipboard.');
        } catch (error) {
            console.error('Error copying gift list link:', error);
            alert(url);
        }
    };

    const renderGearGrid = (items, page, setPage) => {
        const totalPages = Math.max(1, Math.ceil(items.length / GEAR_PAGE_SIZE));
        const pageItems = items.slice((page - 1) * GEAR_PAGE_SIZE, page * GEAR_PAGE_SIZE);
        return (
            <>
                <div className="row g-4">
                    {pageItems.length === 0 && <p className="text-muted">No gear found.</p>}
                    {pageItems.map(g => (
                        <div className="col-md-6" key={g.id}>
                            <div className="note-card p-3 rounded d-flex gap-3" style={{ background: '#FFFFFF', borderRadius: '10px', width: '730px', height: '227px' }}>
                                <img src={g.image || c1} alt={g.title} style={{ width: '225px', height: '188px', borderRadius: '8px', objectFit: 'cover', flexShrink: '0' }} />
                                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: '0' }}>
                                    <div>
                                        <div className="d-flex">
                                            <h6 className="head">{g.title}</h6>
                                        </div>
                                        {g.serial_number && <small className="text-muted">{g.serial_number}</small>}
                                        <p className="text-secondary" style={{ fontSize: '11px', fontWeight: '400', paddingLeft: '20px', width: '480px' }}>{g.description}</p>
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
                <GearPager page={page} totalPages={totalPages} onChange={setPage} />
            </>
        );
    };

    const TabButton = ({ id, label }) => (
        <button className="btn" style={activeTab === id ? { backgroundColor: '#3a2e26', color: '#fff', border: '1px solid #3a2e26' } : { border: '1px solid #99816b', color: '#99816b' }} onClick={() => setActiveTab(id)} >
            {label}
        </button>
    );

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
                                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                                        <input type="search" className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: '1140px', border: '1px solid #a0846c' }} />
                                        <div className="d-flex gap-3">
                                            <button className="btn" id="edit" style={{ width: '160px', maxWidth: '160px' }} onClick={() => navigate('/gear/add')}>+ Add New Gear</button>
                                            <button className="btn" id="e-view" style={{ width: '160px', maxWidth: '160px' }} onClick={() => navigate('/gear/library')}><i className="fas fa-suitcase me-2"></i>Gear Library</button>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2 flex-wrap mb-4">
                                        <TabButton id="all" label={<><i className="fas fa-th-large me-2"></i>All Gear</>} />
                                        <TabButton id="cameras" label={<><i className="fas fa-camera me-2"></i>Cameras</>} />
                                        <TabButton id="lenses" label={<><i className="fas fa-circle-notch me-2"></i>Lens</>} />
                                        <TabButton id="accessories" label={<><i className="fas fa-toolbox me-2"></i>Accessories</>} />
                                    </div>
                                </div>
                            </section>

                            {(activeTab === 'all' || activeTab === 'cameras') && (
                                <section>
                                    <div className='container' style={{ maxWidth: '1820px' }}>
                                        <div className="card bg-white border-0 rounded shadow-sm p-4 mb-4">
                                            <div className="card bg-white border-0 rounded shadow-sm p-2 mb-2" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", }} >
                                                <h5 className="head mb-0">My Cameras</h5>
                                                <button className="btn" id="e-view" onClick={() => navigate('/gear/list')}>
                                                    View All
                                                </button>
                                            </div>
                                            {renderGearGrid(cameras, camerasPage, setCamerasPage)}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {(activeTab === 'all' || activeTab === 'lenses') && (
                                <section>
                                    <div className='container' style={{ maxWidth: '1820px' }}>
                                        <div className="card bg-white border-0 rounded shadow-sm p-4 mb-4">
                                            <div className="card bg-white border-0 rounded shadow-sm p-2 mb-2" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", }} >
                                                <h5 className="head mb-0">My Lenses</h5>
                                                <button className="btn" id="e-view" onClick={() => navigate('/gear/list')}>
                                                    View All
                                                </button>
                                            </div>
                                            {renderGearGrid(lenses, lensesPage, setLensesPage)}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {(activeTab === 'all' || activeTab === 'accessories') && (
                                <section>
                                    <div className='container' style={{ maxWidth: '1820px' }}>
                                        <div className="card bg-white border-0 rounded shadow-sm p-4 mb-4">
                                            <div className="card bg-white border-0 rounded shadow-sm p-2 mb-2" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", }} >
                                                <h5 className="head mb-0">My Accessories</h5>
                                                <button className="btn" id="e-view" onClick={() => navigate('/gear/list')}>
                                                    View All
                                                </button>
                                            </div>
                                            {renderGearGrid(accessories, accessoriesPage, setAccessoriesPage)}
                                        </div>
                                    </div>
                                </section>
                            )}

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="card bg-white border-0 rounded p-4" style={{ width: '750px' }}>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5 className="head m-0">My Sales</h5>
                                                </div>
                                                {sales.length === 0 && <p className="text-muted small">You haven't listed any photos for sale yet.</p>}
                                                {sales.slice(0, 3).map((sale) => (
                                                    <div key={sale.id} className="d-flex gap-3 mb-3 pb-3" style={{ width: '690px', minHeight: '223px' }}>
                                                        <img src={sale.image || c1} alt={sale.title} style={{ width: '190px', height: '190px', objectFit: 'cover', borderRadius: '8px', flexShrink: '0' }} onError={(e) => { e.target.src = c1; }} />
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex justify-content-between align-items-baseline">
                                                                <h6 className="mb-1 fw-bold">{sale.title}</h6>
                                                                <strong style={{ color: '#cc445e' }}>£{Number(sale.price).toFixed(0)}</strong>
                                                            </div>
                                                            {sale.sold_count > 0 && <p className="text-muted small mb-1">{String(sale.sold_count).padStart(2, '0')} Sold</p>}
                                                            <span className="d-inline-block px-2 py-1 rounded mb-2" style={sale.status === 'active' ? { fontSize: '12px', backgroundColor: '#f3e2e6', color: '#cc445e' } : { fontSize: '12px', backgroundColor: '#f3e9e0', color: '#99816b' }}>
                                                                {sale.status === 'active' ? 'Available' : sale.status}
                                                            </span>
                                                            {sale.description && (
                                                                <p className="text-muted small mb-2">
                                                                    {sale.description}
                                                                </p>
                                                            )}
                                                            <button className="btn" id="e-view" onClick={() => navigate(`/my-sales/${sale.id}`)}>View Details</button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button className="btn" id="e-view" onClick={() => navigate('/my-sales')}>View All</button>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex flex-column gap-4">
                                                <div className="card bg-white border-0 rounded shadow-sm p-4" style={{ width: '720px' }}>
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h5 className="head m-0">My Wish list</h5>
                                                    </div>
                                                    <div className="row">
                                                        {wishlist.length === 0 && <p className="text-muted small">No wishlist items yet.</p>}
                                                        {wishlist.map((item) => (
                                                            <div key={item.id} className="col-6 d-flex align-items-center gap-2 mb-3">
                                                                <input type="checkbox" checked={!!item.is_purchased} onChange={() => toggleWishlistPurchased(wishlist, setWishlist, item)} />
                                                                <img src={item.image || c1} alt={item.title} style={{ width: '45px', height: '45px', borderRadius: '7px', objectFit: 'cover', flexShrink: '0', border: '0.3px solid #4C4036' }} onError={(e) => { e.target.src = c1; }} />
                                                                <div className="flex-grow-1 d-flex justify-content-between align-items-center" style={{ minWidth: '0' }}>
                                                                    <div style={{ minWidth: '0' }}>
                                                                        <div className="text-truncate small" style={{ fontSize: '14px', fontWeight: '400' }}>{item.title}</div>
                                                                        {item.brand && <div className="text-truncate" style={{ fontSize: '10px', color: '#cc445e', fontWeight: '400' }}>{item.brand}</div>}
                                                                    </div>
                                                                    {(item.price || item.price === 0) && <div className="text-muted small ms-2" style={{ flexShrink: '0', fontSize: '14px', fontWeight: '400' }}>£{item.price}</div>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button className="btn" id="e-view" onClick={() => navigate('/gear/wishlist/add?type=wish')}>Add List</button>
                                                </div>
                                                <div className="card bg-white border-0 rounded shadow-sm p-4">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h5 className="head m-0">Gift List</h5>
                                                    </div>
                                                    <div className="row">
                                                        {giftList.length === 0 && <p className="text-muted small">No gift list items yet.</p>}
                                                        {giftList.map((item) => (
                                                            <div key={item.id} className="col-6 d-flex align-items-center gap-2 mb-3">
                                                                <img src={item.image || c1} alt={item.title} style={{ width: '45px', height: '45px', borderRadius: '7px', objectFit: 'cover', flexShrink: '0', border: '0.3px solid #4C4036' }} onError={(e) => { e.target.src = c1; }} />
                                                                <div className="flex-grow-1 d-flex justify-content-between align-items-center" style={{ minWidth: '0' }}>
                                                                    <div style={{ minWidth: '0' }}>
                                                                        <div className="text-truncate small" style={{ fontSize: '14px', fontWeight: '400' }}>{item.title}</div>
                                                                        {item.brand && <div className="text-truncate" style={{ fontSize: '10px', color: '#cc445e', fontWeight: '400' }}>{item.brand}</div>}
                                                                    </div>
                                                                    {(item.price || item.price === 0) && <div className="text-muted small ms-2" style={{ flexShrink: '0', fontSize: '14px', fontWeight: '400' }}>£{item.price}</div>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button className="btn" id="e-view" onClick={shareGiftList}><i className="fas fa-share-alt me-2"></i>Share</button>
                                                </div>
                                            </div>
                                        </div>
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
export default PhotographerGear;
