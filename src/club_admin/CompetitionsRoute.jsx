import { useNavigate } from "react-router";
import Calendar from "../React/extra/CalendarRyton"
import HeaderRoute from "./HeaderRoute"
import NavigationRoute from "./NavigationRoute"
import { useEffect, useMemo, useState, useRef } from "react";
import Loader from "../React/extra/LoaderAll";
import Flo from "./assets/icons/quick_comp/flower.svg"
import Ima from "./assets/icons/quick_comp/image.svg"
import Fax from "./assets/icons/quick_comp/fax.svg"
import Pri from "./assets/icons/quick_comp/print.svg"
import Pai from "./assets/icons/quick_comp/paint.svg"
import Prof from "./assets/icons/quick_comp/profile.svg"
import Pro from "./assets/icons/event_list/pro.svg"
import Cal from "./assets/icons/event_list/cal.svg"
import Cam from "./assets/icons/event_list/cam.svg"
import Mess from "./assets/icons/event_list/mess.svg"
import Share from "./assets/icons/event_list/share.svg"
import Book from "./assets/icons/event_list/bookmark.svg"
function CompetitionsRoute() {
    const navigate = useNavigate();
    const [competitionData, setCompetitionData] = useState({})
    const [competitionExtra, setCompetitionExtra] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [rowsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFilter, setExportFilter] = useState("selected");
    const [selectedCompetitions, setSelectedCompetitions] = useState([]);
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
    }, []); const toggleBookmark = (item, category) => {
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
    const handleShare = async (competition) => {
        const shareUrl = `${window.location.origin}/competition/${competition.id}`;
        const shareData = {
            title: competition.name || "Competition",
            text: competition.description
                ? competition.description.replace(/<[^>]*>/g, "").slice(0, 150)
                : "Check out this competition",
            url: shareUrl,
        };
        try {
            // Mobile / supported browsers
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Desktop fallback
                await navigator.clipboard.writeText(shareUrl);
                alert("Competition link copied to clipboard!");
            }
        } catch (error) {
            // User cancelled the share popup
            if (error.name !== "AbortError") {
                console.error("Share failed:", error);
                // Last fallback
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert("Competition link copied to clipboard!");
                } catch (clipboardError) {
                    console.error("Clipboard failed:", clipboardError);
                }
            }
        }
    };
    useEffect(() => {
        getCompetitionData();
        getCompetitionExtra();
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    async function getCompetitionData() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/competitions'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setCompetitionData(data.data);
    };
    console.log(competitionData?.competitions?.original?.data)
    async function getCompetitionExtra() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/competition-extras'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setCompetitionExtra(data.data);
    };
    console.log(competitionExtra)
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
    const filteredCompetitions = useMemo(() => {
        const competitions = competitionData.competitions?.original?.data || [];
        return competitions.filter((competition) =>
            competition.name?.toLowerCase().includes(search.toLowerCase()) ||
            competition.start_date?.toLowerCase().includes(search.toLowerCase()) ||
            competition.end_date?.toLowerCase().includes(search.toLowerCase())
        );
    }, [competitionData, search]);
    console.log(filteredCompetitions)
    const totalPages = useMemo(() => {
        return Math.max(
            Math.ceil(filteredCompetitions.length / rowsPerPage),
            1
        );
    }, [filteredCompetitions, rowsPerPage]);
    const paginatedCompetitions = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredCompetitions.slice(start, start + rowsPerPage);
    }, [filteredCompetitions, currentPage, rowsPerPage]);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const toggleCompetition = (id) => {
        setSelectedCompetitions((prev) =>
            prev.includes(id)
                ? prev.filter((competitionId) => competitionId !== id)
                : [...prev, id]
        );
    };
    const getExportCompetitions = () => {
        const competitions = competitionData?.competitions?.original?.data || [];
        if (exportFilter === "selected") {
            return competitions.filter((competition) =>
                selectedCompetitions.includes(competition.id)
            );
        }
        if (exportFilter === "upcoming") {
            const now = new Date();
            return competitions.filter((competition) => {
                if (!competition.event_date) return false;
                return new Date(competition.event_date) >= now;
            });
        }
        // All
        return competitions;
    };
    const exportCompetitions = getExportCompetitions();
    const toggleSelectAll = () => {
        const visibleIds = exportCompetitions.map((competition) => competition.id);
        if (visibleIds.length === 0) return;
        const allSelected = visibleIds.every((id) =>
            selectedCompetitions.includes(id)
        );
        if (allSelected) {
            // Remove currently displayed competitions from selection
            setSelectedCompetitions((prev) =>
                prev.filter((id) => !visibleIds.includes(id))
            );
        } else {
            // Add currently displayed competitions
            setSelectedCompetitions((prev) => [
                ...new Set([...prev, ...visibleIds])
            ]);
        }
    };
    const handleExport = () => {
        const competitionsToExport = getExportCompetitions();
        if (competitionsToExport.length === 0) {
            alert("Please select at least one competition to export.");
            return;
        }
        const headers = [
            "Competition Name",
            "Competition Date",
            "Description"
        ];
        const rows = competitionsToExport.map((competition) => [
            competition.name || "",
            competition.start_date
                ? new Date(competition.start_date).toLocaleString()
                : "",
            competition.description
                ? competition.description.replace(/<[^>]*>/g, "")
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
        link.download = `competitions-${new Date()
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
                        <HeaderRoute title="Competitions" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">Planned and regular club competition</small>
                                                    <h2 className="name">2024 - 2025 Season</h2>
                                                    <p className="role">{competitionExtra.current_month_competition_count} Competitions to go</p>
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
                                                    <img src={Pri} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Fax} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Pai} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                </div>
                                                <div className="d-flex gap-2 justify-content-end mt-2">
                                                    <img src={Flo} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Prof} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                    <img src={Ima} alt="icon" style={{ width: '20px', height: '20px' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Members</small>
                                                <h3 className="number">{competitionExtra.total_member_count}</h3>
                                            </div>
                                            <div className="event-cards">
                                                {competitionExtra?.upcoming_competition?.remaining_days !== undefined &&
                                                    competitionExtra?.upcoming_competition?.remaining_days !== null ? (
                                                    <>
                                                        <small className="ca-details">Next Competition</small>
                                                        <div className="row">
                                                            <div className="col-md-5">
                                                                <h3 className="number">{String(competitionExtra?.upcoming_competition?.remaining_days).padStart(2, '0')}</h3>
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
                                                            No upcoming Competition
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
                                        <div className="col-md-8">
                                            <section>
                                                <div className="container" style={{ maxWidth: '1820px' }}>
                                                    <div className="mt-4">
                                                        <div className="d-flex justify-content-end">
                                                            <button className="btn" id="edit" style={{ maxWidth: '240px', width: '240px', height: '40px' }} onClick={() => setShowExportModal(true)}>Export Competitions&nbsp;<i className="fa-solid fa-chevron-down text-xs text-gray-500 down notification-desktop"></i></button>
                                                        </div>
                                                        {showExportModal && (
                                                            <div className="export-modal-overlay">
                                                                <div className="export-modal">
                                                                    <div className="export-modal-header">
                                                                        <h2>Export Competitions</h2>
                                                                        <button type="button" className="export-close-btn" onClick={() => setShowExportModal(false)}>
                                                                            ×
                                                                        </button>
                                                                    </div>
                                                                    <div className="export-top-section">
                                                                        <label className="select-all-wrapper">
                                                                            <input type="checkbox" checked={exportCompetitions.length > 0 && exportCompetitions.every(competition => selectedCompetitions.includes(competition.id))} onChange={toggleSelectAll} />
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
                                                                        Competitions
                                                                    </div>
                                                                    <div className="export-event-list">
                                                                        {exportCompetitions.length > 0 ? (
                                                                            exportCompetitions.map((competition) => (
                                                                                <label key={competition.id} className="export-event-row">
                                                                                    <input type="checkbox" checked={selectedCompetitions.includes(competition.id)} onChange={() => toggleCompetition(competition.id)} />
                                                                                    <span className="custom-checkbox"></span>
                                                                                    <span className="export-event-name">
                                                                                        {competition.name || "Untitled Competition"}
                                                                                    </span>
                                                                                    <span className="export-event-date">
                                                                                        {competition.start_date
                                                                                            ? formatDate(competition.start_date)
                                                                                            : "No date"}
                                                                                    </span>
                                                                                </label>
                                                                            ))
                                                                        ) : (
                                                                            <div className="no-events">
                                                                                {exportFilter === "selected"
                                                                                    ? "No competitions selected"
                                                                                    : exportFilter === "upcoming"
                                                                                        ? "No upcoming competitions"
                                                                                        : "No competitions found"
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="export-modal-footer">
                                                                        <button type="button" className="export-cancel-btn" onClick={() => setShowExportModal(false)}>
                                                                            Cancel
                                                                        </button>
                                                                        <button type="button" className="export-now-btn" disabled={exportCompetitions.length === 0} onClick={handleExport}>
                                                                            Export Now
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {paginatedCompetitions?.length > 0 ? (
                                                            <>
                                                                {paginatedCompetitions?.map((competition) => (
                                                                    <div key={competition.id} className="custom-card mb-3 p-3">
                                                                        <div className="d-flex gap-3" style={{ flex: 1 }}>
                                                                            <img src={competition.featured_image_url} alt="Competition Image" />
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
                                                                                <p style={{ margin: '5px 0', fontSize: '14px', columns: 2, color: 'black' }}>
                                                                                    <strong style={{ color: 'red' }}>Open:</strong>{formatDate(competition.start_date)}
                                                                                    <br />
                                                                                    <strong style={{ color: 'brown' }}>Result:</strong> {formatDate(competition.result_announcement_date)}
                                                                                    <br />
                                                                                    <strong style={{ color: 'brown' }}>Theme:</strong>{competition.theme_id}<br />
                                                                                    <strong style={{ color: 'red' }}>Close:</strong>{formatDate(competition.submission_deadline)}
                                                                                    <br />
                                                                                    <strong style={{ color: 'brown' }}>Max:</strong>{competition.max_entries_print}
                                                                                    <br />
                                                                                    <strong style={{ color: 'brown' }}>Format:</strong> {competition.allowed_image_formats}
                                                                                </p>
                                                                                <p className="text-secondary" dangerouslySetInnerHTML={{ __html: competition.description || 'No description provided.' }} />
                                                                                <div className="d-flex justify-content-between align-items-center mt-3 w-100">
                                                                                    <div className="button-group d-flex align-items-center gap-2">
                                                                                        <button className="btn me-2" id="e-view" onClick={() => navigate(`/competitions/${competition.id}`)}>View</button>
                                                                                        <button className="btn" id="e-edit" onClick={() => navigate(`/competitions/${competition.id}/edit`)}>Edit</button>
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center gap-2">
                                                                                        <div className="library-bookmark">
                                                                                            <img src={Book} alt="bookmark" style={{ width: '20px', height: '20px', cursor: 'pointer' }} className={isBookmarked(competition.id, "Competitions") ? "bookmark-icon active" : "bookmark-icon"} onClick={() => toggleBookmark(competition, "Competitions")} />
                                                                                        </div>
                                                                                        <div style={{ position: "relative", display: "inline-block" }}>
                                                                                            {bookmarkOpenId === competition.id && (
                                                                                                <div style={{ position: "absolute", bottom: "30px", right: "0", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 100, minWidth: "170px" }}>
                                                                                                    <p style={{ margin: "0 0 8px", fontWeight: "bold", fontSize: "13px", color: "#333" }}>
                                                                                                        Save to Library
                                                                                                    </p>
                                                                                                    {["Events", "Competitions", "Notices", "Galleries", "News"].map((cat) => (
                                                                                                        <div key={cat} style={{ padding: "7px 10px", cursor: "pointer", borderRadius: "4px", fontSize: "13px", color: "#555" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f0eb"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }} onClick={() => { saveToLibrary(competition, cat); }}>
                                                                                                            📁 {cat}
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                        <img src={Share} alt="Share" style={{ width: '20px', height: '20px', cursor: 'pointer' }} onClick={() => handleShare(competition)} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-muted">No competitions found.</div>
                                                        )}
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
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }}>
                                                            <h5 className="head">Recent Submissions</h5>
                                                            {competitionExtra?.recent_submissions?.length > 0 ? (
                                                                <>
                                                                    {competitionExtra?.recent_submissions?.slice(0, 4)?.map((co) => (
                                                                        <div className="event-list" if="recentsubmissions.length">
                                                                            <div className="event-item" v-htmlFor="co in recentsubmissions.slice(0, 4)" key="co.id" style={{ marginBottom: '10px' }}>
                                                                                {co.entry_image ? (
                                                                                    <img className="img-fluid event-img" src={co.entry_image} alt="Event" />
                                                                                ) : (
                                                                                    <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                                    </div>
                                                                                )}
                                                                                <div className="event-details" style={{ display: 'flex' }}>
                                                                                    <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                        <span id="ename">{co.member_username}</span>
                                                                                        <span id="espeaker"> {co.competition_name}</span>
                                                                                    </div>
                                                                                    <div className="event-time" id="edate">
                                                                                        <small className="event-date galtext">{formatDate(co.submitted_at)}</small><br />
                                                                                        <small className="event-time-details galtext">{formatTime(co.submitted_at)}</small>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <div className="text-center text-muted">No competitions found.</div>
                                                            )}
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
export default CompetitionsRoute
