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
        <div className="row mb-3">
            {options.map((option) => (
                <div className="col-md-4 mb-2" key={option.value}>
                    <div className="premium-radio">
                        <input type="radio" id={`${name}-${option.value}`} name={name} value={option.value} checked={value === option.value} onChange={(e) => onChange(e.target.value)} />
                        <label htmlFor={`${name}-${option.value}`}>
                            <div className="premium-radio-circle"></div>
                            <div className="premium-radio-content">
                                <div className="premium-radio-title">
                                    {option.label}
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Step4ContentSignup({ formData, updateFormData, onPrevious, onNext, onSkip }) {
    const sections = ['News', 'Events', 'Galleries', 'Competitions'];
    return (
        <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <label htmlFor="website">Website Sections</label>
            <div className="row">
                {sections.map((section) => (
                    <div className="col-md-3" key={section}>
                        <label className="form-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }}>
                            <input type="radio" name="website_sections" checked={formData.website_sections === section} onChange={() => updateFormData({ website_sections: section })} />
                            <span>{section}</span>
                        </label>
                    </div>
                ))}
            </div>
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="homepage">Homepage Content Blocks</label>
                    <RadioGroup name="homepage" options={HOMEPAGE_OPTIONS} value={formData.comment_preference} onChange={(value) => updateFormData({ comment_preference: value })} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="reminder">Reminders</label>
                    <RadioGroup name="reminder" options={REMINDER_OPTIONS} value={formData.reminders} onChange={(value) => updateFormData({ reminders: value })} />
                </div>
            </div>
            <div className="button-group" style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', alignItems: 'center' }}>
                <button className="btn" id="e-view" type="button" onClick={onPrevious}>Previous</button>
                <button className="btn" id="e-edit" type="button" onClick={onNext}>Next</button>
                <a href="#" style={{ color: '#cc445e' }} onClick={(event) => { event.preventDefault(); onSkip?.(); }}>Skip</a>
            </div>
        </div>
    );
}
export default Step4ContentSignup;
