import React, { useState, useEffect, useMemo } from 'react';
import HeaderRoute from "./HeaderRoute"
import NavigationRoute from "./NavigationRoute"
import Loader from "../React/extra/LoaderAll";
import Calendar from "../React/extra/CalendarRyton"
import { useNavigate, useParams } from 'react-router';
function CompetitionSingle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [competition, setCompetition] = useState(null);
    const [competitionExtra, setCompetitionExtra] = useState({});
    const [error, setError] = useState("");
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    useEffect(() => {
        getCompetitionExtra();
    }, []);
    const getCompetitionData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const url = `http://rytonlocal-staging.cameraclub.website:8000/api/v1/competitions/${id}`;
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                throw new Error(
                    `Failed to load competition. Status: ${response.status}`
                );
            }
            const data = await response.json();
            console.log("COMPETITION API RESPONSE:", data);
            setCompetition(data?.data || null);
        } catch (error) {
            console.error("COMPETITION API ERROR:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
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
    useEffect(() => {
        if (id) {
            getCompetitionData();
        }
    }, [id]);
    // const formattedStartDate = useMemo(() => {
    //     if (!competition.start_date) return '';
    //     return new Date(competition.start_date).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    // }, [competition.start_date]);
    // const formattedEndDate = useMemo(() => {
    //     if (!competition.submission_deadline) return '';
    //     return new Date(competition.submission_deadline).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    // }, [competition.submission_deadline]);
    // const formattedResultDate = useMemo(() => {
    //     if (!competition.result_announcement_date) return '';
    //     return new Date(competition.result_announcement_date).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    // }, [competition.result_announcement_date]);
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
    const formatTimes = (datetimeStr) => {
        const date = new Date(datetimeStr);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    if (!isLoading && error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h5>Unable to load competition</h5>
                    <p className="mb-0">
                        {error}
                    </p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }
    if (!isLoading && !competition) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">
                    Competition not found.
                </div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }
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
                                <div className="container px-0 mx-auto" style={{ maxWidth: '1810px' }}>
                                    <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3 w-100">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <div className="profile-info">
                                                    <small className="greeting">Planned and regular club competition</small>
                                                    <h2 className="name">2024 - 2025 Season</h2>
                                                    <small className="role">Add new Competition</small>
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
                            <div className="row container mx-auto px-0" style={{ maxWidth: '1810px' }}>
                                <div className="col-md-8 px-0">
                                    <section className="bg-white p-4 rounded shadow-sm">
                                        <div id="news" className="w-100">
                                            <h5 className="head mb-4">Basic Information</h5>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Competition Name</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.name}</h2>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Competition Type</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.competition_type_id}</h2>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Competition Description</label>
                                                <div className="text-dark fs-5 fw-normal" dangerouslySetInnerHTML={{ __html: competition.description }}></div>
                                            </div>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Judging Type</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.judging_type_id}</h2>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Status</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.status}</h2>
                                                </div>
                                            </div>
                                            <h5 className="head mb-4 mt-5">Submission Rules</h5>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Start Date & Time</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{formatDate(competition.start_date)} {formatTimes(competition.start_date)}</h2>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Deadlines for Submissions</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{formatDate(competition.submission_deadline)} {formatTimes(competition.submission_deadline)}</h2>
                                                </div>
                                            </div>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Max Number of Entries Per Participant</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.max_entries_print}</h2>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Allowed Image Formats</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.allowed_image_formats}</h2>
                                                </div>
                                            </div>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Max File Size</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.max_file_size} MB/Image</h2>
                                                </div>
                                            </div>
                                            <h5 className="head mb-4 mt-5">Categories and Themes</h5>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Theme (If applicable)</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.theme_id}</h2>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Competition Categories</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.category_id}</h2>
                                                </div>
                                            </div>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Print vs Digital Submission</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.print_vs_digital}</h2>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Colour vs. Monochrome</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.color_vs_mono}</h2>
                                                </div>
                                            </div>
                                            <h5 className="head mb-4 mt-5">Judging and Scoring</h5>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Judging Panels</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.judging_panel}</h2>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Voting Method</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.voting_method_id}</h2>
                                                </div>
                                            </div>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Judging Start Date & Time</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{formatDate(competition.judging_start_date)} {formatTimes(competition.judging_start_date)}</h2>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Judging End Date & Time</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{formatDate(competition.judging_end_date)} {formatTimes(competition.judging_end_date)}</h2>
                                                </div>
                                            </div>
                                            <h5 className="head mb-4 mt-5">Results & Awards</h5>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Announcement Date</label>
                                                    {/* <h2 className="text-dark fs-5 fw-normal">{formattedResultDate}</h2> */}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Awards - Top Places Available</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.top_places}</h2>
                                                </div>
                                            </div>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Award - No of High Comm. Available</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.high_commendation_number}</h2>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Awards - No of Comm. Available</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.commendation_number}</h2>
                                                </div>
                                            </div>
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Prizes (if any)</label>
                                                    <h2 className="text-dark fs-5 fw-normal">{competition.prizes}</h2>
                                                </div>
                                            </div>
                                            <h5 className="head mb-4 mt-5">Additional Features</h5>
                                            <div className="d-flex flex-column gap-3 mb-5">
                                                <h2 className="text-dark fs-6 fw-normal m-0 d-flex align-items-center gap-2">
                                                    <input type="checkbox" className="form-check-input mt-0" />
                                                    Comments & Critique Section (For Consecutive Purpose)
                                                </h2>
                                                <h2 className="text-dark fs-6 fw-normal m-0 d-flex align-items-center gap-2">
                                                    <input type="checkbox" className="form-check-input mt-0" />
                                                    Auto generated Certificates (For Winners & Participants)
                                                </h2>
                                                <h2 className="text-dark fs-6 fw-normal m-0 d-flex align-items-center gap-2">
                                                    <input type="checkbox" className="form-check-input mt-0" />
                                                    Allow Feedback from the judges to be visible to participants
                                                </h2>
                                            </div>
                                            <div className="button-group d-flex gap-2">
                                                <button className="btn text-white px-4" id="e-view" style={{ backgroundColor: '#99816b' }} onClick={() => navigate(-1)}>Back</button>
                                                <button className="btn text-white px-4" id="e-edit" style={{ backgroundColor: '#4c4036' }} onClick={() => navigate(`/competitions/${competition.id}/edit`)}>Edit</button>
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
                                                    <div className="event-list">
                                                        {competitionExtra?.recent_submissions?.map((submission) => (
                                                            <div className="event-item" key={submission.id} style={{ marginBottom: '10px' }}>
                                                                {submission.entry_image ? (
                                                                    <img className="img-fluid event-img" src={submission.entry_image} alt="Event" />
                                                                ) : (
                                                                    <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                    </div>
                                                                )}
                                                                <div className="event-details" style={{ display: 'flex' }}>
                                                                    <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                        <span id="ename">{submission.member_username}</span>
                                                                        <span id="espeaker">{submission.competition_name}</span>
                                                                    </div>
                                                                    <div className="event-time" id="edate">
                                                                        <small className="event-date galtext">{formatDate(submission.submitted_at)}</small><br />
                                                                        <small className="event-time-details galtext">{formatTime(submission.submitted_at)}</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="button-group mt-auto">
                                                        <button className="btn btn-sm" id="e-view">
                                                            View All
                                                        </button>
                                                        <button className="btn btn-sm" id="new">
                                                            Add New
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="more-card d-flex flex-column" style={{ padding: '35px' }}>
                                                    <h5 className="head">More Competitions</h5>
                                                    <div className="event-list">
                                                        {competitionExtra?.random_competitions?.map((competition) => (
                                                            <div className="event-item" style={{ marginBottom: '10px' }}>
                                                                {competition.featured_thumb_url ? (
                                                                    <img className="img-fluid event-img" src={competition.featured_thumb_url} alt="Comp" />
                                                                ) : (
                                                                    <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                                    </div>
                                                                )}
                                                                <div className="event-details">
                                                                    <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                        <span id="ename">{competition.name}</span>
                                                                    </div>
                                                                    <div className="event-time" id="edate">
                                                                        <small className="event-date galtext">{formatDate(competition.start_date)}</small><br />
                                                                        <small className="event-time-details galtext">{formatTime(competition.start_date)}</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="button-group mt-auto">
                                                        <button className="btn btn-sm" id="e-view">
                                                            View All
                                                        </button>
                                                        <button className="btn btn-sm" id="new">
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
                    </>
                )}
            </div>
        </>
    );
};
export default CompetitionSingle;
