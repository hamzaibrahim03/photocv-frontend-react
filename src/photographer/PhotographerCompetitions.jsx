import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
import Calendar from '../Ryton/extra/CalendarRyton';
import Flo from "../club_admin/assets/icons/quick_comp/flower.svg"
import Ima from "../club_admin/assets/icons/quick_comp/image.svg"
import Fax from "../club_admin/assets/icons/quick_comp/fax.svg"
import Pri from "../club_admin/assets/icons/quick_comp/print.svg"
import Pai from "../club_admin/assets/icons/quick_comp/paint.svg"
import Prof from "../club_admin/assets/icons/quick_comp/profile.svg"
import Pro from "../club_admin/assets/icons/event_list/pro.svg"
import Cal from "../club_admin/assets/icons/event_list/cal.svg"
import Cam from "../club_admin/assets/icons/event_list/cam.svg"
import Mess from "../club_admin/assets/icons/event_list/mess.svg"
import Share from "../club_admin/assets/icons/event_list/share.svg"
import Book from "../club_admin/assets/icons/event_list/bookmark.svg"

function PhotographerCompetitions() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('browse');
    const [competitions, setCompetitions] = useState([]);
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [recentCompetitions, setRecentCompetitions] = useState([]);
    const [daysToGo, setDaysToGo] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;
    const [isLoading, setIsLoading] = useState(true);
    const [myEntries, setMyEntries] = useState([]);
    const [myEntriesLoading, setMyEntriesLoading] = useState(false);
    const [savedLibrary, setSavedLibrary] = useState([]);
    useEffect(() => {
        async function loadSavedLibrary() {
            try {
                const response = await apiClient.get('/saved-library-items', { params: { category: 'Competitions' } });
                const data = response.data?.data || response.data;
                setSavedLibrary(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error loading saved library:', error);
            }
        }
        loadSavedLibrary();
    }, []);
    const toggleBookmark = async (item, category) => {
        try {
            const response = await apiClient.post('/saved-library-items', {
                category: category,
                item_id: item.id,
                title: item.name || item.title || item.event_name || item.competition_name || "Untitled",
                description: item.description || "",
                date: item.event_date || item.competition_date || item.published_at || item.created_at || "",
                image: item.featured_image_url || item.image || item.image_url || item.thumbnail_url || "",
            });
            const saved = response.data?.data?.saved;
            if (saved) {
                const savedItem = response.data?.data?.item;
                setSavedLibrary(prev => [...prev, savedItem || { item_id: item.id, category }]);
                navigate("/photo-library");
            } else {
                setSavedLibrary(prev => prev.filter(saved => !(saved.item_id === item.id && saved.category === category)));
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };
    const isBookmarked = (id, category) => {
        return savedLibrary.some(item =>
            item.item_id === id &&
            item.category === category
        );
    };
    const handleShare = async (competition) => {
        const shareUrl = `${window.location.origin}/my-competitions/${competition.id}`;
        const shareData = {
            title: competition.name || "Competition",
            text: competition.description ? competition.description.replace(/<[^>]*>/g, "").slice(0, 150) : "Check out this competition",
            url: shareUrl,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert("Competition link copied to clipboard!");
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Share failed:", error);
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert("Competition link copied to clipboard!");
                } catch (clipboardError) {
                    console.error("Clipboard failed:", clipboardError);
                }
            }
        }
    };

    const applyResponse = (payload) => {
        const original = payload?.original || {};
        setCompetitions(Array.isArray(original.dataTable?.data) ? original.dataTable.data : []);
        setRecentSubmissions(Array.isArray(original.recentSubmissions) ? original.recentSubmissions : []);
        setRecentCompetitions(Array.isArray(original.recentCompetitions) ? original.recentCompetitions : []);
        setDaysToGo(original.daysUntilNextCompetition ?? null);
    };
    const formatTime = (datetimeStr) => {
        const date = new Date(datetimeStr);
        return date.toLocaleTimeString("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const fetchCompetitions = async () => {
        try {
            const res = await apiClient.get('/member-admin/competitions');
            applyResponse(res.data?.data);
        } catch (e) {
            console.error('Error loading competitions:', e);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchCompetitions();
    }, []);
    const fetchSearchedCompetitions = useCallback(async (query) => {
        try {
            const response = await apiClient.get('/member-admin/competitions', { params: { search_term: query } });
            applyResponse(response.data?.data);
        } catch (error) {
            console.error(error);
            setCompetitions([]);
        }
        setCurrentPage(1);
    }, []);
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.length >= 3) {
                fetchSearchedCompetitions(search);
            } else if (search.length === 0) {
                fetchCompetitions();
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, fetchSearchedCompetitions]);
    const [quickFilterCategory, setQuickFilterCategory] = useState(null);
    const applyFilters = useCallback((list) => {
        let filtered = list;
        if (search.trim()) {
            filtered = filtered.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));
        }
        if (quickFilterCategory === 'print') filtered = filtered.filter(c => c.print_vs_digital === 'print');
        if (quickFilterCategory === 'digital') filtered = filtered.filter(c => c.print_vs_digital === 'digital');
        if (quickFilterCategory === 'mono') filtered = filtered.filter(c => c.color_vs_mono?.toLowerCase().includes('mono'));
        if (quickFilterCategory === 'colour') filtered = filtered.filter(c => c.color_vs_mono?.toLowerCase().includes('colour') || c.color_vs_mono?.toLowerCase().includes('color'));
        if (quickFilterCategory === 'nature') filtered = filtered.filter(c => c.competition_category?.name?.toLowerCase().includes('nature'));
        if (quickFilterCategory === 'portrait') filtered = filtered.filter(c => c.competition_category?.name?.toLowerCase().includes('portrait'));
        return filtered;
    }, [search, quickFilterCategory]);
    const filteredCompetitions = useMemo(() => {
        const filtered = applyFilters(competitions);
        const start = (currentPage - 1) * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [competitions, applyFilters, currentPage]);
    const totalPages = useMemo(() => {
        const count = applyFilters(competitions).length;
        return Math.max(Math.ceil(count / rowsPerPage), 1);
    }, [competitions, applyFilters]);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };
    const quickFilters = [
        { key: 'print', icon: Pri, label: 'Print' },
        { key: 'digital', icon: Fax, label: 'Digital/PDI' },
        { key: 'mono', icon: Pai, label: 'Monochrome' },
        { key: 'nature', icon: Flo, label: 'Nature' },
        { key: 'portrait', icon: Prof, label: 'Portrait' },
        { key: 'colour', icon: Ima, label: 'Colour' },
    ];
    const toggleQuickFilter = (key) => {
        setQuickFilterCategory((prev) => (prev === key ? null : key));
        setCurrentPage(1);
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return isNaN(d) ? '' : d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    };
    const formatShortDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return isNaN(d) ? '—' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };
    const fetchMyEntries = useCallback(async () => {
        setMyEntriesLoading(true);
        try {
            const response = await apiClient.get('/get-joined-competition');
            const list = response.data?.data;
            setMyEntries(Array.isArray(list) ? list : []);
        } catch (error) {
            console.error('Error loading joined competitions:', error);
            setMyEntries([]);
        } finally {
            setMyEntriesLoading(false);
        }
    }, []);
    useEffect(() => {
        if (activeTab === 'entries') {
            fetchMyEntries();
        }
    }, [activeTab, fetchMyEntries]);
    const statusPillStyle = (status) => {
        const base = {
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
        };
        if (status === 'completed') return { ...base, backgroundColor: '#e9ecef', color: '#495057' };
        if (status === 'judging') return { ...base, backgroundColor: '#fff', color: '#495057', border: '1px solid #ced4da' };
        return { ...base, backgroundColor: '#755840', color: '#fff' };
    };
    const statusLabel = (status) => {
        if (status === 'completed') return 'Completed';
        if (status === 'judging') return 'Judging';
        return 'Open';
    };
    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Competitions" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card" id="cl">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting">Planned and regular club competition</small>
                                                <h2 className="name">2024 - 2025 Season</h2>
                                            </div>
                                        </div>
                                        <div className="search-bar d-flex justify-content-between">
                                            <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <i className="fas fa-search"></i>
                                        </div>
                                        <div className="e-quick-filter text-end">
                                            <strong>Quick Filter</strong>
                                            <small className="d-block">(Click icons to filter)</small>
                                            <div className="d-flex gap-2 justify-content-end">
                                                {quickFilters.slice(0, 3).map((f) => (
                                                    <img key={f.key} src={f.icon} alt={f.label} title={f.label} role="button" onClick={() => toggleQuickFilter(f.key)} style={{ width: '20px', height: '20px', cursor: 'pointer', opacity: quickFilterCategory && quickFilterCategory !== f.key ? 0.4 : 1, outline: quickFilterCategory === f.key ? '2px solid #cc445e' : 'none', borderRadius: '4px' }} />
                                                ))}
                                            </div>
                                            <div className="d-flex gap-2 justify-content-end mt-2">
                                                {quickFilters.slice(3, 6).map((f) => (
                                                    <img key={f.key} src={f.icon} alt={f.label} title={f.label} role="button" onClick={() => toggleQuickFilter(f.key)} style={{ width: '20px', height: '20px', cursor: 'pointer', opacity: quickFilterCategory && quickFilterCategory !== f.key ? 0.4 : 1, outline: quickFilterCategory === f.key ? '2px solid #cc445e' : 'none', borderRadius: '4px' }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="event-cards" style={{ width: '100%' }}>
                                            <small className="ca-details">Next Competition</small>
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <h3 className="number">{daysToGo != null ? Math.ceil(daysToGo) : '--'}</h3>
                                                </div>
                                                <div className="days col-md-7">
                                                    <span>days to go</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                <div className="d-flex gap-2 mb-3">
                                    <button className="btn" style={activeTab === 'browse' ? { backgroundColor: '#3a2e26', color: '#fff' } : { border: '1px solid #99816b', color: '#99816b' }} onClick={() => setActiveTab('browse')} >
                                        Browse Competitions
                                    </button>
                                    <button className="btn" style={activeTab === 'entries' ? { backgroundColor: '#3a2e26', color: '#fff' } : { border: '1px solid #99816b', color: '#99816b' }} onClick={() => setActiveTab('entries')} >
                                        My Competition Entries
                                    </button>
                                </div>
                            </div>
                        </section>

                        {activeTab === 'entries' && (
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-4">
                                        <h5 className="head mb-4">My Competition Entries</h5>
                                        {myEntriesLoading && <p className="text-muted small">Loading your competitions...</p>}
                                        {!myEntriesLoading && myEntries.length === 0 && <p className="text-muted small">You haven't joined any competitions yet.</p>}
                                        {!myEntriesLoading && myEntries.length > 0 && (
                                            <div className="table-responsive">
                                                <table className="table align-middle">
                                                    <thead>
                                                        <tr className="text-muted small">
                                                            <th>Competition</th>
                                                            <th>Open</th>
                                                            <th>Close</th>
                                                            <th>Judging Opens</th>
                                                            <th>Judging Closes</th>
                                                            <th>Entries</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {myEntries.map((c) => (
                                                            <tr key={c.competition_member_id}>
                                                                <td>{c.name}</td>
                                                                <td>{formatShortDate(c.start_date)}</td>
                                                                <td>{formatShortDate(c.submission_deadline)}</td>
                                                                <td>{formatShortDate(c.judging_start_date)}</td>
                                                                <td>{formatShortDate(c.judging_end_date)}</td>
                                                                <td>
                                                                    {c.entries_count}{c.max_entries ? `/${c.max_entries}` : ''}
                                                                    {c.max_entries && c.entries_count >= c.max_entries && (
                                                                        <span className="d-inline-block px-2 py-1 rounded ms-2" style={{ fontSize: '12px', backgroundColor: '#e7f6ea', color: '#2f9e44' }}>Ready</span>
                                                                    )}
                                                                </td>
                                                                <td><span style={statusPillStyle(c.status)}>{statusLabel(c.status)}</span></td>
                                                                <td>
                                                                    <div className="d-flex gap-2">
                                                                        <button className="btn btn-outline-secondary" onClick={() => navigate(`/my-competitions/${c.comp_id}/entries`)}>
                                                                            <i className="fa-regular fa-eye me-1"></i>View Entries
                                                                        </button>
                                                                        {c.status === 'open' && (!c.max_entries || c.entries_count < c.max_entries) && (
                                                                            <button className="btn text-white" style={{ backgroundColor: '#cc445e' }} onClick={() => navigate(`/my-competitions/${c.comp_id}`)}>
                                                                                <i className="fa-regular fa-paper-plane me-1"></i>Submit
                                                                            </button>
                                                                        )}
                                                                        {c.status === 'completed' && (
                                                                            <button className="btn text-white" style={{ backgroundColor: '#cc445e' }} onClick={() => navigate(`/my-competitions/${c.comp_id}/entries`)}>
                                                                                <i className="fa-solid fa-trophy me-1"></i>Results
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'browse' && (
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="row mt-4">
                                        <div className="col-md-8">
                                            <div className="container px-0">
                                                {filteredCompetitions.length > 0 ? (
                                                    <div>
                                                        {filteredCompetitions.map(competition => (
                                                            <div key={competition.id} className="custom-card mb-3 p-3">
                                                                <div className="d-flex gap-3" style={{ flex: '1' }}>
                                                                    <img src={competition.featured_image_url || competition.featured_image || '/placeholder.jpg'} alt="Competition" onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                                    <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <h5>{competition.name || 'Untitled Competition'}</h5>
                                                                            <div className="e-icon-container ms-3">
                                                                                <img src={Mess} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                <img src={Cam} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                <img src={Pro} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                <img src={Cal} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                            </div>
                                                                        </div>
                                                                        <p style={{ margin: '5px 0', fontSize: '14px', columns: '2', color: 'black' }}>
                                                                            <strong style={{ color: 'red' }}>Open:&nbsp;</strong>{formatDate(competition.start_date)}
                                                                            <br />
                                                                            <strong style={{ color: 'brown' }}>Result:&nbsp;</strong> {formatDate(competition.result_announcement_date)}
                                                                            <br />
                                                                            <strong style={{ color: 'brown' }}>Theme:&nbsp;</strong>{competition.theme_id}<br />
                                                                            <strong style={{ color: 'red' }}>Close:&nbsp;</strong>{formatDate(competition.submission_deadline)}
                                                                            <br />
                                                                            <strong style={{ color: 'brown' }}>Max:&nbsp;</strong>{competition.max_entries_print}
                                                                            <br />
                                                                            <strong style={{ color: 'brown' }}>Format:&nbsp;</strong> {competition.allowed_image_formats}
                                                                        </p>
                                                                        <p className="text-secondary" dangerouslySetInnerHTML={{ __html: competition.description || 'No description provided.' }}></p>
                                                                        <div className="d-flex justify-content-between align-items-center mt-3 w-100">
                                                                            <div className="button-group d-flex align-items-center gap-2">
                                                                                <button className="btn me-2" id="e-view" onClick={() => navigate(`/my-competitions/${competition.id}`)}>View</button>
                                                                                <button className="btn" id="e-edit" onClick={() => navigate(`/my-competitions/${competition.id}`)}>Enter</button>
                                                                            </div>
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                <div className="library-bookmark">
                                                                                    <img src={Book} alt="bookmark" style={{ width: '20px', height: '20px', cursor: 'pointer' }} className={isBookmarked(competition.id, "Competitions") ? "bookmark-icon active" : "bookmark-icon"} onClick={() => toggleBookmark(competition, "Competitions")} />
                                                                                </div>
                                                                                <img src={Share} alt="Share" style={{ width: '20px', height: '20px', cursor: 'pointer' }} onClick={() => handleShare(competition)} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="dt-paging">
                                                            <nav aria-label="pagination">
                                                                <button className={`dt-paging-button previous ${currentPage === 1 ? "disabled" : ""}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label="Previous">
                                                                    ‹
                                                                </button>
                                                                {Array.from({ length: totalPages }, (_, index) => {
                                                                    const page = index + 1;
                                                                    return (
                                                                        <button key={page} className={`dt-paging-button ${page === currentPage ? "current" : ""}`} onClick={() => goToPage(page)}>
                                                                            {page}
                                                                        </button>
                                                                    );
                                                                })}
                                                                <button className={`dt-paging-button next ${currentPage === totalPages ? "disabled" : ""}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Next">
                                                                    ›
                                                                </button>
                                                            </nav>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-5 text-muted bg-white rounded shadow-sm">No competitions found.</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                    <div className="calendar-card d-flex flex-column" style={{ width: '100%' }}>
                                                        <Calendar />
                                                    </div>
                                                    <div id="news">
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }}>
                                                            <h5 className="head mb-5">Recent Submissions</h5>
                                                            {recentSubmissions.length === 0 && <p className="text-muted small">No recent submissions.</p>}
                                                            {recentSubmissions.map((s, i) => (
                                                                <React.Fragment key={i}>
                                                                    <div className="event-list">
                                                                        <div className="event-item" style={{ marginBottom: '10px' }}>
                                                                            <img src={s.entry_image || '/placeholder.jpg'} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                                            <div className="event-details" style={{ display: 'flex' }}>
                                                                                <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                    <span id="ename">{s.member_username}</span>
                                                                                    <span id="espeaker"> {s.competition_name}</span>
                                                                                </div>
                                                                                <div className="event-time" id="edate">
                                                                                    <small className="event-date galtext">{formatDate(s.submitted_at)}</small><br />
                                                                                    <small className="event-time-details galtext">{formatTime(s.submitted_at)}</small>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }}>
                                                            <h5 className="head mb-5">More Competitions</h5>
                                                            {recentCompetitions.length === 0 && <p className="text-muted small">No other competitions.</p>}
                                                            {recentCompetitions.map((c) => (
                                                                <div key={c.id} className="event-list">
                                                                    <div className="event-item" style={{ marginBottom: '10px' }} onClick={() => navigate(`/my-competitions/${c.id}`)}>
                                                                        <img src={c.featured_image || '/placeholder.jpg'} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span id="ename">{c.title}</span>
                                                                            </div>
                                                                            <div className="event-time" id="edate">
                                                                                <small className="event-date galtext">{formatDate(c.start_date)}</small><br />
                                                                                <small className="event-time-details galtext">{formatTime(c.start_date)}</small>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className="button-group mt-auto">
                                                                <button className="btn" id="e-view" onClick={() => { setActiveTab('browse'); setSearch(''); window.scrollTo({ top: '0', behavior: 'smooth' }); }}>
                                                                    View All
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
                        )}
                        <footer className="site-footer">
                            <div className="footer-content">
                                <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal </p>
                                <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank">cameraclub.website</a></p>
                            </div>
                        </footer>
                    </div>
                </>
            )}
        </>
    );
};
export default PhotographerCompetitions;
