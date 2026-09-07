import React from 'react';
function PostNotice() {
    return (
        <div className="container py-4">
            <h2>Post Notice</h2>
            <form>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows="4" />
                </div>
                <button type="submit" className="btn btn-primary">Publish</button>
            </form>
        </div>
    );
}
export default PostNotice;
