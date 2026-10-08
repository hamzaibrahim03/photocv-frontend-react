import React, { useEffect, useState } from 'react';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import c1 from '../club_admin/assets/images/dashboard/c1.jpg';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

const LOG_TYPES = ['image', 'document', 'video'];

function PhotographerInsights() {
    const [logs, setLogs] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newFile, setNewFile] = useState(null);

    const selected = logs.find(l => l.id === selectedId) || null;

    const fetchLogs = async () => {
        try {
            setIsLoading(true);
            const responses = await Promise.all(
                LOG_TYPES.map(type => apiClient.get('/member-admin/practice-logs', { params: { type } }).catch(() => null))
            );
            const merged = responses.flatMap((response) => {
                if (!response) return [];
                const payload = response.data?.data;
                const list = Array.isArray(payload) ? payload : payload?.data || [];
                return list;
            });
            merged.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            setLogs(merged);
            if (merged.length) setSelectedId(prev => prev ?? merged[0].id);
        } catch (error) {
            console.error('Error loading practice logs:', error);
            setLogs([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this practice log?')) return;
        try {
            await apiClient.delete(`/member-admin/practice-logs/${id}`);
            const next = logs.filter(l => l.id !== id);
            setLogs(next);
            if (selectedId === id) setSelectedId(next.length ? next[0].id : null);
        } catch (error) {
            console.error('Error deleting practice log:', error);
            alert(error?.response?.data?.message || 'Unable to delete practice log.');
        }
    };

    const handleCreateLog = async (e) => {
        e.preventDefault();
        if (!newFile) {
            alert('Please choose a file to upload.');
            return;
        }
        try {
            setIsSaving(true);
            const payload = new FormData();
            payload.append('title', newTitle || '');
            payload.append('description', newDescription || '');
            payload.append('file', newFile);
            const response = await apiClient.post('/member-admin/practice-logs', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const created = response.data?.data || response.data;
            setLogs(prev => [created, ...prev]);
            setSelectedId(created.id);
            setNewTitle('');
            setNewDescription('');
            setNewFile(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error creating practice log:', error);
            alert(error?.response?.data?.message || 'Unable to create practice log.');
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
                            <div className="dashboard-card">
                                <div className="profile-card">
                                    <div className="profile-left">
                                        <img className="img-fluid" src={c1} alt="Profile" />
                                        <div className="profile-info"><h2 className="name">Photographer</h2></div>
                                    </div>
                                </div>
                                <div className="card-section">
                                    <div className="stat-card">
                                        <small className='ca-details'>My Photos</small>
                                        <h3 className="number">21</h3>
                                    </div>
                                    <div className="event-cards">
                                        <small className='ca-details'>Interactions</small>
                                        <h3 className="number">99</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-4 mt-1">
                                <div className="col-md-5">
                                    <div className="card bg-white border-0 rounded shadow-sm p-3" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="head m-0">Practice Log</h5>
                                            <span className="text-muted small">{logs.length} Logs</span>
                                        </div>
                                        {logs.map(l => (
                                            <div key={l.id} className={`p-3 rounded mb-3 ${selected?.id === l.id ? 'shadow-sm' : ''}`} style={{ backgroundColor: selected?.id === l.id ? '#f3e9e0' : '#f8f6f3', cursor: 'pointer' }} onClick={() => setSelectedId(l.id)}>
                                                <h6 className="head mb-1">{l.title || 'Untitled log'}</h6>
                                                <p className="text-secondary small mb-2" style={{ textWrap: 'wrap', width: '600px' }}>{l.description}</p>
                                                {(l.file_url || l.file) && <a href={l.file_url || l.file} target="_blank" rel="noreferrer" className="small d-block mb-2" style={{ color: '#cc445e' }}><i className="fas fa-external-link-alt me-1"></i>View {l.type} file</a>}
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small className="text-muted">Created: {l.created_at ? new Date(l.created_at).toLocaleDateString() : '-'}</small>
                                                    <div className="d-flex gap-2">
                                                        <button className="icon-btn" onClick={(e) => { e.stopPropagation(); handleDelete(l.id); }}><i className="fas fa-trash-alt"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {!showForm ? (
                                            <div className="text-center p-4 rounded" style={{ backgroundColor: '#f8f6f3', cursor: 'pointer' }} onClick={() => setShowForm(true)}>
                                                <i className="fas fa-plus-circle mb-2" style={{ fontSize: '24px', color: '#cc445e' }}></i>
                                                <p className="m-0 text-muted">Create New Log</p>
                                            </div>
                                        ) : (
                                            <form className="p-3 rounded border" onSubmit={handleCreateLog}>
                                                <input className="form-control mb-2" placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                                                <textarea className="form-control mb-2" rows="2" placeholder="Description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)}></textarea>
                                                <input type="file" className="form-control mb-2" onChange={(e) => setNewFile(e.target.files?.[0] || null)} required />
                                                <div className="d-flex gap-2">
                                                    <button type="submit" className="btn text-white text-nowrap" style={{ backgroundColor: '#3a2e26' }} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                                    <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="card bg-white border-0 rounded shadow-sm p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                                        <h5 className="head mb-3">Insights</h5>
                                        {!selected ? (
                                            <p className="text-muted">No practice logs yet.</p>
                                        ) : (
                                            <>
                                                <label className="form-label">Title</label>
                                                <input className="form-control mb-3" value={selected.title || ''} readOnly />
                                                <label className="form-label">Description</label>
                                                <textarea className="form-control mb-3" rows="2" value={selected.description || ''} readOnly></textarea>
                                                <label className="form-label">Type</label>
                                                <input className="form-control mb-3 text-capitalize" value={selected.type || ''} readOnly />
                                                {(selected.file_url || selected.file) && (
                                                    selected.type === 'image' ? (
                                                        <img src={selected.file_url || selected.file} alt="attachment" className="rounded" style={{ width: '280px', maxWidth: '100%' }} />
                                                    ) : (
                                                        <a href={selected.file_url || selected.file} target="_blank" rel="noreferrer" className="btn" style={{ border: '1px solid #99816b', color: '#99816b' }}>
                                                            <i className="fas fa-download me-2"></i>View attached {selected.type}
                                                        </a>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default PhotographerInsights;
