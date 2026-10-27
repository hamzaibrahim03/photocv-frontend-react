import React, { useEffect, useMemo, useState } from 'react';
import NavigationRoute from '../club_admin/NavigationRoute';
import HeaderRoute from '../club_admin/HeaderRoute';
import Loader from '../Ryton/extra/LoaderAll';
import c1 from '../club_admin/assets/images/dashboard/c1.jpg';
import apiClient from '../api/axios';

const TABS = ['General Settings', 'Appearance & Branding', 'Content Management', 'Privacy Settings', 'Account Settings'];


function RadioGroup({ label, name, value, options, onChange }) {
    return (
        <fieldset className="border-0 p-0 m-0">
            <legend className="form-label fw-medium d-block">{label}</legend>
            <div className="d-flex flex-wrap gap-3">
                {options.map((opt) => {
                    const id = `${name}-${opt.value}`;
                    return (
                        <div className="premium-radio" key={id}>
                            <input type="radio" id={id} name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} />
                            <label htmlFor={id}>
                                <span className="premium-radio-circle" />
                                <span className="premium-radio-content">
                                    <span className="premium-radio-title">{opt.label}</span>
                                </span>
                            </label>
                        </div>


                    );
                })}
            </div>
        </fieldset>
    );
}

const initialFormData = {
    header_title: '',
    footer_title: '',
    header_description: '',
    footer_description: '',

};

const PRESET_THEMES = {
    Default: { text: '#333333', primary: '#7FA483', background: '#FFFFFF', secondary: '#ECEDE6', accent: '#DD9757' },
    Greenish: { text: '#2f3b2f', primary: '#6b8f71', background: '#f1f6f1', secondary: '#cfe0d1', accent: '#3f7d4b' },
    Blueish: { text: '#2a3542', primary: '#5c7a99', background: '#eef3f8', secondary: '#cfdce8', accent: '#2f6fa8' },
    Greys: { text: '#333333', primary: '#8c8c8c', background: '#f4f4f4', secondary: '#dcdcdc', accent: '#595959' },
    5: { text: '#3a2e26', primary: '#b08968', background: '#faf3ea', secondary: '#e9d8c3', accent: '#d97e3d' },
    6: { text: '#2e2e3a', primary: '#7a6b99', background: '#f3f1f8', secondary: '#dcd4ec', accent: '#5e4b99' },
    7: { text: '#3a2e2e', primary: '#b06868', background: '#faf0f0', secondary: '#eacfcf', accent: '#a83f3f' },
};

const COLOR_ROLES = [
    { key: 'text', label: 'Text' },
    { key: 'primary', label: 'Primary' },
    { key: 'background', label: 'Background' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
];


const FONT_PRESETS = [
    { key: 'montserrat', heading: 'Montserrat', body: 'Charter' },
    { key: 'crimson', heading: 'Crimson Text', body: 'Oxygen' },
    { key: 'raleway', heading: 'Raleway', body: 'Roboto Slab' },
    { key: 'tahoma', heading: 'Tahoma', body: 'Bodu' }
];

const FONT_COMBO_POOL = [
    { heading: 'Playfair Display', subheading: 'Roboto Slab', body: 'Roboto' },
    { heading: 'Quando', subheading: 'Roboto Slab', body: 'Roboto' },
    { heading: 'Racing Sans One', subheading: 'Inter Tight', body: 'Inter' },
    { heading: 'Cormorant Garamond', subheading: 'Lato', body: 'Lato' },
    { heading: 'Abril Fatface', subheading: 'Mulish', body: 'Mulish' },
    { heading: 'Josefin Sans', subheading: 'Nunito Sans', body: 'Nunito Sans' },
    { heading: 'Libre Baskerville', subheading: 'Source Sans Pro', body: 'Source Sans Pro' },
    { heading: 'DM Serif Display', subheading: 'DM Sans', body: 'DM Sans' },
];

const GOOGLE_FONT_FAMILIES = [
    'Montserrat:wght@400;600;700', 'Charter', 'Crimson+Text:wght@400;600', 'Oxygen',
    'Raleway:wght@400;600;700', 'Roboto+Slab:wght@400;600', 'Playfair+Display:wght@400;700',
    'Roboto:wght@400;600', 'Quando', 'Racing+Sans+One', 'Inter+Tight:wght@400;600', 'Inter:wght@400;600',
    'Cormorant+Garamond:wght@400;600', 'Lato:wght@400;600', 'Abril+Fatface', 'Mulish:wght@400;600',
    'Josefin+Sans:wght@400;600', 'Nunito+Sans:wght@400;600', 'Libre+Baskerville:wght@400;700',
    'Source+Sans+Pro:wght@400;600', 'DM+Serif+Display', 'DM+Sans:wght@400;600',
];

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x) => Math.round(255 * x).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function randomColorForRole(role, hue) {
    switch (role) {
        case 'text': return hslToHex(hue, 20, 20);
        case 'primary': return hslToHex(hue, 40, 45);
        case 'background': return hslToHex(hue, 25, 97);
        case 'secondary': return hslToHex(hue, 30, 80);
        case 'accent': return hslToHex((hue + 150) % 360, 55, 48);
        default: return '#000000';
    }
}

