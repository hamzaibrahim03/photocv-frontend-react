import { useState, useEffect } from "react";
import apiClient from "../src/api/axios";
const ALL_SECTIONS = ['News', 'Events', 'Galleries', 'Competitions'];
const initialFormData = {
    sections: [],
    homepage: 'All',
    reminder: 'All',
    email: '',
    phone: '',
    address: '',
    facebook_enabled: false,
    facebook_url: '',
    instagram_enabled: false,
    instagram_url: '',
    flickr_enabled: false,
    flickr_url: '',
};
function Step4Content() {
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const toggleSection = (section) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.includes(section)
                ? prev.sections.filter((s) => s !== section)
                : [...prev.sections, section],
        }));
    };
    useEffect(() => {
        loadSettings();
    }, []);
    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/club-settings-content');
            const data = response.data?.data || response.data;
            if (data) {
                setFormData((prev) => ({
                    ...prev,
                    ...data,
                    sections: Array.isArray(data.sections) ? data.sections : prev.sections,
                }));
            }
        } catch (error) {
            console.error('Error loading content settings:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const submitForm = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        try {
            await apiClient.post('/club-settings-content', formData);
            alert('Content settings saved successfully!');
        } catch (error) {
            console.error('Error saving content settings:', error);
            alert(error.response?.data?.message || 'Unable to save content settings.');
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
                <form style={{ marginLeft: "2%", marginRight: "2%" }} onSubmit={submitForm}>
                    <h5 className="role" style={{ fontFamily: "Inter", fontWeight: '400', fontSize: "32px", lineHeight: "100%", letterSpacing: "0%" }}>Content Management</h5>
                    <p style={{ fontFamily: "Inter", fontWeight: '400', fontSize: "22.88px", lineHeight: "100%", letterSpacing: "0%", color: "#4C4036" }}>How do you want your club website to shape up.</p>
                    <br /><br />
                    <label htmlFor="website"> Website Sections </label>
                    <div className="row">
                        {ALL_SECTIONS.map((section) => (
                            <div className="col-md-3" key={section}>
                                <div className="form-control">
                                    <input type="checkbox" value={section} checked={formData.sections.includes(section)} onChange={() => toggleSection(section)} /> <span>{section}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="homepage">Homepage Content Blocks</label>
                            <div className="row mb-3">
                                {[
                                    'All',
                                    'Fewer',
                                    'Fewest'
                                ].map(status => (
                                    <div className="col-md-4 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`homepage-${status}`} name="homepage" value={status} checked={formData.homepage === status} onChange={handleChange} />
                                            <label htmlFor={`homepage-${status}`}>
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
                            <label htmlFor="reminder">Reminders</label>
                            <div className="row mb-3">
                                {[
                                    'All',
                                    'Some',
                                    'None'
                                ].map(status => (
                                    <div className="col-md-4 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`reminder-${status}`} name="reminder" value={status} checked={formData.reminder === status} onChange={handleChange} />
                                            <label htmlFor={`reminder-${status}`}>
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
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="phone" className="form-label">Phone</label>
                                    <input type="tel" id="phone" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input type="text" id="address" name="address" className="form-control" value={formData.address} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <label htmlFor="social">Social Media Links</label>
                    <div className="row align-items-center mb-3">
                        <div className="col-auto">
                            <input type="checkbox" id="facebook_enabled" name="facebook_enabled" checked={formData.facebook_enabled} onChange={handleChange} />
                        </div>
                        <div className="col">
                            <label htmlFor="facebook_url" className="form-label">Facebook</label>
                            <input type="text" id="facebook_url" name="facebook_url" className="form-control" placeholder="Facebook link..." value={formData.facebook_url} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row align-items-center mb-3">
                        <div className="col-auto">
                            <input type="checkbox" id="instagram_enabled" name="instagram_enabled" checked={formData.instagram_enabled} onChange={handleChange} />
                        </div>
                        <div className="col">
                            <label htmlFor="instagram_url" className="form-label">Instagram</label>
                            <input type="text" id="instagram_url" name="instagram_url" className="form-control" placeholder="Instagram link..." value={formData.instagram_url} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row align-items-center mb-3">
                        <div className="col-auto">
                            <input type="checkbox" id="flickr_enabled" name="flickr_enabled" checked={formData.flickr_enabled} onChange={handleChange} />
                        </div>
                        <div className="col">
                            <label htmlFor="flickr_url" className="form-label">Flickr</label>
                            <input type="text" id="flickr_url" name="flickr_url" className="form-control" placeholder="Flickr link..." value={formData.flickr_url} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="button-group" style={{ justifyContent: 'left' }}>
                        <button type="button" className="btn" id="e-view" onClick={loadSettings}> Cancel</button>
                        <button type="submit" className="btn" id="e-edit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Step4Content;
