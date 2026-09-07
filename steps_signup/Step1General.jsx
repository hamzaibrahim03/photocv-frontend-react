import React, { useState } from 'react';
function Step1GeneralSignup({ onNext }) {
    const [domainType, setDomainType] = useState('subdomain');
    return (
        <section>
            <div className="container">
                <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h5 className="head">Basic Details</h5>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="club-name">Club Name</label>
                            <input id="club-name" type="text" className="form-control" style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="club-tagline">Club Tagline</label>
                            <input id="club-tagline" type="text" className="form-control" style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
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
                                <input type="text" className="form-control" placeholder="yourclubname" disabled={domainType !== 'subdomain'} style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
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
                            <input type="text" className="form-control mt-3" placeholder="example.com" disabled={domainType !== 'customdomain'} style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
                        </div>
                    </div>
                    <div className="button-group" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button className="btn btn-sm" id="edit" type="button" onClick={onNext}>Next</button>
                    </div>
                </form>
            </div>
        </section>
    );
}
export default Step1GeneralSignup;
