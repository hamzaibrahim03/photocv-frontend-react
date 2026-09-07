import { useNavigate } from "react-router";
import Calendar from "../React/extra/CalendarRyton"
import HeaderRoute from "./HeaderRoute"
import NavigationRoute from "./NavigationRoute"
import { useEffect, useMemo, useState } from "react";
import Loader from "../React/extra/LoaderAll";
import Pro from "./assets/icons/event_list/pro.svg"
import Cal from "./assets/icons/event_list/cal.svg"
import Cam from "./assets/icons/event_list/cam.svg"
import Mess from "./assets/icons/event_list/mess.svg"
import Book from "./assets/icons/quick_notice/book.svg"
import Cale from "./assets/icons/quick_notice/calender.svg"
import Com from "./assets/icons/quick_notice/com.svg"
import Cup from "./assets/icons/quick_notice/cup.svg"
import Hand from "./assets/icons/quick_notice/hand.svg"
import Share from "./assets/icons/event_list/share.svg"
import Books from "./assets/icons/event_list/bookmark.svg"
import Note from "./assets/icons/quick_notice/note.svg"
function PagesRoute() {
    const navigate = useNavigate();
    const [pagesData, setPagesData] = useState({})
    const [pagesExtra, setPagesExtra] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [rowsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    useEffect(() => {
        getPagesData();
        getPagesExtra();
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
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
        console.log(data);
        setPagesData(data.data);
    };
    console.log(pagesData.original?.data)
    async function getPagesExtra() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/pages-extras'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setPagesExtra(data.data);
    };
    console.log(pagesExtra)
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
        const pages = pagesData.original?.data || [];
        return pages.filter((pages) =>
            pages.name?.toLowerCase().includes(search.toLowerCase()) ||
            pages.event_date?.toLowerCase().includes(search.toLowerCase()) ||
            pages.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [pagesData, search]);
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
                                    <div className="dashboard-card">
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
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <img src={Com} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Cale} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Book} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                </div>
                                                <div className="d-flex gap-2 justify-content-end mt-2">
                                                    <img src={Cup} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Hand} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Note} alt="icon" style={{ width: '20px', height: '20px' }} />
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
                                                                        <div className="d-flex gap-3" style={{ flex: 1 }}>
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
                                                        {pagesExtra.random_pages.map((page) => (
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
                                                            <button className="btn btn-sm" id="e-view" onClick={() => navigate('/pages_single')}>
                                                                View All
                                                            </button>
                                                            <button className="btn btn-sm" id="new" onClick={() => navigate('/pages_add')}>
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
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal</p>
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
