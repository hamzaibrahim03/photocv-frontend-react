import { useNavigate } from "react-router";
import Calendar from "../React/extra/CalendarRyton"
import HeaderRoute from "./HeaderRoute"
import NavigationRoute from "./NavigationRoute"
import { useEffect, useMemo, useState } from "react";
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
                                                <small className="ca-details">Next Competition</small>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{String(competitionExtra.upcoming_competition.remaining_days).padStart(2, 0)}</h3>
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
                                                <div className="container" style={{ maxWidth: '1820px' }}>
                                                    <div className="mt-4">
                                                        <div className="d-flex justify-content-end">
                                                            <button className="btn" id="edit" style={{ maxWidth: '240px', width: '240px', height: '40px' }}>Export Competitions&nbsp;<i className="fa-solid fa-chevron-down text-xs text-gray-500 down notification-desktop"></i></button>
                                                        </div>
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
                                                                                        <button className="btn me-2" id="e-view" onClick={() => navigate('/competitionsingle/' + competition.id)}>View</button>
                                                                                        <button className="btn" id="e-edit" onClick={() => navigate('/comp_edit/' + competition.id)}>Edit</button>
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
                                                            <div className="text-center text-muted">No competitions found.</div>
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
                                                    <div className="calendar-card d-flex flex-column" style={{ width: '100%' }}>
                                                        <Calendar />
                                                    </div>
                                                    <div id="news">
                                                        <div className="more-card d-flex flex-column" style={{ padding: '35px', height: 'auto' }}>
                                                            <h5 className="head">Recent Submissions</h5>
                                                            {competitionExtra.recent_submissions.length > 0 ? (
                                                                <>
                                                                    {competitionExtra.recent_submissions.slice(0, 4).map((co) => (
                                                                        <div className="event-list" v-if="recentsubmissions.length">
                                                                            <div className="event-item" v-for="co in recentsubmissions.slice(0, 4)" key="co.id" style={{ marginBottom: '10px' }}>
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

export default CompetitionsRoute