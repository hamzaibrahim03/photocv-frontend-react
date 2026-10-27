import React from 'react';

function SocialField({ id, label, enabled, link, onToggle, onLinkChange }) {
    return (
        <div className="sp-field">
            <label htmlFor={id}>{label}</label>
            <label className="sp-domain-option" htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px' }}>
                <input type="checkbox" id={id} checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
                <input type="text" className="sp-input" style={{ border: 'none', padding: '0', flex: '1' }} placeholder={`${label} link....`} value={link} disabled={!enabled} onChange={(e) => onLinkChange(e.target.value)} onClick={(e) => e.stopPropagation()} />
            </label>
        </div>
    );
}

function Step4ContactSignup({ formData, updateFormData, onPrevious, onNext, onSkip }) {
    return (
        <div className="sp-form">
            <div className="sp-row">
                <div className="sp-field">
                    <label htmlFor="contact-email">Email</label>
                    <input id="contact-email" type="email" className="sp-input" value={formData.contact_email} onChange={(e) => updateFormData({ contact_email: e.target.value })} placeholder="Text here..." />
                </div>
                <div className="sp-field">
                    <label htmlFor="contact-phone">Phone</label>
                    <input id="contact-phone" type="text" className="sp-input" value={formData.phone} onChange={(e) => updateFormData({ phone: e.target.value })} placeholder="Text here..." />
                </div>
            </div>
            <div className="sp-row">
                <div className="sp-field">
                    <label htmlFor="contact-address">Address</label>
                    <textarea id="contact-address" className="sp-input" rows="3" value={formData.address} onChange={(e) => updateFormData({ address: e.target.value })} placeholder="Text here..." />
                </div>
            </div>
            <div className="sp-section-label">Social Media Links</div>
            <div className="sp-row">
                <SocialField id="facebook-enabled" label="Facebook" enabled={formData.facebook_enabled} link={formData.facebook} onToggle={(v) => updateFormData({ facebook_enabled: v })} onLinkChange={(v) => updateFormData({ facebook: v })} />
                <SocialField id="instagram-enabled" label="Instagram" enabled={formData.instagram_enabled} link={formData.instagram} onToggle={(v) => updateFormData({ instagram_enabled: v })} onLinkChange={(v) => updateFormData({ instagram: v })} />
                <SocialField id="flickr-enabled" label="Flickr" enabled={formData.flickr_enabled} link={formData.flickr} onToggle={(v) => updateFormData({ flickr_enabled: v })} onLinkChange={(v) => updateFormData({ flickr: v })} />
            </div>
            <div className="sp-actions">
                <button className="btn" id="e-view" type="button" onClick={onPrevious}>Previous</button>
                <button className="btn" id="edit" type="button" onClick={onNext}>Next</button>
                <a className="sp-skip-link" onClick={(event) => { event.preventDefault(); onSkip?.(); }}>Skip this step</a>
            </div>
        </div>
    );
}
export default Step4ContactSignup;