function randomPalette() {
    const hue = Math.floor(Math.random() * 360);
    const palette = {};
    COLOR_ROLES.forEach(({ key }) => { palette[key] = randomColorForRole(key, hue); });
    return palette;
}

function generatePalettes(count = 6) {
    return Array.from({ length: count }, () => ({ id: Math.random().toString(36).slice(2), colors: randomPalette() }));
}

function pickFontCombos(count = 4) {
    const shuffled = [...FONT_COMBO_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function Swatch({ color }) {
    return <span style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '4px', backgroundColor: color, border: '1px solid rgba(0,0,0,0.1)' }}></span>;
}


const DEFAULT_SETTINGS = {
    general: {
        name: '', tagline: '', about: '', domain_type: 'subdomain', domainName: '',
        timezone: 'UTC', privacy: 'public', email: '', phone: '', address: '',
        facebook: '', facebookEnabled: false, instagram: '', instagramEnabled: false,
        flickr: '', flickrEnabled: false,
    },
    appearance: {
        headerTitle: '', headerDescription: '', footerTitle: '', footerDescription: '',
    },
    content: {
        allowComments: 'enable', reminders: 'all', galleryDisplay: 'enable',
        exifDetails: 'enable', allowDownload: 'enable', allowSharing: 'enable', visibility: 'public',
    },
    privacy: {
        gdpr: '', cookiesEnabled: true, cookiesText: '', dataCollectionEnabled: true,
        dataCollectionText: '', allowReporting: true, reportingText: '',
    },
};

