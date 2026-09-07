import React from 'react';
function Step2AppearanceSignup({ onPrevious, onNext, onSkip }) {
    return (
        <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="theme">Theme & Colours</label>
                    <div style={{ minHeight: '180px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f4f1' }}>
                        Theme Preview
                    </div>
                </div>
                <div className="col-md-6">
                    <label htmlFor="fonts">Typography & Fonts</label>
                    <div style={{ minHeight: '180px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f4f1' }}>
                        Font Preview
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="logo">Logo</label>
                    <input id="logo" type="file" className="form-control" style={{ height: '50px', fontSize: '16.61px', marginLeft: '0px', width: '100%', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="banner">Club Banner and Cover Image</label>
                    <input id="banner" type="file" className="form-control" style={{ height: '50px', fontSize: '16.61px', borderRadius: '5px', color: '#4C4036', border: '1.04px solid #99816B' }} />
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
export default Step2AppearanceSignup;
