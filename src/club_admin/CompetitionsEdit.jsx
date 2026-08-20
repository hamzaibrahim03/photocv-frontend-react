import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import NavigationRoute from '../../components/NavigationRoute';
import HeaderRoute from '../../components/HeaderRoute';
import CalendarDashboard from '../../components/club_admin/Calendars/CalendarDashboard';
import RecentSubmissions from '../../partials/club_admin/competitions/RecentSubmissions';
import MoreCompetitions from '../../partials/club_admin/competitions/MoreCompetitions';
import GlobalSettings from '../../partials/club_admin/competitionsadd/GlobalSettings';

// Mock API
import apiClient from '../../api/axios';

const CompetitionsEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [memberCount, setMemberCount] = useState(50);
    const [competitionCount, setCompetitionCount] = useState(5);
    const [eventDay, setEventDay] = useState(12);

    const [formData, setFormData] = useState({
        name: '',
        competition_type_id: '',
        description: '',
        judging_type_id: '',
        status: '',
        start_date: '',
        submission_deadline: '',
        max_entries_digital: '',
        max_entries_print: '',
        max_file_size: '',
        allowed_image_formats: '',
        theme_id: '',
        category_id: '',
        print_vs_digital: '',
        color_vs_mono: '',
        judging_panel: '',
        voting_method_id: '',
        result_announcement_date: '',
        top_places: '',
        high_commendation_number: '',
        commendation_number: '',
        prizes: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    useEffect(() => {
        if (id) {
            // Mock fetch
            /* 
            apiClient.get(`/competitions/${id}`).then(res => {
                setFormData(res.data.data);
            });
            */
        }
    }, [id]);

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                // await apiClient.put(`/competitions/${id}`, formData);
            } else {
                // await apiClient.post(`/competitions`, formData);
            }
            alert("Competition saved successfully!");
            navigate("/competitions");
        } catch (error) {
            console.error("Error submitting competition:", error);
        }
    };

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Competitions" />
            <div className="content" style={{ padding: '0 30px' }}>
                <section>
                    <div className="container px-0 mx-auto" style={{ maxWidth: '1810px' }}>
                        <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3 w-100">
                            <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                                <div className="profile-left">
                                    <div className="profile-info">
                                        <small className="greeting text-muted fs-6">Planned and Regular Club Competition</small>
                                        <h2 className="name m-0 text-dark fw-bold fs-3">2024 - 2025 Season</h2>
                                        <small className="role text-danger fs-6">{competitionCount} Competitions to go</small>
                                    </div>
                                </div>
                            </div>
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
                        <div className="bg-white p-4 rounded shadow-sm">
                            <form onSubmit={submitForm}>
                                <h5 className="fw-bold mb-4">Basic Information</h5>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Competition Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Competition Type</label>
                                        <input type="number" name="competition_type_id" value={formData.competition_type_id} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <label className="form-label text-muted">Competition Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="form-control mb-3" style={{ height: '250px', resize: 'none' }}></textarea>
                                <hr className="text-light my-4" />

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Judging Type</label>
                                        <select name="judging_type_id" value={formData.judging_type_id} onChange={handleChange} className="form-select">
                                            <option value=""></option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Assign Judge</label>
                                        <select className="form-select">
                                            <option value=""></option>
                                            <option value="Ammar">Ammar</option>
                                            <option value="Sohaib">Sohaib</option>
                                            <option value="Kamran">Kamran</option>
                                            <option value="Sarfraz">Sarfraz</option>
                                        </select>
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <label className="form-label text-muted mb-3 d-block">Status</label>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <div className="row">
                                            {['scheduled', 'draft', 'postponed'].map(s => (
                                                <div className="col-md-4" key={s}>
                                                    <div className="form-check p-0 d-flex align-items-center gap-2 border rounded p-2">
                                                        <input type="radio" name="status" value={s} checked={formData.status === s} onChange={handleChange} className="form-check-input m-0 ms-2" />
                                                        <span className="text-capitalize">{s}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            {['cancelled', 'completed'].map(s => (
                                                <div className="col-md-6" key={s}>
                                                    <div className="form-check p-0 d-flex align-items-center gap-2 border rounded p-2">
                                                        <input type="radio" name="status" value={s} checked={formData.status === s} onChange={handleChange} className="form-check-input m-0 ms-2" />
                                                        <span className="text-capitalize">{s}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <h5 className="fw-bold mb-4">Submission Rules</h5>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Start Date & Time</label>
                                        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Deadlines for Submissions</label>
                                        <input type="date" name="submission_deadline" value={formData.submission_deadline} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Max Number of PDI Entries Per Participant</label>
                                        <input type="number" name="max_entries_digital" value={formData.max_entries_digital} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Max Number of PRINT Per Participant</label>
                                        <input type="number" name="max_entries_print" value={formData.max_entries_print} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Max File Size</label>
                                        <input type="number" name="max_file_size" value={formData.max_file_size} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Allowed Image Formats</label>
                                        <select name="allowed_image_formats" value={formData.allowed_image_formats} onChange={handleChange} className="form-select">
                                            <option value="" disabled>Allowed Image Formats</option>
                                            <option value="active">Active</option>
                                            <option value="enable">Enable</option>
                                            <option value="diactive">Diactive</option>
                                            <option value="disable">Disable</option>
                                        </select>
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <h5 className="fw-bold mb-4">Categories and Themes</h5>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Theme (If applicable)</label>
                                        <input type="number" name="theme_id" value={formData.theme_id} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Competition Categories</label>
                                        <input type="number" name="category_id" value={formData.category_id} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Print vs Digital Submission</label>
                                        <select name="print_vs_digital" value={formData.print_vs_digital} onChange={handleChange} className="form-select">
                                            <option value="" disabled>print_vs_digital</option>
                                            <option value="print">Print</option>
                                            <option value="digital">Digital</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Colour vs. Monochrome</label>
                                        <select name="color_vs_mono" value={formData.color_vs_mono} onChange={handleChange} className="form-select">
                                            <option value="" disabled>color_vs_mono</option>
                                            <option value="color">Color</option>
                                            <option value="monochrome">Monochrome</option>
                                        </select>
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <h5 className="fw-bold mb-4">Judging and Scoring</h5>
                                <label className="form-label text-muted">Judging Panels</label>
                                <textarea name="judging_panel" value={formData.judging_panel} onChange={handleChange} className="form-control mb-3"></textarea>
                                <hr className="text-light my-4" />

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Voting Method</label>
                                        <input type="number" name="voting_method_id" value={formData.voting_method_id} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <h5 className="fw-bold mb-4">Results & Awards</h5>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Announcement Date</label>
                                        <input type="date" name="result_announcement_date" value={formData.result_announcement_date} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Awards - Top Places Available</label>
                                        <input type="text" name="top_places" value={formData.top_places} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Award - No. of High Commendations Available</label>
                                        <input type="number" name="high_commendation_number" value={formData.high_commendation_number} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Awards - Number of Commendations Available</label>
                                        <input type="number" name="commendation_number" value={formData.commendation_number} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Prizes (if any)</label>
                                        <textarea name="prizes" value={formData.prizes} onChange={handleChange} className="form-control"></textarea>
                                    </div>
                                </div>
                                <hr className="text-light my-4" />

                                <h5 className="fw-bold mb-4">Additional Features</h5>
                                <div className="d-flex flex-column gap-2 mb-4">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input shadow-none" id="feature1" />
                                        <label className="form-check-label" htmlFor="feature1">Comments & Critique Section (For Consecutive Purpose)</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input shadow-none" id="feature2" />
                                        <label className="form-check-label" htmlFor="feature2">Auto generated Certificates (For Winners & Participants)</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input shadow-none" id="feature3" />
                                        <label className="form-check-label" htmlFor="feature3">Allow Feedback from the judges to be visible to participants</label>
                                    </div>
                                </div>

                                <div className="button-group d-flex gap-2">
                                    <button type="button" className="btn text-white px-4" style={{ backgroundColor: '#99816b' }} onClick={() => navigate(-1)}>Back</button>
                                    <button type="submit" className="btn text-white px-4" style={{ backgroundColor: '#4c4036' }}>Save</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-4 px-3">
                        <section className="d-flex flex-column gap-4">
                            <div className="bg-white rounded shadow-sm">
                                <CalendarDashboard />
                            </div>
                            <div className="d-flex flex-column gap-4 text-center">
                                <RecentSubmissions />
                                <MoreCompetitions />
                                <GlobalSettings />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompetitionsEdit;
