import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import apiClient from '../api/axios';

function formatFileSize(bytes) {
    if (!bytes) return '—';
    const kb = Number(bytes) / 1024;
    return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}

function PhotographerCompEntries() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [competition, setCompetition] = useState(null);
    const [entries, setEntries] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editFile, setEditFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadEntries();
    }, [id]);

    async function loadEntries() {
        setIsLoading(true);
        try {
            const response = await apiClient.get(`/competition-entries/${id}`);
            const data = response.data?.data || {};
            setCompetition(data.competition || null);
            setEntries(Array.isArray(data.entries) ? data.entries : []);
        } catch (err) {
            console.error('Error loading competition entries:', err);
            setCompetition(null);
            setEntries([]);
        } finally {
            setIsLoading(false);
        }
    }

    const startEdit = (entry) => {
        setError('');
        setEditingId(entry.id);
        setEditTitle(entry.entry_image_title || '');
        setEditFile(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
        setEditFile(null);
    };

    const saveEdit = async (entryId) => {
        setIsSaving(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('entry_image_title', editTitle);
            if (editFile) formData.append('entry_image', editFile);
            const response = await apiClient.post(`/competition-entry/${entryId}/update`, formData, {
                headers: { 'Content-Type': undefined },
            });
            const updated = response.data?.data;
            setEntries((prev) => prev.map((e) => (e.id === entryId ? updated : e)));
            cancelEdit();
        } catch (err) {
            console.error('Error updating entry:', err);
            setError(err.response?.data?.message || 'Unable to update entry.');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteEntry = async (entryId) => {
        if (!window.confirm('Delete this entry? This cannot be undone.')) return;
        setError('');
        try {
            await apiClient.delete(`/competition-entry/${entryId}`);
            setEntries((prev) => prev.filter((e) => e.id !== entryId));
        } catch (err) {
            console.error('Error deleting entry:', err);
            setError(err.response?.data?.message || 'Unable to delete entry.');
        }
    };

    return (
        <>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Competitions" />
                    <div className="content">
                        <section>
                            <div className='container' style={{ maxWidth: '1820px' }}>
                                <div className="bg-white rounded shadow-sm p-4">
                                    <h4 className="head mt-5 mb-5">{competition?.name || 'Competition Entries'}</h4>

                                    {error && <div className="alert alert-danger py-2 small">{error}</div>}

                                    {entries.length === 0 ? (
                                        <div className="text-center text-muted py-4">No entries submitted yet.</div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table align-middle">
                                                <thead>
                                                    <tr className="text-muted small">
                                                        <th>Competition</th>
                                                        <th>Round</th>
                                                        <th>Entry</th>
                                                        <th>Image</th>
                                                        <th>Image Title</th>
                                                        <th>Image Info</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {entries.map((entry, index) => (
                                                        <tr key={entry.id}>
                                                            <td>{competition?.name || '—'}</td>
                                                            <td>Round 1</td>
                                                            <td>Entry {index + 1}</td>
                                                            <td>
                                                                <img src={entry.entry_image_thumb || entry.entry_image_url || '/placeholder.jpg'} alt={entry.entry_image_title} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                                                            </td>
                                                            <td>
                                                                {editingId === entry.id ? (
                                                                    <input className="form-control form-control-sm" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                                                ) : (
                                                                    entry.entry_image_title
                                                                )}
                                                            </td>
                                                            <td>
                                                                {editingId === entry.id ? (
                                                                    <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => setEditFile(e.target.files?.[0] || null)} />
                                                                ) : (
                                                                    <>
                                                                        {entry.dpi && <div>Resolution: {entry.dpi} DPI</div>}
                                                                        {entry.image_width && entry.image_height ? `${entry.image_width} × ${entry.image_height}` : '—'}
                                                                        <div className="text-muted small">{formatFileSize(entry.file_size)}</div>
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {editingId === entry.id ? (
                                                                    <div className="d-flex gap-2">
                                                                        <button className="btn" id="e-view" disabled={isSaving} onClick={() => saveEdit(entry.id)}>
                                                                            {isSaving ? 'Saving...' : 'Save'}
                                                                        </button>
                                                                        <button className="btn" id="edit" onClick={cancelEdit}>Cancel</button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="d-flex gap-2">
                                                                        <button className="btn btn-outline-secondary" onClick={() => startEdit(entry)}>
                                                                            <i className="fa-regular fa-pen-to-square me-1"></i>Edit
                                                                        </button>
                                                                        <button className="btn btn-outline-danger" onClick={() => deleteEntry(entry.id)}>
                                                                            <i className="fa-regular fa-trash-can me-1"></i>Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    <button className="btn" id="e-view" onClick={() => navigate('/my-competitions')}>
                                        Back
                                    </button>
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

export default PhotographerCompEntries;
