import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
import Calendar from '../Ryton/extra/CalendarRyton';

function formatDateTime(value) {
    if (!value) return '—';
    const d = new Date(value);
    if (isNaN(d)) return '—';
    return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) + ' ' +
        d.toLocaleTimeString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

function Field({ label, value }) {
    return (
        <div className="col-md-6 mb-3">
            <div className="text-danger small fw-medium">{label}</div>
            <div>{value || '—'}</div>
        </div>
    );
}

function PhotographerCompSingle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [competition, setCompetition] = useState(null);
    const [daysToGo, setDaysToGo] = useState(null);
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [moreCompetitions, setMoreCompetitions] = useState([]);

    const [showEntryForm, setShowEntryForm] = useState(false);
    const [memberCompId, setMemberCompId] = useState(null);
    const [isJoining, setIsJoining] = useState(false);
    const [entryType, setEntryType] = useState('digital');
    const [stagedImages, setStagedImages] = useState([]);
    const [submittedEntries, setSubmittedEntries] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [entryError, setEntryError] = useState('');

    useEffect(() => {
        loadCompetition();
    }, [id]);

    async function loadCompetition() {
        setIsLoading(true);
        try {
            const response = await apiClient.get(`/member-admin/competition/${id}`);
            const data = response.data?.data || {};
            setCompetition(data.competition || null);
            setDaysToGo(data.daysUntilNextCompetition ?? null);
            setRecentSubmissions(Array.isArray(data.recentSubmissions) ? data.recentSubmissions : []);
            setMoreCompetitions(Array.isArray(data.moreCompetitions) ? data.moreCompetitions : []);
        } catch (error) {
            console.error('Error loading competition:', error);
            setCompetition(null);
        } finally {
            setIsLoading(false);
        }
    }

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return isNaN(d) ? '' : d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (datetimeStr) => {
        const date = new Date(datetimeStr);
        return date.toLocaleTimeString("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleEnterClick = async () => {
        setEntryError('');
        if (memberCompId) {
            setShowEntryForm(true);
            return;
        }
        setIsJoining(true);
        try {
            const response = await apiClient.post('/join-competition', { comp_id: Number(id) });
            const created = response.data?.data || response.data;
            setMemberCompId(created?.id);
            setShowEntryForm(true);
        } catch (error) {
            console.error('Error joining competition:', error);
            if (error.response?.status === 400) {
                try {
                    const joined = await apiClient.get('/get-joined-competition');
                    const list = joined.data?.data || joined.data || [];
                    const existing = (Array.isArray(list) ? list : []).find((c) => c.name === competition?.name);
                    if (existing?.competition_member_id) {
                        setMemberCompId(existing.competition_member_id);
                        setShowEntryForm(true);
                        return;
                    }
                } catch (lookupError) {
                    console.error('Error looking up existing entry:', lookupError);
                }
            }
            setEntryError(error.response?.data?.message || 'Unable to start entry for this competition.');
        } finally {
            setIsJoining(false);
        }
    };

    const handleFilesSelected = (fileList) => {
        const files = Array.from(fileList || []);
        files.forEach((file) => {
            const previewUrl = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                setStagedImages((prev) => prev.map((s) => (
                    s.previewUrl === previewUrl ? { ...s, width: img.naturalWidth, height: img.naturalHeight } : s
                )));
            };
            img.src = previewUrl;
            setStagedImages((prev) => [...prev, { file, title: '', previewUrl, width: null, height: null }]);
        });
    };

    const handleStagedTitleChange = (previewUrl, title) => {
        setStagedImages((prev) => prev.map((s) => (s.previewUrl === previewUrl ? { ...s, title } : s)));
    };

    const handleRemoveStaged = (previewUrl) => {
        setStagedImages((prev) => {
            const target = prev.find((s) => s.previewUrl === previewUrl);
            if (target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((s) => s.previewUrl !== previewUrl);
        });
    };

    const handleAddEntry = async () => {
        setEntryError('');
        if (stagedImages.length === 0) {
            setEntryError('Please choose at least one image to upload.');
            return;
        }
        if (stagedImages.some((s) => !s.title.trim())) {
            setEntryError('Please give every image a title.');
            return;
        }
        if (!memberCompId) {
            setEntryError('Could not start your entry for this competition. Please try again.');
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = new FormData();
            payload.append('member_comp_id', memberCompId);
            payload.append('entry_type', entryType);
            stagedImages.forEach((s) => {
                payload.append('entry_images[]', s.file);
                payload.append('entry_image_titles[]', s.title.trim());
            });
            const response = await apiClient.post('/submit-competition-entry', payload, {
                headers: { 'Content-Type': undefined },
            });
            const data = response.data?.data || response.data;
            const newEntries = Array.isArray(data) ? data : [data];
            setSubmittedEntries((prev) => [...prev, ...newEntries]);
            stagedImages.forEach((s) => URL.revokeObjectURL(s.previewUrl));
            setStagedImages([]);
        } catch (error) {
            console.error('Error submitting entry:', error);
            setEntryError(error.response?.data?.message || 'Unable to submit this entry.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const maxEntries = (competition?.print_vs_digital === 'digital' ? competition?.max_entries_digital : competition?.max_entries_print) || null;
    const entryLimitReached = maxEntries && submittedEntries.length >= maxEntries;

    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && !competition && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Competitions" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="card bg-white border-0 rounded shadow-sm p-5 mt-4 text-center text-muted">
                                    Competition not found.
                                    <div className="mt-3"><button className="btn" id="edit" onClick={() => navigate('/my-competitions')}>Back to Competitions</button></div>
                                </div>
                            </div>
                        </section>
                        <footer className="site-footer">
                            <div className="footer-content">
                                <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal </p>
                                <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank">cameraclub.website</a></p>
                            </div>
                        </footer>
                    </div>
                </>
            )}
            {!isLoading && competition && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Competitions" />
                    <div className="content">
                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <div className="profile-info">
                                                <small className="greeting text-muted" style={{ fontSize: '18px' }}>Planned and regular club competition</small>
                                                <h2 className="name" style={{ fontSize: '30px' }}>2024 - 2025 Season</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-section d-flex" style={{ width: '32%' }}>
                                        <div className="event-card text-white text-center rounded p-4 w-100" style={{ backgroundColor: '#3a2e26', height: '148px' }}>
                                            <small className="ca-details" style={{ fontSize: '20px' }}>Next Competition</small>
                                            <div className="row mt-4 align-items-center">
                                                <div className="col-md-5">
                                                    <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{daysToGo != null ? Math.ceil(daysToGo) : '--'}</h3>
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

                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                <div className="row mt-4">
                                    <div className="col-md-8">
                                        <div className="card bg-white border-0 rounded shadow-sm p-4">
                                            <h6 className="head mt-5 mb-5">Basic Information</h6>
                                            <div className="row">
                                                <Field label="Competition Name" value={competition.name} />
                                                <Field label="Competition Type" value={competition.competition_type?.name} />
                                                <div className="col-md-12 mb-3">
                                                    <div className="text-danger small fw-medium">Competition Description</div>
                                                    <div dangerouslySetInnerHTML={{ __html: competition.description || '—' }}></div>
                                                </div>
                                                <Field label="Judging Type" value={competition.judging_type?.name} />
                                                <Field label="Status" value={competition.status} />
                                            </div>

                                            <h6 className="head mb-3 mt-3">Submission Rules</h6>
                                            <div className="row">
                                                <Field label="Start Date & Time" value={formatDateTime(competition.start_date)} />
                                                <Field label="Deadline for Submissions" value={formatDateTime(competition.submission_deadline)} />
                                                <Field label="Max Number of Entries per Participant" value={competition.print_vs_digital === 'digital' ? competition.max_entries_digital : competition.max_entries_print} />
                                                <Field label="Allowed Image Formats" value={competition.allowed_image_formats} />
                                                <Field label="Max File Size" value={competition.max_file_size ? `${competition.max_file_size}MB/image` : null} />
                                            </div>

                                            <h6 className="head mb-3 mt-3">Categories & Themes</h6>
                                            <div className="row">
                                                <Field label="Theme (if applicable)" value={competition.competition_theme?.name} />
                                                <Field label="Competition Categories" value={competition.competition_category?.name} />
                                                <Field label="Print vs. Digital Submission" value={competition.print_vs_digital} />
                                                <Field label="Colour vs. Monochrome" value={competition.color_vs_mono} />
                                            </div>

                                            <h6 className="head mb-3 mt-3">Judging & Scoring</h6>
                                            <div className="row">
                                                <Field label="Judging Panel" value={competition.judging_panel} />
                                                <Field label="Voting Method" value={competition.voting_method?.name} />
                                                <Field label="Judging Start Date & Time" value={formatDateTime(competition.judging_start_date)} />
                                                <Field label="Judging End Date & Time" value={formatDateTime(competition.judging_end_date)} />
                                            </div>

                                            <h6 className="head mb-3 mt-3">Results & Awards</h6>
                                            <div className="row">
                                                <Field label="Announcement Date" value={formatDateTime(competition.result_announcement_date)} />
                                                <Field label="Awards - Top Places Available" value={competition.top_places} />
                                                <Field label="Award - Number of High Commendations Available" value={competition.high_commendation_number} />
                                                <Field label="Awards - Number of Commendations Available" value={competition.commendation_number} />
                                                <Field label="Prizes (if any)" value={competition.prizes} />
                                            </div>

                                            {entryError && !showEntryForm && <div className="alert alert-danger py-2 small mt-3">{entryError}</div>}

                                            {showEntryForm && (
                                                <div className="border rounded p-3 mt-3" style={{ background: '#faf7f3' }}>
                                                    <h6 className="head mt-5 mb-5">Upload Entries</h6>
                                                    <small className="text-muted d-block mb-3">
                                                        {maxEntries ? `Maximum ${maxEntries} images allowed per entry` : 'Upload your entry image'}
                                                    </small>

                                                    {entryError && <div className="alert alert-danger py-2 small">{entryError}</div>}

                                                    {submittedEntries.length > 0 && (
                                                        <div className="d-flex gap-2 flex-wrap mb-3">
                                                            {submittedEntries.map((e, i) => (
                                                                <div key={i} className="text-center">
                                                                    <img src={e.entry_image_url || e.entry_image} alt={e.entry_image_title} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                                                                    <div className="small text-muted" style={{ maxWidth: '90px' }}>{e.entry_image_title}</div>
                                                                    {e.image_width && e.image_height && (
                                                                        <div className="text-muted" style={{ fontSize: '11px', maxWidth: '90px' }}>
                                                                            {e.dpi ? `${e.dpi} DPI · ` : ''}{e.image_width}×{e.image_height}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {!entryLimitReached ? (
                                                        <>
                                                            <div className="row g-2 mb-3">
                                                                <div className="col-md-6">
                                                                    <label className="form-label small">Entry Type</label>
                                                                    <select className="form-select" value={entryType} onChange={(e) => setEntryType(e.target.value)}>
                                                                        <option value="digital">Digital</option>
                                                                        <option value="print">Print</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <label className="form-label small">Max File Size</label>
                                                                    <div className="form-control bg-light text-muted">
                                                                        {competition.max_file_size ? `${competition.max_file_size} MB/image` : 'No limit set'}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <label className="form-label small">Upload Images</label>
                                                            <input type="file" className="form-control mb-3" accept="image/*" multiple onChange={(e) => { handleFilesSelected(e.target.files); e.target.value = ''; }} />

                                                            {stagedImages.length > 0 && (
                                                                <>
                                                                    <label className="form-label small d-block">Uploaded Images</label>
                                                                    <div className="d-flex gap-3 flex-wrap mb-3">
                                                                        {stagedImages.map((s) => (
                                                                            <div key={s.previewUrl} className="position-relative" style={{ width: '160px' }}>
                                                                                <button type="button" className="btn btn-danger rounded-circle position-absolute" style={{ top: '-8px', right: '-8px', width: '24px', height: '24px', padding: '0', lineHeight: '1' }} onClick={() => handleRemoveStaged(s.previewUrl)} >
                                                                                    &times;
                                                                                </button>
                                                                                <img src={s.previewUrl} alt="Preview" style={{ width: '160px', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />
                                                                                <input className="form-control form-control-sm mt-1" placeholder="Image title" value={s.title} onChange={(e) => handleStagedTitleChange(s.previewUrl, e.target.value)} />
                                                                                <small className="text-muted d-block mt-1">
                                                                                    {s.width && s.height ? `${s.width} × ${s.height}` : 'Reading size...'}
                                                                                </small>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            )}

                                                            <button type="button" className="btn" id="edit" disabled={isSubmitting || stagedImages.length === 0} onClick={handleAddEntry}>
                                                                {isSubmitting ? 'Adding...' : '+ Add'}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="text-success small">You've reached the maximum number of entries for this competition.</div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="d-flex gap-2 pt-3 border-top mt-3">
                                                <button className="btn" id="e-view" onClick={() => navigate('/my-competitions')}>Back</button>
                                                <button className="btn" id="edit" disabled={isJoining} onClick={handleEnterClick}>
                                                    {isJoining ? 'Starting...' : showEntryForm ? 'Entered' : 'Enter'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <section className="d-flex flex-column gap-4">
                                            <div className="bg-white rounded shadow-sm">
                                                <Calendar />
                                            </div>
                                            <div className="bg-white rounded shadow-sm p-4">
                                                <h5 className="head mt-5 mb-5">Recent Submissions</h5>
                                                {recentSubmissions.length === 0 && <p className="text-muted small">No recent submissions.</p>}
                                                {recentSubmissions.map((s, i) => (
                                                    <React.Fragment key={i}>
                                                        <div className="event-list">
                                                            <div className="event-item" style={{ marginBottom: '10px' }}>
                                                                <img src={s.entry_image || '/placeholder.jpg'} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                                <div className="event-details" style={{ display: 'flex' }}>
                                                                    <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                        <span id="ename">{s.member_username}</span>
                                                                        <span id="espeaker"> {s.competition_name}</span>
                                                                    </div>
                                                                    <div className="event-time" id="edate">
                                                                        <small className="event-date galtext">{formatDate(s.submitted_at)}</small><br />
                                                                        <small className="event-time-details galtext">{formatTime(s.submitted_at)}</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                            <div className="bg-white rounded shadow-sm p-4">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5 className="head m-0">More Competitions</h5>
                                                </div>
                                                {moreCompetitions.length === 0 && <p className="text-muted small">No other competitions.</p>}
                                                {moreCompetitions.map((c) => (
                                                    <div key={c.id} className="event-list">
                                                        <div className="event-item" style={{ marginBottom: '10px' }} onClick={() => navigate(`/my-competitions/${c.id}`)}>
                                                            <img src={c.featured_image || '/placeholder.jpg'} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                            <div className="event-details">
                                                                <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <span id="ename">{c.title}</span>
                                                                </div>
                                                                <div className="event-time" id="edate">
                                                                    <small className="event-date galtext">{formatDate(c.start_date)}</small><br />
                                                                    <small className="event-time-details galtext">{formatTime(c.start_date)}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="button-group mt-auto">
                                                    <button className="btn" id="e-view" onClick={() => navigate('/my-competitions')}>
                                                        View All
                                                    </button>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <footer className="site-footer">
                            <div className="footer-content">
                                <p className="memtext" id="fcopy">Copyright &copy; 2025 – rytonlocal </p>
                                <p className="memtext">Powered by <a href="https://cameraclub.website" target="_blank">cameraclub.website</a></p>
                            </div>
                        </footer>
                    </div>
                </>
            )}
        </>
    );
}
export default PhotographerCompSingle;
