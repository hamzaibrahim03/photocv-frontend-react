import React, { useState } from 'react';

function TagInput({ label, placeholder, values, onChange }) {
    const [draft, setDraft] = useState('');

    const addTag = () => {
        const value = draft.trim();
        if (!value) return;
        if (!values.includes(value)) onChange([...values, value]);
        setDraft('');
    };

    const removeTag = (tag) => onChange(values.filter((v) => v !== tag));

    return (
        <div className="sp-field">
            <label>{label}</label>
            <input type="text" className="sp-input" placeholder={placeholder} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }} onBlur={addTag} />
            {values.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                    {values.map((tag) => (
                        <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f7f3ee', color: '#cc445e', borderRadius: '20px', padding: '5px 12px', fontSize: '13px' }}>
                            {tag}
                            <i className="fa-solid fa-xmark" style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)}></i>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function Step3ProfileSignup({ formData, updateFormData, onPrevious, onNext, onSkip }) {
    return (
        <div className="sp-form">
            <div className="sp-row">
                <div className="sp-field">
                    <label htmlFor="about">About</label>
                    <textarea id="about" className="sp-input" rows="4" value={formData.about} onChange={(e) => updateFormData({ about: e.target.value })} placeholder="Tell people a bit about yourself and your photography." />
                </div>
                <div className="sp-field">
                    <label>Profile Privacy</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="premium-radio">
                            <input type="radio" id="public" name="public" value="public" />
                            <label htmlFor="public">
                                <span className="premium-radio-circle" />
                                <span className="premium-radio-content">
                                    <span className="premium-radio-title">Public</span>
                                </span>
                            </label>
                        </div>
                        <div className="premium-radio">
                            <input type="radio" id="private" name="private" value="private" />
                            <label htmlFor="private">
                                <span className="premium-radio-circle" />
                                <span className="premium-radio-content">
                                    <span className="premium-radio-title">Private</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sp-row">
                <div className="sp-field">
                    <label htmlFor="header-text">Header Customization</label>
                    <textarea id="header-text" className="sp-input" rows="5" value={formData.header_text} onChange={(e) => updateFormData({ header_text: e.target.value })} placeholder="Text here..." />
                </div>
                <div className="sp-field">
                    <label htmlFor="footer-text">Footer Customization</label>
                    <textarea id="footer-text" className="sp-input" rows="3" value={formData.footer_text} onChange={(e) => updateFormData({ footer_text: e.target.value })} placeholder="Text here..." />
                </div>
            </div>
            <div className="sp-row">
                <TagInput label="Brands" placeholder="e.g. Sony" values={formData.brands} onChange={(brands) => updateFormData({ brands })} />
                <TagInput label="Interests" placeholder="e.g. Nature Photography" values={formData.interests} onChange={(interests) => updateFormData({ interests })} />
            </div>
            <div className="sp-actions">
                <button className="btn" id="e-view" type="button" onClick={onPrevious}>Previous</button>
                <button className="btn" id="edit" type="button" onClick={onNext}>Next</button>
                <a className="sp-skip-link" onClick={(event) => { event.preventDefault(); onSkip?.(); }}>Skip this step</a>
            </div>
        </div>
    );
}
export default Step3ProfileSignup;
