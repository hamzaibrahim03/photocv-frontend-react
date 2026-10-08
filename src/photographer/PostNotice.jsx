import React, { useState } from 'react';
import apiClient from '../api/axios';
function PostNotice() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const submitForm = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        if (!title.trim() && !message.trim()) {
            alert('Please add a title or a message before publishing.');
            return;
        }
        setIsSaving(true);
        try {
            await apiClient.post('/member-notice', {
                title: title.trim(),
                description: message.trim(),
                status: 'active',
            });
            alert('Notice published successfully!');
            setTitle('');
            setMessage('');
        } catch (error) {
            console.error('Error publishing notice:', error);
            alert(error.response?.data?.message || 'Unable to publish notice.');
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <div className="container py-4">
            <h2>Post Notice</h2>
            <form onSubmit={submitForm}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? 'Publishing...' : 'Publish'}</button>
            </form>
        </div>
    );
}
export default PostNotice;
