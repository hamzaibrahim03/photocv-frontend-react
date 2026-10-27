import React from 'react';

const REGISTRATION_OPTIONS = [
    { label: 'Open', value: 'open' },
    { label: 'Invite', value: 'invite' },
    { label: 'Manual', value: 'manual_approval' },
];
const VISIBILITY_OPTIONS = [
    { label: 'Visible', value: 'visible' },
    { label: 'Club Only', value: 'club_only' },
];
const ENABLED_OPTIONS = [
    { label: 'Enable', value: 'enabled' },
    { label: 'Disable', value: 'disabled' },
];

function RadioGroup({ name, options, value, onChange }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {options.map((option) => (
                <div className="premium-radio" key={option.value} style={{ flex: '1 1 110px' }}>
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

function Step3MembershipSignup({ formData, updateFormData, onPrevious, onNext, onSkip }) {
    return (
        <div className="sp-form">
            <div className="sp-row">
                <div className="sp-field">
                    <label>Registration &amp; Access Control</label>
                    <RadioGroup name="access" options={REGISTRATION_OPTIONS} value={formData.registration} onChange={(value) => updateFormData({ registration: value })} />
                </div>
                <div className="sp-field">
                    <label>Members Directory Public Visibility</label>
                    <RadioGroup name="visible" options={VISIBILITY_OPTIONS} value={formData.directory_visibility} onChange={(value) => updateFormData({ directory_visibility: value })} />
                </div>
            </div>
            <div className="sp-row">
                <div className="sp-field">
                    <label>Comments</label>
                    <RadioGroup name="comments" options={ENABLED_OPTIONS} value={formData.comments} onChange={(value) => updateFormData({ comments: value })} />
                </div>
                <div className="sp-field">
                    <label>Likes</label>
                    <RadioGroup name="likes" options={ENABLED_OPTIONS} value={formData.likes} onChange={(value) => updateFormData({ likes: value })} />
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
export default Step3MembershipSignup;
