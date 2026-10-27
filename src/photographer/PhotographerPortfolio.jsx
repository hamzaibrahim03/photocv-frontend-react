import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
import qrCode from '../club_admin/assets/images/profile/qr_code.png';
import c1 from '../club_admin/assets/images/dashboard/c1.jpg';
import { extractRows } from './PhotographerGear';

function timeAgo(value) {
    if (!value) return '';
    const diffMs = Date.now() - new Date(value).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    return `${Math.floor(hrs / 24)} day(s) ago`;
}

function PhotographerPortfolio() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ first_name: 'Photographer', profile_image_url: '/placeholder.jpg', username: '' });
    const [galleries, setGalleries] = useState([]);
    const [portfolioPhotos, setPortfolioPhotos] = useState([]);
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });
    const [recentComments, setRecentComments] = useState([]);
    const [recentLikes, setRecentLikes] = useState([]);
    const [interests, setInterests] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [sales, setSales] = useState([]);
    const [salesLoading, setSalesLoading] = useState(true);
    const [saleRequests, setSaleRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(true);
    const [requestActionId, setRequestActionId] = useState(null);
    const [showAddListing, setShowAddListing] = useState(false);
    const [newListing, setNewListing] = useState({ photo_id: '', title: '', description: '', price: '' });
    const [addListingError, setAddListingError] = useState('');
    const [addListingSaving, setAddListingSaving] = useState(false);

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

    async function loadSaleRequests() {
        setRequestsLoading(true);
        try {
            const response = await apiClient.get('/photographer/sale-requests');
            setSaleRequests(response.data?.data || response.data || []);
        } catch (error) {
            console.error('Error loading photo requests:', error);
        } finally {
            setRequestsLoading(false);
        }
    }

    async function handleCreateListing(e) {
        e.preventDefault();
        setAddListingError('');
        if (!newListing.photo_id || !newListing.title || !newListing.price) {
            setAddListingError('Please choose a photo, a title, and a price.');
            return;
        }
        setAddListingSaving(true);
        try {
            await apiClient.post('/photographer/sales', {
                photo_id: Number(newListing.photo_id),
                title: newListing.title,
                description: newListing.description || undefined,
                price: Number(newListing.price),
            });
            setNewListing({ photo_id: '', title: '', description: '', price: '' });
            setShowAddListing(false);
            loadSales();
        } catch (error) {
            setAddListingError(error?.response?.data?.message || 'Could not create this listing.');
        } finally {
            setAddListingSaving(false);
        }
    }

    async function handleRespondToRequest(id, action) {
        setRequestActionId(id);
        try {
            await apiClient.post(`/photographer/sale-requests/${id}/${action}`);
            setSaleRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: action === 'accept' ? 'accepted' : 'rejected' } : r)));
        } catch (error) {
            console.error(`Error ${action}ing request:`, error);
        } finally {
            setRequestActionId(null);
        }
    }

    useEffect(() => {
        loadSales();
        loadSaleRequests();
    }, []);

    useEffect(() => {
        async function loadPortfolio() {
            setLoading(true);
            setIsLoading(true);
            try {
                const [portfolioRes, interestsRes] = await Promise.all([
                    apiClient.get('/member-admin/profile/portfolio'),
                    apiClient.get('/member-admin/profile/interests-brands', { params: { draw: 1, start: 0, length: -1 } }),
                ]);
                const response = portfolioRes;
                const memberInfo = response.data?.member_info?.original?.data;
                const galleryData = response.data?.gallery?.original?.data;
                const interactions = response.data?.recent_comments_and_interactions;
                if (memberInfo) setUser(memberInfo);
                const galleryList = Array.isArray(galleryData?.galleries) ? galleryData.galleries : [];
                setGalleries(galleryList);
                setPortfolioPhotos(Array.isArray(galleryData?.portfolio_photos) ? galleryData.portfolio_photos : []);
                setTotals({
                    totalPhotos: galleryData?.total_photos ?? 0,
                    totalLikes: galleryData?.total_likes ?? 0,
                    totalComments: galleryData?.total_comments ?? 0,
                });
                setRecentComments(Array.isArray(interactions?.recent_comments_on_notices) ? interactions.recent_comments_on_notices : []);
                setRecentLikes(Array.isArray(interactions?.my_recent_likes) ? interactions.my_recent_likes : []);

                const rows = extractRows(interestsRes);
                setInterests(rows.filter((r) => r.interest));
                setBrands(rows.filter((r) => !r.interest && r.brands));
            } catch (error) {
                console.error('Error loading photographer portfolio:', error);
            } finally {
                setLoading(false);
                setIsLoading(false);
            }
        }
        loadPortfolio();
    }, []);

    const galleryTiles = useMemo(() => {
        return galleries.flatMap((g) =>
            (g.photos || []).map((photo) => ({
                id: photo.id,
                image: photo.image_url || '/placeholder.jpg',
                category: g.gallery_name,
                likes: photo.likes_count || 0,
                comments: photo.comments_count || 0,
            }))
        );
    }, [galleries]);
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
                                                <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={user.profile_image_url || '/placeholder.jpg'} alt="Profile" onError={(e) => e.target.src = '/placeholder.jpg'} />
                                                <div className="profile-info">
                                                    <h2 className="name">{user.first_name} {user.last_name}</h2>
                                                    {user.created_at && (
                                                        <small className="text-muted d-block">Member since {new Date(user.created_at).getFullYear()}</small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="profile-icons d-flex flex-column gap-2 text-danger">
                                                <div className="icon d-flex align-items-center gap-2"><span>{totals.totalComments}</span><i className="fas fa-comments"></i></div>
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
                                    <div className="card bg-white mt-4 border-0 rounded shadow-sm overflow-hidden p-4">
                                        <h4 className="head mt-5 mb-5">My Portfolio</h4>
                                        {loading ? (
                                            <div className="text-center py-5 text-muted">Loading portfolio...</div>
                                        ) : (
                                            <div className="portfolio-tiles-grid">
                                                {portfolioPhotos.length === 0 && <p className="text-muted small">No portfolio photos yet.</p>}
                                                {portfolioPhotos.slice(0, 3).map((item, idx) => (
                                                    <div key={item.id} className="portfolio-tile">
                                                        <img src={item.image_url || '/placeholder.jpg'} alt={item.title || 'Portfolio photo'} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                                                        <div className="pics-infos" style={{ backgroundColor: idx % 2 === 0 ? '#99816b' : '#4c4036' }}>
                                                            <span className="portfolio-tile-label">{item.title || 'Untitled'}</span>
                                                            <span className='d-flex flex-column'>
                                                                <span><i className="fas fa-heart me-1"></i>{item.likes_count || 0}</span>
                                                                <span><i className="fas fa-comment me-1"></i>{item.comments_count || 0}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="row g-4 mt-1">
                                        <div className="col-md-6">
                                            <div className="card bg-white border-0 rounded shadow-sm p-4" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                                <h5 className="head mb-3">Recent Comments</h5>
                                                {recentComments.length === 0 && <p className="text-muted small mb-0">No comments yet.</p>}
                                                {recentComments.map((c) => (
                                                    <div key={c.id || c.comment_id} className="d-flex justify-content-between align-items-start mb-2 pb-2 border-bottom">
                                                        <div style={{ minWidth: '0' }}>
                                                            <strong className="small d-block">{(typeof c.user === 'object' ? c.user?.username : c.user) || 'Unknown'}</strong>
                                                            <span className="small text-muted">{c.comment}</span>
                                                        </div>
                                                        <small className="text-muted ms-2 flex-shrink-0">{timeAgo(c.created_at)}</small>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card bg-white border-0 rounded shadow-sm p-4" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                                <h5 className="head mb-3">Recent Likes</h5>
                                                {recentLikes.length === 0 && <p className="text-muted small mb-0">No likes yet.</p>}
                                                <div className="d-flex flex-wrap gap-3">
                                                    {recentLikes.map((l) => (
                                                        <div key={l.id} className="d-flex flex-column align-items-center" style={{ width: '64px' }}>
                                                            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '48px', height: '48px' }}>
                                                                <i className="fas fa-heart" style={{ color: '#cc445e' }}></i>
                                                            </div>
                                                            <small className="text-truncate" style={{ maxWidth: '64px' }}>{l.record_type}</small>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="row g-4 mt-1">
                                        <div className="col-md-6">
                                            <div className="card bg-white border-0 rounded shadow-sm p-4">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5 className="head m-0">My Interests</h5>
                                                    <button className="btn" id="e-view" onClick={() => navigate('/learn')}>Manage</button>
                                                </div>
                                                {interests.length === 0 && <p className="text-muted small mb-0">No topics of interest added yet.</p>}
                                                <div className="row">
                                                    {interests.map((topic) => (
                                                        <div key={topic.id} className="col-6 d-flex align-items-center gap-2 mb-2">
                                                            <img src={topic.image_url || c1} alt={topic.interest} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: '0' }} onError={(e) => { e.target.src = c1; }} />
                                                            <span className="small text-truncate">{topic.interest}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card bg-white border-0 rounded shadow-sm p-4">
                                                <h5 className="head mb-3">My Brands</h5>
                                                {brands.length === 0 && <p className="text-muted small mb-0">No brands added yet.</p>}
                                                <div className="d-flex flex-wrap gap-3">
                                                    {brands.map((b) => (
                                                        <span key={b.id} className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded border">
                                                            <img src={b.image_url || c1} alt={b.brands} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.src = c1; }} />
                                                            {b.brands}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white mt-4 border-0 rounded shadow-sm p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="head m-0">My Gallery</h4>
                                            <button className="btn" id="e-view" onClick={() => navigate('/my-gallery')}>View All</button>
                                        </div>
                                        <div className="portfolio-tiles-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                            {galleryTiles.length === 0 && <p className="text-muted small">No galleries yet.</p>}
                                            {galleryTiles.map((p, idx) => (
                                                <div className="portfolio-tile" key={p.id} style={{ aspectRatio: '370/362' }}>
                                                    <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/my-gallery/${p.id}`)}>
                                                        <img src={p.image} alt={p.category} style={{ width: '100%', height: '362px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                                                        <div className="pics-infos" style={{ backgroundColor: idx % 2 === 0 ? '#99816b' : '#4c4036' }}>
                                                            <span className="portfolio-tile-label">{p.category}</span>
                                                            <span className='d-flex flex-column'>
                                                                <span><i className="fas fa-heart me-1"></i>{p.likes}</span>
                                                                <span><i className="fas fa-comment me-1"></i>{p.comments}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="row mt-4 g-4">
                                        <div className="col-md-6">
                                            <div className="bg-white rounded shadow-sm p-4 sales-panel">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h4 className="head m-0">My Sales</h4>
                                                    <div className="d-flex gap-2">
                                                        <button type="button" className="btn-sales-add" onClick={() => setShowAddListing((v) => !v)}>
                                                            {showAddListing ? 'Cancel' : '+ New Listing'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {showAddListing && (
                                                    <form className="add-listing-form mb-3" onSubmit={handleCreateListing}>
                                                        <select className="form-select form-select-sm mb-2" value={newListing.photo_id} onChange={(e) => setNewListing((v) => ({ ...v, photo_id: e.target.value }))} >
                                                            <option value="">Choose a photo to sell...</option>
                                                            {portfolioPhotos.map((p) => (
                                                                <option key={p.id} value={p.id}>{p.title || `Photo #${p.id}`}</option>
                                                            ))}
                                                        </select>
                                                        <input className="form-control form-control-sm mb-2" placeholder="Listing title" value={newListing.title} onChange={(e) => setNewListing((v) => ({ ...v, title: e.target.value }))} />
                                                        <textarea className="form-control form-control-sm mb-2" placeholder="Description" rows={2} value={newListing.description} onChange={(e) => setNewListing((v) => ({ ...v, description: e.target.value }))} />
                                                        <input className="form-control form-control-sm mb-2" type="number" min="0" step="0.01" placeholder="Price (£)" value={newListing.price} onChange={(e) => setNewListing((v) => ({ ...v, price: e.target.value }))} />
                                                        {addListingError && <p className="text-danger small mb-2">{addListingError}</p>}
                                                        <button type="submit" className="btn-sales-add" disabled={addListingSaving}>
                                                            {addListingSaving ? 'Saving...' : 'Create Listing'}
                                                        </button>
                                                    </form>
                                                )}

                                                <div className="sales-list">
                                                    {salesLoading && <p className="text-muted small">Loading your listings...</p>}
                                                    {!salesLoading && sales.length === 0 && <p className="text-muted small">You haven't listed any photos for sale yet.</p>}
                                                    {sales.map((sale) => (
                                                        <div className="sale-card" style={{ width: '646px', height: '223px', display: 'flex' }} key={sale.id}>
                                                            <img src={sale.image || '/placeholder.jpg'} alt={sale.title} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} style={{ width: '267px', maxWidth: '267px', height: '223px' }} />
                                                            <div className="sale-card-body">
                                                                <h6 className="mb-1">{sale.title}</h6>
                                                                <span className="sale-price">£ {Number(sale.price).toFixed(0)}</span>
                                                                {sale.description && <p className="sale-desc">{sale.description}</p>}
                                                                <button type="button" className="btn" id="aview" onClick={() => navigate(`/my-sales/${sale.id}`)}>View Details</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button type="button" className="btn mt-4" id="e-view" onClick={() => navigate('/my-sales')}>View All</button>

                                            </div>
                                        </div>

                                        <div className="col-md-6 d-flex flex-column gap-4">
                                            <div className="bg-white rounded shadow-sm p-4 requests-panel">
                                                <h4 className="head mt-5 mb-5">Photo Requests</h4>
                                                {requestsLoading && <p className="text-muted small">Loading requests...</p>}
                                                {!requestsLoading && saleRequests.length === 0 && <p className="text-muted small">No one has requested your photos yet.</p>}
                                                {saleRequests.map((req) => (
                                                    <div className="request-row" key={req.id}>
                                                        <img src={req.requester?.avatar || '/placeholder.jpg'} alt={req.requester?.name} onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                                                        <div className="request-body">
                                                            <div className="role">{req.requester?.name}</div>
                                                            <div className="request-sub">{req.sale?.title} &middot; £ {req.sale?.price != null ? Number(req.sale.price).toFixed(0) : '-'}</div>
                                                        </div>
                                                        {req.status === 'pending' ? (
                                                            <div className="d-flex gap-2">
                                                                <button type="button" id="e-view" className='btn' disabled={requestActionId === req.id} onClick={() => handleRespondToRequest(req.id, 'accept')}>Accept</button>
                                                                <button type="button" className="btn-reject" disabled={requestActionId === req.id} onClick={() => handleRespondToRequest(req.id, 'reject')}>Reject</button>
                                                            </div>
                                                        ) : (
                                                            <span className={`request-status request-status--${req.status}`}>{req.status}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bg-white rounded shadow-sm p-4 qr-panel text-center">
                                                <h4 className="head text-start mb-3">My QR Code</h4>
                                                <img src={qrCode} alt="QR CODE" className="qr-panel-img mb-2" />
                                                <p className="text-secondary mb-0 small">{user.username ? `${user.username}.photo.cv` : ''}</p>
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
                )
                }
            </div>
        </>
    );
};
export default PhotographerPortfolio;
