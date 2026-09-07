import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import HeaderRoute from "./HeaderRoute";
import NavigationRoute from "./NavigationRoute";
import Loader from "../React/extra/LoaderAll";
import Calendar from "../React/extra/CalendarRyton";
import apiClient from '../api/axios';
const initialFormData = {
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
    judging_start_date: '',
    judging_end_date: '',
    result_announcement_date: '',
    top_places: '',
    high_commendation_number: '',
    commendation_number: '',
    prizes: '',
    comments_and_critique: false,
    auto_generate_certificates: false,
    visible_judges_feedback: false,
};
function CompetitionsEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [competitionExtra, setCompetitionExtra] = useState({});
    const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        if (Number.isNaN(d.getTime())) {
            return '';
        }
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const formatDateTimeForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        if (Number.isNaN(d.getTime())) {
            return '';
        }
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked
        } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    useEffect(() => {
        loadPage();
    }, [id]);
    useEffect(() => {
        getCompetitionExtra();
    }, []);
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
    const loadPage = async () => {
        setIsLoading(true);
        try {
            if (isEditMode) {
                const response = await apiClient.get(`/competitions/${id}`);
                console.log('Competition API:', response.data);
                const competition = response.data?.data || response.data;
                setFormData({
                    name: competition.name || '',
                    competition_type_id: competition.competition_type_id || '',
                    description: competition.description || '',
                    judging_type_id: competition.judging_type_id || '',
                    status: competition.status || '',
                    start_date: formatDateTimeForInput(
                        competition.start_date
                    ),
                    submission_deadline: formatDateTimeForInput(
                        competition.submission_deadline
                    ),
                    max_entries_digital:
                        competition.max_entries_digital ?? '',
                    max_entries_print:
                        competition.max_entries_print ?? '',
                    max_file_size:
                        competition.max_file_size ?? '',
                    allowed_image_formats:
                        competition.allowed_image_formats || '',
                    theme_id:
                        competition.theme_id ?? '',
                    category_id:
                        competition.category_id ?? '',
                    print_vs_digital:
                        competition.print_vs_digital || '',
                    color_vs_mono:
                        competition.color_vs_mono || '',
                    judging_panel:
                        competition.judging_panel || '',
                    voting_method_id:
                        competition.voting_method_id ?? '',
                    judging_start_date:
                        formatDateTimeForInput(
                            competition.judging_start_date
                        ),
                    judging_end_date:
                        formatDateTimeForInput(
                            competition.judging_end_date
                        ),
                    result_announcement_date:
                        formatDateTimeForInput(
                            competition.result_announcement_date
                        ),
                    top_places:
                        competition.top_places ?? '',
                    high_commendation_number:
                        competition.high_commendation_number ?? '',
                    commendation_number:
                        competition.commendation_number ?? '',
                    prizes:
                        competition.prizes || '',
                    comments_and_critique:
                        Boolean(competition.comments_and_critique),
                    auto_generate_certificates:
                        Boolean(competition.auto_generate_certificates),
                    visible_judges_feedback:
                        Boolean(competition.visible_judges_feedback),
                });
            }
            else {
                setFormData(initialFormData);
            }
        } catch (error) {
            console.error(
                'Error loading competition:',
                error
            );
            if (isEditMode) {
                alert('Unable to load competition.');
            }
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
    const submitForm = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                competition_type_id:
                    formData.competition_type_id
                        ? Number(formData.competition_type_id)
                        : null,
                judging_type_id:
                    formData.judging_type_id
                        ? Number(formData.judging_type_id)
                        : null,
                max_entries_digital:
                    formData.max_entries_digital
                        ? Number(formData.max_entries_digital)
                        : null,
                max_entries_print:
                    formData.max_entries_print
                        ? Number(formData.max_entries_print)
                        : null,
                max_file_size:
                    formData.max_file_size
                        ? Number(formData.max_file_size)
                        : null,
                theme_id:
                    formData.theme_id
                        ? Number(formData.theme_id)
                        : null,
                category_id:
                    formData.category_id
                        ? Number(formData.category_id)
                        : null,
                voting_method_id:
                    formData.voting_method_id
                        ? Number(formData.voting_method_id)
                        : null,
                top_places:
                    formData.top_places
                        ? Number(formData.top_places)
                        : null,
                high_commendation_number:
                    formData.high_commendation_number
                        ? Number(formData.high_commendation_number)
                        : null,
                commendation_number:
                    formData.commendation_number
                        ? Number(formData.commendation_number)
                        : null,
            };
            console.log(
                isEditMode
                    ? 'UPDATE PAYLOAD:'
                    : 'CREATE PAYLOAD:',
                payload
            );
            if (isEditMode) {
                await apiClient.put(`/competitions/${id}`, payload);
                alert(
                    'Competition updated successfully!'
                );
            } else {
                await apiClient.post(`/competitions`, payload);
                alert(
                    'Competition created successfully!'
                );
            }
            navigate('/competitions');
        } catch (error) {
            console.error('Error saving competition:', error);
            console.log('API ERROR:', error.response?.data);
            alert(error.response?.data?.message || 'Unable to save competition.');
        } finally {
            setIsSaving(false);
        }
    };
    return (
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
                                    <div className="profile-card d-flex align-items-center justify-content-between bg-white shadow-sm p-4 rounded" style={{ width: '65.8%', height: '148px' }}>
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting text-muted fs-6">
                                                    Planned and Regular Club Competition
                                                </small>
                                                <h2 className="name m-0 text-dark head fs-3">
                                                    2024 - 2025 Season
                                                </h2>
                                                <small className="role text-danger fs-6">
                                                    {isEditMode
                                                        ? 'Edit Competition'
                                                        : 'Add New Competition'}
                                                </small>
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
                                <div className="bg-white p-4 rounded shadow-sm">
                                    <form onSubmit={submitForm}>
                                        <h5 className="head mb-4">
                                            Basic Information
                                        </h5>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Competition Name
                                                </label>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Competition Type
                                                </label>
                                                <input type="number" name="competition_type_id" value={formData.competition_type_id} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <label className="form-label text-muted">
                                            Competition Description
                                        </label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} className="form-control mb-3" style={{ height: '250px', resize: 'none' }} />
                                        <hr className="text-light my-4" />
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Judging Type
                                                </label>
                                                <select name="judging_type_id" value={formData.judging_type_id} onChange={handleChange} className="form-select">
                                                    <option value="">Select Judging Type</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Assign Judge
                                                </label>
                                                <select name="judge_id" value={formData.judge_id} onChange={handleChange} className="form-select">
                                                    <option value="">Select Judge</option>
                                                    <option value="Ammar">Ammar</option>
                                                    <option value="Sohaib">Sohaib</option>
                                                    <option value="Kamran">Kamran</option>
                                                    <option value="Sarfraz">Sarfraz</option>
                                                </select>
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <label className="form-label text-muted mb-3 d-block">
                                            Status
                                        </label>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="row mb-3">
                                                    {[
                                                        'scheduled',
                                                        'draft',
                                                        'postponed'
                                                    ].map(status => (
                                                        <div className="col-md-4 mb-2" key={status}>
                                                            <div className="premium-radio">
                                                                <input type="radio" id={`status-${status}`} name="status" value={status} checked={formData.status === status} onChange={handleChange} />
                                                                <label htmlFor={`status-${status}`}>
                                                                    <div className="premium-radio-circle"></div>
                                                                    <div className="premium-radio-content">
                                                                        <div className="premium-radio-title">
                                                                            {status}
                                                                        </div>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="row mb-3">
                                                    {[
                                                        'cancelled',
                                                        'completed'
                                                    ].map(status => (
                                                        <div className="col-md-6 mb-2" key={status}>
                                                            <div className="premium-radio">
                                                                <input type="radio" id={`status-${status}`} name="status" value={status} checked={formData.status === status} onChange={handleChange} />
                                                                <label htmlFor={`status-${status}`}>
                                                                    <div className="premium-radio-circle"></div>
                                                                    <div className="premium-radio-content">
                                                                        <div className="premium-radio-title">
                                                                            {status}
                                                                        </div>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <h5 className="head mb-4">
                                            Submission Rules
                                        </h5>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Start Date & Time
                                                </label>
                                                <input type="datetime-local" name="start_date" value={formData.start_date} onChange={handleChange} className="form-control" required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Deadlines for Submissions
                                                </label>
                                                <input type="datetime-local" name="submission_deadline" value={formData.submission_deadline} onChange={handleChange} className="form-control" required />
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Max Number of PDI Entries Per Participant
                                                </label>
                                                <input type="number" min="0" name="max_entries_digital" value={formData.max_entries_digital} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Max Number of PRINT Per Participant
                                                </label>
                                                <input type="number" min="0" name="max_entries_print" value={formData.max_entries_print} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Max File Size
                                                </label>
                                                <input type="number" min="0" name="max_file_size" value={formData.max_file_size} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Allowed Image Formats
                                                </label>
                                                <select name="allowed_image_formats" value={formData.allowed_image_formats} onChange={handleChange} className="form-select">
                                                    <option value="">Select Format</option>
                                                    <option value="JPEG">JPEG</option>
                                                    <option value="PNG">PNG</option>
                                                    <option value="JPEG, PNG">JPEG, PNG</option>
                                                    <option value="WEBP">WEBP</option>
                                                </select>
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <h5 className="head mb-4">
                                            Categories and Themes
                                        </h5>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Theme
                                                </label>
                                                <input type="number" name="theme_id" value={formData.theme_id} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Competition Categories
                                                </label>
                                                <input type="number" name="category_id" value={formData.category_id} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Print vs Digital Submission
                                                </label>
                                                <select name="print_vs_digital" value={formData.print_vs_digital} onChange={handleChange} className="form-select">
                                                    <option value="">Select</option>
                                                    <option value="print">Print</option>
                                                    <option value="digital">Digital</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Colour vs. Monochrome
                                                </label>
                                                <select name="color_vs_mono" value={formData.color_vs_mono} onChange={handleChange} className="form-select">
                                                    <option value="">Select</option>
                                                    <option value="color">Color</option>
                                                    <option value="monochrome">Monochrome</option>
                                                </select>
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <h5 className="head mb-4">
                                            Judging and Scoring
                                        </h5>
                                        <label className="form-label text-muted">
                                            Judging Panels
                                        </label>
                                        <textarea name="judging_panel" value={formData.judging_panel} onChange={handleChange} className="form-control mb-3" />
                                        <hr className="text-light my-4" />
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Voting Method
                                                </label>
                                                <input type="number" name="voting_method_id" value={formData.voting_method_id} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <h5 className="head mb-4">
                                            Results & Awards
                                        </h5>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Announcement Date
                                                </label>
                                                <input type="datetime-local" name="result_announcement_date" value={formData.result_announcement_date} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Awards - Top Places Available
                                                </label>
                                                <input type="number" name="top_places" value={formData.top_places} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    High Commendations
                                                </label>
                                                <input type="number" name="high_commendation_number" value={formData.high_commendation_number} onChange={handleChange} className="form-control" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Commendations
                                                </label>
                                                <input type="number" name="commendation_number" value={formData.commendation_number} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted">
                                                    Prizes
                                                </label>
                                                <textarea name="prizes" value={formData.prizes} onChange={handleChange} className="form-control" />
                                            </div>
                                        </div>
                                        <hr className="text-light my-4" />
                                        <h5 className="head mb-4">
                                            Additional Features
                                        </h5>
                                        <div className="d-flex flex-column gap-3 mb-4">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input shadow-none" id="feature1" name="comments_and_critique" checked={formData.comments_and_critique} onChange={handleChange} />
                                                <label className="form-check-label" htmlFor="feature1">
                                                    Comments & Critique Section
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input shadow-none" id="feature2" name="auto_generate_certificates" checked={formData.auto_generate_certificates} onChange={handleChange} />
                                                <label className="form-check-label" htmlFor="feature2">
                                                    Auto generated Certificates
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input shadow-none" id="feature3" name="visible_judges_feedback" checked={formData.visible_judges_feedback} onChange={handleChange} />
                                                <label className="form-check-label" htmlFor="feature3">
                                                    Allow Feedback from judges to be visible to participants
                                                </label>
                                            </div>
                                        </div>
                                        <div className="button-group d-flex gap-2">
                                            <button type="button" className="btn text-white px-4" style={{ backgroundColor: '#99816b' }} onClick={() => navigate(-1)}>
                                                Back
                                            </button>
                                            <button type="submit" className="btn text-white px-4" style={{ backgroundColor: '#4c4036' }} disabled={isSaving}>
                                                {isSaving ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
                                            </button>
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
    );
}
export default CompetitionsEdit;