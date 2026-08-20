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

function NewsRoute() {
    const navigate = useNavigate();
    const [newsData, setNewsData] = useState({})
    const [newsExtra, setNewsExtra] = useState({})
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
        getNewsData();
        getNewsExtra();
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);


    async function getNewsData() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/club-news'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        const data = await response.json();

        console.log(data);

        setNewsData(data.data);
    };
    console.log(newsData.original?.data)

    async function getNewsExtra() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/club-news-extras'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        const data = await response.json();

        console.log(data);

        setNewsExtra(data.data);
    };
    console.log(newsExtra)




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

    const filteredNews = useMemo(() => {
        const news = newsData.original?.data || [];

        return news.filter((news) =>
            news.name?.toLowerCase().includes(search.toLowerCase()) ||
            news.event_date?.toLowerCase().includes(search.toLowerCase()) ||
            news.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [newsData, search]);

    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(filteredNews.length / rowsPerPage),
            1
        );
    }, [filteredNews, rowsPerPage]);

    const paginatedNews = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;

        return filteredNews.slice(start, start + rowsPerPage);
    }, [filteredNews, currentPage, rowsPerPage]);

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
                        <HeaderRoute title="News" />
                        <div class="content">
                            <section>
                                <div class="container" style={{ maxWidth: '1820px' }}>
                                    <div class="dashboard-card">
                                        <div class="profile-card">
                                            <div class="profile-left">
                                                <div class="profile-info">
                                                    <small class="greeting">News from the club admins</small>
                                                    <h2 class="name">Club News</h2>
                                                    <p class="role">{newsExtra?.current_month_news_count} News posted this month</p>
                                                </div>
                                            </div>
                                            <div className="search-bar d-flex justify-content-space-between">
                                                <input type="search" className="search-input" id="dt-search-1" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                <i className="fas fa-search"></i>
                                            </div>
                                            <div class="e-quick-filter text-end">
                                                <strong>Quick Filter</strong>
                                                <small class="d-block">(Click icons to filter)</small>
                                                <div class="d-flex gap-2 justify-content-end">
                                                    <img src={Com} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Cale} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Book} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                </div>
                                                <div class="d-flex gap-2 justify-content-end mt-2">
                                                    <img src={Cup} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Hand} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Note} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-section">
                                            <div class="stat-card">
                                                <small class="ca-details">News</small>
                                                <h3 class="number">{newsExtra?.total_news}</h3>
                                            </div>
                                            <div class="event-cards">
                                                <small class="ca-details">Latest News</small>
                                                <div class="row">
                                                    <div class="col-md-5">
                                                        <h3 class="number">{newsExtra?.last_news_days_ago}</h3>
                                                    </div>
                                                    <div class="days col-md-7">
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
                                        <div class="col-md-8">
                                            <section>
                                                <div class="container" style={{ maxWidth: '1820px' }}>
                                                    <div class="mt-4">
                                                        {filteredNews.length > 0 ? (
                                                            filteredNews.map((news) => (
                                                                <div key={news.id} class="custom-card mb-3 p-3">
                                                                    <div class="d-flex gap-3" style={{ flex: 1 }}>
                                                                        {news.club_news_type.icon && (
                                                                            <img src={news.featured_image} alt="News Image" />
                                                                        )}
                                                                        <div class="flex-grow-1 d-flex flex-column justify-content-between">
                                                                            <div class="d-flex justify-content-between align-items-center">
                                                                                <h5>{news.title || 'Untitled News'}</h5>
                                                                                <div class="e-icon-container ms-3">
                                                                                    <img src={Mess} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                    <img src={Cam} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                    <img src={Pro} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                    <img src={Cal} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                </div>
                                                                            </div>
                                                                            <p class="date">
                                                                                {formatDate(news.publish_date) || 'Date Not Available'}
                                                                            </p>
                                                                            <p class="text-secondary" dangerouslySetInnerHTML={{ __html: news.description || 'No description provided.' }}>
                                                                            </p>
                                                                            <div class="d-flex justify-content-between align-items-center mt-3 w-100">
                                                                                <div class="button-group d-flex align-items-center gap-2">
                                                                                    <button class="btn me-2" id="e-view" onClick={() => navigate('/news/view')} >View</button>
                                                                                    <button class="btn" id="e-edit" onClick={() => navigate('/news/edit')} >Edit</button>
                                                                                </div>

                                                                                <div className="d-flex align-items-center gap-2">
                                                                                    <div className="library-bookmark">
                                                                                        <img src={Books} alt="bookmark" style={{ width: '20px', height: '20px', cursor: 'pointer' }} className={isBookmarked(news.id, "News") ? "bookmark-icon active" : "bookmark-icon"} onClick={() => toggleBookmark(news, "News")} />
                                                                                    </div>
                                                                                    <div style={{ position: "relative", display: "inline-block" }}>

                                                                                        {bookmarkOpenId === news.id && (
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
                                                            ))
                                                        ) : (
                                                            <div class="text-center text-muted">No news found.</div>
                                                        )}
                                                    </div>

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
                                            </section>
                                        </div>
                                        <div class="col-md-4">
                                            <section>
                                                <div class="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                    <div class="calendar-card" style={{ width: '100%' }}>
                                                        <Calendar />
                                                    </div>
                                                    <div id="news">
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">Recent Comments on News</h5>

                                                            {newsData?.original?.data?.flatMap((news) => news.comments || [])?.slice(0, 4)?.map((comment) => (
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
                                                            <h5 className="head">More News</h5>
                                                            {newsData?.original?.data?.slice(0, 6)?.map((news) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }} key={news.id}>
                                                                    <div className="event-item">
                                                                        {news.featured_image_url ? (
                                                                            <img className="img-fluid event-img" src={news.featured_image_url} onError="this.src='null'" />
                                                                        ) : (
                                                                            <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                            </div>
                                                                        )}
                                                                        <div className="event-details">
                                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <span className="text-secondary">{news?.title}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="event-time" id="edate">
                                                                            <small className="event-date galtext">{formatDate(news?.created_at)}</small><br />
                                                                            <small className="event-time-details galtext">{formatTime(news?.created_at)}</small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            <div className="button-group mt-auto">
                                                                <button className="btn btn-sm" id="e-view" onClick="{() => navigate(/news)}">
                                                                    View All
                                                                </button>
                                                                <button className="btn btn-sm" id="new" onClick="{() => navigate(/news/create)}">
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
                        </div>
                        <footer className="site-footer">
                            <div className="footer-content">
                                <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal</p>
                            </div>
                        </footer>

                    </>
                )
                }
            </div >
        </>
    );
}

export default NewsRoute;