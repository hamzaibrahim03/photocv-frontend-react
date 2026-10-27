import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
import Calendar from '../Ryton/extra/CalendarRyton';
import Mess from "../club_admin/assets/icons/event_list/mess.svg"
import Cam from "../club_admin/assets/icons/event_list/cam.svg"
import Pro from "../club_admin/assets/icons/event_list/pro.svg"
import Cal from "../club_admin/assets/icons/event_list/cal.svg"
import Share from "../club_admin/assets/icons/event_list/share.svg"
import Book from "../club_admin/assets/icons/event_list/bookmark.svg"

function PostNotice() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ first_name: 'Photographer', profile_image_url: '/placeholder.jpg' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });
    const [notices, setNotices] = useState([]);
    const [extras, setExtras] = useState({ recent_comments: [], random_notices: [] });
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;
    const [isLoading, setIsLoading] = useState(true);
    const [savedLibrary, setSavedLibrary] = useState([]);

    useEffect(() => {
        const loadAll = async () => {
            setIsLoading(true);
            try {
                const [noticesRes, extrasRes, profileRes, savedRes] = await Promise.all([
                    apiClient.get('/photographer/notices'),
                    apiClient.get('/photographer/notice-extras'),
                    apiClient.get('/member-admin/profile/portfolio'),
                    apiClient.get('/saved-library-items', { params: { category: 'Notices' } }).catch(() => null),
                ]);
                setNotices(Array.isArray(noticesRes.data?.data) ? noticesRes.data.data : []);
                setExtras(extrasRes.data?.data || { recent_comments: [], random_notices: [] });
                const memberInfo = profileRes.data?.member_info?.original?.data;
                const galleryData = profileRes.data?.gallery?.original?.data;
                if (memberInfo) setUser(memberInfo);
                setTotals({
                    totalPhotos: galleryData?.total_photos ?? 0,
                    totalLikes: galleryData?.total_likes ?? 0,
                    totalComments: galleryData?.total_comments ?? 0,
                });
                if (savedRes) {
                    const data = savedRes.data?.data || savedRes.data;
                    setSavedLibrary(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Error loading notices:', error);
                setNotices([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadAll();
    }, []);

    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
    const formatTime = (datetimeStr) => datetimeStr ? new Date(datetimeStr).toLocaleTimeString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : '';

    const filteredNotices = useMemo(() => {
        return notices.filter((notice) =>
            (notice.title || '').toLowerCase().includes(search.toLowerCase()) ||
            (notice.description || '').toLowerCase().includes(search.toLowerCase())
        );
    }, [notices, search]);
    const totalPages = Math.max(Math.ceil(filteredNotices.length / rowsPerPage), 1);
    const paginatedNotices = filteredNotices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };

    const isBookmarked = (id) => savedLibrary.some(item => item.item_id === id && item.category === 'Notices');
    const toggleBookmark = async (notice) => {
        try {
            const response = await apiClient.post('/saved-library-items', {
                category: 'Notices',
                item_id: notice.id,
                title: notice.title || 'Untitled Notice',
                description: notice.description || '',
                date: notice.created_at || '',
                image: notice.featured_image_url || '',
            });
            const saved = response.data?.data?.saved;
            if (saved) {
                const savedItem = response.data?.data?.item;
                setSavedLibrary(prev => [...prev, savedItem || { item_id: notice.id, category: 'Notices' }]);
                navigate('/photo-library');
            } else {
                setSavedLibrary(prev => prev.filter(s => !(s.item_id === notice.id && s.category === 'Notices')));
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };
    const handleShare = async (notice) => {
        const shareUrl = `${window.location.origin}/notice/${notice.id}`;
        const shareData = {
            title: notice.title || 'Notice',
            text: notice.description ? notice.description.replace(/<[^>]*>/g, '').slice(0, 150) : 'Check out this notice',
            url: shareUrl,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert('Notice link copied to clipboard!');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert('Notice link copied to clipboard!');
                } catch (clipboardError) {
                    console.error('Clipboard failed:', clipboardError);
                }
            }
        }
    };

    const recentCommentEntries = (extras.recent_comments || [])
        .flatMap((notice) => (notice.comments || []).map((comment) => ({ ...comment, noticeTitle: notice.title })))
        .slice(0, 4);

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Notices" />
                        <div className="content">
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <img className="img-fluid rounded-circle" style={{ width: '64px', height: '64px', objectFit: 'cover' }} src={user.profile_image_url || '/placeholder.jpg'} alt="Profile" onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
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
                                    <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                                        <h5 className='head'>My Notices</h5>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="row">
                                        <div className="col-md-8" style={{ padding: '0px' }}>
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }}>
                                                    <div className="mt-4">
                                                        {paginatedNotices.length ? (
                                                            <>
                                                                {paginatedNotices.map((notice) => (
                                                                    <div key={notice.id} className="custom-card mb-3 p-3">
                                                                        <div className="d-flex gap-3" style={{ flex: '1' }}>
                                                                            <img src={notice.featured_image_url || '/placeholder.jpg'} alt="Notice" onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                                            <div className="flex-grow-1 d-flex flex-column justify-content-between" style={{ minWidth: '0' }}>
                                                                                <div className="d-flex justify-content-between align-items-center">
                                                                                    <h5>{notice.title || 'Untitled Notice'}</h5>
                                                                                    <div className="e-icon-container ms-3 d-flex gap-2">
                                                                                        <img src={Mess} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                        <img src={Cam} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                        <img src={Pro} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                        <img src={Cal} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                    </div>
                                                                                </div>
                                                                                <p className="names" style={{ fontSize: '14px', color: 'black' }}>{user.first_name}  {user.last_name}</p>
                                                                                <p className="date" style={{ color: 'black' }}>{formatDate(notice.created_at)}</p>
                                                                                <p className="text-secondary" dangerouslySetInnerHTML={{ __html: notice.description || 'No description provided.' }}>
                                                                                </p>
                                                                                <div className="d-flex justify-content-between align-items-center mt-3 w-100">
                                                                                    <div className="button-group d-flex align-items-center gap-2">
                                                                                        <button className="btn me-2" id="e-view" onClick={() => navigate(`/notice/${notice.id}`)}>View</button>
                                                                                        <button className="btn me-2" id="e-edit" onClick={() => navigate(`/notice/${notice.id}/edit`)}>Edit</button>
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center gap-2">
                                                                                        <img src={Book} alt="bookmark" style={{ width: '20px', height: '20px', cursor: 'pointer' }} className={isBookmarked(notice.id) ? 'bookmark-icon active' : 'bookmark-icon'} onClick={() => toggleBookmark(notice)} />
                                                                                        <img src={Share} alt="Share" style={{ width: '20px', height: '20px', cursor: 'pointer' }} onClick={() => handleShare(notice)} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-muted">No notices found.</div>
                                                        )}
                                                        {totalPages > 1 && (
                                                            <div className="dt-paging">
                                                                <nav aria-label="pagination">
                                                                    <button className={`dt-paging-button previous ${currentPage === 1 ? 'disabled' : ''}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label="Previous">
                                                                        &lsaquo;
                                                                    </button>
                                                                    {Array.from({ length: totalPages }, (_, index) => {
                                                                        const page = index + 1;
                                                                        return (
                                                                            <button key={page} className={`dt-paging-button ${page === currentPage ? 'current' : ''}`} onClick={() => goToPage(page)}>
                                                                                {page}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                    <button className={`dt-paging-button next ${currentPage === totalPages ? 'disabled' : ''}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Next">
                                                                        &rsaquo;
                                                                    </button>
                                                                </nav>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                    <div id="news">
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">Recent Comments on Notices</h5>
                                                            {recentCommentEntries.length === 0 && <span className="text-muted small">No comments yet.</span>}
                                                            {recentCommentEntries.map((comment) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }} key={comment.id}>
                                                                    <div className="event-item">
                                                                        {comment.user?.profile_image_url ? (
                                                                            <img className="img-fluid event-img" src={comment.user.profile_image_url} alt="User" onError={(e) => { e.target.style.display = 'none'; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span className="text-secondary fw-bold small">{comment.noticeTitle}</span>
                                                                                <span className="text-secondary">{comment?.comment}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="event-time" id="edate">
                                                                            <small className="event-date galtext">{formatDate(comment?.created_at)}</small><br />
                                                                            <small className="event-time-details galtext">{formatTime(comment?.created_at)}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">More Notices</h5>
                                                            {(extras.random_notices || []).length === 0 && <span className="text-muted small">No other notices.</span>}
                                                            {(extras.random_notices || []).slice(0, 6).map((notice) => (
                                                                <div className="event-list" style={{ marginBottom: '10px', cursor: 'pointer' }} key={notice.id} onClick={() => navigate(`/notice/${notice.id}`)}>
                                                                    <div className="event-item">
                                                                        {notice.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={notice.featured_image_url} alt="Notice" onError={(e) => { e.target.style.display = 'none'; }} />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                <i className="fa-regular fa-bell" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span className="text-secondary">{notice?.title}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="event-time" id="edate">
                                                                            <small className="event-date galtext">{formatDate(notice?.created_at)}</small><br />
                                                                            <small className="event-time-details galtext">{formatTime(notice?.created_at)}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="button-group mt-auto">
                                                                <button className="btn" id="e-view" onClick={() => setSearch('')}>
                                                                    View All
                                                                </button>
                                                                <button className="btn" id="new" onClick={() => navigate('/notice/add')}>
                                                                    Add New
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
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
export default PostNotice;
