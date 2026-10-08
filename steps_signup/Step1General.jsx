import React from 'react';
function Step1GeneralSignup({ formData, updateFormData, onNext }) {
    const domainType = formData.domain_type;
    const setDomainType = (value) => updateFormData({ domain_type: value });
    const canContinue = formData.club_name.trim().length > 0 && formData.domain_name.trim().length > 0;
    return (
        <section>
            <div className="container">
                <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h5 className="head">Basic Details</h5>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="club-name">Club Name</label>
                            <input id="club-name" type="text" className="form-control" value={formData.club_name} onChange={(e) => updateFormData({ club_name: e.target.value })} style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="club-tagline">Club Tagline</label>
                            <input id="club-tagline" type="text" className="form-control" value={formData.tag_line} onChange={(e) => updateFormData({ tag_line: e.target.value })} style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
                        </div>
                    </div>
                    <h5 className="fw-semibold mb-3">Domain Type and Name Options</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="col-md-12">
                                <div className="premium-radio">
                                    <input type="radio" id="subdomain" name="domain_type" value="subdomain" checked={domainType === 'subdomain'} onChange={(e) => setDomainType(e.target.value)} />
                                    <label htmlFor="subdomain">
                                        <div className="premium-radio-circle" />
                                        <div className="premium-radio-content">
                                            <div className="premium-radio-title">
                                                Subdomain
                                            </div>
                                            <div className="premium-radio-description">
                                                Use our domain, type your name
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="input-group mt-3">
                                <input type="text" className="form-control" placeholder="yourclubname" disabled={domainType !== 'subdomain'} value={domainType === 'subdomain' ? formData.domain_name : ''} onChange={(e) => updateFormData({ domain_name: e.target.value })} style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
                                <button className="btn btn-outline-secondary dropdown-toggle" type="button" disabled={domainType !== 'subdomain'}> .cameraclub.website </button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="col-md-12">
                                <div className="premium-radio">
                                    <input type="radio" id="customdomain" name="domain_type" value="customdomain" checked={domainType === 'customdomain'} onChange={(e) => setDomainType(e.target.value)} />
                                    <label htmlFor="customdomain">
                                        <div className="premium-radio-circle" />
                                        <div className="premium-radio-content">
                                            <div className="premium-radio-title">
                                                Custom Domain
                                            </div>
                                            <div className="premium-radio-description">
                                                Use your own domain
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <input type="text" className="form-control mt-3" placeholder="example.com" disabled={domainType !== 'customdomain'} value={domainType === 'customdomain' ? formData.domain_name : ''} onChange={(e) => updateFormData({ domain_name: e.target.value })} style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
                        </div>
                    </div>
                    <div className="button-group" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button className="btn btn-sm" id="edit" type="button" disabled={!canContinue} onClick={onNext}>Next</button>
                    </div>
                </form>
            </div>
        </section>
    );
}
export default Step1GeneralSignup;
