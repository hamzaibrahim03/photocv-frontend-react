function Step3Membership() {
    return (
        <>
            <div className="form-container">
                <form style={{ marginLeft: '2%', marginRight: '2%' }}>
                    <h5 className="role" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '32px', lineHeight: '100%', letterSpacing: '0%' }}>Membership Settings</h5>
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '22.88px', lineHeight: '100%', letterSpacing: '0%', color: '#4C4036;' }}>Let us know how do you want your members to interact.</p>
                    <br /><br />
                    <div className="row">
                        <div className="col-md-6">
                            <label for="Registration">Registration & Access Control</label>
                            <div className="row mb-3">
                                {[
                                    'Open',
                                    'Invite Only',
                                    'Manual Approval'
                                ].map(status => (
                                    <div className="col-md-4 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`status-${status}`} name="registration" value={status} />
                                            <label htmlFor={`status-${status}`}>
                                                <div className="premium-radio-circle"></div>
                                                <div className="premium-radio-content">
                                                    <div className="premium-radio-title">
                                                        {status}
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label for="members">Members Directory Public Visibility</label>
                            <div className="row mb-3">
                                {[
                                    'Visible',
                                    'Club Only',
                                ].map(status => (
                                    <div className="col-md-6 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`status-${status}`} name="directory_visibility" value={status} />
                                            <label htmlFor={`status-${status}`}>
                                                <div className="premium-radio-circle"></div>
                                                <div className="premium-radio-content">
                                                    <div className="premium-radio-title">
                                                        {status}
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6">
                            <label for="comments">Comments</label>
                            <div className="row mb-3">
                                {[
                                    'Enable',
                                    'Disable',
                                ].map(status => (
                                    <div className="col-md-6 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`status-${status}`} name="comments" value={status} />
                                            <label htmlFor={`status-${status}`}>
                                                <div className="premium-radio-circle"></div>
                                                <div className="premium-radio-content">
                                                    <div className="premium-radio-title">
                                                        {status}
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label for="likes">Likes</label>
                            <div className="row mb-3">
                                {[
                                    'Enable',
                                    'Disable',
                                ].map(status => (
                                    <div className="col-md-6 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`status-${status}`} name="likes" value={status} />
                                            <label htmlFor={`status-${status}`}>
                                                <div className="premium-radio-circle"></div>
                                                <div className="premium-radio-content">
                                                    <div className="premium-radio-title">
                                                        {status}
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="button-group" style={{ justifyContent: 'left' }}>
                        <button className="btn btn-sm" id="e-view"> Cancel</button>
                        <button type="submit" className="btn btn-sm" id="edit"> Save</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Step3Membership;
