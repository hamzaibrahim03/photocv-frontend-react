import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
import { extractRows } from './PhotographerGear';
import c1 from '../club_admin/assets/images/dashboard/c1.jpg';

const RECENT_NOTES_LIMIT = 5;
const TOPICS_CAP = 6;
const CLASSES_CAP = 4;
const PRACTICE_CAP = 5;

function timeAgo(value) {
    if (!value) return '';
    const diffMs = Date.now() - new Date(value).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    return `${Math.floor(hrs / 24)} day(s) ago`;
}

function formatDate(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function ModalShell({ title, onClose, children, width = '560px' }) {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: '1050' }} onClick={onClose}>
            <div className="bg-white rounded p-4" style={{ maxWidth: width, width: '92%', maxHeight: '88vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="head m-0">{title}</h4>
                    <button type="button" className="btn p-0 border-0 bg-transparent" style={{ fontSize: '18px', color: '#333' }} onClick={onClose} aria-label="Close"><i className="fas fa-times"></i></button>
                </div>
                {children}
            </div>
        </div>
    );
}

function UploadDropzone({ file, onChange, previewUrl }) {
    const label = file?.name;
    return (
        <label className="d-flex flex-column align-items-center justify-content-center text-center rounded p-4" style={{ border: '1px dashed #cbbfae', cursor: 'pointer', minHeight: '140px', background: previewUrl ? `url(${previewUrl}) center/cover no-repeat` : 'transparent' }}>
            {!previewUrl && (
                <>
                    <i className="fas fa-cloud-upload-alt mb-2" style={{ fontSize: '20px', color: '#cc445e' }}></i>
                    <div className="text-muted small mb-2">{label ? label : <>Drag image to upload<br />or</>}</div>
                    <span className="btn text-white px-3" style={{ backgroundColor: '#cc445e' }}>Browse Image</span>
                </>
            )}
            <input type="file" accept="image/*" className="d-none" onChange={onChange} />
        </label>
    );
}

const emptyNoteForm = { title: '', description: '' };
const emptyInterestForm = { interest: '', image: null, imagePreview: '' };
const emptyClassForm = { title: '', description: '', image: null, imagePreview: '', start_date: '', end_date: '', present: false };
const emptyPracticeForm = { title: '', description: '', file: null };

