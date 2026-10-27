import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

function MySales() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({ first_name: 'Photographer', profile_image_url: '' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });

    const [sales, setSales] = useState([]);
    const [salesLoading, setSalesLoading] = useState(true);
    const [browseSales, setBrowseSales] = useState([]);
    const [browseLoading, setBrowseLoading] = useState(true);
    const [requestedIds, setRequestedIds] = useState(new Set());
    const [requestingId, setRequestingId] = useState(null);

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [conditionFilter, setConditionFilter] = useState('');

    async function loadSales() {
        setSalesLoading(true);
        try {
            const response = await apiClient.get('/photographer/sales');
            setSales(response.data?.data || response.data || []);
        } catch (error) {
            console.error('Error loading sales:', error);
        } finally {
            setSalesLoading(false);
        }
    }

    async function loadBrowseSales() {
        setBrowseLoading(true);
        try {
            const response = await apiClient.get('/photographer/sales/browse');
            setBrowseSales(response.data?.data || response.data || []);
        } catch (error) {
            console.error('Error loading photos for sale:', error);
        } finally {
            setBrowseLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            loadSales(),
            loadBrowseSales(),
            apiClient.get('/member-admin/profile/portfolio').then((response) => {
                const memberInfo = response.data?.member_info?.original?.data;
                const galleryData = response.data?.gallery?.original?.data;
                if (memberInfo) setUser(memberInfo);
                setTotals({
                    totalPhotos: galleryData?.total_photos ?? 0,
                    totalLikes: galleryData?.total_likes ?? 0,
                    totalComments: galleryData?.total_comments ?? 0,
                });
            }),
        ]).finally(() => setIsLoading(false));
    }, []);

    async function handleRequest(id) {
        setRequestingId(id);
        try {
            await apiClient.post(`/photographer/sales/${id}/request`);
            setRequestedIds((prev) => new Set(prev).add(id));
        } catch (error) {
            console.error('Error requesting photo:', error);
        } finally {
            setRequestingId(null);
        }
    }

    const categories = useMemo(
        () => [...new Set(sales.map((s) => s.category).filter(Boolean))],
        [sales]
    );

    const filteredSales = useMemo(() => {
        return sales.filter((s) => {
            if (search.trim() && !(s.title || '').toLowerCase().includes(search.toLowerCase())) return false;
            if (categoryFilter && s.category !== categoryFilter) return false;
            if (conditionFilter && s.condition !== conditionFilter) return false;
            if (priceFilter) {
                const price = Number(s.price || 0);
                if (priceFilter === 'under50' && !(price < 50)) return false;
                if (priceFilter === '50to200' && !(price >= 50 && price <= 200)) return false;
                if (priceFilter === 'over200' && !(price > 200)) return false;
            }
            return true;
        });
    }, [sales, search, categoryFilter, conditionFilter, priceFilter]);

    const resetFilters = () => { setCategoryFilter(''); setPriceFilter(''); setConditionFilter(''); };

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="My Sales" />
                        <div className="content">
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <img className="img-fluid" src={user.profile_image_url || '/placeholder.jpg'} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                                                <div className="profile-info">
                                                    <h2 className="name">{user.first_name}</h2>
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
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{totals.totalLikes + totals.totalComments}</h3>
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
                                    <div className="card bg-white border-0 rounded shadow-sm p-3 mb-4">
                                        <div className="d-flex flex-wrap gap-3 align-items-end justify-content-between">
                                            <div className="d-flex flex-wrap gap-2 align-items-end">
                                                <div>
                                                    <label className="form-label mb-1">Category</label>
                                                    <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                                        <option value="">- Select -</option>
                                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="form-label mb-1">Price</label>
                                                    <select className="form-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                                                        <option value="">- Select -</option>
                                                        <option value="under50">Under £50</option>
                                                        <option value="50to200">£50 - £200</option>
                                                        <option value="over200">Over £200</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="form-label mb-1">Condition</label>
                                                    <select className="form-select" value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
                                                        <option value="">- Select -</option>
                                                        <option value="new">New</option>
                                                        <option value="used">Used</option>
                                                    </select>
                                                </div>
                                                <button className="btn" style={{ border: '1px solid #99816b', color: '#99816b', height: '38px' }} onClick={resetFilters}>Reset</button>
                                            </div>
                                            <div className="d-flex gap-3">
                                                <input type="search" className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: '260px', border: '1px solid #a0846c' }} />
                                                <button className="btn" id="edit" onClick={() => navigate('/my-sales/add')}>+ Add Items</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-4">
                                        <h5 className="head">All Item Listing</h5>
                                        {salesLoading && <p className="text-muted small">Loading your listings...</p>}
                                        {!salesLoading && filteredSales.length === 0 && <p className="text-muted small">No items found.</p>}
                                        {filteredSales.map((sale) => (
                                            <div key={sale.id} className="d-flex gap-4 mb-4 pb-4 border-bottom">
                                                <img src={sale.image || '/placeholder.jpg'} alt={sale.title} className="rounded" style={{ width: '220px', height: '160px', objectFit: 'cover', flexShrink: 0 }} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                    <h4 className="head mt-5 mb-5">{sale.title}</h4>
                                                    <p className="mb-2" style={{ color: '#cc445e', fontWeight: '600' }}>£ {Number(sale.price).toFixed(0)}</p>
                                                    {sale.sold_count > 0 && <p className="text-muted small mb-2">{String(sale.sold_count).padStart(2, '0')} Sold</p>}
                                                    {sale.description && <p className="text-secondary mb-3">{sale.description}</p>}
                                                    <button className="btn" id="e-view" onClick={() => navigate(`/my-sales/${sale.id}`)}>View Details</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-4">
                                        <h5 className="head mt-5 mb-5">Photos For Sale by Other Members</h5>
                                        <div className="my-sales-grid">
                                            {browseLoading && <p className="text-muted small">Loading listings...</p>}
                                            {!browseLoading && browseSales.length === 0 && <p className="text-muted small">No one else has listed photos for sale yet.</p>}
                                            {browseSales.map((sale) => {
                                                const requested = requestedIds.has(sale.id);
                                                return (
                                                    <div className="sale-card" key={sale.id}>
                                                        <img src={sale.image || '/placeholder.jpg'} alt={sale.title} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                                                        <div className="sale-card-body">
                                                            <div className="d-flex justify-content-between align-items-baseline">
                                                                <h6 className="mb-1">{sale.title}</h6>
                                                                <span className="sale-price">£ {Number(sale.price).toFixed(0)}</span>
                                                            </div>
                                                            <p className="sale-desc mb-1">by {sale.seller?.name || 'Unknown'}</p>
                                                            {sale.description && <p className="sale-desc">{sale.description}</p>}
                                                            <button type="button" className="btn-sales-add" disabled={requested || requestingId === sale.id} onClick={() => handleRequest(sale.id)} >
                                                                {requested ? 'Requested' : requestingId === sale.id ? 'Sending...' : 'Request This Photo'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </section> */}
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
export default MySales;
