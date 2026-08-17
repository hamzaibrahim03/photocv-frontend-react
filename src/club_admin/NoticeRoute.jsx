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

function NoticeRoute() {
    const navigate = useNavigate();
    const [noticeData, setNoticeData] = useState({})
    const [noticeExtra, setNoticeExtra] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [rowsPerPage] = useState(4);

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");



    useEffect(() => {
        getNoticeData();
        getNoticeExtra();
        // updateColumns();
        // updatedColumns();
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);


    async function getNoticeData() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/notices'
        // let res = await fetch(url, {
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${localStorage.getItem("token")}`,
        //     },
        // })
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
        // let res = await fetch(url, {
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${localStorage.getItem("token")}`,
        //     },
        // })
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

    const { eventDaysToGo, upcomingEventCount } = useMemo(() => {
        const today = new Date();
        const notices = noticeData.original?.data || [];
        const upcomingNotices = notices.filter(e => new Date(e.event_date) > today);
        const nearest = upcomingNotices
            .map(e => new Date(e.event_date))
            .sort((a, b) => a - b)[0];

        let days = 0;
        if (nearest) {
            days = Math.ceil((nearest - today) / (1000 * 60 * 60 * 24));
        }

        return { eventDaysToGo: days, upcomingEventCount: upcomingNotices.length };
    }, [noticeData]);

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Events" />
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
                                                                                        <button className="btn me-2" id="e-view" onClick={() => navigateTo('/notices')}>View</button>
                                                                                        <button className="btn me-2" id="e-edit" onClick={() => navigateTo('/notice_single')}>Edit</button>
                                                                                    </div>

                                                                                    <div className="d-flex align-items-center gap-2">
                                                                                        <img src={Book} alt="icon" style={{ width: '20px', height: '20px' }} />
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
                                                                                <span id="espeaker">{comment?.comment}</span>
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
                                                        <div class="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 class="head">More Notices</h5>
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
                                                                                <span id="espeaker">{notice?.title}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="event-time" id="edate">
                                                                            <small className="event-date galtext">{formatDate(notice?.created_at)}</small><br />
                                                                            <small className="event-time-details galtext">{formatTime(notice?.created_at)}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            <div class="button-group mt-auto">
                                                                <button class="btn btn-sm" id="e-view" onClick="{() => navigate(/notices)}">
                                                                    View All
                                                                </button>
                                                                <button class="btn btn-sm" id="new" onClick="{() => navigate(/notices/create)}">
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
                                    {/* <p className="memtext" id="fcopy">Copyright &copy; 2025 – {dashboardStore?.dashboardData?.data?.user_details?.username}</p> */}
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
