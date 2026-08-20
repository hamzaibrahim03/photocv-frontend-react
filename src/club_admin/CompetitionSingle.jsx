import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import NavigationRoute from '../../components/NavigationRoute';
import HeaderRoute from '../../components/HeaderRoute';
import CalendarDashboard from '../../components/club_admin/Calendars/CalendarDashboard';
import ProfileWithoutSearch from '../../partials/club_admin/competitionsadd/ProfileWithoutSearch';
import RecentSubmissions from '../../partials/club_admin/competitions/RecentSubmissions';
import MoreCompetitions from '../../partials/club_admin/competitions/MoreCompetitions';

const CompetitionSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock store
    const [memberCount, setMemberCount] = useState(50);
    const [eventDay, setEventDay] = useState(12);

    const [competition, setCompetition] = useState({});

    useEffect(() => {
        // Fetch competition data using id
        if (id) {
            setCompetition({
                name: 'Annual Contest',
                competition_type_id: 1,
                description: '<b>Yearly big contest</b>',
                judging_type_id: 2,
                status: 'scheduled',
                start_date: '2024-05-01T08:00:00Z',
                submission_deadline: '2024-06-01T23:59:59Z',
                result_announcement_date: '2024-06-15T12:00:00Z',
                max_entries_print: 3,
                allowed_image_formats: 'JPEG, PNG',
                max_file_size: 5,
                theme_id: 10,
                category_id: 2,
                print_vs_digital: 'digital',
                color_vs_mono: 'color',
                judging_panel: '3 Judges',
                voting_method_id: 1,
                top_places: 3,
                high_commendation_number: 10,
                commendation_number: 20,
                prizes: 'Cash and Certificates'
            });
        }
    }, [id]);

    const formattedStartDate = useMemo(() => {
        if (!competition.start_date) return '';
        return new Date(competition.start_date).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    }, [competition.start_date]);

    const formattedEndDate = useMemo(() => {
        if (!competition.submission_deadline) return '';
        return new Date(competition.submission_deadline).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    }, [competition.submission_deadline]);

    const formattedResultDate = useMemo(() => {
        if (!competition.result_announcement_date) return '';
        return new Date(competition.result_announcement_date).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    }, [competition.result_announcement_date]);

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Competitions" />
            <div className="content" style={{ padding: '0 30px' }}>
                <section>
                    <div className="container px-0 mx-auto" style={{ maxWidth: '1810px' }}>
                        <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3 w-100">
                            <ProfileWithoutSearch greeting="Planned and regular club competition" name="2024 - 2025 Season" role="Add new Competition" />

                            <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                    <small className="ca-details fs-5">Competitions</small>
                                    <h3 className="number mt-4 fw-medium" style={{ fontSize: '48px' }}>{memberCount}</h3>
                                </div>
                                <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                    <small className="ca-details fs-5">Next Competition</small>
                                    <div className="row mt-4 align-items-center">
                                        <div className="col-md-5">
                                            <h3 className="number m-0 fw-medium" style={{ fontSize: '48px' }}>{eventDay}</h3>
                                        </div>
                                        <div className="days col-md-7 text-start">
                                            <span>days to go</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="row container mx-auto px-0" style={{ maxWidth: '1810px' }}>
                    <div className="col-md-8 px-0">
                        <section className="bg-white p-4 rounded shadow-sm">
                            <div id="news" className="w-100">

                                <h5 className="fw-bold mb-4">Basic Information</h5>
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

                                <h5 className="fw-bold mb-4 mt-5">Submission Rules</h5>
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Start Date & Time</label>
                                        <h2 className="text-dark fs-5 fw-normal">{formattedStartDate}</h2>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Deadlines for Submissions</label>
                                        <h2 className="text-dark fs-5 fw-normal">{formattedEndDate}</h2>
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
                                        <h2 className="text-dark fs-5 fw-normal">{competition.max_file_size}</h2>
                                    </div>
                                </div>

                                <h5 className="fw-bold mb-4 mt-5">Categories and Themes</h5>
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

                                <h5 className="fw-bold mb-4 mt-5">Judging and Scoring</h5>
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

                                <h5 className="fw-bold mb-4 mt-5">Results & Awards</h5>
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="text-danger mb-1 d-block" style={{ fontSize: '18px' }}>Announcement Date</label>
                                        <h2 className="text-dark fs-5 fw-normal">{formattedResultDate}</h2>
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

                                <h5 className="fw-bold mb-4 mt-5">Additional Features</h5>
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
                                    <button className="btn text-white px-4" style={{ backgroundColor: '#99816b' }} onClick={() => navigate(-1)}>Back</button>
                                    <button className="btn text-white px-4" style={{ backgroundColor: '#4c4036' }}>Edit</button>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="col-md-4 px-3">
                        <section className="d-flex flex-column gap-4">
                            <div className="bg-white rounded shadow-sm">
                                <CalendarDashboard />
                            </div>
                            <div className="d-flex flex-column gap-4 text-center">
                                <RecentSubmissions />
                                <MoreCompetitions />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompetitionSingle;
