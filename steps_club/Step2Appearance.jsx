import { useState, useEffect } from "react";
import apiClient from "../src/api/axios";
const initialFormData = {
    header_title: '',
    footer_title: '',
    header_description: '',
    footer_description: '',
};
function Step2Appearance() {
    const [formData, setFormData] = useState(initialFormData);
    const [logos, setLogos] = useState(null);
    const [banner, setBanner] = useState(null);
    const [favicon, setFavicon] = useState(null);
    const [existingImages, setExistingImages] = useState({});
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
            const response = await apiClient.get('/club-settings-appearance');
            const data = response.data?.data || response.data;
            if (data) {
                setFormData((prev) => ({
                    ...prev,
                    header_title: data.header_title || '',
                    footer_title: data.footer_title || '',
                    header_description: data.header_description || '',
                    footer_description: data.footer_description || '',
                }));
                setExistingImages({
                    logos_url: data.logos_url || '',
                    banner_url: data.banner_url || '',
                    favicon_url: data.favicon_url || '',
                });
            }
        } catch (error) {
            console.error('Error loading appearance settings:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const submitForm = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append('header_title', formData.header_title);
            payload.append('footer_title', formData.footer_title);
            payload.append('header_description', formData.header_description);
            payload.append('footer_description', formData.footer_description);
            if (logos) payload.append('logos', logos);
            if (banner) payload.append('banner', banner);
            if (favicon) payload.append('favicon', favicon);
            await apiClient.post('/club-settings-appearance', payload);
            alert('Appearance settings saved successfully!');
        } catch (error) {
            console.error('Error saving appearance settings:', error);
            alert(error.response?.data?.message || 'Unable to save appearance settings.');
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
                    <h5 className="role" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '32px', lineHeight: '100%', letterSpacing: '0%' }}>Appearance & Branding</h5>
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '22.88px', lineHeight: '100%', letterSpacing: '0%', color: '#4C4036' }}>Each club has its own design Preference, let us know yours.</p>
                    <br /><br />
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <h5>Header Customization</h5>
                            <label htmlFor="header_title">Title</label>
                            <input type="text" id="header_title" name="header_title" className="form-control" value={formData.header_title} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <h5>Footer Customization</h5>
                            <label htmlFor="footer_title">Title</label>
                            <input type="text" id="footer_title" name="footer_title" className="form-control" value={formData.footer_title} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="header_description">Description</label>
                            <textarea id="header_description" name="header_description" className="form-control" value={formData.header_description} onChange={handleChange}></textarea>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="footer_description">Description</label>
                            <textarea id="footer_description" name="footer_description" className="form-control" value={formData.footer_description} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="logos"> Logo </label>
                            <input type="file" id="logos" className="form-control" accept="image/*" onChange={(e) => setLogos(e.target.files?.[0] || null)} />
                            {existingImages.logos_url && !logos && (
                                <img src={existingImages.logos_url} alt="Current logos" className="mt-2 rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            )}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="banner"> Club Banner and Cover Image </label>
                            <input type="file" id="banner" className="form-control" accept="image/*" onChange={(e) => setBanner(e.target.files?.[0] || null)} />
                            {existingImages.banner_url && !banner && (
                                <img src={existingImages.banner_url} alt="Current banner" className="mt-2 rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="favicon"> Favicon </label>
                            <input type="file" id="favicon" className="form-control" accept="image/*" onChange={(e) => setFavicon(e.target.files?.[0] || null)} />
                            {existingImages.favicon_url && !favicon && (
                                <img src={existingImages.favicon_url} alt="Current favicon" className="mt-2 rounded" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                            )}
                        </div>
                    </div>
                    <div className="button-group" style={{ justifyContent: 'left' }}>
                        <button type="button" className="btn btn-sm" id="e-view" onClick={loadSettings}> Cancel</button>
                        <button type="submit" className="btn btn-sm" id="edit" disabled={isSaving}> {isSaving ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Step2Appearance;
