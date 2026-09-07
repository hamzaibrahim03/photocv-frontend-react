import { useNavigate } from "react-router";
import Calendar from "../React/extra/CalendarRyton"
import HeaderRoute from "./HeaderRoute"
import NavigationRoute from "./NavigationRoute"
import Loader from "../React/extra/LoaderAll";
import { useEffect, useMemo, useState, useRef } from "react";
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
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFilter, setExportFilter] = useState("selected");
    const [selectedEvents, setSelectedEvents] = useState([]);
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
    const handleShare = async (event) => {
        const shareUrl = `${window.location.origin}/event/${event.id}`;
        const shareData = {
            title: event.name || "Event",
            text: event.description
                ? event.description.replace(/<[^>]*>/g, "").slice(0, 150)
                : "Check out this event",
            url: shareUrl,
        };
        try {
            // Mobile / supported browsers
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Desktop fallback
                await navigator.clipboard.writeText(shareUrl);
                alert("Event link copied to clipboard!");
            }
        } catch (error) {
            // User cancelled the share popup
            if (error.name !== "AbortError") {
                console.error("Share failed:", error);
                // Last fallback
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert("Event link copied to clipboard!");
                } catch (clipboardError) {
                    console.error("Clipboard failed:", clipboardError);
                }
            }
        }
    };
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
    const toggleEvent = (id) => {
        setSelectedEvents((prev) =>
            prev.includes(id)
                ? prev.filter((eventId) => eventId !== id)
                : [...prev, id]
        );
    };
    const getExportEvents = () => {
        const events = eventData?.original?.data || [];
        if (exportFilter === "selected") {
            return events.filter((event) =>
                selectedEvents.includes(event.id)
            );
        }
        if (exportFilter === "upcoming") {
            const now = new Date();
            return events.filter((event) => {
                if (!event.event_date) return false;
                return new Date(event.event_date) >= now;
            });
        }
        // All
        return events;
    };
    const exportEvents = getExportEvents();
    const toggleSelectAll = () => {
        const visibleIds = exportEvents.map((event) => event.id);
        if (visibleIds.length === 0) return;
        const allSelected = visibleIds.every((id) =>
            selectedEvents.includes(id)
        );
        if (allSelected) {
            // Remove currently displayed events from selection
            setSelectedEvents((prev) =>
                prev.filter((id) => !visibleIds.includes(id))
            );
        } else {
            // Add currently displayed events
            setSelectedEvents((prev) => [
                ...new Set([...prev, ...visibleIds])
            ]);
        }
    };
    const handleExport = () => {
        const eventsToExport = getExportEvents();
        if (eventsToExport.length === 0) {
            alert("Please select at least one event to export.");
            return;
        }
        const headers = [
            "Event Name",
            "Event Date",
            "Description"
        ];
        const rows = eventsToExport.map((event) => [
            event.name || "",
            event.event_date
                ? new Date(event.event_date).toLocaleString()
                : "",
            event.description
                ? event.description.replace(/<[^>]*>/g, "")
                : ""
        ]);
        const csvContent = [
            headers,
            ...rows
        ]
            .map(row =>
                row
                    .map(value =>
                        `"${String(value).replace(/"/g, '""')}"`
                    )
                    .join(",")
            )
            .join("\n");
        const blob = new Blob(
            [csvContent],
            { type: "text/csv;charset=utf-8;" }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `events-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setShowExportModal(false);
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
                                                <h3 className="number">{eventExtra?.total_events}</h3>
                                            </div>
                                            <div className="event-cards">
                                                {eventExtra?.upcoming_event?.remaining_days !== undefined &&
                                                    eventExtra?.upcoming_event?.remaining_days !== null ? (
                                                    <>
                                                        <small className="ca-details">Next Event</small>
                                                        <div className="row">
                                                            <div className="col-md-5">
                                                                <h3 className="number">{String(eventExtra?.upcoming_event?.remaining_days).padStart(2, '0')}</h3>
                                                            </div>
                                                            <div className="days col-md-7">
                                                                <span>days to go</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                            <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <h3 className="days">
                                                            No upcoming events
                                                        </h3>
                                                    </div>
                                                )}
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
                                                            <button type="button" className="btn export-events-btn" id="edit" style={{ maxWidth: '170px', width: '170px', height: '40px' }} onClick={() => setShowExportModal(true)}>
                                                                Export Events
                                                                <i className="fa-solid fa-chevron-down" style={{ marginLeft: '10px' }}></i>
                                                            </button>
                                                        </div>
                                                        {showExportModal && (
                                                            <div className="export-modal-overlay">
                                                                <div className="export-modal">
                                                                    <div className="export-modal-header">
                                                                        <h2>Export Events</h2>
                                                                        <button type="button" className="export-close-btn" onClick={() => setShowExportModal(false)}>
                                                                            ×
                                                                        </button>
                                                                    </div>
                                                                    <div className="export-top-section">
                                                                        <label className="select-all-wrapper">
                                                                            <input type="checkbox" checked={exportEvents.length > 0 && exportEvents.every(event => selectedEvents.includes(event.id))} onChange={toggleSelectAll} />
                                                                            <span className="custom-checkbox"></span>
                                                                            <span>Select All</span>
                                                                        </label>
                                                                        <div className="export-filters">
                                                                            <button type="button" className={exportFilter === "selected" ? "export-filter active" : "export-filter"} onClick={() => setExportFilter("selected")}>
                                                                                Selected
                                                                            </button>
                                                                            <button type="button" className={exportFilter === "upcoming" ? "export-filter active" : "export-filter"} onClick={() => setExportFilter("upcoming")}>
                                                                                Upcoming
                                                                            </button>
                                                                            <button type="button" className={exportFilter === "all" ? "export-filter active" : "export-filter"} onClick={() => setExportFilter("all")}>
                                                                                All
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="export-events-title">
                                                                        Events
                                                                    </div>
                                                                    <div className="export-event-list">
                                                                        {exportEvents.length > 0 ? (
                                                                            exportEvents.map((event) => (
                                                                                <label key={event.id} className="export-event-row">
                                                                                    <input type="checkbox" checked={selectedEvents.includes(event.id)} onChange={() => toggleEvent(event.id)} />
                                                                                    <span className="custom-checkbox"></span>
                                                                                    <span className="export-event-name">
                                                                                        {event.name || "Untitled Event"}
                                                                                    </span>
                                                                                    <span className="export-event-date">
                                                                                        {event.event_date
                                                                                            ? formatDate(event.event_date)
                                                                                            : "No date"}
                                                                                    </span>
                                                                                </label>
                                                                            ))
                                                                        ) : (
                                                                            <div className="no-events">
                                                                                {exportFilter === "selected"
                                                                                    ? "No events selected"
                                                                                    : exportFilter === "upcoming"
                                                                                        ? "No upcoming events"
                                                                                        : "No events found"
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="export-modal-footer">
                                                                        <button type="button" className="export-cancel-btn" onClick={() => setShowExportModal(false)}>
                                                                            Cancel
                                                                        </button>
                                                                        <button type="button" className="export-now-btn" disabled={exportEvents.length === 0} onClick={handleExport}>
                                                                            Export Now
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
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
                                                                                            <img src={event?.types?.[0]?.icon_url} alt={event?.featured_image_url} style={{ width: '20px', height: '20px', borderRadius: '0%' }} />
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
                                                                                        <div className="library-bookmark">
                                                                                            <img src={Book} alt="bookmark" style={{ width: '20px', height: '20px', cursor: 'pointer' }} className={isBookmarked(event.id, "Events") ? "bookmark-icon active" : "bookmark-icon"} onClick={() => toggleBookmark(event, "Events")} />
                                                                                        </div>
                                                                                        <div style={{ position: "relative", display: "inline-block" }}>
                                                                                            {bookmarkOpenId === event.id && (
                                                                                                <div style={{ position: "absolute", bottom: "30px", right: "0", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 100, minWidth: "170px" }}>
                                                                                                    <p style={{ margin: "0 0 8px", fontWeight: "bold", fontSize: "13px", color: "#333" }}>
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
                                                                                        <img src={Share} alt="Share" style={{ width: '20px', height: '20px', cursor: 'pointer' }} onClick={() => handleShare(event)} />
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
                                                    <div className="calendar-card d-flex flex-column" style={{ width: '100%' }}>
                                                        <Calendar />
                                                    </div>
                                                    <div id="news">
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                            <h5 className="head">Recent Comments</h5>
                                                            {eventData?.original?.data?.flatMap((event) => event.comments || [])?.slice(0, 5)?.map((comment) => (
                                                                <div className="event-list" style={{ marginBottom: '10px' }}>
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
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <footer className="site-footer">
                                <div className="footer-content">
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
export default EventRoute;
