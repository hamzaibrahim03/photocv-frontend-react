import { useState, useEffect } from "react";
import apiClient from "../src/api/axios";
const initialFormData = {
    registration: 'Open',
    directory_visibility: 'Visible',
    comments: 'Enable',
    likes: 'Enable',
};
function Step3Membership() {
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    useEffect(() => {
        loadSettings();
    }, []);
    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/club-settings-membership');
            const data = response.data?.data || response.data;
            if (data) {
                setFormData((prev) => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error loading membership settings:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const submitForm = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        try {
            await apiClient.post('/club-settings-membership', formData);
            alert('Membership settings saved successfully!');
        } catch (error) {
            console.error('Error saving membership settings:', error);
            alert(error.response?.data?.message || 'Unable to save membership settings.');
        } finally {
            setIsSaving(false);
        }
    };
    if (isLoading) {
        return <div className="form-container">Loading...</div>;
    }
    return (
        <>
            <div className="form-container">
                <form style={{ marginLeft: '2%', marginRight: '2%' }} onSubmit={submitForm}>
                    <h5 className="role" style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: '32px', lineHeight: '100%', letterSpacing: '0%' }}>Membership Settings</h5>
                    <p style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: '22.88px', lineHeight: '100%', letterSpacing: '0%', color: '#4C4036;' }}>Let us know how do you want your members to interact.</p>
                    <br /><br />
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="registration">Registration & Access Control</label>
                            <div className="row mb-3">
                                {[
                                    'Open',
                                    'Invite Only',
                                    'Manual Approval'
                                ].map(status => (
                                    <div className="col-md-4 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`registration-${status}`} name="registration" value={status} checked={formData.registration === status} onChange={handleChange} />
                                            <label htmlFor={`registration-${status}`}>
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
                            <label htmlFor="directory_visibility">Members Directory Public Visibility</label>
                            <div className="row mb-3">
                                {[
                                    'Visible',
                                    'Club Only',
                                ].map(status => (
                                    <div className="col-md-6 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`directory-${status}`} name="directory_visibility" value={status} checked={formData.directory_visibility === status} onChange={handleChange} />
                                            <label htmlFor={`directory-${status}`}>
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
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="comments">Comments</label>
                            <div className="row mb-3">
                                {[
                                    'Enable',
                                    'Disable',
                                ].map(status => (
                                    <div className="col-md-6 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`comments-${status}`} name="comments" value={status} checked={formData.comments === status} onChange={handleChange} />
                                            <label htmlFor={`comments-${status}`}>
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
                            <label htmlFor="likes">Likes</label>
                            <div className="row mb-3">
                                {[
                                    'Enable',
                                    'Disable',
                                ].map(status => (
                                    <div className="col-md-6 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`likes-${status}`} name="likes" value={status} checked={formData.likes === status} onChange={handleChange} />
                                            <label htmlFor={`likes-${status}`}>
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
                    <div className="button-group" style={{ justifyContent: 'left' }}>
                        <button type="button" className="btn" id="e-view" onClick={loadSettings}> Cancel</button>
                        <button type="submit" className="btn" id="edit" disabled={isSaving}> {isSaving ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Step3Membership;
