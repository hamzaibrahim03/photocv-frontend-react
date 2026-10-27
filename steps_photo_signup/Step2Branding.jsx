import React, { useEffect, useMemo, useState } from 'react';
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

function UploadBox({ id, label, file, onChange }) {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!(file instanceof File)) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    return (
        <div className="sp-field">
            <label htmlFor={id}>{label}</label>
            <label className="sp-upload-box" htmlFor={id}>
                {previewUrl ? (
                    <img className="preview" src={previewUrl} alt={label} />
                ) : (
                    <>
                        <i className="fa-regular fa-image" style={{ fontSize: '22px' }}></i>
                        <span>Click to upload</span>
                    </>
                )}
                <input id={id} type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0] || null)} />
            </label>
            {file && <div className="sp-upload-filename">{file.name}</div>}
        </div>
    );
}

function Step2BrandingSignup({ formData, updateFormData, onPrevious, onNext, onSkip }) {
    const [selectedTheme, setSelectedTheme] = useState(formData.color_theme || 'Default');
    const [colors, setColors] = useState(() => {
        if (formData.color_theme && PRESET_THEMES[formData.color_theme]) return PRESET_THEMES[formData.color_theme];
        return PRESET_THEMES.Default;
    });
    const [fontCombo, setFontCombo] = useState(() => {
        if (formData.fonts) {
            try { return JSON.parse(formData.fonts); } catch { /* fall through */ }
        }
        return FONT_PRESETS[0];
    });

    const [showGenerator, setShowGenerator] = useState(false);
    const [generatedPalettes, setGeneratedPalettes] = useState([]);
    const [generatedFontCombos, setGeneratedFontCombos] = useState([]);

    const [isCustomFont, setIsCustomFont] = useState(false);
    const [loadedCustomFonts, setLoadedCustomFonts] = useState(() => new Set());

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

    const previewHeadingStyle = useMemo(() => ({ fontFamily: `'${fontCombo.heading}', serif`, color: colors.text }), [fontCombo, colors]);
    const previewBodyStyle = useMemo(() => ({ fontFamily: `'${fontCombo.body}', sans-serif`, color: colors.text }), [fontCombo, colors]);

    useEffect(() => {
        updateFormData({ color_theme: selectedTheme, colors, fonts: JSON.stringify(fontCombo) });
    }, [selectedTheme, colors, fontCombo]);

    return (
        <div className="sp-form">
            <div className="row">
                <div className="col-md-6 mb-4">
                    <h5>Theme & Colors</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                        {[...Object.keys(PRESET_THEMES), 'Custom'].map((name) => (
                            <label key={name} style={{ display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer', minWidth: '110px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6 px' }}>
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
                            <label key={key} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e5ded7', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', cursor: 'pointer', position: 'relative' }}>
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
                            <h5 style={{ color: '#cc445e', margin: '0' }}>Color Palette and Font Generator</h5>
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
                                            <button type="button" onClick={() => regenerateSwatch(palette.id, key)} style={{ border: 'none', background: 'none', color: '#99816b', fontSize: '11px', cursor: 'pointer', padding: '0' }} title={`Regenerate ${label.toLowerCase()}`} >
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
                                <span style={{ ...previewHeadingStyle, fontSize: '22px' }}>{formData.username || 'Your Name'}</span>
                                <button type="button" style={{ background: colors.accent, color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontFamily: `'${fontCombo.body}', sans-serif` }}>
                                    View Portfolio
                                </button>
                            </div>
                            <p style={{ ...previewBodyStyle, fontSize: '13px', maxWidth: '480px' }}>
                                {formData.tag_line || 'A photographer sharing their passion for capturing great images.'}
                            </p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                {(formData.interests?.length ? formData.interests : ['Portraits', 'Landscape', 'Events']).slice(0, 3).map((label) => (
                                    <span key={label} style={{ backgroundColor: colors.secondary, color: colors.text, borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontFamily: `'${fontCombo.body}', sans-serif` }}>{label}</span>
                                ))}
                            </div>
                            <div style={{ backgroundColor: colors.primary, borderRadius: '8px', padding: '16px', marginTop: '20px', color: '#fff' }}>
                                <div style={{ ...previewHeadingStyle, color: '#fff', fontSize: '16px' }}>Latest Work</div>
                                <div style={{ ...previewBodyStyle, color: '#fff', fontSize: '12px', opacity: '0.9' }}>A preview of your best shots goes here</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="row">
                <div className='col-md-6'>
                    <UploadBox id="logo" label="Choose a Logo" file={formData.logo} onChange={(file) => updateFormData({ logo: file })} />
                </div>
                <div className='col-md-6'>
                    <UploadBox id="banner" label="Choose a Cover Image" file={formData.banner} onChange={(file) => updateFormData({ banner: file })} />
                </div>
            </div>
            <div className="sp-actions">
                <button className="btn" id="e-view" type="button" onClick={onPrevious}>Previous</button>
                <button className="btn" id="edit" type="button" onClick={onNext}>Next</button>
                <a className="sp-skip-link" onClick={(event) => { event.preventDefault(); onSkip?.(); }}>Skip this step</a>
            </div>
        </div>
    );
}
export default Step2BrandingSignup;
