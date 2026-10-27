import React from 'react';
function Step1GeneralSignup({ formData, updateFormData, onNext }) {
    const domainType = formData.domain_type;
    const setDomainType = (value) => updateFormData({ domain_type: value });
    const canContinue = formData.club_name.trim().length > 0 && formData.domain_name.trim().length > 0;
    return (
        <form className="sp-form" onSubmit={(e) => e.preventDefault()}>
            <div className="sp-section-label">Basic Details</div>
            <div className="sp-row">
                <div className="sp-field">
                    <label htmlFor="club-name">Club Name</label>
                    <input id="club-name" type="text" className="sp-input" value={formData.club_name} onChange={(e) => updateFormData({ club_name: e.target.value })} placeholder="e.g. Ryton Camera Club" />
                </div>
                <div className="sp-field">
                    <label htmlFor="club-tagline">Club Tagline</label>
                    <input id="club-tagline" type="text" className="sp-input" value={formData.tag_line} onChange={(e) => updateFormData({ tag_line: e.target.value })} placeholder="A short line about your club" />
                </div>
            </div>

            <div className="sp-section-label">Domain Type and Name Options</div>
            <div className="sp-row">
                <div>
                    <label className={`sp-domain-option ${domainType === 'subdomain' ? 'active' : ''}`} htmlFor="subdomain">
                        <input type="radio" id="subdomain" name="domain_type" value="subdomain" checked={domainType === 'subdomain'} onChange={(e) => setDomainType(e.target.value)} />
                        <div>
                            <div className="sp-domain-title">Subdomain</div>
                            <div className="sp-domain-desc">Use our domain, type your name</div>
                        </div>
                    </label>
                    <div className="sp-input-group" style={{ marginTop: '14px' }}>
                        <input type="text" className="sp-input" placeholder="yourclubname" disabled={domainType !== 'subdomain'} value={domainType === 'subdomain' ? formData.domain_name : ''} onChange={(e) => updateFormData({ domain_name: e.target.value })} />
                        <span className="sp-input-suffix">.cameraclub.website</span>
                    </div>
                </div>
                <div>
                    <label className={`sp-domain-option ${domainType === 'customdomain' ? 'active' : ''}`} htmlFor="customdomain">
                        <input type="radio" id="customdomain" name="domain_type" value="customdomain" checked={domainType === 'customdomain'} onChange={(e) => setDomainType(e.target.value)} />
                        <div>
                            <div className="sp-domain-title">Custom Domain</div>
                            <div className="sp-domain-desc">Use your own domain</div>
                        </div>
                    </label>
                    <input type="text" className="sp-input" style={{ marginTop: '14px' }} placeholder="example.com" disabled={domainType !== 'customdomain'} value={domainType === 'customdomain' ? formData.domain_name : ''} onChange={(e) => updateFormData({ domain_name: e.target.value })} />
                </div>
            </div>

            <div className="sp-actions">
                <button className="btn" id="edit" type="button" disabled={!canContinue} onClick={onNext}>Next</button>
            </div>
        </form>
    );
}
export default Step1GeneralSignup;