function PhotographerLearning() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [notes, setNotes] = useState([]);
    const [interests, setInterests] = useState([]);
    const [classLogs, setClassLogs] = useState([]);
    const [practiceLogs, setPracticeLogs] = useState([]);
    const [user, setUser] = useState({ first_name: 'Photographer', profile_image_url: '' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });
    const [showAllTopics, setShowAllTopics] = useState(false);
    const [showAllClasses, setShowAllClasses] = useState(false);
    const [showAllPractice, setShowAllPractice] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteForm, setNoteForm] = useState(emptyNoteForm);
    const [showInterestModal, setShowInterestModal] = useState(false);
    const [interestForm, setInterestForm] = useState(emptyInterestForm);
    const [showClassModal, setShowClassModal] = useState(false);
    const [classForm, setClassForm] = useState(emptyClassForm);
    const [showPracticeModal, setShowPracticeModal] = useState(false);
    const [practiceForm, setPracticeForm] = useState(emptyPracticeForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadAll = async () => {
        setIsLoading(true);
        try {
            const [profileRes, notesRes, interestsRes, classLogsRes, practiceImgRes, practiceDocRes] = await Promise.all([
                apiClient.get('/member-admin/profile/portfolio'),
                apiClient.get('/cheat-sheets', { params: { draw: 1, start: 0, length: -1 } }),
                apiClient.get('/member-admin/profile/interests-brands', { params: { draw: 1, start: 0, length: -1 } }),
                apiClient.get('/member-admin/profile/class-logs', { params: { draw: 1, start: 0, length: -1 } }),
                apiClient.get('/member-admin/practice-logs', { params: { type: 'image', draw: 1, start: 0, length: -1 } }),
                apiClient.get('/member-admin/practice-logs', { params: { type: 'document', draw: 1, start: 0, length: -1 } }),
            ]);

            const memberInfo = profileRes.data?.member_info?.original?.data;
            const galleryData = profileRes.data?.gallery?.original?.data;
            if (memberInfo) setUser(memberInfo);
            setTotals({
                totalPhotos: galleryData?.total_photos ?? 0,
                totalLikes: galleryData?.total_likes ?? 0,
                totalComments: galleryData?.total_comments ?? 0,
            });

            setNotes(extractRows(notesRes));
            setInterests(extractRows(interestsRes).filter((i) => i.interest));
            setClassLogs(extractRows(classLogsRes));
            setPracticeLogs([...extractRows(practiceImgRes), ...extractRows(practiceDocRes)]);
        } catch (error) {
            console.error('Error loading learning hub:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadAll(); }, []);

    const filteredNotes = notes.filter((n) => (n.title || '').toLowerCase().includes(search.toLowerCase()));

    const openNoteModal = () => { setNoteForm(emptyNoteForm); setShowNoteModal(true); };
    const submitNote = async (e) => {
        e.preventDefault();
        if (!noteForm.title.trim()) return;
        try {
            setIsSubmitting(true);
            const payload = new FormData();
            payload.append('title', noteForm.title.trim());
            payload.append('notes', noteForm.description || '');
            const response = await apiClient.post('/cheat-sheets', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            setShowNoteModal(false);
            await loadAll();
            const created = response.data?.data || response.data;
            if (created?.id) navigate('/notebook');
        } catch (error) {
            console.error('Error creating note:', error);
            alert(error?.response?.data?.message || 'Unable to create note.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await apiClient.delete(`/cheat-sheets/${id}`);
            setNotes((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error('Error deleting note:', error);
            alert(error?.response?.data?.message || 'Unable to delete note.');
        }
    };

    const openInterestModal = () => { setInterestForm(emptyInterestForm); setShowInterestModal(true); };
    const handleInterestImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setInterestForm((prev) => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
    };
    const submitInterest = async (e) => {
        e.preventDefault();
        if (!interestForm.interest.trim()) return;
        try {
            setIsSubmitting(true);
            const payload = new FormData();
            payload.append('interest', interestForm.interest.trim());
            if (interestForm.image) payload.append('image', interestForm.image);
            await apiClient.post('/member-admin/profile/interests-brands', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            setShowInterestModal(false);
            await loadAll();
        } catch (error) {
            console.error('Error adding interest:', error);
            alert(error?.response?.data?.message || 'Unable to add topic.');
        } finally {
            setIsSubmitting(false);
        }
    };


    const openClassModal = () => { setClassForm(emptyClassForm); setShowClassModal(true); };
    const handleClassImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setClassForm((prev) => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
    };
    const submitClassLog = async (e) => {
        e.preventDefault();
        if (!classForm.title.trim() || !classForm.start_date) return;
        try {
            setIsSubmitting(true);
            const payload = new FormData();
            payload.append('title', classForm.title.trim());
            payload.append('description', classForm.description || '');
            payload.append('start_date', classForm.start_date);
            payload.append('present', classForm.present ? 1 : 0);
            if (!classForm.present && classForm.end_date) payload.append('end_date', classForm.end_date);
            if (classForm.image) payload.append('image', classForm.image);
            await apiClient.post('/member-admin/profile/class-logs', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            setShowClassModal(false);
            await loadAll();
        } catch (error) {
            console.error('Error adding class log:', error);
            alert(error?.response?.data?.message || 'Unable to add class.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClassLog = async (id) => {
        if (!window.confirm('Delete this class log entry?')) return;
        try {
            await apiClient.delete(`/member-admin/profile/class-logs/${id}`);
            setClassLogs((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            console.error('Error deleting class log:', error);
            alert(error?.response?.data?.message || 'Unable to delete class log.');
        }
    };

    const openPracticeModal = () => { setPracticeForm(emptyPracticeForm); setShowPracticeModal(true); };
    const handlePracticeFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPracticeForm((prev) => ({ ...prev, file, title: prev.title || file.name.replace(/\.[^/.]+$/, '') }));
    };
    const submitPracticeLog = async (e) => {
        e.preventDefault();
        if (!practiceForm.title.trim() || !practiceForm.file) return;
        try {
            setIsSubmitting(true);
            const payload = new FormData();
            payload.append('title', practiceForm.title.trim());
            payload.append('description', practiceForm.description || '');
            payload.append('file', practiceForm.file);
            await apiClient.post('/member-admin/practice-logs', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            setShowPracticeModal(false);
            await loadAll();
        } catch (error) {
            console.error('Error adding practice log:', error);
            alert(error?.response?.data?.message || 'Unable to add practice log.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePracticeLog = async (id) => {
        if (!window.confirm('Delete this practice log entry?')) return;
        try {
            await apiClient.delete(`/member-admin/practice-logs/${id}`);
            setPracticeLogs((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Error deleting practice log:', error);
            alert(error?.response?.data?.message || 'Unable to delete practice log.');
        }
    };

    const visibleTopics = showAllTopics ? interests : interests.slice(0, TOPICS_CAP);
    const visibleClasses = showAllClasses ? classLogs : classLogs.slice(0, CLASSES_CAP);
    const visiblePractice = showAllPractice ? practiceLogs : practiceLogs.slice(0, PRACTICE_CAP);

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Profile" />
                        <div className="content">
                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <img className="img-fluid rounded-circle" style={{ width: '108px', height: '108px', objectFit: 'cover' }} src={user.profile_image_url || c1} alt="Profile" onError={(e) => { e.target.src = c1; }} />
                                                <div className="profile-info">
                                                    <h2 className="name">{user.first_name}</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className='ca-details'>My Photos</small>
                                                <h3 className="number">{totals.totalPhotos}</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className='ca-details'>Interactions</small>
                                                <div className="row align-items-center">
                                                    <div className="col-md-5">
                                                        <h3 className="number">{totals.totalLikes + totals.totalComments}</h3>
                                                    </div>
                                                    <div className="days col-md-7">
                                                        <span>Likes & Comments</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-3">
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted"></i></span>
                                            <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" className="form-control border-start-0 shadow-none" placeholder="Search" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h5 className="head m-0">Recent Notes</h5>
                                            <div className="d-flex gap-2 align-items-center">
                                                <input value={search} onChange={(e) => setSearch(e.target.value)} className="form-control form-control-sm" style={{ width: '200px' }} placeholder="Search" />
                                                <button className="btn" id="e-view" onClick={() => navigate('/notebook')}>View All</button>
                                                <button className="btn" id="edit" style={{ width: '170px', maxWidth: '170px' }} onClick={openNoteModal}>+ Add New Notes</button>
                                            </div>
                                        </div>
                                        <div className="row g-3">
                                            {filteredNotes.map((note) => (
                                                <div className="col-md-4" key={note.id}>
                                                    <div className="h-100 d-flex flex-column rounded p-3" style={{ background: 'white', cursor: 'pointer', minWidth: '0', boxShadow: '0px 3px 15px 0px #0000001A' }} onClick={() => navigate('/notebook')}>
                                                        <h6 className="head mb-2">{note.title}</h6>
                                                        <p className="text-secondary mb-2" style={{ fontSize: '12px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: '1', minWidth: '0', width: '100%', maxWidth: '100%', wordBreak: 'break-word' }}>{note.description}</p>
                                                        {note.category?.name && (
                                                            <span className="d-inline-block px-2 py-1 rounded mb-2 text-white" style={{ fontSize: '11px', backgroundColor: '#4C4036', alignSelf: 'flex-start' }}>{note.category.name}</span>
                                                        )}
                                                        <div className="d-flex justify-content-between align-items-center mt-1">
                                                            <small className="text-muted">{timeAgo(note.updated_at)}</small>
                                                            <div className="d-flex gap-3">
                                                                <button type="button" className="btn p-0 border-0 bg-transparent" style={{ color: '#cc445e' }} onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} aria-label="Delete note"><i className="fas fa-trash-alt"></i></button>
                                                                <button type="button" className="btn p-0 border-0 bg-transparent" style={{ color: '#cc445e' }} onClick={(e) => { e.stopPropagation(); navigate('/notebook'); }} aria-label="Edit note"><i className="fas fa-pen"></i></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {filteredNotes.length === 0 && <p className="text-muted">No notes yet.</p>}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="row g-4 mt-1">
                                        <div className="col-md-6">
                                            <div className="card bg-white border-0 rounded shadow-sm p-4 h-100">
                                                <div className="card bg-white border-0 rounded shadow-sm" style={{ maxHeight: '45px', padding: '15px', marginBottom: '10px' }}>
                                                    <h5 className="head">Topics of Interest</h5>
                                                </div>
                                                <div className="row g-3 mb-3">
                                                    {visibleTopics.map((topic) => (
                                                        <div className="col-6 d-flex align-items-center gap-2" key={topic.id}>
                                                            <img src={topic.image_url || c1} alt={topic.interest} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} onError={(e) => { e.target.src = c1; }} />
                                                            <div className="d-flex align-items-center justify-content-between flex-grow-1" style={{ minWidth: 0 }}>
                                                                <span className="text-truncate">{topic.interest}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {interests.length === 0 && <p className="text-muted small">No topics of interest added yet.</p>}
                                                </div>
                                                <div className="d-flex gap-2 mt-auto">
                                                    {interests.length > TOPICS_CAP && <button className="btn" id="e-view" onClick={() => setShowAllTopics((v) => !v)}>{showAllTopics ? 'Show Less' : 'View All'}</button>}
                                                    <button className="btn" id="edit" onClick={openInterestModal}>Add New</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card bg-white border-0 rounded shadow-sm p-4 h-100">
                                                <div className="card bg-white border-0 rounded shadow-sm" style={{ maxHeight: '45px', padding: '15px', marginBottom: '10px' }}>
                                                    <h5 className="head">Classes Log</h5>
                                                </div>
                                                <div className="mb-3">
                                                    {visibleClasses.map((cls) => (
                                                        <div className="d-flex justify-content-between align-items-start mb-3" key={cls.id}>
                                                            <div className="d-flex gap-3" style={{ minWidth: 0 }}>
                                                                <img src={cls.image_url || c1} alt={cls.title} style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} onError={(e) => { e.target.src = c1; }} />
                                                                <div style={{ minWidth: 0 }}>
                                                                    <div className="fw-medium text-truncate">{cls.title}</div>
                                                                    {cls.description && <div className="small text-muted text-truncate">{cls.description}</div>}
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                                                <small style={{ color: '#cc445e', whiteSpace: 'nowrap' }}>{formatDate(cls.start_date)} - {cls.present ? 'Present' : formatDate(cls.end_date)}</small>
                                                                <button type="button" className="btn p-0 border-0 bg-transparent" style={{ color: '#cc445e' }} onClick={() => handleDeleteClassLog(cls.id)} aria-label="Delete class log"><i className="fas fa-trash-alt"></i></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {classLogs.length === 0 && <p className="text-muted small">No classes logged yet.</p>}
                                                </div>
                                                <div className="d-flex gap-2 mt-auto">
                                                    {classLogs.length > CLASSES_CAP && <button className="btn" id="e-view" onClick={() => setShowAllClasses((v) => !v)}>{showAllClasses ? 'Show Less' : 'View All'}</button>}
                                                    <button className="btn" id="edit" onClick={openClassModal}>Add New</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h5 className="head m-0">Practice Log</h5>
                                            {practiceLogs.length > PRACTICE_CAP && <button className="btn" id="e-view" onClick={() => setShowAllPractice((v) => !v)}>{showAllPractice ? 'Show Less' : 'View All'}</button>}
                                            <div className="d-flex gap-2 align-items-center">
                                                <input value={search} onChange={(e) => setSearch(e.target.value)} className="form-control form-control-sm" style={{ width: '200px' }} placeholder="Search" />
                                                <button className="btn" id="e-view" onClick={() => navigate('/notebook')}>View All</button>
                                                <button className="btn" id="edit" style={{ width: '170px', maxWidth: '170px' }} onClick={openPracticeModal}>+ Add New Log</button>
                                            </div>
                                        </div>
                                        <div className="row g-3">
                                            {visiblePractice.map((log) => (
                                                <div className="col-md-4" key={log.id}>
                                                    <div className="h-100 d-flex flex-column rounded p-3" style={{ background: '#F3EEE8', minWidth: 0 }}>
                                                        <h6 className="head mb-2">{log.title}</h6>
                                                        <p className="text-secondary mb-2" style={{ fontSize: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minWidth: '0', width: '100%', maxWidth: '100%', wordBreak: 'break-word' }}>{log.description}</p>
                                                        {log.type === 'image' ? (
                                                            <img src={log.file_url} alt={log.title} className="rounded mb-2" style={{ width: '100%', height: '110px', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                                        ) : (
                                                            <a href={log.file_url} target="_blank" rel="noreferrer" className="small text-truncate d-block mb-2" style={{ color: '#cc445e' }}><i className="fas fa-link me-1"></i>{log.file_url}</a>
                                                        )}
                                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                                            <small className="text-muted">Created: {formatDate(log.created_at)}</small>
                                                            <button type="button" className="btn p-0 border-0 bg-transparent" style={{ color: '#cc445e' }} onClick={() => handleDeletePracticeLog(log.id)} aria-label="Delete practice log"><i className="fas fa-trash-alt"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {practiceLogs.length === 0 && <p className="text-muted">No practice sessions logged yet.</p>}
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

                        {showNoteModal && (
                            <ModalShell title="Create New Note" onClose={() => setShowNoteModal(false)} width="520px">
                                <form onSubmit={submitNote}>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Title</label>
                                        <input className="form-control" placeholder="Text here..." value={noteForm.title} onChange={(e) => setNoteForm((p) => ({ ...p, title: e.target.value }))} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Description</label>
                                        <textarea className="form-control" rows="4" placeholder="Text here..." value={noteForm.description} onChange={(e) => setNoteForm((p) => ({ ...p, description: e.target.value }))}></textarea>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button type="button" className="btn" style={{ border: "1px solid #99816b", color: "#99816b" }} onClick={() => setShowNoteModal(false)}>Cancel</button>
                                        <button type="submit" className="btn" id="edit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button>
                                    </div>
                                </form>
                            </ModalShell>
                        )}

                        {showInterestModal && (
                            <ModalShell title="Add New Interest" onClose={() => setShowInterestModal(false)} width="520px">
                                <form onSubmit={submitInterest}>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Topic Name</label>
                                        <input className="form-control" placeholder="Text here..." value={interestForm.interest} onChange={(e) => setInterestForm((p) => ({ ...p, interest: e.target.value }))} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Upload thumbnail</label>
                                        <UploadDropzone file={interestForm.image} previewUrl={interestForm.imagePreview} onChange={handleInterestImage} />
                                    </div>
                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button type="button" className="btn" style={{ border: "1px solid #99816b", color: "#99816b" }} onClick={() => setShowInterestModal(false)}>Cancel</button>
                                        <button type="submit" className="btn" id="edit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button>
                                    </div>
                                </form>
                            </ModalShell>
                        )}

                        {showClassModal && (
                            <ModalShell title="Add New Class Log" onClose={() => setShowClassModal(false)} width="600px">
                                <form onSubmit={submitClassLog}>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Title</label>
                                        <input className="form-control" placeholder="Text here..." value={classForm.title} onChange={(e) => setClassForm((p) => ({ ...p, title: e.target.value }))} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Description</label>
                                        <textarea className="form-control" rows="3" placeholder="Text here..." value={classForm.description} onChange={(e) => setClassForm((p) => ({ ...p, description: e.target.value }))}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Upload thumbnail</label>
                                        <UploadDropzone file={classForm.image} previewUrl={classForm.imagePreview} onChange={handleClassImage} />
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Start Date</label>
                                            <input type="date" className="form-control" value={classForm.start_date} onChange={(e) => setClassForm((p) => ({ ...p, start_date: e.target.value }))} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">End Date</label>
                                            <input type="date" className="form-control" value={classForm.end_date} disabled={classForm.present} onChange={(e) => setClassForm((p) => ({ ...p, end_date: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="form-check mt-3">
                                        <input className="form-check-input" type="checkbox" id="classInProgress" checked={classForm.present} onChange={(e) => setClassForm((p) => ({ ...p, present: e.target.checked }))} />
                                        <label className="form-check-label" htmlFor="classInProgress">This class is still in progress</label>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button type="button" className="btn" style={{ border: "1px solid #99816b", color: "#99816b" }} onClick={() => setShowClassModal(false)}>Cancel</button>
                                        <button type="submit" className="btn" id="edit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button>
                                    </div>
                                </form>
                            </ModalShell>
                        )}

                        {showPracticeModal && (
                            <ModalShell title="Create New Log" onClose={() => setShowPracticeModal(false)} width="520px">
                                <form onSubmit={submitPracticeLog}>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Title</label>
                                        <input className="form-control" placeholder="Text here..." value={practiceForm.title} onChange={(e) => setPracticeForm((p) => ({ ...p, title: e.target.value }))} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Description</label>
                                        <textarea className="form-control" rows="3" placeholder="Text here..." value={practiceForm.description} onChange={(e) => setPracticeForm((p) => ({ ...p, description: e.target.value }))}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Upload File</label>
                                        <label className="d-flex flex-column align-items-center justify-content-center text-center rounded p-4" style={{ border: '1px dashed #cbbfae', cursor: 'pointer', minHeight: '110px' }}>
                                            <i className="fas fa-cloud-upload-alt mb-2" style={{ fontSize: '20px', color: '#cc445e' }}></i>
                                            <div className="text-muted small mb-2">{practiceForm.file ? practiceForm.file.name : 'Drag file to upload or'}</div>
                                            <span className="btn text-white px-3" style={{ backgroundColor: '#cc445e' }}>Browse File</span>
                                            <input type="file" accept="image/*,.pdf,.doc,.docx,.mp4,.mov" className="d-none" onChange={handlePracticeFile} required />
                                        </label>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button type="button" className="btn" style={{ border: "1px solid #99816b", color: "#99816b" }} onClick={() => setShowPracticeModal(false)}>Cancel</button>
                                        <button type="submit" className="btn" id="edit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button>
                                    </div>
                                </form>
                            </ModalShell>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
export default PhotographerLearning;
