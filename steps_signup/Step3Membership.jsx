import React from 'react';
function Step3MembershipSignup({ onPrevious, onNext, onSkip }) {
    return (
        <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="registration">Registration & Access Control</label>
                    <div className="row mb-3">
                        {[
                            'Open', 'Invite Only', 'Manual Approval'
                        ].map(option => (
                            <div className="col-md-6 mb-2" key={option}>
                                <div className="premium-radio">
                                    <input type="radio" id={`access-${option}`} name="access" value={option} />
                                    <label htmlFor={`access-${option}`}>
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
                    <label htmlFor="members">Members Directory Public Visibility</label>
                    <div className="row mb-3">
                        {[
                            'Visible', 'Club Only'
                        ].map(option => (
                            <div className="col-md-6 mb-2" key={option}>
                                <div className="premium-radio">
                                    <input type="radio" id={`visible-${option}`} name="visible" value={option} />
                                    <label htmlFor={`visible-${option}`}>
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
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="comments">Comments</label>
                    <div className="row mb-3">
                        {[
                            'Enable', 'Disable'
                        ].map(option => (
                            <div className="col-md-6 mb-2" key={option}>
                                <div className="premium-radio">
                                    <input type="radio" id={`comments-${option}`} name="comments" value={option} />
                                    <label htmlFor={`comments-${option}`}>
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
                    <label htmlFor="likes">Likes</label>
                    <div className="row mb-3">
                        {[
                            'Enable', 'Disable'
                        ].map(option => (
                            <div className="col-md-6 mb-2" key={option}>
                                <div className="premium-radio">
                                    <input type="radio" id={`likes-${option}`} name="likes" value={option} />
                                    <label htmlFor={`likes-${option}`}>
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
export default Step3MembershipSignup;
