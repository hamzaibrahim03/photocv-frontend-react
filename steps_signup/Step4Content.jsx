import React from 'react';
function Step4ContentSignup({ onPrevious, onNext, onSkip }) {
    const sections = ['News', 'Events', 'Galleries', 'Competitions'];
    return (
        <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <label htmlFor="website">Website Sections</label>
            <div className="row">
                {sections.map((section) => (
                    <div className="col-md-3" key={section}>
                        <label className="form-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }}>
                            <input type="checkbox" />
                            <span>{section}</span>
                        </label>
                    </div>
                ))}
            </div>
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="homepage">Homepage Content Blocks</label>
                    <div className="row mb-3">
                        {[
                            'All', 'Fewer', 'Fewest'
                        ].map(option => (
                            <div className="col-md-4 mb-2" key={option}>
                                <div className="premium-radio">
                                    <input type="radio" id={`homepage-${option}`} name="homepage" value={option} />
                                    <label htmlFor={`homepage-${option}`}>
                                        <div className="premium-radio-circle"></div>
                                        <div className="premium-radio-content">
                                            <div className="premium-radio-title">
                                                {option}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-6">
                    <label htmlFor="reminder">Reminders</label>
                    <div className="row mb-3">
                        {[
                            'All', 'Some', 'None'
                        ].map(option => (
                            <div className="col-md-4 mb-2" key={option}>
                                <div className="premium-radio">
                                    <input type="radio" id={`reminder-${option}`} name="reminder" value={option} />
                                    <label htmlFor={`reminder-${option}`}>
                                        <div className="premium-radio-circle"></div>
                                        <div className="premium-radio-content">
                                            <div className="premium-radio-title">
                                                {option}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
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