function PhotographerSettings() {
    const [formData, setFormData] = useState(initialFormData);
    const [activeTab, setActiveTab] = useState(0);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [account, setAccount] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [totals, setTotals] = useState({ totalPhotos: 0, totalLikes: 0, totalComments: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('Default');
    const [colors, setColors] = useState(PRESET_THEMES.Default);
    const [fontCombo, setFontCombo] = useState(FONT_PRESETS[0]);

    const [showGenerator, setShowGenerator] = useState(false);
    const [generatedPalettes, setGeneratedPalettes] = useState([]);
    const [generatedFontCombos, setGeneratedFontCombos] = useState([]);

    const [isCustomFont, setIsCustomFont] = useState(false);
    const [loadedCustomFonts, setLoadedCustomFonts] = useState(() => new Set());
    const loadAll = async () => {
        setIsLoading(true);
        try {
            const [settingsRes, profileRes] = await Promise.all([
                apiClient.get('/member-admin/website-settings').catch(() => null),
                apiClient.get('/member-admin/profile/portfolio').catch(() => null),
            ]);
            const saved = settingsRes?.data?.data;
            if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
                setSettings(prev => ({
                    general: { ...DEFAULT_SETTINGS.general, ...(prev?.general || {}), ...(saved.general || {}), domain_type: saved.general?.domain_type || (saved.general?.domainType === 'custom' ? 'customdomain' : saved.general?.domainType) || prev?.general?.domain_type || DEFAULT_SETTINGS.general.domain_type },
                    appearance: { ...DEFAULT_SETTINGS.appearance, ...(prev?.appearance || {}), ...(saved.appearance || {}) },
                    content: { ...DEFAULT_SETTINGS.content, ...(prev?.content || {}), ...(saved.content || {}) },
                    privacy: { ...DEFAULT_SETTINGS.privacy, ...(prev?.privacy || {}), ...(saved.privacy || {}) },
                }));
            }
            const memberInfo = profileRes?.data?.member_info?.original?.data;
            const galleryData = profileRes?.data?.gallery?.original?.data;
            if (memberInfo) {
                setAccount(prev => ({ ...prev, name: [memberInfo.first_name, memberInfo.last_name].filter(Boolean).join(' '), email: memberInfo.email || '' }));
                setSettings(prev => ({ ...DEFAULT_SETTINGS, ...prev, general: { ...DEFAULT_SETTINGS.general, ...(prev?.general || {}), name: prev?.general?.name || [memberInfo.first_name, memberInfo.last_name].filter(Boolean).join(' '), email: prev?.general?.email || memberInfo.email || '' } }));
            }
            setTotals({
                totalPhotos: galleryData?.total_photos ?? 0,
                totalLikes: galleryData?.total_likes ?? 0,
                totalComments: galleryData?.total_comments ?? 0,
            });
            await loadSettings();
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadAll(); }, []);

    const updateField = (tab, key, value) => setSettings(prev => ({ ...DEFAULT_SETTINGS, ...prev, [tab]: { ...DEFAULT_SETTINGS[tab], ...(prev?.[tab] || {}), [key]: value } }));
    const g = settings?.general || DEFAULT_SETTINGS.general;
    const c = settings?.content || DEFAULT_SETTINGS.content;
    const p = settings?.privacy || DEFAULT_SETTINGS.privacy;
    const previewHeadingStyle = useMemo(() => ({ fontFamily: `'${fontCombo.heading}', serif`, color: colors.text }), [fontCombo, colors]);
    const previewBodyStyle = useMemo(() => ({ fontFamily: `'${fontCombo.body}', sans-serif`, color: colors.text }), [fontCombo, colors]);

    const handleSaveSettings = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            await apiClient.put('/member-admin/website-settings', { settings });
            setSaveMessage('Saved.');
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveMessage(error?.response?.data?.message || 'Unable to save settings.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    const handleSaveAccount = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            const nameParts = account.name.trim().split(/\s+/).filter(Boolean);
            const [first_name = '', ...rest] = nameParts;
            if (!first_name || !account.email.trim()) {
                setSaveMessage('Name and email are required.');
                return;
            }
            await apiClient.put('/profile/update', { first_name, last_name: rest.join(' '), email: account.email.trim() });
            setSaveMessage('Account details saved.');
        } catch (error) {
            console.error('Error saving account:', error);
            setSaveMessage(error?.response?.data?.message || 'Unable to save account details.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?${GOOGLE_FONT_FAMILIES.map((f) => `family=${f}`).join('&')}&display=swap`;
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    useEffect(() => {
        const names = [fontCombo.heading, fontCombo.body].filter(Boolean);
        const toLoad = names.filter((n) => !loadedCustomFonts.has(n));
        if (toLoad.length === 0) return;

        const timeout = setTimeout(() => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?${toLoad.map((n) => `family=${n.replace(/ /g, '+')}:wght@400;600;700`).join('&')}&display=swap`;
            document.head.appendChild(link);
            setLoadedCustomFonts((prev) => new Set([...prev, ...toLoad]));
        }, 500);
        return () => clearTimeout(timeout);
    }, [fontCombo.heading, fontCombo.body, loadedCustomFonts]);

    const loadSettings = async () => {
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
                setSettings((prev) => ({
                    ...prev,
                    appearance: {
                        ...prev.appearance,
                        headerTitle: data.header_title || '',
                        footerTitle: data.footer_title || '',
                        headerDescription: data.header_description || '',
                        footerDescription: data.footer_description || '',
                    },
                }));
                if (data.text_color || data.primary_color || data.background_color || data.secondary_color || data.accent_color) {
                    setColors({
                        text: data.text_color || PRESET_THEMES.Default.text,
                        primary: data.primary_color || PRESET_THEMES.Default.primary,
                        background: data.background_color || PRESET_THEMES.Default.background,
                        secondary: data.secondary_color || PRESET_THEMES.Default.secondary,
                        accent: data.accent_color || PRESET_THEMES.Default.accent,
                    });
                    setSelectedTheme(data.theme_colors || 'Custom');
                }
                if (data.fonts) {
                    try {
                        const parsed = JSON.parse(data.fonts);
                        if (parsed?.heading && parsed?.body) {
                            setFontCombo(parsed);
                            const isKnown = FONT_PRESETS.some((p) => p.heading === parsed.heading)
                                || FONT_COMBO_POOL.some((c) => c.heading === parsed.heading);
                            setIsCustomFont(!isKnown);
                        }
                    } catch { /* keep default */ }
                }
            }
        } catch (error) {
            console.error('Error loading appearance settings:', error);
        }
    };

    const applyTheme = (name) => {
        setSelectedTheme(name);
        if (PRESET_THEMES[name]) setColors(PRESET_THEMES[name]);
    };

    const updateColorRole = (role, value) => {
        setColors((prev) => ({ ...prev, [role]: value }));
        setSelectedTheme('Custom');
    };

    const openGenerator = () => {
        setGeneratedPalettes(generatePalettes());
        setGeneratedFontCombos(pickFontCombos());
        setShowGenerator(true);
    };

    const regenerateSwatch = (paletteId, role) => {
        setGeneratedPalettes((prev) => prev.map((p) => {
            if (p.id !== paletteId) return p;
            const hue = Math.floor(Math.random() * 360);
            return { ...p, colors: { ...p.colors, [role]: randomColorForRole(role, hue) } };
        }));
    };

    const applySwatch = (palette, role) => {
        updateColorRole(role, palette.colors[role]);
    };

    const applyPalette = (palette) => {
        setColors(palette.colors);
        setSelectedTheme('Custom');
    };

    const regenerateAll = () => {
        setGeneratedPalettes(generatePalettes());
        setGeneratedFontCombos(pickFontCombos());
    };

    const submitForm = async (e) => {
        e?.preventDefault?.();
        if (isSaving) return;
        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append('header_title', formData.header_title);
            payload.append('footer_title', formData.footer_title);
            payload.append('header_description', formData.header_description);
            payload.append('footer_description', formData.footer_description);
            payload.append('theme_colors', selectedTheme);
            payload.append('text_color', colors.text);
            payload.append('primary_color', colors.primary);
            payload.append('background_color', colors.background);
            payload.append('secondary_color', colors.secondary);
            payload.append('accent_color', colors.accent);
            payload.append('typography', fontCombo.heading);
            payload.append('fonts', JSON.stringify(fontCombo));
            await apiClient.post('/club-settings-appearance', payload, { headers: { 'Content-Type': undefined } });
            await loadSettings();
            alert('Appearance settings saved successfully!');
        } catch (error) {
            console.error('Error saving appearance settings:', error);
            alert(error.response?.data?.message || 'Unable to save appearance settings.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'white' }}>
            <Loader show={isLoading} />
            {!isLoading && (
                <>
                    <NavigationRoute />
                    <HeaderRoute title="Settings" />
                    <div className="content">
                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="dashboard-card">
                                    <div className="profile-card">
                                        <div className="profile-left">
                                            <img className="img-fluid rounded-circle" style={{ width: '64px', height: '64px', objectFit: 'cover' }} src={c1} alt="Profile" />
                                            <div className="profile-info">
                                                <small className="greeting">Viewing Core Website Settings</small>
                                                <h2 className="name">Settings</h2>
                                                <small className="role">All changes are applied instantly</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-section">
                                        <div className="stat-card">
                                            <small className="ca-details">My Photos</small>
                                            <h3 className="number">{totals.totalPhotos}</h3>
                                        </div>
                                        <div className="event-cards">
                                            <small className="ca-details">Interactions</small>
                                            <div className='row'>
                                                <div className='col-md-5'>
                                                    <h3 className="number">{totals.totalLikes + totals.totalComments}</h3>
                                                </div>
                                                <div className='col-md-7'>
                                                    <h3 className='days'>Likes & Comments</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="container" style={{ maxWidth: '1820px' }}>
                                <div className="card bg-white border-0 rounded shadow-sm p-4 mt-4">
                                    <div className="d-flex justify-content-between mb-4 flex-wrap gap-3">
                                        {TABS.map((tab, index) => (
                                            <div key={tab} className="d-flex flex-column align-items-center flex-grow-1" style={{ cursor: 'pointer' }} onClick={() => setActiveTab(index)}>
                                                <span className="d-flex align-items-center justify-content-center rounded-circle text-white mb-2" style={{ width: '36px', height: '36px', backgroundColor: index === activeTab ? '#cc445e' : '#ccc' }}>{index + 1}</span>
                                                <span className="small text-center" style={{ color: index === activeTab ? '#cc445e' : '#333', fontWeight: index === activeTab ? 600 : 400 }}>{tab}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {saveMessage && <div className="alert alert-light border mb-3 py-2">{saveMessage}</div>}

                                    {activeTab === 0 && (
                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Name</label>
                                                <input className="form-control" value={g.name} onChange={(e) => updateField('general', 'name', e.target.value)} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Tagline</label>
                                                <input className="form-control" value={g.tagline} onChange={(e) => updateField('general', 'tagline', e.target.value)} />
                                            </div>
                                            <div className="col-md-12">
                                                <label className="form-label fw-medium">About</label>
                                                <textarea className="form-control" rows="4" value={g.about} onChange={(e) => updateField('general', 'about', e.target.value)}></textarea>
                                            </div>
                                            <div className="col-md-6">
                                                <RadioGroup label="Domain Type" name="domain_type" value={g.domain_type} options={[{ value: 'customdomain', label: 'Custom Domain' }, { value: 'subdomain', label: 'Subdomain' }]} onChange={(v) => updateField('general', 'domain_type', v)} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Domain Name</label>
                                                <input className="form-control" value={g.domainName} onChange={(e) => updateField('general', 'domainName', e.target.value)} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Time Zone & Date</label>
                                                <select className="form-select" value={g.timezone} onChange={(e) => updateField('general', 'timezone', e.target.value)}>
                                                    <option value="">- Select -</option>
                                                    <option value="Europe/London">Europe/London</option>
                                                    <option value="America/New_York">America/New_York</option>
                                                    <option value="UTC">UTC</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <RadioGroup label="Website Privacy" name="privacy" value={g.privacy} options={[{ value: 'public', label: 'Public' }, { value: 'private', label: 'Private' }]} onChange={(v) => updateField('general', 'privacy', v)} />
                                            </div>
                                            <div className="col-md-12"><h6 className="head mt-2">Contact Details</h6></div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-medium">Email</label>
                                                <input type="email" className="form-control" value={g.email} onChange={(e) => updateField('general', 'email', e.target.value)} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-medium">Phone</label>
                                                <input className="form-control" value={g.phone} onChange={(e) => updateField('general', 'phone', e.target.value)} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-medium">Address</label>
                                                <input className="form-control" value={g.address} onChange={(e) => updateField('general', 'address', e.target.value)} />
                                            </div>
                                            <div className="col-md-12"><h6 className="head mt-2">Social Media Links</h6></div>
                                            {[['facebook', 'Facebook'], ['instagram', 'Instagram'], ['flickr', 'Flickr']].map(([key, label]) => (
                                                <div className="col-md-4" key={key}>
                                                    <label className="form-label fw-medium">{label}</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><input type="checkbox" checked={Boolean(g[`${key}Enabled`])} onChange={(e) => updateField('general', `${key}Enabled`, e.target.checked)} /></span>
                                                        <input className="form-control" placeholder={`${label} link...`} value={g[key] || ''} onChange={(e) => updateField('general', key, e.target.value)} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 1 && (
                                        <div>
                                            <div className="row">
                                                <div className="col-md-6 mb-4">
                                                    <h5>Theme & Colors</h5>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                                                        {[...Object.keys(PRESET_THEMES), 'Custom'].map((name) => (
                                                            <label key={name} style={{ display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer', minWidth: '110px' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <input type="radio" name="theme" checked={selectedTheme === name} onChange={() => applyTheme(name)} />
                                                                    {name}
                                                                </span>
                                                                {name !== 'Custom' ? (
                                                                    <span style={{ display: 'flex', borderRadius: '4px', overflow: 'hidden', height: '14px' }}>
                                                                        {Object.values(PRESET_THEMES[name]).map((c, i) => (
                                                                            <span key={i} style={{ flex: '1', backgroundColor: c }}></span>
                                                                        ))}
                                                                    </span>
                                                                ) : (
                                                                    <span style={{ fontSize: '12px', color: '#cc445e' }}>Pick your own below</span>
                                                                )}
                                                            </label>
                                                        ))}
                                                    </div>

                                                    <div style={{ marginBottom: '8px', fontWeight: '600', color: '#4c4036' }}>Choose Specific Colours</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                        {COLOR_ROLES.map(({ key, label }) => (
                                                            <label key={key} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e5ded7', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', position: 'relative' }}>
                                                                <Swatch color={colors[key]} />
                                                                {label}
                                                                <input type="color" value={colors[key]} onChange={(e) => updateColorRole(key, e.target.value)} style={{ position: 'absolute', inset: '0', opacity: '0', cursor: 'pointer' }} />
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="col-md-6 mb-4">
                                                    <h5>Try the Look & Feel wizard</h5>
                                                    <button type="button" className="btn" id="edit" onClick={openGenerator} style={{ width: '161px', maxWidth: '161px' }}>Generate Palettes</button>

                                                    <h5 style={{ marginTop: '24px' }}>Typography & Fonts</h5>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                        {FONT_PRESETS.map((preset) => (
                                                            <div key={preset.key} onClick={() => { setFontCombo(preset); setIsCustomFont(false); }} style={{ border: fontCombo.heading === preset.heading ? '2px solid #cc445e' : '1px solid #e5ded7', borderRadius: '8px', padding: '12px', cursor: 'pointer' }} >
                                                                <div style={{ fontFamily: `'${preset.heading}', serif`, fontSize: '20px', textTransform: 'uppercase' }}>{preset.heading}</div>
                                                                <div style={{ fontFamily: `'${preset.body}', sans-serif`, fontSize: '13px', textTransform: 'uppercase', color: '#99816b' }}>{preset.body}</div>
                                                                <p style={{ fontFamily: `'${preset.body}', sans-serif`, fontSize: '11px', color: '#777', margin: '6px 0 0' }}>
                                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                                </p>
                                                            </div>
                                                        ))}
                                                        <div onClick={() => setIsCustomFont(true)} style={{ border: isCustomFont ? '2px solid #cc445e' : '1px dashed #cc445e', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cc445e', cursor: 'pointer' }} >
                                                            Custom
                                                        </div>
                                                    </div>

                                                    {isCustomFont && (
                                                        <div style={{ marginTop: '12px', border: '1px solid #e5ded7', borderRadius: '8px', padding: '12px' }}>
                                                            <div className="row g-2">
                                                                <div className="col-md-6">
                                                                    <label className="form-label small mb-1">Heading font (any Google Font name)</label>
                                                                    <input type="text" className="form-control" placeholder="e.g. Bebas Neue" value={fontCombo.heading} onChange={(e) => setFontCombo((prev) => ({ ...prev, heading: e.target.value }))} />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <label className="form-label small mb-1">Body font (any Google Font name)</label>
                                                                    <input type="text" className="form-control" placeholder="e.g. Work Sans" value={fontCombo.body} onChange={(e) => setFontCombo((prev) => ({ ...prev, body: e.target.value }))} />
                                                                </div>
                                                            </div>
                                                            {(fontCombo.heading || fontCombo.body) && (
                                                                <div style={{ marginTop: '10px', padding: '10px', background: '#f7f3ee', borderRadius: '6px' }}>
                                                                    <div style={{ fontFamily: `'${fontCombo.heading}', serif`, fontSize: '20px' }}>{fontCombo.heading || 'Heading preview'}</div>
                                                                    <p style={{ fontFamily: `'${fontCombo.body}', sans-serif`, fontSize: '13px', color: '#777', margin: '4px 0 0' }}>
                                                                        {fontCombo.body ? `${fontCombo.body} - Lorem ipsum dolor sit amet, consectetur adipiscing elit.` : 'Body preview'}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {showGenerator && (
                                                <div style={{ background: '#fff', border: '1px solid #e5ded7', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <h5 style={{ color: '#cc445e', margin: '0px' }}>Color Palette and Font Generator</h5>
                                                            <p style={{ color: '#777', fontSize: '13px', margin: '4px 0 0' }}>Generate fresh color palettes and font combos based on your principles.</p>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button type="button" className="btn" id="edit" style={{ width: '135px', maxWidth: '135px' }} onClick={regenerateAll}><i className="fas fa-rotate"></i> Regenerate</button>
                                                            <button type="button" className="btn" id="e-view" onClick={() => setShowGenerator(false)}>Close</button>
                                                        </div>
                                                    </div>

                                                    <h6 style={{ marginTop: '20px' }}>Theme & Colors</h6>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                                                        {generatedPalettes.map((palette, idx) => (
                                                            <div key={palette.id} style={{ border: '1px solid #e5ded7', borderRadius: '8px', padding: '12px' }}>
                                                                <div style={{ fontSize: '12px', fontWeight: '600', color: '#99816b', marginBottom: '8px' }}>Color Option {String(idx + 1).padStart(2, '0')}</div>
                                                                <div style={{ display: 'flex', gap: '8px', cursor: 'pointer' }} onClick={() => applyPalette(palette)} title="Apply this whole palette">
                                                                    {COLOR_ROLES.map(({ key, label }) => (
                                                                        <div key={key} style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                                                            <div style={{ width: '34px', height: '28px', borderRadius: '6px', backgroundColor: palette.colors[key], border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }} onClick={() => applySwatch(palette, key)} title={`Use this ${label.toLowerCase()} color`} ></div>
                                                                            <div style={{ fontSize: '9px', color: '#999', marginTop: '2px' }}>{label}</div>
                                                                            <button type="button" onClick={() => regenerateSwatch(palette.id, key)} style={{ border: 'none', background: 'none', color: '#99816b', fontSize: '11px', cursor: 'pointer', padding: '0px' }} title={`Regenerate ${label.toLowerCase()}`} >
                                                                                <i className="fas fa-rotate"></i>
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <h6 style={{ marginTop: '20px' }}>Font Combos</h6>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                                                        {generatedFontCombos.map((combo, idx) => (
                                                            <div key={idx} onClick={() => { setFontCombo(combo); setIsCustomFont(false); }} style={{ border: fontCombo.heading === combo.heading ? '2px solid #cc445e' : '1px solid #e5ded7', borderRadius: '8px', padding: '12px', cursor: 'pointer' }} >
                                                                <div style={{ fontFamily: `'${combo.heading}', serif`, fontSize: '18px' }}>{combo.heading}</div>
                                                                <div style={{ fontFamily: `'${combo.subheading}', sans-serif`, fontSize: '12px', color: '#777' }}>{combo.subheading}</div>
                                                                <div style={{ fontFamily: `'${combo.body}', sans-serif`, fontSize: '11px', color: '#777' }}>{combo.body}</div>
                                                                <p style={{ fontFamily: `'${combo.body}', sans-serif`, fontSize: '10px', color: '#999', margin: '6px 0 0' }}>
                                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <h6 style={{ marginTop: '20px' }}>Template Preview</h6>
                                                    <div style={{ border: '1px solid #e5ded7', borderRadius: '8px', overflow: 'hidden' }}>
                                                        <div style={{ backgroundColor: colors.background, padding: '24px' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                                <span style={{ ...previewHeadingStyle, fontSize: '22px' }}>{formData.header_title || 'Your Club Name'}</span>
                                                                <button type="button" style={{ background: colors.accent, color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontFamily: `'${fontCombo.body}', sans-serif` }}>
                                                                    Join Now
                                                                </button>
                                                            </div>
                                                            <p style={{ ...previewBodyStyle, fontSize: '13px', maxWidth: '480px' }}>
                                                                {formData.header_description || 'A friendly community of photographers sharing their passion, running competitions, and celebrating great images together.'}
                                                            </p>
                                                            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                                                {['News', 'Events', 'Galleries'].map((label) => (
                                                                    <span key={label} style={{ backgroundColor: colors.secondary, color: colors.text, borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontFamily: `'${fontCombo.body}', sans-serif` }}>{label}</span>
                                                                ))}
                                                            </div>
                                                            <div style={{ backgroundColor: colors.primary, borderRadius: '8px', padding: '16px', marginTop: '20px', color: '#fff' }}>
                                                                <div style={{ ...previewHeadingStyle, color: '#fff', fontSize: '16px' }}>Featured Competition</div>
                                                                <div style={{ ...previewBodyStyle, color: '#fff', fontSize: '12px', opacity: '0.9' }}>Open Competition &middot; closes in 5 days</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="row g-4">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-medium">Header Title</label>
                                                    <input className="form-control mb-3" value={formData.header_title} name="header_title" onChange={handleChange} />
                                                    <label className="form-label fw-medium">Header Description</label>
                                                    <textarea className="form-control" rows="3" value={formData.header_description} name="header_description" onChange={handleChange}></textarea>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-medium">Footer Title</label>
                                                    <input className="form-control mb-3" value={formData.footer_title} name="footer_title" onChange={handleChange} />
                                                    <label className="form-label fw-medium">Footer Description</label>
                                                    <textarea className="form-control" rows="3" value={formData.footer_description} name="footer_description" onChange={handleChange}></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 2 && (
                                        <div className="row g-4">
                                            <div className="col-md-6"><RadioGroup label="Allow Comments" name="allowComments" value={c.allowComments} options={[{ value: 'enable', label: 'Enable' }, { value: 'disable', label: 'Disable' }]} onChange={(v) => updateField('content', 'allowComments', v)} /></div>
                                            <div className="col-md-6"><RadioGroup label="Reminders" name="reminders" value={c.reminders} options={[{ value: 'all', label: 'All' }, { value: 'some', label: 'Some' }, { value: 'none', label: 'None' }]} onChange={(v) => updateField('content', 'reminders', v)} /></div>
                                            <div className="col-md-6"><RadioGroup label="Gallery Display & Sorting" name="galleryDisplay" value={c.galleryDisplay} options={[{ value: 'enable', label: 'Enable' }, { value: 'disable', label: 'Disable' }]} onChange={(v) => updateField('content', 'galleryDisplay', v)} /></div>
                                            <div className="col-md-6"><RadioGroup label="EXIF Details" name="exifDetails" value={c.exifDetails} options={[{ value: 'enable', label: 'Enable' }, { value: 'disable', label: 'Disable' }]} onChange={(v) => updateField('content', 'exifDetails', v)} /></div>
                                            <div className="col-md-6"><RadioGroup label="Allow Photo Download" name="allowDownload" value={c.allowDownload} options={[{ value: 'enable', label: 'Enable' }, { value: 'disable', label: 'Disable' }]} onChange={(v) => updateField('content', 'allowDownload', v)} /></div>
                                            <div className="col-md-6"><RadioGroup label="Allow Sharing of Photos" name="allowSharing" value={c.allowSharing} options={[{ value: 'enable', label: 'Enable' }, { value: 'disable', label: 'Disable' }]} onChange={(v) => updateField('content', 'allowSharing', v)} /></div>
                                            <div className="col-md-12"><RadioGroup label="Visibility for New Upload" name="visibility" value={c.visibility} options={[{ value: 'public', label: 'Public' }, { value: 'private', label: 'Private' }, { value: 'members', label: 'Members Only' }, { value: 'club', label: 'My Club Only' }]} onChange={(v) => updateField('content', 'visibility', v)} /></div>
                                        </div>
                                    )}

                                    {activeTab === 3 && (
                                        <div>
                                            <label className="form-label fw-medium">GDPR & Privacy Management</label>
                                            <input className="form-control mb-4" value={p.gdpr} onChange={(e) => updateField('privacy', 'gdpr', e.target.value)} placeholder="Text here..." />
                                            <h6 className="head mb-3">User Consent Settings</h6>
                                            <div className="row g-4 mb-4">
                                                <div className="col-md-6">
                                                    <label className="d-flex align-items-center gap-2 fw-medium mb-2"><input type="checkbox" checked={p.cookiesEnabled} onChange={(e) => updateField('privacy', 'cookiesEnabled', e.target.checked)} />Cookies</label>
                                                    <textarea className="form-control" rows="4" value={p.cookiesText} onChange={(e) => updateField('privacy', 'cookiesText', e.target.value)}></textarea>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="d-flex align-items-center gap-2 fw-medium mb-2"><input type="checkbox" checked={p.dataCollectionEnabled} onChange={(e) => updateField('privacy', 'dataCollectionEnabled', e.target.checked)} />Data Collection Preferences</label>
                                                    <textarea className="form-control" rows="4" value={p.dataCollectionText} onChange={(e) => updateField('privacy', 'dataCollectionText', e.target.value)}></textarea>
                                                </div>
                                            </div>
                                            <h6 className="head mb-3">Content Moderation & Reporting</h6>
                                            <label className="d-flex align-items-center gap-2 fw-medium mb-2"><input type="checkbox" checked={p.allowReporting} onChange={(e) => updateField('privacy', 'allowReporting', e.target.checked)} />Allow Reporting</label>
                                            <textarea className="form-control" rows="4" value={p.reportingText} onChange={(e) => updateField('privacy', 'reportingText', e.target.value)}></textarea>
                                        </div>
                                    )}

                                    {activeTab === 4 && (
                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Name</label>
                                                <input className="form-control" value={account.name} onChange={(e) => setAccount(prev => ({ ...prev, name: e.target.value }))} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Email</label>
                                                <input type="email" className="form-control" value={account.email} onChange={(e) => setAccount(prev => ({ ...prev, email: e.target.value }))} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Password</label>
                                                <input type="password" className="form-control" value={account.password} onChange={(e) => setAccount(prev => ({ ...prev, password: e.target.value }))} disabled />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium">Confirm Password</label>
                                                <input type="password" className="form-control" value={account.confirmPassword} onChange={(e) => setAccount(prev => ({ ...prev, confirmPassword: e.target.value }))} disabled />
                                            </div>
                                            <div className="col-md-12">
                                                <p className="small text-muted mb-0">Password changes aren't available from this screen yet — use "Forgot Password" on the login page to reset it.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="d-flex gap-2 mt-4 pt-3 border-top">
                                        <button type="button" className="btn" id="e-view" onClick={loadAll}>Cancel</button>
                                        <button type="button" className="btn" id="edit" disabled={isSaving} onClick={activeTab === 4 ? handleSaveAccount : activeTab === 1 ? submitForm : handleSaveSettings}>
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </button>
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
                </>
            )}
        </div>
    );
}
export default PhotographerSettings;
