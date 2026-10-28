import { useNavigate } from "react-router";
import Calendar from "../Ryton/extra/CalendarRyton"
import HeaderRoute from "./HeaderRoute"
import NavigationRoute from "./NavigationRoute"
import { useEffect, useMemo, useState } from "react";
import Loader from "../Ryton/extra/LoaderAll";
import Pro from "./assets/icons/event_list/pro.svg"
import Cal from "./assets/icons/event_list/cal.svg"
import Cam from "./assets/icons/event_list/cam.svg"
import Mess from "./assets/icons/event_list/mess.svg"
import Share from "./assets/icons/event_list/share.svg"
import Books from "./assets/icons/event_list/bookmark.svg"

const CATALOG_API_BASE = "http://rytonlocal-staging.cameraclub.website:8000/api/v1";
function PagesRoute() {
    const navigate = useNavigate();
    const [pagesData, setPagesData] = useState({})
    const [pagesExtra, setPagesExtra] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [rowsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [pageTypes, setPageTypes] = useState([]);
    const [quickFilterType, setQuickFilterType] = useState(null);
    useEffect(() => {
        async function loadPageTypes() {
            try {
                const response = await fetch(`${CATALOG_API_BASE}/club/public/catalog/all-grouped`, {
                    headers: { Accept: 'application/json' },
                });
                const json = await response.json();
                setPageTypes(json?.data?.page_type || []);
            } catch (error) {
                console.error('Error loading page types:', error);
            }
        }
        loadPageTypes();
    }, []);
    const toggleQuickFilter = (id) => {
        setQuickFilterType((prev) => (prev === id ? null : id));
        setCurrentPage(1);
    };
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([getPagesData(), getPagesExtra()]);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);
    async function getPagesData() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/pages'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        setPagesData(data.data || {});
    };
    async function getPagesExtra() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/pages-extras'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        setPagesExtra(data.data || {});
    };
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    const formatTime = (datetimeStr) => {
        const date = new Date(datetimeStr);
        return date.toLocaleTimeString("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const filteredPages = useMemo(() => {
        let pages = pagesData.original?.data || [];
        if (quickFilterType) pages = pages.filter((p) => p.page_type?.id === quickFilterType);
        return pages.filter((p) =>
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.publish_date?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [pagesData, search, quickFilterType]);
    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(filteredPages.length / rowsPerPage),
            1
        );
    }, [filteredPages, rowsPerPage]);
    const paginatedPages = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredPages.slice(start, start + rowsPerPage);
    }, [filteredPages, currentPage, rowsPerPage]);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Pages" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">Live and Draft Club Website Pages</small>
                                                    <h2 className="name">Club Website Pages</h2>
                                                    <p className="role">{pagesExtra.total_live_pages} Live Pages</p>
                                                </div>
                                            </div>
                                            <div className="search-bar d-flex justify-content-space-between">
                                                <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                <i className="fas fa-search"></i>
                                            </div>
                                            <div className="e-quick-filter text-end">
                                                <strong>Quick Filter</strong>
                                                <small className="d-block">(Click icons to filter)</small>
                                                <div className="d-flex gap-2 justify-content-end flex-wrap" style={{ maxWidth: '140px', marginLeft: 'auto' }}>
                                                    {pageTypes.map((type) => (
                                                        <img key={type.id} src={type.icon_url} alt={type.name} title={type.name} role="button" onClick={() => toggleQuickFilter(type.id)} style={{ width: '20px', height: '20px', cursor: 'pointer', opacity: quickFilterType && quickFilterType !== type.id ? 0.4 : 1, outline: quickFilterType === type.id ? '2px solid #cc445e' : 'none', borderRadius: '4px' }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Drafts</small>
                                                <h3 className="number">{pagesExtra.total_drafted_pages}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Latest Change</small>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{pagesExtra.last_page_days_ago}</h3>
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
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <section>
                                                <div className="container">
                                                    <div className="mt-4">
                                                        {paginatedPages.length ? (
                                                            <>
                                                                {paginatedPages.map((page) => (
                                                                    <div key={page.id} className="custom-card mb-3 p-3">
                                                                        <div className="d-flex gap-3" style={{ flex: '1' }}>
                                                                            <img src={page.featured_image} alt="Page Image" />
                                                                            <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                                                                <div className="d-flex justify-content-between align-items-center">
                                                                                    <h5>{page.title || 'Untitled Page'}</h5>
                                                                                    <div className="e-icon-container ms-3">
                                                                                        <img src={Mess} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                        <img src={Cam} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                        <img src={Pro} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                        <img src={Cal} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                    </div>
                                                                                </div>
                                                                                <p className="date"> {formatDate(page.publish_date) || 'Date Not Available'}
                                                                                </p>
                                                                                <p className="text-secondary">
                                                                                    {page.description || 'No description provided.'}
                                                                                </p>
                                                                                <div className="button-group mt-3 d-flex">
                                                                                    <button className="btn me-2" id="e-view" onClick={() => navigate(`/pages/${page.id}`)}>View</button>
                                                                                    <button className="btn" id="e-edit" onClick={() => navigate(`/pages/${page.id}/edit`)}>Edit</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-muted">No pages found.</div>
                                                        )}
                                                    </div>
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
                                            </section>
                                        </div>
                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                    <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                        <h5 className="head">Recent Comments on Pages</h5>
                                                        {pagesData?.original?.data?.flatMap((page) => page.comments || [])?.slice(0, 4)?.map((comment) => (
                                                            <div className="event-list" style={{ marginBottom: '10px' }} key={comment.id}>
                                                                <div key={comment.id} className="event-item">
                                                                    {comment.user?.profile_image_url ? (
                                                                        <img className="img-fluid event-img" src={comment.user.profile_image_url} />
                                                                    ) : (
                                                                        <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                            <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                        </div>
                                                                    )}
                                                                    <div className="event-details">
                                                                        <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <span className="text-secondary">{comment.comment}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="event-time" id="edate">
                                                                        <small className="event-date galtext">{formatDate(comment.created_at)}</small><br />
                                                                        <small className="event-time-details galtext">{formatTime(comment.created_at)}</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                        <h5 className="head">More Pages</h5>
                                                        {(pagesExtra.random_pages || []).map((page) => (
                                                            <div className="event-list">
                                                                <div className="event-item" style={{ marginBottom: '10px' }} key={page.id}>
                                                                    {page.featured_image_url ? (
                                                                        <img className="img-fluid event-img" src={page.featured_image_url} />
                                                                    ) : (
                                                                        <div className="event-img fallback-box d-flex justify-content-center align-items-center"></div>
                                                                    )}
                                                                    <div className="event-details">
                                                                        <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <span className="text-secondary">{page.title}</span>
                                                                        </div>
                                                                        <div className="event-time" id="edate">
                                                                            <small className="event-date galtext">{formatDate(page.created_at)}</small><br />
                                                                            <small className="event-time-details galtext">{formatTime(page.created_at)}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="button-group mt-auto">
                                                            <button className="btn" id="e-view" onClick={() => navigate('/pages')}>
                                                                View All
                                                            </button>
                                                            <button className="btn" id="new" onClick={() => navigate('/pages/create')}>
                                                                Add New
                                                            </button>
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
                )
                }
            </div>
        </>
    );
}
export default PagesRoute;
