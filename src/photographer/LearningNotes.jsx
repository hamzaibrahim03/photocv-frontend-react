import React, { useEffect, useState } from 'react';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import icon1 from '../club_admin/assets/images/profile/icon.png';
import c1 from '../club_admin/assets/images/dashboard/c1.jpg';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';
import { extractRows } from './PhotographerGear';

function LearningNotes() {
    const [user, setUser] = useState({
        first_name: 'Photographer',
        profile_image_url: ''
    });
    const [search, setSearch] = useState('');
    const [notes, setNotes] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [draftContent, setDraftContent] = useState('');
    const [draftTitle, setDraftTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const selected = notes.find(n => n.id === selectedId) || null;

    const fetchNotes = async () => {
        try {
            setIsLoading(true);
            const [notesRes, profileRes] = await Promise.all([
                apiClient.get('/cheat-sheets', { params: { draw: 1, start: 0, length: -1 } }),
                apiClient.get('/member-admin/profile/portfolio').catch(() => null),
            ]);
            const list = extractRows(notesRes);
            setNotes(list);
            if (list.length) setSelectedId(prev => prev ?? list[0].id);
            const memberInfo = profileRes?.data?.member_info?.original?.data;
            if (memberInfo) setUser(memberInfo);
        } catch (error) {
            console.error('Error loading notes:', error);
            setNotes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchNotes(); }, []);

    useEffect(() => {
        setDraftContent(selected?.notes || '');
        setDraftTitle(selected?.title || '');
    }, [selectedId]);

    const timeAgo = (value) => {
        if (!value) return '';
        const diffMs = Date.now() - new Date(value).getTime();
        const mins = Math.floor(diffMs / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins} mins ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} hours ago`;
        return `${Math.floor(hrs / 24)} day(s) ago`;
    };

    const handleCreateNote = async () => {
        const title = window.prompt('Note title?');
        if (!title) return;
        try {
            const payload = new FormData();
            payload.append('title', title);
            payload.append('notes', '');
            const response = await apiClient.post('/cheat-sheets', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const created = response.data?.data || response.data;
            setNotes(prev => [created, ...prev]);
            setSelectedId(created.id);
        } catch (error) {
            console.error('Error creating note:', error);
            alert(error?.response?.data?.message || 'Unable to create note.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await apiClient.delete(`/cheat-sheets/${id}`);
            const next = notes.filter(n => n.id !== id);
            setNotes(next);
            if (selectedId === id) setSelectedId(next.length ? next[0].id : null);
        } catch (error) {
            console.error('Error deleting note:', error);
            alert(error?.response?.data?.message || 'Unable to delete note.');
        }
    };

    const handleShareNote = () => {
        if (!selected) return;
        const url = `${window.location.origin}/notebook?note=${selected.id}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => alert('Note link copied to clipboard!')).catch(() => alert(url));
        } else {
            alert(url);
        }
    };

    const handleSaveNote = async () => {
        if (!selected) return;
        try {
            setIsSaving(true);
            const response = await apiClient.put(`/cheat-sheets/${selected.id}`, {
                title: draftTitle || selected.title,
                notes: draftContent,
            });
            const updated = response.data?.data || response.data;
            setNotes(prev => prev.map(n => n.id === selected.id ? { ...n, ...updated } : n));
        } catch (error) {
            console.error('Error saving note:', error);
            alert(error?.response?.data?.message || 'Unable to save note.');
        } finally {
            setIsSaving(false);
        }
    };

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
                                    <div className="dashboard-card" id="cl">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <img className="img-fluid rounded-circle" style={{ width: '64px', height: '64px', objectFit: 'cover' }} src={user.profile_image_url || c1} alt="Profile" onError={(e) => { e.target.src = c1; }} />
                                                <div className="profile-info">
                                                    <h2 className="name">{user.first_name}</h2>
                                                </div>
                                            </div>
                                            <div className="profile-icons d-flex flex-column gap-2 text-danger">
                                                <div className="icon d-flex align-items-center gap-2"><span>20</span><i className="fas fa-comments"></i></div>
                                                <div className="icon d-flex align-items-center gap-2"><span>53</span><i className="fas fa-desktop"></i></div>
                                                <div className="icon d-flex align-items-center gap-2"><span>39</span><i className="fas fa-users"></i></div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">My Photos</small>
                                                <h3 className="number">21</h3>
                                            </div>
                                            <div className="event-cards">
                                                <small className="ca-details">Interactions</small>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <h3 className="number">99</h3>
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
                                    <div className="card bg-white mt-4 border-0 p-3 rounded shadow-sm">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="dt-search" style={{ width: '300px' }}>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-white border-end-0" style={{ borderColor: '#a0846c' }}><i className="fas fa-search" style={{ color: '#a0846c' }}></i></span>
                                                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" className="form-control border-start-0 shadow-none" placeholder="Search" style={{ borderColor: '#a0846c' }} />
                                                </div>
                                            </div>
                                            <div className="button-group d-flex align-items-center gap-2">
                                                <button className="btn d-flex align-items-center gap-2 px-3 py-2 text-white border-0" style={{ backgroundColor: '#99816B' }} onClick={handleCreateNote}>
                                                    <i className="fas fa-sticky-note"></i> Note
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className='container' style={{ maxWidth: '1820px' }}>
                                    <div className="notes-app d-flex mt-4 bg-white rounded shadow-sm">
                                        <aside className="sidebars overflow-auto" style={{ width: '400px', backgroundColor: '#ebe6e1', borderRight: '1px solid #ddd' }}>
                                            <div className="p-3">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5 className="mb-0">My Notes</h5>
                                                    <span className="text-muted small">{notes.length} Notes</span>
                                                </div>
                                                {notes
                                                    .filter(n => (n.title || '').toLowerCase().includes(search.toLowerCase()))
                                                    .map((note) => (
                                                        <div key={note.id} className={`note-preview p-3 rounded mb-3 bg-white position-relative ${selectedId === note.id ? 'shadow' : ''}`} style={{ borderLeft: '3px solid #a0846c', cursor: 'pointer' }} onClick={() => setSelectedId(note.id)}>
                                                            <h6 className="head">{note.title}</h6>
                                                            <p className="text-secondary small mb-2">{note.description}</p>
                                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                                <span className="small border rounded px-2 py-1" style={{ color: '#4C4036' }}>{timeAgo(note.updated_at)}</span>
                                                                <div className="d-flex gap-2">
                                                                    <button className="btn btn-link text-secondary p-0" onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}><i className="fas fa-trash-alt"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                <div className="note-preview p-4 rounded text-center bg-white" style={{ borderLeft: '3px solid #a0846c', cursor: 'pointer' }} onClick={handleCreateNote}>
                                                    <img src={icon1} alt="Create Note" className="mb-2" style={{ width: '32px' }} />
                                                    <p className="m-0 text-muted">Create New Note</p>
                                                </div>
                                            </div>
                                        </aside>
                                        <main className="editor flex-grow-1 p-4 bg-white" style={isExpanded ? { position: 'fixed', inset: '0', zIndex: '1060', maxWidth: 'none', maxHeight: '500px', borderRadius: '20px' } : undefined}>
                                            {!selected ? (
                                                <p className="text-muted">No notes yet. Create one to get started.</p>
                                            ) : (
                                                <>
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <button type="button" className="btn p-0 border-0 bg-transparent" style={{ color: '#4C4036', fontSize: '16px' }} onClick={() => setIsExpanded((v) => !v)} aria-label="Toggle focus mode">
                                                            <i className={isExpanded ? 'fas fa-compress-alt' : 'fas fa-expand-alt'}></i>
                                                        </button>
                                                        <button type="button" className="btn" id="edit" onClick={handleShareNote}>
                                                            <i className="fas fa-share-alt me-2"></i>Share
                                                        </button>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <span className="small text-muted">Last edited on {selected.updated_at ? new Date(selected.updated_at).toLocaleDateString() : '-'}</span>
                                                        <button className="btn" id="e-view" onClick={handleSaveNote} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                                    </div>
                                                    <input className="form-control form-control-lg head border-0 bg-transparent px-0 mb-3 fs-3 shadow-none" style={{ color: '#333' }} value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="Note Title" />
                                                    <div className="editor-container border rounded mb-3">
                                                        <div id="toolbar" className="bg-light p-2 border-bottom d-flex gap-2 flex-wrap text-secondary">
                                                            <i className="fas fa-bold cursor-pointer p-1"></i>
                                                            <i className="fas fa-italic cursor-pointer p-1"></i>
                                                            <i className="fas fa-underline cursor-pointer p-1"></i>
                                                            <i className="fas fa-strikethrough cursor-pointer p-1"></i>
                                                            <div className="border-end mx-1"></div>
                                                            <i className="fas fa-align-left cursor-pointer p-1"></i>
                                                            <i className="fas fa-align-center cursor-pointer p-1"></i>
                                                            <i className="fas fa-align-right cursor-pointer p-1"></i>
                                                            <div className="border-end mx-1"></div>
                                                            <i className="fas fa-list-ol cursor-pointer p-1"></i>
                                                            <i className="fas fa-list-ul cursor-pointer p-1"></i>
                                                        </div>
                                                        <textarea className="form-control border-0 p-3 shadow-none" rows="8" value={draftContent} onChange={(e) => setDraftContent(e.target.value)} placeholder="Start writing your note..." style={{ resize: 'none' }} ></textarea>
                                                    </div>
                                                    <div className="note-image my-4">
                                                        <img src={selected.reference_image || c1} alt="Note Attachment" className="img-fluid rounded w-100" style={{ maxHeight: '300px', objectFit: 'cover' }} />
                                                    </div>
                                                    <div className="d-flex gap-2 mt-4">
                                                        <span className="d-inline-block px-3 py-2 rounded text-white" style={{ backgroundColor: '#4C4036' }}>{selected.category?.name || 'General'}</span>
                                                    </div>
                                                </>
                                            )}
                                        </main>
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
            </div>
        </>
    );
};
export default LearningNotes;
