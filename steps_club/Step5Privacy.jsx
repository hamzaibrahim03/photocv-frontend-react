import { useState, useEffect } from "react";
import apiClient from "../src/api/axios";
const initialFormData = {
    privacy_policy_url: '',
    cookies_enabled: false,
    cookies_notes: '',
    data_collection_enabled: false,
    data_collection_notes: '',
    allow_reporting: false,
    reporting_notes: '',
};
function Step5Privacy() {
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    useEffect(() => {
        loadSettings();
    }, []);
    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/club-settings-privacy');
            const data = response.data?.data || response.data;
            if (data) {
                setFormData((prev) => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error loading privacy settings:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const submitForm = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        try {
            await apiClient.post('/club-settings-privacy', formData);
            alert('Privacy settings saved successfully!');
        } catch (error) {
            console.error('Error saving privacy settings:', error);
            alert(error.response?.data?.message || 'Unable to save privacy settings.');
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
                    <h5 className="role" style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: '32px', lineHeight: '100%', letterSpacing: '0%' }}>Privacy Settings</h5>
                    <p style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: '22.88px', lineHeight: '100%', letterSpacing: '0%', color: '#4C4036' }}>Decide how cookies, data and reports are handled in your club.</p>
                    <br /><br />
                    <label htmlFor="privacy_policy_url"> GDPR & Privacy Policy Management </label>
                    <input type="text" id="privacy_policy_url" name="privacy_policy_url" className="form-control" value={formData.privacy_policy_url} onChange={handleChange} />
                    <div className="divider3"></div>
                    <h5>User Consent Settings</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <input type="checkbox" id="cookies_enabled" name="cookies_enabled" checked={formData.cookies_enabled} onChange={handleChange} className="icheck-cookies" />&nbsp;
                            <span></span> Cookies
                            <textarea name="cookies_notes" className="form-control" value={formData.cookies_notes} onChange={handleChange}></textarea>
                        </div>
                        <div className="col-md-6">
                            <input type="checkbox" id="data_collection_enabled" name="data_collection_enabled" checked={formData.data_collection_enabled} onChange={handleChange} className="icheck-data_collection_preferences" />&nbsp;
                            <span></span> Data Collection Preferences
                            <textarea name="data_collection_notes" className="form-control" value={formData.data_collection_notes} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <h5>Content Moderation & Reporting</h5>
                    <input type="checkbox" id="allow_reporting" name="allow_reporting" checked={formData.allow_reporting} onChange={handleChange} className="icheck-allow_reporting" /> &nbsp;
                    <span></span> Allow Reporting
                    <textarea name="reporting_notes" className="form-control" value={formData.reporting_notes} onChange={handleChange}></textarea>
                    <div className="button-group" style={{ justifyContent: 'left' }}>
                        <button type="button" className="btn" id="e-view" onClick={loadSettings}> Cancel</button>
                        <button type="submit" className="btn" id="e-edit" disabled={isSaving}> {isSaving ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Step5Privacy;
