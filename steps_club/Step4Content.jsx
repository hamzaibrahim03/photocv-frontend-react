function Step4Content() {
    return (
        <>
            <div className="form-container">
                <form style={{ marginLeft: "2%", marginRight: "2%" }}>
                    <h5 className="role" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "32px", lineHeight: "100%", letterSpacing: "0%" }}>Content Management</h5>
                    <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "22.88px", lineHeight: "100%", letterSpacing: "0%", color: "#4C4036" }}>How do you want your club website to shape up.</p>
                    <br /><br />
                    <label for="website"> Website Sections </label>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-control">
                                <input type="checkbox" value="News" /> <span>News</span>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-control">
                                <input type="checkbox" value="Events" /> <span>Events</span>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-control">
                                <input type="checkbox" value="Galleries" /> <span>Galleries</span>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-control">
                                <input type="checkbox" value="Competitions" /> <span>Competitions</span>
                            </div>
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6">
                            <label for="homepage">Homepage Content Blocks</label>
                            <div className="row mb-3">
                                {[
                                    'All',
                                    'Fewer',
                                    'Fewest'
                                ].map(status => (
                                    <div className="col-md-4 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`status-${status}`} name="homepage" value={status} />
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
                            <label for="reminder">Reminders</label>
                            <div className="row mb-3">
                                {[
                                    'All',
                                    'Some',
                                    'None'
                                ].map(status => (
                                    <div className="col-md-4 mb-2" key={status}>
                                        <div className="premium-radio">
                                            <input type="radio" id={`status-${status}`} name="reminder" value={status} />
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
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label for="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" />
                                </div>
                                <div className="col-md-6">
                                    <label for="phone" className="form-label">Phone</label>
                                    <input type="number" className="form-control" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label for="address" className="form-label">Address</label>
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <label for="social">Social Media Links</label>
                    <div className="row align-items-center mb-3">
                        <div className="col-auto">
                            <input type="checkbox" id="facebook" />
                        </div>
                        <div className="col">
                            <label for="facebook" className="form-label">Facebook</label>
                            <input type="text" className="form-control" placeholder="Facebook link..." />
                        </div>
                    </div>
                    <div className="row align-items-center mb-3">
                        <div className="col-auto">
                            <input type="checkbox" id="instagram" />
                        </div>
                        <div className="col">
                            <label for="instagram" className="form-label">Instagram</label>
                            <input type="text" className="form-control" placeholder="Instagram link..." />
                        </div>
                    </div>
                    <div className="row align-items-center mb-3">
                        <div className="col-auto">
                            <input type="checkbox" id="flickr" />
                        </div>
                        <div className="col">
                            <label for="flickr" className="form-label">Flickr</label>
                            <input type="text" className="form-control" placeholder="Flickr link..." />
                        </div>
                    </div>
                    <div className="button-group" style={{ justifyContent: 'left' }}>
                        <button className="btn btn-sm" id="e-view"> Cancel</button>
                        <button className="btn btn-sm" id="e-edit">Save</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Step4Content;
