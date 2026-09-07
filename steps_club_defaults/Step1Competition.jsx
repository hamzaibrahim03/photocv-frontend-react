import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import '../src/App.css'
import NavigationRoute from '../src/club_admin/NavigationRoute';
import HeaderRoute from '../src/club_admin/HeaderRoute';
import Loader from '../src/React/extra/LoaderAll';
import Calendar from '../src/React/extra/CalendarRyton';
import apiClient from '../src/api/axios';
function ResultToggle({ label, checked, onChange }) {
    return (
        <div className="result-row">
            <span>{label}</span>
            <button type="button" className={`small-switch ${checked ? "active" : ""}`} onClick={onChange} aria-label={`Toggle ${label}`}>
                <span></span>
            </button>
        </div>
    );
}
function Step1Competition() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
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
        number_of_reminders: '',
        result_announcement_date: '',
        result_announcement_method_id: '',
        top_places: '',
        high_commendation_number: '',
        commendation_number: '',
        prizes: '',
        points_1st_place: '',
        points_2nd_place: '',
        points_3rd_place: '',
        points_high_commendation: '',
        points_commendation: '',
        points_entry: '',
        comments_enabled: false,
        certificates_enabled: false,
        judge_feedback_visible: false
    });
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    useEffect(() => {
        if (id) {
            /* 
            apiClient.get(`/competitions/${id}`).then(res => {
                setFormData(res.data.data);
            });
            */
        }
    }, [id]);
    const submitForm = async (e) => {
        const payload = {
            ...formData,
            result_options: {
                photographer_name: results.photographerName,
                comments: results.comments,
                scores: results.scores,
                position: results.position,
                reels: results.reels,
                arrows: results.arrows,
            },
            submission_reminders: {
                enabled: reminderEnabled,
                reminders: reminders.map((item) => ({
                    id: item.id,
                    enabled: item.checked,
                    days_before_deadline: item.days,
                })),
            },
        };
        console.log("Final payload:", payload);
        e.preventDefault();
        try {
            if (id) {
                await apiClient.put(`/competitions/${id}`, formData);
            } else {
                await apiClient.post(`/competitions`, formData);
            }
            alert("Competition saved successfully!");
            navigate("/competitions");
        } catch (error) {
            console.error("Error submitting competition:", error);
        }
    };
    const [results, setResults] = useState({
        photographerName: true,
        comments: true,
        scores: true,
        position: true,
        reels: true,
        arrows: true,
    });
    const [reminderEnabled, setReminderEnabled] = useState(true);
    const [reminders, setReminders] = useState([]);
    const toggleResult = (key) => {
        setResults((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    const toggleReminder = (id) => {
        setReminders((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, checked: !item.checked }
                    : item
            )
        );
    };
    const changeDays = (id, value) => {
        setReminders((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, days: value }
                    : item
            )
        );
    };
    const handleReminderCountChange = (e) => {
        let count = Number(e.target.value);
        if (count < 0) count = 0;
        // optional maximum limit
        if (count > 20) count = 20;
        setFormData((prev) => ({
            ...prev,
            number_of_reminders: count,
        }));
        setReminders((prev) => {
            // agar rows increase hongi
            if (count > prev.length) {
                const newReminders = [...prev];
                for (let i = prev.length + 1; i <= count; i++) {
                    newReminders.push({
                        id: i,
                        days: "",
                        checked: true,
                    });
                }
                return newReminders;
            }
            // agar rows decrease hongi
            return prev.slice(0, count);
        });
    };
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <section>
                            <div className="container px-0 mx-auto" style={{ maxWidth: '1810px' }}>
                                <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3 w-100">
                                    <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting text-muted fs-6">Planned and Regular Club Competition</small>
                                                <h2 className="name m-0 text-dark head fs-3">2024 - 2025 Season</h2>
                                                <small className="role text-danger fs-6">Any values selected here would become default for new competition  entry</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-section d-flex gap-4" style={{ width: '32%' }}>
                                        <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                            <small className="ca-details fs-5">Competitions</small>
                                            <h3 className="number mt-4 fw-medium" style={{ fontSize: '48px' }}>0</h3>
                                        </div>
                                        <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                            <small className="ca-details fs-5">Next Competition</small>
                                            <div className="row mt-4 align-items-center">
                                                <div className="col-md-5">
                                                    <h3 className="number m-0 fw-medium" style={{ fontSize: '48px' }}>0</h3>
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
                                        <div>
                                            <h5 className="head">Basic Information</h5>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Competition Type</label>
                                                    <select name="competition_type_id" value={formData.competition_type_id} onChange={handleChange} className="form-select">
                                                        <option value="" disabled>Select Competition Type</option>
                                                        <option value="1">Club Competition</option>
                                                        <option value="2">Salon Competition</option>
                                                        <option value="3">National Competition</option>
                                                        <option value="4">International Competition</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted">Judging Type</label>
                                                    <select name="judging_type_id" value={formData.judging_type_id} onChange={handleChange} className="form-select">
                                                        <option value="" disabled>Select Judging Type</option>
                                                        <option value="1">Accept/Reject</option>
                                                        <option value="2">Score</option>
                                                        <option value="3">Accept/Reject + Score</option>
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
                                                                <div className="premium-radio">
                                                                    <input type="radio" name="status" value={s} checked={formData.status === s} onChange={handleChange} />
                                                                    <label htmlFor={s}>
                                                                        <div className="premium-radio-circle"></div>
                                                                        <div className="premium-radio-content">
                                                                            <div className="premium-radio-title">
                                                                                {s}
                                                                            </div>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="row">
                                                        {['cancelled', 'completed'].map(s => (
                                                            <div className="col-md-6" key={s}>
                                                                <div className="premium-radio">
                                                                    <input type="radio" name="status" value={s} checked={formData.status === s} onChange={handleChange} />
                                                                    <label htmlFor={s}>
                                                                        <div className="premium-radio-circle"></div>
                                                                        <div className="premium-radio-content">
                                                                            <div className="premium-radio-title">
                                                                                {s}
                                                                            </div>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <h5 className="head">Submission Rules</h5>
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
                                        <h5 className="head">Categories and Themes</h5>
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
                                        <h5 className="head">Judging and Scoring</h5>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">Voting Method</label>
                                                <select name="voting_method_id" value={formData.voting_method_id} onChange={handleChange} className="form-select">
                                                    <option value="" disabled>Select Voting Method</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">Number of Reminders</label>
                                                <input type="number" name="number_of_reminders" min="0" max="20" value={formData.number_of_reminders} onChange={handleReminderCountChange} className="form-control" placeholder="Enter number of reminders" />
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <h5 className="head">Results & Awards</h5>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">Voting Method</label>
                                                <select name="voting_method_id" value={formData.voting_method_id} onChange={handleChange} className="form-select">
                                                    <option value="" disabled>Select Voting Method</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">Result Announcement Method</label>
                                                <select name="result_announcement_method_id" value={formData.result_announcement_method_id} onChange={handleChange} className="form-select">
                                                    <option value="" disabled>Select Result Announcement Method</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                </select>
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
                                                <label className="form-label text-muted">Awards - Top Places Available</label>
                                                <input type="text" name="top_places" value={formData.top_places} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <h5 className="head">Points Per Award</h5>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">Points for 1st Place</label>
                                                <input type="number" name="points_1st_place" value={formData.points_1st_place} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">Points for 2nd Place</label>
                                                <input type="number" name="points_2nd_place" value={formData.points_2nd_place} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">Points for 3rd Place</label>
                                                <input type="number" name="points_3rd_place" value={formData.points_3rd_place} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">Points for High Commendation</label>
                                                <input type="number" name="points_high_commendation" value={formData.points_high_commendation} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">Points for Commendation</label>
                                                <input type="number" name="points_commendation" value={formData.points_commendation} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">Points for Entry</label>
                                                <input type="number" name="points_entry" value={formData.points_entry} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="head">Result Options</h5>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <small className="text-muted">
                                                        Enable/Disable data to show on results
                                                    </small>
                                                </div>
                                                <div className='col-md-6'>
                                                    <small className="text-muted">
                                                        Choose when and where to announce the results
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <ResultToggle label="Photographer Name" checked={results.photographerName} onChange={() => toggleResult("photographerName")} />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <ResultToggle label="Comments" checked={results.comments} onChange={() => toggleResult("comments")} />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <ResultToggle label="Scores" checked={results.scores} onChange={() => toggleResult("scores")} />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <ResultToggle label="Position" checked={results.position} onChange={() => toggleResult("position")} />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <ResultToggle label="Reels" checked={results.reels} onChange={() => toggleResult("reels")} />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <ResultToggle label="Arrows" checked={results.arrows} onChange={() => toggleResult("arrows")} />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="head">Submission Reminders</h5>
                                            <small className="text-muted">
                                                Notify club members about upcoming competition
                                                submission deadlines
                                            </small>
                                            <div className="reminder-status">
                                                <label className="form-label">Reminder</label>
                                                <div className="row">
                                                    <div className="premium-radio-group">
                                                        {/* Enable */}
                                                        <div className="premium-radio">
                                                            <input type="radio" id="enable" name="reminder-status" value="enable" checked={reminderEnabled} onChange={() => setReminderEnabled(true)} />
                                                            <label htmlFor="enable">
                                                                <div className="premium-radio-circle"></div>
                                                                <div className="premium-radio-content">
                                                                    <div className="premium-radio-title">
                                                                        Enable
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </div>
                                                        {/* Disable */}
                                                        <div className="premium-radio">
                                                            <input type="radio" id="disable" name="reminder-status" value="disable" checked={!reminderEnabled} onChange={() => setReminderEnabled(false)} />
                                                            <label htmlFor="disable">
                                                                <div className="premium-radio-circle"></div>
                                                                <div className="premium-radio-content">
                                                                    <div className="premium-radio-title">
                                                                        Disable
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {reminderEnabled && (
                                                <div className="reminders-list">
                                                    {reminders.map((reminder) => (
                                                        <div className="reminder-row" key={reminder.id}>
                                                            <label className="reminder-checkbox">
                                                                <input type="checkbox" checked={reminder.checked} onChange={() => toggleReminder(reminder.id)} />
                                                                <span className="custom-checkbox">
                                                                    {reminder.checked && (
                                                                        <i className="fa-solid fa-check"></i>
                                                                    )}
                                                                </span>
                                                            </label>
                                                            <span className="reminder-name">
                                                                Reminder {reminder.id}
                                                            </span>
                                                            <input type="number" min="0" className="days-input" value={reminder.days} onChange={(e) => changeDays(reminder.id, Number(e.target.value))} />
                                                            <span className="days-label">days before deadline</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <h5 className="head">Additional Features</h5>
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
                                                    <div className="event-item" style={{ marginBottom: '10px' }}>
                                                        <img className="img-fluid event-img" alt="Event" />
                                                        <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                        </div>
                                                        <div className="event-details" style={{ display: 'flex' }}>
                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span id="ename">member_username</span>
                                                                <span id="espeaker"> competition_name</span>
                                                            </div>
                                                            <div className="event-time" id="edate">
                                                                <small className="event-date galtext">formatDate(co.submitted_at)</small><br />
                                                                <small className="event-time-details galtext">formatTime(co.submitted_at)</small>
                                                            </div>
                                                        </div>
                                                    </div>
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
                                                    <div className="event-item" style={{ marginBottom: '10px' }}>
                                                        <img className="img-fluid event-img" alt="Comp" />
                                                        <div className="event-img fallback-box d-flex justify-content-center align-items-center">
                                                        </div>
                                                        <div className="event-details">
                                                            <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span id="ename">name</span>
                                                            </div>
                                                            <div className="event-time" id="edate">
                                                                <small className="event-date galtext">formatDate(start_date)</small><br />
                                                                <small className="event-time-details galtext">formatTime(start_date)</small>
                                                            </div>
                                                        </div>
                                                    </div>
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
                    </>
                )
                }
            </div>
        </>
    )
}
export default Step1Competition;
