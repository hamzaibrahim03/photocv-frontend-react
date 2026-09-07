function Step5Privacy() {
    return (
        <>
            <div className="form-container">
                <form style={{ marginLeft: '2%', marginRight: '2%' }}>
                    <h5 className="role" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '32px', lineHeight: '100%', letterSpacing: '0%' }}>Privacy Settings</h5>
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '22.88px', lineHeight: '100%', letterSpacing: '0%', color: '#4C4036' }}>Decide how cookies, data and reports are handled in your club.</p>
                    <br /><br />
                    <label for="GDPR"> GDPR & Privacy Policy Management </label>
                    <input type="text" className="form-control" />
                    <div className="divider3"></div>
                    <h5>User Consent Settings</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <input type="radio" name="cookies" value="Cookies" className="icheck-cookies" />&nbsp;
                            <span></span> Cookies
                            <textarea className="form-control"></textarea>
                        </div>
                        <div className="col-md-6">
                            <input type="radio" name="data_collection_preferences" value="Data Collection Preferences" className="icheck-data_collection_preferences" />&nbsp;
                            <span></span> Data Collection Preferences
                            <textarea className="form-control"></textarea>
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <h5>Content Moderation & Reporting</h5>
                    <input type="radio" name="allow_reporting" value="Allow Reporting" className="icheck-allow_reporting" /> &nbsp;
                    <span></span> Allow Reporting
                    <textarea className="form-control"></textarea>
                    <div className="button-group" style={{ justifyContent: 'left' }}>
                        <button className="btn btn-sm" id="e-view"> Cancel</button>
                        <button className="btn btn-sm" id="e-edit"> Save</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Step5Privacy;