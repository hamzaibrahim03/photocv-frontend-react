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

function RadioGroup({ name, options, value, onChange, columns = 4 }) {
    return (
        <div className="row mb-3">
            {options.map((option) => (
                <div className={`col-md-${columns} mb-2`} key={option.value}>
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

function Step3MembershipSignup({ formData, updateFormData, onPrevious, onNext, onSkip }) {
    return (
        <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="registration">Registration & Access Control</label>
                    <RadioGroup name="access" options={REGISTRATION_OPTIONS} value={formData.registration} onChange={(value) => updateFormData({ registration: value })} columns={4} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="members">Members Directory Public Visibility</label>
                    <RadioGroup name="visible" options={VISIBILITY_OPTIONS} value={formData.directory_visibility} onChange={(value) => updateFormData({ directory_visibility: value })} columns={6} />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="comments">Comments</label>
                    <RadioGroup name="comments" options={ENABLED_OPTIONS} value={formData.comments} onChange={(value) => updateFormData({ comments: value })} columns={6} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="likes">Likes</label>
                    <RadioGroup name="likes" options={ENABLED_OPTIONS} value={formData.likes} onChange={(value) => updateFormData({ likes: value })} columns={6} />
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
export default Step3MembershipSignup;
