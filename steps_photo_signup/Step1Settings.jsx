import React from 'react';
function Step1SettingsSignup({ formData, updateFormData, onNext }) {
    const domainType = formData.domain_type;
    const setDomainType = (value) => updateFormData({ domain_type: value });
    const canContinue = formData.domain_name.trim().length > 0;
    return (
        <form className="sp-form" onSubmit={(e) => e.preventDefault()}>
            <div className="row">
                <div className='col-md-6'>
                    <label htmlFor="domain-name">Domain Type</label>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className="premium-radio">
                                <input type="radio" id="subdomain" name="subdomain" value="subdomain" />
                                <label htmlFor="subdomain">
                                    <span className="premium-radio-circle" />
                                    <span className="premium-radio-content">
                                        <span className="premium-radio-title">Sub Domain</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="premium-radio">
                                <input type="radio" id="custom domain" name="custom domain" value="custom domain" />
                                <label htmlFor="custom domain">
                                    <span className="premium-radio-circle" />
                                    <span className="premium-radio-content">
                                        <span className="premium-radio-title">Custom Domain</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <label htmlFor="domain-name">Domain Name</label>
                    <input id="domain-name" type="text" className="sp-input" value={formData.domain_name} onChange={(e) => updateFormData({ domain_name: e.target.value })} placeholder={domainType === 'customdomain' ? 'example.com' : 'yourname'} />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <label htmlFor="tagline">Tagline</label>
                    <input id="tagline" type="text" className="sp-input" value={formData.tag_line} onChange={(e) => updateFormData({ tag_line: e.target.value })} placeholder="A short line about your photography" />
                </div>
            </div>

            <div className="sp-actions">
                <button className="btn" id="edit" type="button" disabled={!canContinue} onClick={onNext}>Next</button>
            </div>
        </form>
    );
}
export default Step1SettingsSignup;
