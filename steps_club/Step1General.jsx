import { useState, useEffect } from "react";
import apiClient from "../src/api/axios";
const initialFormData = {
    name: '',
    tagline: '',
    about: '',
    contact_details: '',
    domain_type: 'customdomain',
    domain_name: '',
    timezone_offset: '+05:00',
    privacy: 'Public',
};
function Step1General() {
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
            const response = await apiClient.get('/club-settings-general');
            const data = response.data?.data || response.data;
            if (data) {
                setFormData((prev) => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error loading general settings:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const submitForm = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        try {
            await apiClient.post('/club-settings-general', formData);
            alert('General settings saved successfully!');
        } catch (error) {
            console.error('Error saving general settings:', error);
            alert(error.response?.data?.message || 'Unable to save general settings.');
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
                    <h5 className="role" style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: '32px', lineHeight: '100%', letterSpacing: '0%' }}>General Settings</h5>
                    <p style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: '22.88px', lineHeight: '100%', letterSpacing: '0%', color: '#4C4036' }}>We need just a few basic details of the club</p>
                    <br /><br />
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="name"> Club Name </label>
                            <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="tagline"> Club Tagline </label>
                            <input type="text" id="tagline" name="tagline" className="form-control" value={formData.tagline} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="about"> About </label>
                            <textarea id="about" name="about" className="form-control" value={formData.about} onChange={handleChange}></textarea>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="contact_details"> Contact Details </label>
                            <textarea id="contact_details" name="contact_details" className="form-control" value={formData.contact_details} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="domain_type">Domain Type</label>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="premium-radio">
                                        <input type="radio" id="customdomain" name="domain_type" value="customdomain" checked={formData.domain_type === 'customdomain'} onChange={handleChange} />&nbsp;
                                        <label htmlFor="customdomain">
                                            <div className="premium-radio-circle"></div>
                                            <div className="premium-radio-content">
                                                <div className="premium-radio-title">
                                                    Custom Domain
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="premium-radio">
                                        <input type="radio" id="Subdomain" name="domain_type" value="Subdomain" checked={formData.domain_type === 'Subdomain'} onChange={handleChange} />&nbsp;
                                        <label htmlFor="Subdomain">
                                            <div className="premium-radio-circle"></div>
                                            <div className="premium-radio-content">
                                                <div className="premium-radio-title">
                                                    Sub Domain
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="domain_name"> Domain Name </label>
                            <input type="text" id="domain_name" name="domain_name" className="form-control" value={formData.domain_name} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="timezone_offset"> Time Zone & Date </label>
                            <select name="timezone_offset" id="timezone_offset" className="form-control" value={formData.timezone_offset} onChange={handleChange}>
                                <option value="-12:00">(GMT -12:00) Eniwetok, Kwajalein</option>
                                <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
                                <option value="-10:00">(GMT -10:00) Hawaii</option>
                                <option value="-09:50">(GMT -9:30) Taiohae</option>
                                <option value="-09:00">(GMT -9:00) Alaska</option>
                                <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                                <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                                <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                                <option value="-05:00">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                                <option value="-04:50">(GMT -4:30) Caracas</option>
                                <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                                <option value="-03:50">(GMT -3:30) Newfoundland</option>
                                <option value="-03:00">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                                <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
                                <option value="-01:00">(GMT -1:00) Azores, Cape Verde Islands</option>
                                <option value="+00:00">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                                <option value="+01:00">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
                                <option value="+02:00">(GMT +2:00) Kaliningrad, South Africa</option>
                                <option value="+03:00">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                                <option value="+03:50">(GMT +3:30) Tehran</option>
                                <option value="+04:00">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                                <option value="+04:50">(GMT +4:30) Kabul</option>
                                <option value="+05:00">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                                <option value="+05:50">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                                <option value="+05:75">(GMT +5:45) Kathmandu, Pokhara</option>
                                <option value="+06:00">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                                <option value="+06:50">(GMT +6:30) Yangon, Mandalay</option>
                                <option value="+07:00">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                                <option value="+08:00">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                                <option value="+08:75">(GMT +8:45) Eucla</option>
                                <option value="+09:00">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                                <option value="+09:50">(GMT +9:30) Adelaide, Darwin</option>
                                <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                                <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
                                <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                                <option value="+11:50">(GMT +11:30) Norfolk Island</option>
                                <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                                <option value="+12:75">(GMT +12:45) Chatham Islands</option>
                                <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
                                <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="privacy">Club Privacy</label>
                            <div className="row mb-3">
                                {[
                                    'Public',
                                    'Members Only',
                                    'Private'
                                ].map(privacy => (
                                    <div className="col-md-4 mb-2" key={privacy}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`privacy-${privacy}`} name="privacy" value={privacy} checked={formData.privacy === privacy} onChange={handleChange} />
                                            <label htmlFor={`privacy-${privacy}`}>
                                                <div className="premium-radio-circle"></div>
                                                <div className="premium-radio-content">
                                                    <div className="premium-radio-title">
                                                        {privacy}
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="button-group">
                        <button type="button" className="btn" id="e-view" onClick={loadSettings}>Cancel</button>
                        <button type="submit" className="btn" id="edit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Step1General;
