import { useNavigate } from "react-router";
import Calendar from "../React/extra/CalendarRyton"
import HeaderRoute from "./HeaderRoute"
import NavigationRoute from "./NavigationRoute"
import { useEffect, useMemo, useState } from "react";
import Loader from "../React/extra/LoaderAll";
import Video from "./assets/icons/quick_event/video.svg"
import Star from "./assets/icons/quick_event/star.svg"
import Set from "./assets/icons/quick_event/set.svg"
import Stick from "./assets/icons/quick_event/stick.svg"
import Camera from "./assets/icons/quick_event/camera.svg"
import Project from "./assets/icons/quick_event/project.svg"
import Pro from "./assets/icons/event_list/pro.svg"
import Cal from "./assets/icons/event_list/cal.svg"
import Cam from "./assets/icons/event_list/cam.svg"
import Mess from "./assets/icons/event_list/mess.svg"
import Share from "./assets/icons/event_list/share.svg"
import Book from "./assets/icons/event_list/bookmark.svg"

function EventRoute() {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({})
    const [eventExtra, setEventExtra] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [rowsPerPage] = useState(4);

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");



    useEffect(() => {
        getEventData();
        getEventExtra();
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);


    async function getEventData() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/events'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        const data = await response.json();

        console.log(data);

        setEventData(data.data);
    };
    console.log(eventData.original?.data)

    async function getEventExtra() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/event-extras'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        const data = await response.json();

        console.log(data);

        setEventExtra(data.data);
    };
    console.log(eventExtra)




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

    const filteredEvents = useMemo(() => {
        const events = eventData.original?.data || [];

        return events.filter((event) =>
            event.name?.toLowerCase().includes(search.toLowerCase()) ||
            event.event_date?.toLowerCase().includes(search.toLowerCase()) ||
            event.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [eventData, search]);

    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(filteredEvents.length / rowsPerPage),
            1
        );
    }, [filteredEvents, rowsPerPage]);

    const paginatedEvents = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;

        return filteredEvents.slice(start, start + rowsPerPage);
    }, [filteredEvents, currentPage, rowsPerPage]);

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
                        <HeaderRoute title="Events" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">Planned and regular club event</small>
                                                    <h2 className="name">2024 - 2025 Season</h2>
                                                    <p className="role">{eventExtra.current_month_event_count} Events to go</p>
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
                                                    <img src={Video} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Project} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Star} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                </div>
                                                <div className="d-flex gap-2 justify-content-end mt-2">
                                                    <img src={Camera} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Stick} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Set} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Total Events</small>
                                                <h3 className="number">{eventExtra.total_events}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Next Event</small>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{String(eventExtra.upcoming_event.remaining_days).padStart(2, '0')}</h3>
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
                                        <div className="col-md-8" style={{ padding: '0px' }}>
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }}>
                                                    <div className="mt-4">
                                                        <div className="d-flex justify-content-end">
                                                            <button className="btn" id="edit" style={{ maxWidth: '158px', width: '158px', height: '40px' }}>Export Events&nbsp;<i className="fa-solid fa-chevron-down text-xs text-gray-500 down notification-desktop"></i></button>
                                                        </div>
                                                        {paginatedEvents?.length > 0 ? (
                                                            <>
                                                                {paginatedEvents?.map((event) => (
                                                                    <div key={event.id} className="custom-card mb-3">
                                                                        <div className="d-flex gap-3" style={{ flex: 1 }}>
                                                                            <img src={event.featured_image_url} alt="Event Image" />
                                                                            <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                                                                <div>
                                                                                    <div className="d-flex justify-content-between align-items-start">
                                                                                        <h5>{event.name || 'Untitled Event'}</h5>
                                                                                        <div className="e-icon-container ms-3">
                                                                                            <img src={Mess} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                            <img src={Cam} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                            <img src={Pro} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                            <img src={Cal} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                                                        </div>
                                                                                    </div>
                                                                                    <p className="date" style={{ color: 'black' }}>
                                                                                        {formatDate(event.event_date) || 'Date Not Available'}
                                                                                    </p>
                                                                                    <p className="text-secondary" dangerouslySetInnerHTML={{ __html: event.description || 'No description provided.' }}>
                                                                                    </p>
                                                                                </div>

                                                                                <div className="d-flex justify-content-between align-items-center mt-3 w-100">
                                                                                    <div className="button-group d-flex align-items-center">
                                                                                        <button className="btn" id="e-view" onClick={() => navigate(`/event/${event.id}`)}>View</button>

                                                                                        <button className="btn" id="e-edit" onClick={() => navigate(`/event/${event.id}/edit`)}>Edit</button>
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
                                                            <div className="text-center text-muted">No events found.</div>
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
                                        <div className="col-md-4">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }} id="e-right">
                                                    <div className="calendar-card d-flex flex-column" style={{ width: '100%' }}>
                                                        <Calendar />
                                                    </div>
                                                    <div id="news">
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">Recent Comments</h5>

                                                            {eventData?.original?.data?.flatMap((event) => event.comments || [])?.slice(0, 5)?.map((comment) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }} >
                                                                    <div key={comment.id} className="event-item">
                                                                        <div className="col-md-2">
                                                                            {comment.user?.profile_image_url ? (
                                                                                <img src={comment.user?.profile_image_url} alt="Com" style={{ width: '50px', height: '50px' }} />
                                                                            ) : (
                                                                                <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                    <i className="fa-regular fa-user" style={{ fontSize: '24px', color: 'gray' }}></i>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <p className="text-secondary">{comment.comment}</p>
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <div className="event-time" style={{ textAlign: 'right', width: '90%' }}>
                                                                                <small className="event-date">{formatDate(comment.created_at)}</small><br />
                                                                                <small className="event-time-details">{formatTime(comment.created_at)}</small>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                        </div>

                                                    </div>
                                                </div >
                                            </section >
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

export default EventRoute;