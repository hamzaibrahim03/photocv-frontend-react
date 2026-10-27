import React from 'react';

const HOMEPAGE_OPTIONS = [
    { label: 'All', value: 'All' },
    { label: 'Fewer', value: 'Fewer' },
    { label: 'Fewest', value: 'Fewest' },
];
const REMINDER_OPTIONS = [
    { label: 'All', value: 'all' },
    { label: 'Some', value: 'some' },
    { label: 'None', value: 'none' },
];

function RadioGroup({ name, options, value, onChange }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {options.map((option) => (
                <div className="premium-radio" key={option.value} style={{ flex: '1 1 90px' }}>
                    <input type="radio" id={`${name}-${option.value}`} name={name} value={option.value} checked={value === option.value} onChange={(e) => onChange(e.target.value)} />
                    <label htmlFor={`${name}-${option.value}`}>
                        <div className="premium-radio-circle"></div>
                        <div className="premium-radio-content">
                            <div className="premium-radio-title">{option.label}</div>
                        </div>
                    </label>
                </div>
            ))}
        </div>
    );
}

function Step4ContentSignup({ formData, updateFormData, onPrevious, onNext, onSkip }) {
    const sections = ['News', 'Events', 'Galleries', 'Competitions'];
    return (
        <div className="sp-form">
            <div className="sp-field">
                <label>Website Sections</label>
                <div className="sp-tile-grid">
                    {sections.map((section) => (
                        <label key={section} className={`sp-tile ${formData.website_sections === section ? 'active' : ''}`}  style={{ padding: '11px 22px'}} >
                            <input type="checkbox" name="website_sections" checked={formData.website_sections === section} onChange={() => updateFormData({ website_sections: section })} style={{width: '20px', height: '20px'}}/>
                            <span style={{fontSize: '20px'}}>{section}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="sp-row">
                <div className="sp-field">
                    <label>Homepage Content Blocks</label>
                    <RadioGroup name="homepage" options={HOMEPAGE_OPTIONS} value={formData.comment_preference} onChange={(value) => updateFormData({ comment_preference: value })} />
                </div>
                <div className="sp-field">
                    <label>Reminders</label>
                    <RadioGroup name="reminder" options={REMINDER_OPTIONS} value={formData.reminders} onChange={(value) => updateFormData({ reminders: value })} />
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
export default Step4ContentSignup;
