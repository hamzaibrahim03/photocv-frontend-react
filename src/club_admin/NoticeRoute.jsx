import { useNavigate } from "react-router";
import Calendar from "../React/extra/CalendarRyton"
import HeaderRoute from "./HeaderRoute"
import NavigationRoute from "./NavigationRoute"
import { useEffect, useMemo, useState, useRef } from "react";
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

function NoticeRoute() {
    const navigate = useNavigate();
    const [noticeData, setNoticeData] = useState({})
    const [noticeExtra, setNoticeExtra] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [rowsPerPage] = useState(4);

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [bookmarkOpenId, setBookmarkOpenId] = useState(null);
    const [shareOpenId, setShareOpenId] = useState(null);
    const popupRef = useRef(null);
    const [savedLibrary, setSavedLibrary] = useState(() => {
        return JSON.parse(
            localStorage.getItem("savedLibrary") || "[]"
        );
    });
    useEffect(() => {
        function handleClickOutside(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setBookmarkOpenId(null);
                setShareOpenId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const toggleBookmark = (item, category) => {
        const existingLibrary = JSON.parse(
            localStorage.getItem("savedLibrary") || "[]"
        );

        const alreadySaved = existingLibrary.some(
            saved =>
                saved.id === item.id &&
                saved.category === category
        );

        let updatedLibrary;

        if (alreadySaved) {

            updatedLibrary = existingLibrary.filter(
                saved =>
                    !(
                        saved.id === item.id &&
                        saved.category === category
                    )
            );

        } else {

            const libraryItem = {
                id: item.id,
                category: category,

                title:
                    item.name ||
                    item.title ||
                    item.event_name ||
                    item.competition_name ||
                    "Untitled",

                description:
                    item.description || "",

                date:
                    item.event_date ||
                    item.competition_date ||
                    item.published_at ||
                    item.created_at ||
                    "",

                image:
                    item.featured_image_url ||
                    item.image ||
                    item.image_url ||
                    item.thumbnail_url ||
                    "",

                originalData: item,

                savedAt: new Date().toISOString()
            };

            updatedLibrary = [
                ...existingLibrary,
                libraryItem
            ];
        }

        localStorage.setItem(
            "savedLibrary",
            JSON.stringify(updatedLibrary)
        );

        setSavedLibrary(updatedLibrary);
        navigate("/library");
    };

    const isBookmarked = (id, category) => {
        return savedLibrary.some(
            item =>
                item.id === id &&
                item.category === category
        );
    };



    useEffect(() => {
        getNoticeData();
        getNoticeExtra();
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);


    async function getNoticeData() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/notices'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        const data = await response.json();

        console.log(data);

        setNoticeData(data.data);
    };
    console.log(noticeData.original?.data)

    async function getNoticeExtra() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/notices-extras'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        const data = await response.json();

        console.log(data);

        setNoticeExtra(data.data);
    };
    console.log(noticeExtra)




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

    const filteredNotices = useMemo(() => {
        const notices = noticeData.original?.data || [];

        return notices.filter((notice) =>
            notice.name?.toLowerCase().includes(search.toLowerCase()) ||
            notice.event_date?.toLowerCase().includes(search.toLowerCase()) ||
            notice.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [noticeData, search]);

    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(filteredNotices.length / rowsPerPage),
            1
        );
    }, [filteredNotices, rowsPerPage]);

    const paginatedNotices = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;

        return filteredNotices.slice(start, start + rowsPerPage);
    }, [filteredNotices, currentPage, rowsPerPage]);

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
                        <HeaderRoute title="Notices" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">All kinds of notices on the club website</small>
                                                    <h2 className="name">Club Notices</h2>
                                                    <p className="role">{noticeExtra.current_month_notice_count} Notices posted this month</p>
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
                                                <small className="ca-details">Notices</small>
                                                <h3 className="number"> {noticeExtra.total_notices}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Last Notice</small>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{noticeExtra.last_notice_days_ago}</h3>
                                                    </div>
                                                    <div className="days col-md-7">
                                                        <span>days ago</span>
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
                                        <div className="col-md-8" style={{ padding: '0px' }}>
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }}>
                                                    <div className="mt-4">
                                                        {paginatedNotices.length ? (
                                                            <>
                                                                {paginatedNotices.map((notice) => (
                                                                    <div key={notice.id} className="custom-card mb-3 p-3">
                                                                        <div className="d-flex gap-3" style={{ flex: 1 }}>
                                                                            <img src={notice.featured_image} alt="Notice Image" />
                                                                            <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                                                                <div className="d-flex justify-content-between align-items-center">
                                                                                    <h5>{notice.title || 'Untitled Notice'}</h5>
                                                                                    <div className="e-icon-container ms-3">
                                                                                        <img src={Mess} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                        <img src={Cam} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                        <img src={Pro} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                        <img src={Cal} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                    </div>
                                                                                </div>
                                                                                <p className="names" style={{ fontSize: '14px' }}>{notice.names}</p>
                                                                                <p className="date">{formatDate(notice.created_at)}</p>
                                                                                <p className="text-secondary" dangerouslySetInnerHTML={{ __html: notice.description || 'No description provided.' }}>
                                                                                </p>
                                                                                <div className="d-flex justify-content-between align-items-center mt-3 w-100">
                                                                                    <div className="button-group d-flex align-items-center gap-2">
                                                                                        <button className="btn me-2" id="e-view" onClick={() => navigate('/notice_single')}>View</button>
                                                                                        <button className="btn me-2" id="e-edit" onClick={() => navigate('/notice_edit')}>Edit</button>
                                                                                    </div>

                                                                                    <div className="d-flex align-items-center gap-2">
                                                                                        <div className="library-bookmark">
                                                                                            <img src={Books} alt="bookmark" style={{ width: '20px', height: '20px', cursor: 'pointer' }} className={isBookmarked(notice.id, "Notices") ? "bookmark-icon active" : "bookmark-icon"} onClick={() => toggleBookmark(notice, "Notices")} />
                                                                                        </div>
                                                                                        <div style={{ position: "relative", display: "inline-block" }}>

                                                                                            {bookmarkOpenId === notice.id && (
                                                                                                <div style={{ position: "absolute", bottom: "30px", right: "0", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 100, minWidth: "170px" }} >
                                                                                                    <p style={{ margin: "0 0 8px", fontWeight: "bold", fontSize: "13px", color: "#333" }} >
                                                                                                        Save to Library
                                                                                                    </p>

                                                                                                    {["Events", "Competitions", "Notices", "Galleries", "News"].map((cat) => (
                                                                                                        <div key={cat} style={{ padding: "7px 10px", cursor: "pointer", borderRadius: "4px", fontSize: "13px", color: "#555" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f0eb"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }} onClick={() => { saveToLibrary(event, cat); }}>
                                                                                                            📁 {cat}
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                        <img src={Share} alt="icon" style={{ width: '20px', height: '20px' }} />
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
                                                        <div className="dt-paging">
                                                            <nav aria-label="pagination">
                                                                <button className={`dt-paging-button previous ${currentPage === 1 ? "disabled" : ""}`} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} aria-label="Previous" >
                                                                    ‹
                                                                </button>

                                                                {Array.from({ length: totalPages }, (_, index) => {
                                                                    const page = index + 1;

                                                                    return (
                                                                        <button key={page} className={`dt-paging-button ${page === currentPage ? "current" : ""}`} onClick={() => goToPage(page)} >
                                                                            {page}
                                                                        </button>
                                                                    );
                                                                })}

                                                                <button className={`dt-paging-button next ${currentPage === totalPages ? "disabled" : ""}`} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Next" >
                                                                    ›
                                                                </button>
                                                            </nav>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>

                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                    <div className="calendar-card" style={{ width: '100%' }}>
                                                        <Calendar />
                                                    </div>
                                                    <div id="news">
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">Recent Comments on Notice</h5>

                                                            {noticeData?.original?.data?.flatMap((notice) => notice.comments || [])?.slice(0, 4)?.map((comment) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }} key={comment.id}>
                                                                    <div className="event-item">
                                                                        {comment.user?.profile_image_url ? (
                                                                            <img className="img-fluid event-img" src={comment.user.profile_image_url} onError="this.src='null'" />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
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
                                                            {noticeData?.original?.data?.slice(0, 6)?.map((notice) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }} key={notice.id}>
                                                                    <div className="event-item">
                                                                        {notice.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={notice.featured_image_url} onError="this.src='null'" />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
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
                                                                <button className="btn btn-sm" id="e-view" onClick="{() => navigate(/notices)}">
                                                                    View All
                                                                </button>
                                                                <button className="btn btn-sm" id="new" onClick="{() => navigate(/notices/create)}">
                                                                    Add New
                                                                </button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </section>
                                        </div >
                                    </div >
                                </div >
                            </section >
                            <footer className="site-footer">
                                <div className="footer-content">
                                    <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal</p>
                                </div>
                            </footer>
                        </div >

                    </>
                )
                }
            </div >
        </>
    );
}

export default NoticeRoute;
